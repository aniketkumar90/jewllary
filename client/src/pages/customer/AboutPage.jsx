import React from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionHeading from '../../components/customer/SectionHeading';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import { FiAward, FiShield, FiGlobe, FiCalendar } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      {/* Editorial Hero with Cohesive Royal Styling */}
      <div className="hero-header-bg text-ivory py-20 sm:py-28 border-b border-gold-400/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="text-[10px] uppercase tracking-luxury text-gold-300 font-semibold mb-2 block drop-shadow-sm">
            ✦ Four Decades of Royal Goldsmithing ✦
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-ivory font-normal tracking-wide mb-6 drop-shadow">
            The Saga of New Shiv Jewellers
          </h1>
          <p className="text-sm sm:text-base text-ivory/85 font-sans font-light leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
            Preserving the sacred craft of polki jadau, temple repoussé, and high jewellery solitaires, New Shiv Jewellers sculpts enduring heirlooms of divine splendour.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb items={[{ label: 'Artisanal Heritage' }]} />

        {/* Section 1: Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16">
          <div className="space-y-6 text-left">
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block">
              ✦ The Maison Philosophy ✦
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-normal leading-snug">
              Heirlooms For Generations, Sculpted in 22K Hallmarked Gold
            </h2>
            <div className="h-[1px] w-14 bg-gradient-to-r from-gold-400 to-transparent" />
            <p className="text-xs sm:text-sm text-ivory/75 leading-relaxed font-light">
              At New Shiv Jewellers, jewellery is not merely an ornament; it is a sacred conduit of cultural heritage, maternal legacy, and poetic devotion. Every single design originates from hand-painted gouache illustrations rendered by our master designers.
            </p>
            <p className="text-xs sm:text-sm text-ivory/75 leading-relaxed font-light">
              Our karigars spend hundreds of hours selecting syndicate polki uncut diamonds, each mounted with pure silver foil backings to maximize celestial fire under candlelight and bridal chandeliers.
            </p>
            <div className="pt-2">
              <Link to="/contact">
                <Button variant="gold" size="md">
                  Reserve Salon Consultation
                </Button>
              </Link>
            </div>
          </div>

          {/* Arched Palace Frame */}
          <div className="relative aspect-[4/5] rounded-t-[140px] rounded-b-md overflow-hidden bg-[#131c15] border border-gold-400/40 shadow-2xl shadow-black/60 group">
            <img
              src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop"
              alt="Master Artisan Crafting Jewellery"
              className="w-full h-full object-cover brightness-[0.80] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-transparent to-transparent opacity-80" />
            
            {/* Inset Gold Arch Border */}
            <div className="absolute inset-3 border border-gold-400/30 rounded-t-[125px] rounded-b-sm pointer-events-none" />

            {/* Floating Heritage Plaque */}
            <div className="absolute bottom-6 inset-x-6 bg-[#142318]/90 backdrop-blur-md border border-gold-400/40 p-4 rounded-lg text-center">
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
                ✦ Master Goldsmith Atelier ✦
              </span>
              <p className="text-xs text-ivory/90 font-serif">
                Hand-setting natural uncut syndicate diamonds into 22K imperial gold
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Certifications */}
        <div className="bg-[#142318] border border-gold-400/30 rounded-xl p-8 sm:p-14 my-14 text-center shadow-2xl shadow-black/50 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 blur-[100px] rounded-full pointer-events-none" />

          <SectionHeading
            subtitle="Purity Guaranteed"
            title="Integrity, Hallmarking & Certification"
            description="We adhere to the most stringent international standards of gemological integrity."
            light={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left mt-8 relative z-10">
            <div className="p-6 bg-[#18281d] border border-gold-500/25 rounded-lg hover:border-gold-400/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-4">
                <FiAward className="text-lg" />
              </div>
              <h4 className="font-serif text-lg text-gold-300 mb-2">BIS 916 & 750 Hallmarked</h4>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Certified by the Bureau of Indian Standards with laser-engraved identification marks guaranteeing 100% gold purity.
              </p>
            </div>

            <div className="p-6 bg-[#18281d] border border-gold-500/25 rounded-lg hover:border-gold-400/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-4">
                <FiShield className="text-lg" />
              </div>
              <h4 className="font-serif text-lg text-gold-300 mb-2">GIA & IGI Certified Diamonds</h4>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Every solitaire diamond exceeding 0.30 carats comes with a globally recognized laboratory certification report.
              </p>
            </div>

            <div className="p-6 bg-[#18281d] border border-gold-500/25 rounded-lg hover:border-gold-400/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-4">
                <FiGlobe className="text-lg" />
              </div>
              <h4 className="font-serif text-lg text-gold-300 mb-2">Conflict-Free & Ethically Sourced</h4>
              <p className="text-xs text-ivory/70 leading-relaxed font-light">
                Compliant with the Kimberley Process, ensuring all precious gems support artisanal communities and sustainable mining practices.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Salon Invitation */}
        <div className="text-center py-12 border-t border-gold-500/20">
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-2 block">
            ✦ Private Bridal Appointments ✦
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif text-ivory mb-6 font-normal">
            Experience the Touch of True High Jewellery
          </h3>
          <Link to="/contact">
            <Button variant="gold" size="lg" icon={FiCalendar}>
              Book a Salon Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
