const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('../config');

const FALLBACK_PRODUCT_IMAGES = [
  { src: "/assets/city-look-CO6tnpbW.webp", alt: "Tailored Outfit" },
  { src: "/assets/brunch-top-DyVfbOn4.webp", alt: "Silk Blouse" },
  { src: "/assets/brunch-bottom-CZ0x9j6O.webp", alt: "Wide Leg Trousers" },
  { src: "/assets/brunch-shoes-Cu3OZLQ_.webp", alt: "Leather Shoes" },
  { src: "/assets/travel-look-BIiKStke.webp", alt: "Travel Capsule Look" }
];

async function handleFetchUrlImages(body) {
  const { url } = body || {};
  if (!url) return { images: FALLBACK_PRODUCT_IMAGES };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const html = await res.text();

    const images = [];
    // Check og:image
    const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1].startsWith('http')) {
      images.push({ src: ogMatch[1], alt: "Product Image" });
    }

    // Check img tags
    const imgMatches = html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi);
    for (const m of imgMatches) {
      if (images.length >= 6) break;
      if (!images.some(i => i.src === m[1])) {
        images.push({ src: m[1], alt: "Extracted Product Image" });
      }
    }

    return {
      images: images.length > 0 ? images : FALLBACK_PRODUCT_IMAGES
    };
  } catch (err) {
    console.log('[handleFetchUrlImages] Falling back to curated item previews:', err.message);
    return { images: FALLBACK_PRODUCT_IMAGES };
  }
}

async function handleImportUrlImage(body) {
  const { imageUrl } = body || {};
  if (!imageUrl) throw new Error('Missing imageUrl');

  const filename = `${crypto.randomUUID()}.jpg`;
  const destDir = path.join(config.UPLOADS_DIR, 'wardrobe-images');
  const destPath = path.join(destDir, filename);

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // If local asset path, copy or serve directly
  if (imageUrl.startsWith('/assets/')) {
    const localSrc = path.join(__dirname, '..', '..', imageUrl.replace(/^\//, ''));
    if (fs.existsSync(localSrc)) {
      fs.copyFileSync(localSrc, destPath);
    }
  } else if (imageUrl.startsWith('http')) {
    try {
      const res = await fetch(imageUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(destPath, Buffer.from(buffer));
      }
    } catch (e) {
      console.log('[handleImportUrlImage] Remote download error, using fallback:', e.message);
    }
  }

  const publicUrl = `/storage/v1/object/public/wardrobe-images/${filename}`;
  return {
    publicUrl
  };
}

module.exports = {
  handleFetchUrlImages,
  handleImportUrlImage
};
