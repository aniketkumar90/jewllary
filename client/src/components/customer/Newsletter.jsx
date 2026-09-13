import React, { useState } from 'react';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { cmsService } from '../../services/cmsService';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await cmsService.subscribeNewsletter(email);
      toast.success(res.message || 'Thank you for subscribing to our private salon updates.');
      setEmail('');
    } catch (error) {
      toast.error(error.message || 'Subscription failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 bg-forest-900 text-ivory border-y border-gold-500/20 overflow-hidden">
      {/* Decorative background watermark */}
      <div className="absolute right-10 -bottom-10 opacity-5 pointer-events-none font-serif text-[180px] leading-none text-gold-400 select-none">
        VY
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-2 block">
          ✦ Private Salon Dispatch ✦
        </span>

        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-ivory mb-4 tracking-wide">
          Be The First To Unveil New Chapters
        </h2>

        <p className="text-xs sm:text-sm text-ivory/70 max-w-lg mx-auto mb-8 leading-relaxed font-sans font-light">
          Receive private invitations to confidential high jewellery auctions, bespoke bridal previews, and artisanal masterclasses.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="flex-1 bg-white text-charcoal-900 px-5 py-3.5 text-xs font-sans placeholder:text-charcoal-400 focus:outline-none focus:ring-1 focus:ring-gold-400 border border-gold-500/30"
          />
          <Button
            type="submit"
            variant="gold"
            loading={loading}
            className="sm:w-auto w-full flex-shrink-0"
          >
            Subscribe
          </Button>
        </form>

        <p className="text-[10px] text-ivory/50 mt-4 tracking-wider">
          Respecting your privacy. You may opt out anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
