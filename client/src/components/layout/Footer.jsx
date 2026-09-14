import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_SUBTITLE } from '../../utils/constants';
import { useSettings } from '../../context/SettingsContext';
import { FiShield, FiAward, FiLock, FiPackage } from 'react-icons/fi';

const Footer = () => {
  const { logoUrl } = useSettings();
  return (
    <footer className="bg-forest-900 text-ivory border-t border-gold-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gold-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center text-gold-400 flex-shrink-0">
              <FiAward className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-gold-300">
                100% BIS Hallmarked
              </p>
              <p className="text-[11px] text-ivory/60">Government certified gold</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center text-gold-400 flex-shrink-0">
              <FiShield className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-gold-300">
                Certified Diamonds
              </p>
              <p className="text-[11px] text-ivory/60">GIA & IGI grading reports</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center text-gold-400 flex-shrink-0">
              <FiPackage className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-gold-300">
                Insured Delivery
              </p>
              <p className="text-[11px] text-ivory/60">Tamper-evident luxury vault</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center text-gold-400 flex-shrink-0">
              <FiLock className="text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-gold-300">
                Bespoke Heritage
              </p>
              <p className="text-[11px] text-ivory/60">Handcrafted by master karigars</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14">
          {/* Col 1: Brand & Salons */}
          <div className="lg:col-span-2 space-y-4 pr-4">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <img
                src={logoUrl || '/images/logo.png'}
                alt="New Shiv Jewellers"
                onError={(e) => {
                  if (e.currentTarget.src !== window.location.origin + '/images/logo.png') {
                    e.currentTarget.src = '/images/logo.png';
                  }
                }}
                className="w-14 h-14 object-contain rounded-lg border border-gold-400/40 p-0.5 shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="font-serif text-2xl sm:text-3xl tracking-wider text-gold-400 font-bold block uppercase group-hover:text-gold-300 transition-colors leading-tight">
                  {BRAND_NAME}
                </span>
              </div>
            </Link>
            <p className="text-xs text-ivory/70 leading-relaxed max-w-sm pt-2">
              Welcome to New Shiv Jewellers. From sacred Nakshi repoussé temple jewellery to uncut Polki diamond chokers and certified solitaires, each creation is an enduring royal heirloom.
            </p>
            <div className="pt-2 text-xs text-ivory/60 space-y-1">
              <p><strong className="text-gold-300">Boutique:</strong> New Shiv Jewellers Fine Jewellery Showroom</p>
              <p><strong className="text-gold-300">Concierge:</strong> Certified 22K Hallmarked Gold & Solitaires</p>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-gold-400 mb-4">
              Jewellery
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li><Link to="/jewellery/necklaces" className="hover:text-gold-300 transition-colors">Necklaces & Chokers</Link></li>
              <li><Link to="/jewellery/rings" className="hover:text-gold-300 transition-colors">Diamond & Gold Rings</Link></li>
              <li><Link to="/jewellery/earrings" className="hover:text-gold-300 transition-colors">Jhumkas & Chandbalis</Link></li>
              <li><Link to="/jewellery/bracelets-bangles" className="hover:text-gold-300 transition-colors">Temple Kadas & Bangles</Link></li>
              <li><Link to="/jewellery/pendants" className="hover:text-gold-300 transition-colors">Solitaire Pendants</Link></li>
              <li><Link to="/jewellery/bridal" className="hover:text-gold-300 transition-colors">Royal Bridal Suites</Link></li>
            </ul>
          </div>

          {/* Col 3: Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-gold-400 mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li><Link to="/collections/royal-bridal-heritage" className="hover:text-gold-300 transition-colors">Royal Bridal Heritage</Link></li>
              <li><Link to="/collections/celeste-diamond-collection" className="hover:text-gold-300 transition-colors">Celeste Diamond Soliloquy</Link></li>
              <li><Link to="/collections/the-temple-gold-era" className="hover:text-gold-300 transition-colors">The Temple Gold Chronicle</Link></li>
              <li><Link to="/collections/everyday-elegance" className="hover:text-gold-300 transition-colors">Everyday Modern Minimalist</Link></li>
              <li><Link to="/collections" className="hover:text-gold-300 transition-colors">All Curations</Link></li>
            </ul>
          </div>

          {/* Col 4: Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-luxury font-semibold text-gold-400 mb-4">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li><Link to="/contact" className="hover:text-gold-300 transition-colors">Book Private Appointment</Link></li>
              <li><Link to="/about" className="hover:text-gold-300 transition-colors">Artisanal Heritage</Link></li>
              <li><Link to="/account" className="hover:text-gold-300 transition-colors">Track Your Order</Link></li>
              <li><Link to="/jewellery" className="hover:text-gold-300 transition-colors">Jewellery Portfolio</Link></li>
              <li><Link to="/contact" className="hover:text-gold-300 transition-colors">Concierge Helpline</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-gold-500/15 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-ivory/50 gap-4">
          <p>© {new Date().getFullYear()} {BRAND_NAME} Haute Joaillerie. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[10px] uppercase tracking-wider">
            <span>Complimentary Insured Courier</span>
            <span>•</span>
            <span>Handcrafted In India</span>
            <span>•</span>
            <span>30-Day Inspection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
