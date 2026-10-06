import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Filter, Eye, ShoppingBag, Check } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';

const PRODUCTS = [
  {
    id: 1,
    name: 'Tailored Double-Breasted Wool Blazer',
    category: 'Outerwear',
    price: 680,
    color: 'Pitch Black',
    description: 'Structured shoulders, peak lapels, horn buttons, architectural silhouette.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    tag: 'Iconic'
  },
  {
    id: 2,
    name: 'Bias-Cut Silk Charmeuse Evening Gown',
    category: 'Dresses',
    price: 920,
    color: 'Champagne Ivory',
    description: 'Floor-length fluid drape, delicate cowl neck, low open back.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
    tag: 'Haute Couture'
  },
  {
    id: 3,
    name: 'Oversized Poplin French Cuff Shirt',
    category: 'Tops',
    price: 340,
    color: 'Optic White',
    description: '100% Egyptian long-staple cotton, crisp spread collar, mother-of-pearl buttons.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
    tag: 'Essential'
  },
  {
    id: 4,
    name: 'Pleated Wide-Leg Wool Trousers',
    category: 'Bottoms',
    price: 460,
    color: 'Charcoal Grey',
    description: 'High-rise waist, deep double pleats, relaxed fluid leg line.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80',
    tag: 'Tailored'
  },
  {
    id: 5,
    name: 'Cashmere Ribbed Turtleneck Knit',
    category: 'Tops',
    price: 520,
    color: 'Midnight Black',
    description: 'Ultra-fine 2-ply Mongolian cashmere, close-fitting ribbed neckline.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    tag: 'Luxury'
  },
  {
    id: 6,
    name: 'Structured Gabardine Trench Coat',
    category: 'Outerwear',
    price: 1150,
    color: 'Oatmeal Beige',
    description: 'Water-repellent technical gabardine, storm flap, belted cuffs and waist.',
    image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80',
    tag: 'Atelier'
  }
];

const CATEGORIES = ['All', 'Outerwear', 'Dresses', 'Tops', 'Bottoms'];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const navigate = useNavigate();

  const handleAcquire = (product) => {
    setCheckoutProduct(product);
    setIsPaymentOpen(true);
  };

  const filtered = selectedCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-white text-black min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">
            Curated Collection
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-black">
            The MAISON Boutique
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
            Architectural tailoring, pure natural fibers, and timeless silhouettes. Preview any piece instantly on your own portrait in our Virtual Fitting Room.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center gap-2 border-b border-neutral-200 pb-4 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group border border-neutral-200 hover:border-black transition-all duration-300 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-black border border-neutral-200">
                    {product.tag}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      to="/try-on"
                      className="px-4 py-2.5 bg-white text-black text-xs uppercase tracking-wider font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Virtual Try-On
                    </Link>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400">
                    <span>{product.category}</span>
                    <span>{product.color}</span>
                  </div>
                  <h3 className="font-serif text-xl font-normal text-black group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 font-light">
                    {product.description}
                  </p>
                  <p className="text-base font-semibold text-black pt-2">
                    ${product.price}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
                <Link
                  to="/try-on"
                  className="text-xs font-semibold uppercase tracking-wider text-black flex items-center gap-1.5 hover:translate-x-1 transition-transform"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Try On Now
                </Link>
                <button
                  onClick={() => handleAcquire(product)}
                  className="text-xs font-semibold uppercase tracking-wider bg-black text-white px-3 py-1.5 hover:bg-neutral-800 transition-colors flex items-center gap-1 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Acquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secure Payment Modal */}
      {checkoutProduct && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setCheckoutProduct(null);
          }}
          orderData={{
            type: 'garment',
            totalAmount: checkoutProduct.price,
            currency: 'USD',
            items: [
              {
                id: checkoutProduct.id,
                name: checkoutProduct.name,
                price: checkoutProduct.price,
                quantity: 1,
                image: checkoutProduct.image
              }
            ]
          }}
          onPaymentSuccess={(order) => {
            console.log('Order finalized:', order);
          }}
        />
      )}
    </div>
  );
};

export default Shop;
