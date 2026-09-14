import React, { useState, useEffect, useRef } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { FiSave, FiUpload, FiImage, FiRotateCcw } from 'react-icons/fi';

const AdminSettingsPage = () => {
  const { updateLogo } = useSettings();
  const [settings, setSettings] = useState({
    storeName: 'NEW SHIV JEWELLERS',
    tagline: 'Fine Jewels • Est. 2024',
    contactEmail: 'contact@newshivjewellers.com',
    contactPhone: '+91 98765 43210',
    address: 'Main Market, Near Clock Tower, City Centre',
    currency: 'INR',
    currencySymbol: '₹',
    logo: {
      secure_url: '/images/logo.png',
      public_id: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getSettings();
        if (res.settings) {
          const currentLogo = res.settings.logo?.secure_url || '/images/logo.png';
          setSettings({
            ...res.settings,
            logo: res.settings.logo || { secure_url: '/images/logo.png', public_id: '' },
          });
          updateLogo(currentLogo);
        }
      } catch (e) {
        toast.error('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [updateLogo]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingLogo(true);
    try {
      const res = await cmsService.uploadMedia(formData);
      const uploadedUrl = res.data?.secure_url || res.secure_url;
      const publicId = res.data?.public_id || res.public_id || '';
      if (uploadedUrl) {
        const updated = {
          ...settings,
          logo: { secure_url: uploadedUrl, public_id: publicId },
        };
        setSettings(updated);
        updateLogo(uploadedUrl);

        // Instantly save to database so the logo applies globally without needing extra click
        try {
          await cmsService.updateSettings(updated);
          toast.success('Logo uploaded and applied across entire website!');
        } catch {
          toast.success('Brand logo uploaded successfully! Click Save Settings to persist.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleResetDefaultLogo = async () => {
    const updated = {
      ...settings,
      logo: { secure_url: '/images/logo.png', public_id: '' },
    };
    setSettings(updated);
    updateLogo('/images/logo.png');
    try {
      await cmsService.updateSettings(updated);
      toast.success('Logo reset to default and applied everywhere.');
    } catch {
      toast.success('Logo reset to default.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.updateSettings(settings);
      if (settings.logo?.secure_url) {
        updateLogo(settings.logo.secure_url);
      }
      toast.success('Maison settings and logo saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Maison Settings..." />;
  }

  const currentLogoUrl = settings.logo?.secure_url || '/images/logo.png';

  return (
    <div className="space-y-6 text-left max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-400/20">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ System Configuration ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Maison Store Settings
          </h1>
        </div>

        <Button variant="gold" onClick={handleSave} loading={saving} icon={FiSave}>
          Save Settings
        </Button>
      </div>

      <form onSubmit={handleSave} className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* BRAND LOGO MANAGEMENT CARD */}
        <div className="p-5 bg-[#0e1610] border border-gold-400/30 rounded-lg space-y-4">
          <div>
            <span className="text-xs uppercase tracking-luxury text-gold-400 font-semibold flex items-center gap-1.5">
              <FiImage className="text-sm" />
              Maison Brand Logo (Navbar & Branding)
            </span>
            <p className="text-[11px] text-ivory/60 mt-0.5">
              Upload your custom jewellery house logo. Appears on the website Navbar, Mobile Menu, and Footers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Live Logo Preview on Dark Header Simulator */}
            <div className="relative group flex flex-col items-center">
              <div className="w-24 h-24 rounded-lg bg-[#0a100c] border-2 border-gold-400/50 p-2 flex items-center justify-center shadow-inner overflow-hidden">
                <img
                  src={currentLogoUrl}
                  alt="Brand Logo Preview"
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                      e.currentTarget.src = '/images/logo.png';
                    }
                  }}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="text-[9px] uppercase tracking-wider text-gold-400/80 text-center block mt-1.5">
                Live Preview
              </span>
            </div>

            {/* Actions */}
            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-wrap gap-2.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  loading={uploadingLogo}
                  icon={FiUpload}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingLogo ? 'Uploading to Cloudinary...' : 'Upload New Logo'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={FiRotateCcw}
                  onClick={handleResetDefaultLogo}
                >
                  Reset Default
                </Button>
              </div>

              {/* Direct URL input fallback */}
              <Input
                dark={true}
                label="Or Direct Logo Image URL"
                name="logoUrl"
                value={settings.logo?.secure_url || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    logo: { ...settings.logo, secure_url: e.target.value },
                  })
                }
                placeholder="https://res.cloudinary.com/... or /images/logo.png"
              />
            </div>
          </div>
        </div>

        {/* STORE DETAILS */}
        <Input
          dark={true}
          label="Maison Store Title"
          name="storeName"
          value={settings.storeName}
          onChange={handleChange}
        />

        <Input
          dark={true}
          label="Artisanal Tagline"
          name="tagline"
          value={settings.tagline}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            dark={true}
            label="Concierge Email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
          />

          <Input
            dark={true}
            label="Concierge Phone"
            name="contactPhone"
            value={settings.contactPhone}
            onChange={handleChange}
          />
        </div>

        <Input
          dark={true}
          label="Flagship Salon Promenade Address"
          name="address"
          value={settings.address}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            dark={true}
            label="Currency Code"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
          />
          <Input
            dark={true}
            label="Currency Symbol"
            name="currencySymbol"
            value={settings.currencySymbol}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4 border-t border-gold-400/20 flex justify-end">
          <Button type="submit" variant="gold" loading={saving} icon={FiSave}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
