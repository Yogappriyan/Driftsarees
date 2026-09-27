import React, { useState } from 'react';
import { MagneticButton } from './MagneticButton';
import { ArrowUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { scrollToElement } from '../utils/scroll';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategoryFilter, setIsAdminOpen } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    scrollToElement('#hero', 0);
  };

  const handleCategoryNav = (cat: string) => {
    setSelectedCategoryFilter(cat);
    scrollToElement('#full-catalog', -40);
  };

  return (
    <footer className="relative w-full bg-[#0A0808] border-t border-[#FAF7F2]/10 text-[#ECE5DC] pt-20 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#541123]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#FAF7F2]/10">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#C5A880] block mb-2 font-medium">
              PRIVILEGE CIRCLE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal tracking-tight mb-4">
              Enter the Maison’s Private Salon
            </h2>
            <p className="text-sm text-[#ECE5DC]/70 font-light max-w-md leading-relaxed mb-6">
              Receive seasonal private previews of one-of-one ceremonial weaves, invitations to private trunk shows, and artisanal provenance notes before public releases.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#C5A880] font-mono tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880]" />
                <span>You have been entered into the DRIFT Private Salon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-md gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#141212] border border-[#FAF7F2]/15 rounded-full px-5 py-3 text-xs text-[#FAF7F2] placeholder-[#ECE5DC]/40 outline-none focus:border-[#C5A880] transition-colors"
                />
                <MagneticButton type="submit" variant="primary" className="text-xs tracking-wider uppercase font-semibold cursor-pointer">
                  Subscribe
                </MagneticButton>
              </form>
            )}
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-sm tracking-widest uppercase text-[#FAF7F2] mb-4">
                Collections
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-[#ECE5DC]/70 font-light">
                <li>
                  <button
                    onClick={() => handleCategoryNav('Kanjivaram')}
                    className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                  >
                    Kanchipuram Silk
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryNav('Banarasi')}
                    className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                  >
                    Banarasi Kadhwa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryNav('Paithani')}
                    className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                  >
                    Yeola Paithani
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryNav('Organza')}
                    className="hover:text-[#C5A880] transition-colors text-left cursor-pointer"
                  >
                    Organza Botanicals
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-sm tracking-widest uppercase text-[#FAF7F2] mb-4">
                Maison Services
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-[#ECE5DC]/70 font-light">
                <li>
                  <span className="text-[#ECE5DC]/90">Custom Blouse Stitching</span>
                </li>
                <li>
                  <span className="text-[#ECE5DC]/90">Bridal Concierge</span>
                </li>
                <li>
                  <span className="text-[#ECE5DC]/90">Tested Zari Authentication</span>
                </li>
                <li>
                  <span className="text-[#ECE5DC]/90">White-Glove Insured Delivery</span>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-1.5 text-[#C5A880] hover:text-[#E7D5B8] transition-colors font-mono text-[11px] cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Maison Admin Portal</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-sm tracking-widest uppercase text-[#FAF7F2] mb-4">
                Ateliers
              </h3>
              <p className="text-xs text-[#ECE5DC]/70 font-light leading-relaxed">
                Varanasi Ghats Atelier <br />
                Kanchipuram Temple Road <br />
                Yeola Heritage Looms
              </p>
              <div className="mt-4 text-[10px] text-[#C5A880] font-mono">
                FLAGSHIP SALON: MUMBAI &amp; BENGALURU
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#ECE5DC]/50 font-mono">
          <div className="flex items-center gap-4">
            <span className="font-serif text-2xl tracking-[0.25em] uppercase text-[#FAF7F2]">
              DRIFT
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">
              Draped in Stories
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>© 2026 DRIFT Haute Couture</span>
            <span>·</span>
            <span>All rights reserved</span>
            <span>·</span>
            <span>Silk Mark Registered</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ECE5DC]/70 hover:text-[#C5A880] transition-colors group cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <div className="w-7 h-7 rounded-full bg-[#181515] border border-[#FAF7F2]/10 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
