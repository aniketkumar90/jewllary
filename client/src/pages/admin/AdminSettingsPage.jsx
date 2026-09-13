import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { FiSave } from 'react-icons/fi';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    storeName: 'NEW SHIV JEWELLERS',
    tagline: 'Fine Jewels • Est. 2024',
    contactEmail: 'contact@newshivjewellers.com',
    contactPhone: '+91 98765 43210',
    address: 'Main Market, Near Clock Tower, City Centre',
    currency: 'INR',
    currencySymbol: '₹',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await cmsService.getSettings();
        if (res.settings) setSettings(res.settings);
      } catch (e) {
        toast.error('Failed to load store settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.updateSettings(settings);
      toast.success('Maison settings saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Maison Settings..." />;
  }

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

      <form onSubmit={handleSave} className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
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
