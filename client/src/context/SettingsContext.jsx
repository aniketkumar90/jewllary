import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cmsService } from '../services/cmsService';

const SettingsContext = createContext(null);

const DEFAULT_LOGO = '/images/logo.png';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [logoUrl, setLogoUrl] = useState(() => {
    try {
      return localStorage.getItem('nsj_logo') || DEFAULT_LOGO;
    } catch {
      return DEFAULT_LOGO;
    }
  });

  // Fetch store settings from backend on app load
  const fetchSettings = useCallback(async () => {
    try {
      const res = await cmsService.getSettings();
      if (res.settings) {
        setSettings(res.settings);
        const serverLogo = res.settings.logo?.secure_url;
        if (serverLogo) {
          setLogoUrl(serverLogo);
          try {
            localStorage.setItem('nsj_logo', serverLogo);
          } catch {
            // Ignore storage errors
          }
        }
      }
    } catch (err) {
      console.warn('[SettingsContext] Failed to fetch settings, using local fallback:', err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    // Listen for cross-tab or real-time logo updates
    const handleLogoUpdate = (e) => {
      if (e.detail) {
        setLogoUrl(e.detail);
      }
    };

    window.addEventListener('nsj_logo_updated', handleLogoUpdate);
    return () => window.removeEventListener('nsj_logo_updated', handleLogoUpdate);
  }, [fetchSettings]);

  const updateLogo = useCallback((newUrl) => {
    if (!newUrl) return;
    setLogoUrl(newUrl);
    try {
      localStorage.setItem('nsj_logo', newUrl);
    } catch {
      // Ignore storage errors
    }
    window.dispatchEvent(new CustomEvent('nsj_logo_updated', { detail: newUrl }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        logoUrl: logoUrl || DEFAULT_LOGO,
        updateLogo,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: null,
      logoUrl: DEFAULT_LOGO,
      updateLogo: () => {},
      refreshSettings: () => {},
    };
  }
  return context;
};

export default SettingsContext;
