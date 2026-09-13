import React, { useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCalendar, FiCheckCircle } from 'react-icons/fi';

const ContactPage = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    service: 'Bridal Consultation',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your private salon appointment request has been scheduled. Our concierge will call you shortly.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: 'Mumbai',
        service: 'Bridal Consultation',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="hero-header-bg text-ivory py-16 sm:py-24 border-b border-gold-400/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] uppercase tracking-luxury text-gold-300 font-semibold mb-2 block drop-shadow-sm">
            ✦ Private Concierge & Consultations ✦
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-ivory font-normal tracking-wide mb-3 drop-shadow">
            Salon Appointments & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-ivory/85 max-w-lg mx-auto font-sans font-light leading-relaxed drop-shadow-sm">
            Reserve a private boutique consultation or request a personalized styling appointment with our master jewellery consultants.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Client Concierge' }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 items-start">
          {/* Contact Information & Salons (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/50 relative overflow-hidden">
              {/* Subtle gold glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 blur-[60px] rounded-full pointer-events-none" />

              <h3 className="font-serif text-2xl text-ivory pb-3 border-b border-gold-400/25 flex items-center justify-between">
                <span>Private Salons</span>
                <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-sans font-normal">Est. 2024</span>
              </h3>

              <div className="space-y-5 text-xs text-ivory/70">
                <div className="space-y-1.5 p-4 rounded-lg bg-[#18281d] border border-gold-500/20">
                  <h4 className="font-semibold text-gold-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <FiMapPin className="text-gold-400 shrink-0" />
                    <span>New Shiv Jewellers Fine Showroom</span>
                  </h4>
                  <p className="pl-5 text-ivory/75 leading-relaxed">
                    Heritage Luxury Promenade, Main Market
                  </p>
                  <p className="pl-5 text-gold-400 font-medium flex items-center gap-1 text-[11px]">
                    <FiClock className="text-xs" />
                    <span>Daily: 11:00 AM – 8:30 PM</span>
                  </p>
                </div>

                <div className="space-y-1.5 p-4 rounded-lg bg-[#18281d] border border-gold-500/20">
                  <h4 className="font-semibold text-gold-300 uppercase tracking-wider text-[11px] flex items-center gap-2">
                    <FiMapPin className="text-gold-400 shrink-0" />
                    <span>The Royal Bridal Vault</span>
                  </h4>
                  <p className="pl-5 text-ivory/75 leading-relaxed">
                    By Private Invitation & Appointment Only
                  </p>
                  <p className="pl-5 text-gold-400 font-medium text-[11px]">Personal Karigar & Styling Suite</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-400/25 space-y-3 text-xs text-ivory/80">
                <p className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
                    <FiPhone className="text-xs" />
                  </div>
                  <span className="font-medium tracking-wide">+91 98200 12345 / +91 98111 54321</span>
                </p>
                <p className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-400/30 flex items-center justify-center text-gold-400 shrink-0">
                    <FiMail className="text-xs" />
                  </div>
                  <span className="tracking-wide">concierge@newshivjewellers.com</span>
                </p>
              </div>
            </div>

            {/* Atelier Assurance Box */}
            <div className="bg-[#142318]/70 border border-gold-400/25 rounded-xl p-5 text-xs text-ivory/70 space-y-2">
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold flex items-center gap-1.5">
                <FiCheckCircle className="text-gold-400" />
                <span>Complimentary White-Glove Service</span>
              </span>
              <p className="font-light leading-relaxed">
                Every consultation includes personalized gemological appraisal, customized heirloom sketches, and private viewing chamber hospitality.
              </p>
            </div>
          </div>

          {/* Appointment Form (7 Cols) */}
          <div className="lg:col-span-7 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-10 text-left shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-gold-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="pb-4 border-b border-gold-400/25 mb-6">
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
                ✦ Bespoke Engagement ✦
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory font-normal">
                Schedule Your Private Appointment
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  dark={true}
                  placeholder="e.g. Maharani Gayatri"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  dark={true}
                  placeholder="name@domain.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Mobile Contact"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  dark={true}
                  placeholder="+91 98765 43210"
                />
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-gold-300/90 font-medium mb-1.5">
                    Preferred Salon
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#18281d] text-ivory text-sm border border-gold-500/35 py-3 px-4 rounded-sm focus:outline-none focus:border-gold-400 transition-colors"
                  >
                    <option value="Mumbai">Mumbai — Flagship Showroom</option>
                    <option value="Delhi">New Delhi — Private Vault</option>
                    <option value="Jaipur">Jaipur — Artisanal Atelier</option>
                    <option value="Virtual">Global Video Consultation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-gold-300/90 font-medium mb-1.5">
                  Nature of Inquiry / Custom Requirements
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about the occasion (e.g. Matrimonial Suite, Solitaire Engagement Ring, Bespoke Polki Choker, Temple Gold Harams)..."
                  className="w-full bg-[#18281d] text-ivory border border-gold-500/35 p-3.5 text-xs font-sans rounded-sm placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:bg-[#1f3227] transition-all"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={loading}
                  icon={FiCalendar}
                  fullWidth
                >
                  <span className="hidden sm:inline">Request Private Salon Appointment</span>
                  <span className="inline sm:hidden">Request Private Appointment</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
