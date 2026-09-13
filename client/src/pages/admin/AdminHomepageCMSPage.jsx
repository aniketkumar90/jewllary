import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { FiSave } from 'react-icons/fi';

const AdminHomepageCMSPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [cmsData, setCmsData] = useState({
    hero: {
      smallText: 'THE ART OF ELEGANCE',
      heading: 'Timeless Jewellery, Made For You',
      description: 'Discover jewellery designed to celebrate your most beautiful moments.',
      buttonText: 'Explore Collection',
      buttonLink: '/jewellery',
      image: { secure_url: '', public_id: '' },
    },
    brandStory: {
      badge: 'OUR HERITAGE',
      heading: 'A Legacy of Indian Royal Craftsmanship',
      description: '',
      image: { secure_url: '', public_id: '' },
    },
    luxuryBanner: {
      title: 'The Royal Bridal Affair',
      subtitle: 'BESPOKE BRIDAL TROUSSEAU',
      description: '',
      buttonText: 'Book Private Appointment',
      buttonLink: '/contact',
      image: { secure_url: '', public_id: '' },
    },
  });

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await cmsService.getHomepage();
        if (res.homepage) {
          setCmsData(res.homepage);
        }
      } catch (e) {
        toast.error('Failed to load homepage CMS');
      } finally {
        setLoading(false);
      }
    };
    fetchCMS();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await cmsService.updateHomepage(cmsData);
      toast.success('Homepage CMS content updated! Live store refreshed.');
    } catch (err) {
      toast.error(err.message || 'Failed to update CMS content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Accessing Homepage CMS Editor..." />;
  }

  return (
    <div className="space-y-6 text-left max-w-5xl">
      <div className="flex items-center justify-between pb-4 border-b border-gold-400/20">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Dynamic Content Manager ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Homepage CMS Visual Editor
          </h1>
        </div>

        <Button variant="gold" onClick={handleSave} loading={saving} icon={FiSave}>
          Save & Publish Live
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Hero Section CMS */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            1. Hero Section & Main Stage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              dark={true}
              label="Accent Header Badge"
              value={cmsData.hero?.smallText || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  hero: { ...cmsData.hero, smallText: e.target.value },
                })
              }
            />

            <Input
              dark={true}
              label="CTA Button Text"
              value={cmsData.hero?.buttonText || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  hero: { ...cmsData.hero, buttonText: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Hero Large Headline (Supports multi-line)
            </label>
            <textarea
              rows="2"
              value={cmsData.hero?.heading || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  hero: { ...cmsData.hero, heading: e.target.value },
                })
              }
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-sm focus:outline-none focus:border-gold-400 font-serif transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Hero Subtitle / Description
            </label>
            <textarea
              rows="2"
              value={cmsData.hero?.description || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  hero: { ...cmsData.hero, description: e.target.value },
                })
              }
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

          <CloudinaryUploader
            label="Hero Full-Screen Background Image (Cloudinary)"
            value={cmsData.hero?.image}
            onChange={(img) =>
              setCmsData({
                ...cmsData,
                hero: { ...cmsData.hero, image: img },
              })
            }
          />
        </div>

        {/* 2. Brand Story Section CMS */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            2. Artisanal Brand Story & Karigar Legacy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              dark={true}
              label="Section Badge"
              value={cmsData.brandStory?.badge || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  brandStory: { ...cmsData.brandStory, badge: e.target.value },
                })
              }
            />

            <Input
              dark={true}
              label="Story Heading"
              value={cmsData.brandStory?.heading || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  brandStory: { ...cmsData.brandStory, heading: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Story Narrative Paragraph
            </label>
            <textarea
              rows="4"
              value={cmsData.brandStory?.description || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  brandStory: { ...cmsData.brandStory, description: e.target.value },
                })
              }
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

          <CloudinaryUploader
            label="Story Visual Photo (Cloudinary)"
            value={cmsData.brandStory?.image}
            onChange={(img) =>
              setCmsData({
                ...cmsData,
                brandStory: { ...cmsData.brandStory, image: img },
              })
            }
          />
        </div>

        {/* 3. Luxury Banner CMS */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            3. Curated Bridal Promo Banner
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              dark={true}
              label="Banner Title"
              value={cmsData.luxuryBanner?.title || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  luxuryBanner: { ...cmsData.luxuryBanner, title: e.target.value },
                })
              }
            />

            <Input
              dark={true}
              label="Banner Subtitle"
              value={cmsData.luxuryBanner?.subtitle || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  luxuryBanner: { ...cmsData.luxuryBanner, subtitle: e.target.value },
                })
              }
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Banner Description
            </label>
            <textarea
              rows="2"
              value={cmsData.luxuryBanner?.description || ''}
              onChange={(e) =>
                setCmsData({
                  ...cmsData,
                  luxuryBanner: { ...cmsData.luxuryBanner, description: e.target.value },
                })
              }
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

          <CloudinaryUploader
            label="Banner Photography (Cloudinary)"
            value={cmsData.luxuryBanner?.image}
            onChange={(img) =>
              setCmsData({
                ...cmsData,
                luxuryBanner: { ...cmsData.luxuryBanner, image: img },
              })
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" variant="gold" size="lg" loading={saving} icon={FiSave}>
            Publish Live to Customer Store
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminHomepageCMSPage;
