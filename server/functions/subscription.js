const crypto = require('crypto');
const db = require('../db');

function handleLandingTryonPairs() {
  return {
    pairs: [
      {
        id: "pair-1",
        title: "Sunday Gallery Walk",
        before: "/assets/travel-look-BIiKStke.webp",
        after: "/assets/city-look-CO6tnpbW.webp",
        tag: "Classic Tailored"
      },
      {
        id: "pair-2",
        title: "Effortless Brunch",
        before: "/assets/brunch-top-DyVfbOn4.webp",
        after: "/assets/minniie-general-ootd-DvG9Y0bt.jpg",
        tag: "Casual Chic"
      }
    ],
    outfits: [
      { id: "o-1", title: "Autumn Palette Capsule", image: "/assets/minniie-general-ootd-DvG9Y0bt.jpg" },
      { id: "o-2", title: "Smart Casual Blazer", image: "/assets/city-look-CO6tnpbW.webp" }
    ],
    buildLookOutfits: [
      { id: "b-1", title: "Tailored Camel & Raw Denim", image: "/assets/city-look-CO6tnpbW.webp" },
      { id: "b-2", title: "Silk & Knit Layering", image: "/assets/travel-look-BIiKStke.webp" }
    ],
    ootdOutfits: [
      { id: "ootd-1", title: "Daily Uniform", image: "/assets/minniie-general-ootd-DvG9Y0bt.jpg" }
    ],
    founderAvatar: "/assets/minniie-general-ootd-DvG9Y0bt.jpg",
    closet: [
      { id: "c-1", title: "Camel Blazer", image: "/assets/city-look-CO6tnpbW.webp", category: "outerwear" },
      { id: "c-2", title: "Silk Ivory Top", image: "/assets/brunch-top-DyVfbOn4.webp", category: "tops" },
      { id: "c-3", title: "Pleated Trousers", image: "/assets/brunch-bottom-CZ0x9j6O.webp", category: "bottoms" },
      { id: "c-4", title: "Leather Loafers", image: "/assets/brunch-shoes-Cu3OZLQ_.webp", category: "shoes" }
    ],
    wishlist: [
      { id: "w-1", title: "Structured Shoulder Bag", image: "/assets/city-look-CO6tnpbW.webp" }
    ],
    brunchFit: {
      image: "/assets/travel-look-BIiKStke.webp",
      title: "Weekend Brunch"
    },
    aiEdit: {
      image: "/assets/city-look-CO6tnpbW.webp",
      instruction: "Make it Parisian chic"
    }
  };
}

function handleCheckSubscription(user) {
  if (!user) {
    return {
      subscribed: false,
      tier: 'free',
      subscriptionEnd: null,
      product_id: 'free'
    };
  }

  const sub = db.prepare('SELECT * FROM subscribers WHERE user_id = ?').get(user.sub);
  if (!sub) {
    return {
      subscribed: true,
      tier: 'pro',
      subscriptionEnd: new Date(Date.now() + 365 * 86400000).toISOString(),
      product_id: 'pro'
    };
  }

  return {
    subscribed: sub.subscribed === 1 || sub.manual_override === 1,
    tier: sub.tier || 'pro',
    subscriptionEnd: sub.current_period_end || new Date(Date.now() + 365 * 86400000).toISOString(),
    product_id: sub.tier || 'pro'
  };
}

function handleCreateCheckout(body) {
  return {
    url: '/home?subscription=success'
  };
}

function handlePurchaseCredits(body) {
  return {
    url: '/home?topup=success'
  };
}

function handleContactForm(body) {
  console.log('[Contact form submitted]:', body);
  return { success: true };
}

function handleLogFunnelEvent(body) {
  return { ok: true };
}

function handleAffiliateAttach(body) {
  return { attached: true };
}

module.exports = {
  handleLandingTryonPairs,
  handleCheckSubscription,
  handleCreateCheckout,
  handlePurchaseCredits,
  handleContactForm,
  handleLogFunnelEvent,
  handleAffiliateAttach
};
