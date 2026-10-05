import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Palette, MessageSquare, Layers, ArrowRight, CheckCircle2, ShoppingBag, Eye } from 'lucide-react';

const FEATURED_PIECES = [
  {
    id: 1,
    name: 'Tailored Double-Breasted Wool Blazer',
    category: 'Outerwear',
    price: '$680',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    name: 'Bias-Cut Silk Charmeuse Gown',
    category: 'Dresses',
    price: '$920',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    name: 'Oversized Poplin French Cuff Shirt',
    category: 'Tops',
    price: '$340',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80'
  }
];

const Home = () => {
  return (
    <div className="bg-white text-black space-y-32 pb-24">
      {/* ── Hero Section ───────────────────────────── */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-black text-[10px] font-semibold tracking-[0.25em] text-black uppercase">
              <Sparkles className="w-3 h-3" />
              Haute Couture &bull; Virtual Fitting
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-tight text-black leading-[1.05]">
              Virtual Try-On. <br />
              <span className="italic font-normal">Dress without limits.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-xl">
              Upload any clothing item and your portrait. Powered by Gemini, MAISON creates photorealistic fitting previews with natural fabric drape, contouring shadows, and effortless grace.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                to="/try-on"
                className="w-full sm:w-auto px-10 py-4 bg-black text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-sm group"
              >
                <span>Enter Fitting Room</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-10 py-4 border border-black text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Boutique</span>
              </Link>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-8 text-[11px] text-neutral-500 uppercase tracking-widest font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Instant AI Try-On
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                12-Season Color Draping
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Personal AI Stylist
              </div>
            </div>
          </div>

          {/* Hero Editorial Visual */}
          <div className="relative">
            <div className="aspect-[3/4] border border-neutral-200 overflow-hidden bg-neutral-100 shadow-2xl relative group">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
                alt="MAISON Atelier Editorial"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-neutral-200 space-y-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                  Live Preview Technology
                </p>
                <p className="font-serif text-lg text-black font-normal">
                  "The future of luxury shopping is seeing yourself in the garment before the needle touches the thread."
                </p>
                <Link
                  to="/try-on"
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-black hover:underline pt-1"
                >
                  Launch Try-On Experience &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Curated Boutique Preview ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-6 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
              The Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-black">
              Signature Garments Ready For Try-On
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-black hover:underline flex items-center gap-2"
          >
            View All Pieces <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED_PIECES.map((item) => (
            <div key={item.id} className="group border border-neutral-200 hover:border-black transition-all bg-white flex flex-col justify-between">
              <div>
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to="/try-on"
                      className="px-5 py-2.5 bg-white text-black text-xs uppercase tracking-widest font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      Try On Item
                    </Link>
                  </div>
                </div>
                <div className="p-6 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400">{item.category}</p>
                  <h3 className="font-serif text-lg font-normal text-black">{item.name}</h3>
                  <p className="text-sm font-semibold text-black">{item.price}</p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between">
                <Link
                  to="/try-on"
                  className="text-xs uppercase tracking-wider font-semibold text-black flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3" /> Virtual Fitting
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Full AI Styling Suite ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Intelligent Fashion Engine
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light text-black">
            The Complete Atelier Suite
          </h2>
          <p className="text-sm text-neutral-600 font-light leading-relaxed">
            From chromatic color science to digital closet management and conversational styling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Virtual Try-On */}
          <div className="border border-neutral-200 p-8 space-y-6 hover:border-black transition-all bg-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-black">
                Virtual Try-On
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Upload your picture and any garment to generate photorealistic fitting room shots powered by Gemini.
              </p>
            </div>
            <Link
              to="/try-on"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-black hover:translate-x-1 transition-transform pt-4 border-t border-neutral-100"
            >
              Try On Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Color Analysis */}
          <div className="border border-neutral-200 p-8 space-y-6 hover:border-black transition-all bg-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-black">
                12-Season Color
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Determine your skin undertone, high-contrast power hues, and tailored wardrobe neutrals.
              </p>
            </div>
            <Link
              to="/color-analysis"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-black hover:translate-x-1 transition-transform pt-4 border-t border-neutral-100"
            >
              Analyze Palette <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: AI Stylist */}
          <div className="border border-neutral-200 p-8 space-y-6 hover:border-black transition-all bg-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-black">
                AI Personal Stylist
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Consult with our conversational fashion director for event dress codes, capsule formulas, and advice.
              </p>
            </div>
            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-black hover:translate-x-1 transition-transform pt-4 border-t border-neutral-100"
            >
              Consult Stylist <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Digital Wardrobe */}
          <div className="border border-neutral-200 p-8 space-y-6 hover:border-black transition-all bg-white flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 border border-black flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <Shirt className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-light text-black">
                Digital Wardrobe
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Digitize your physical closet with AI background removal and build smart mix-and-match capsules.
              </p>
            </div>
            <Link
              to="/wardrobe"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-black hover:translate-x-1 transition-transform pt-4 border-t border-neutral-100"
            >
              Open Wardrobe <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Call to Action ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-black p-12 sm:p-16 text-center space-y-6 bg-white">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
            Private Atelier
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-light text-black">
            Experience Virtual Try-On Today
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto leading-relaxed">
            Eliminate fitting uncertainty. See garments rendered directly on your portrait with realistic drape, shadows, and elegance.
          </p>
          <div className="pt-4">
            <Link
              to="/try-on"
              className="inline-flex items-center gap-3 px-12 py-4 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-colors shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Virtual Fitting</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
