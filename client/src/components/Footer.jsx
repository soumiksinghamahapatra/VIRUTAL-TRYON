import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-light tracking-[0.25em] text-black uppercase">
                MAISON
              </span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              Haute couture atelier and intelligent fashion suite. Virtual fitting rooms, seasonal color harmonic algorithms, and personal styling.
            </p>
            <p className="text-[11px] uppercase tracking-widest text-neutral-400">
              Paris &bull; Milan &bull; New York
            </p>
          </div>

          {/* Navigation Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              The Atelier
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">
                  The Boutique Collection
                </Link>
              </li>
              <li>
                <Link to="/try-on" className="hover:text-black transition-colors font-medium text-black flex items-center gap-1">
                  Virtual Fitting Room <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="hover:text-black transition-colors">
                  Digital Wardrobe Catalog
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-black transition-colors">
                  Mix & Match Outfit Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-light">
              <li>
                <Link to="/color-analysis" className="hover:text-black transition-colors">
                  12-Season Color Draping
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-black transition-colors">
                  Conversational AI Stylist
                </Link>
              </li>
              <li>
                <Link to="/analyzer" className="hover:text-black transition-colors">
                  Inspo Match & Outfit Breakdown
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-black transition-colors">
                  Atelier Membership Tiers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-black">
              Atelier Dispatch
            </h4>
            <p className="text-xs text-neutral-500 font-light">
              Receive seasonal capsule formulas and private collection previews.
            </p>
            <div className="flex border border-neutral-300 focus-within:border-black transition-colors">
              <input
                type="email"
                placeholder="atelier@domain.com"
                className="w-full text-xs px-3 py-2 bg-transparent text-black outline-none placeholder:text-neutral-400 font-light"
              />
              <button
                onClick={() => alert('Subscribed to MAISON Dispatch.')}
                className="bg-black text-white px-4 text-[10px] uppercase tracking-widest font-semibold hover:bg-neutral-800"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
          <p>&copy; {new Date().getFullYear()} MAISON Fashion Technologies. All rights reserved.</p>
          <div className="flex gap-6 uppercase tracking-wider text-[10px]">
            <a href="#" className="hover:text-black">Privacy Protocol</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">AI Transparency</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
