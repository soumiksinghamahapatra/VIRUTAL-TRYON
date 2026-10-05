const CATEGORIES = [
  { name: 'tops', keywords: ['shirt', 'blouse', 'top', 'tee', 't-shirt', 'sweater', 'knit', 'cardigan', 'hoodie', 'tank'] },
  { name: 'bottoms', keywords: ['trouser', 'pants', 'jeans', 'skirt', 'shorts', 'leggings', 'denim', 'bottom'] },
  { name: 'dresses', keywords: ['dress', 'gown', 'slip', 'jumpsuit', 'romper'] },
  { name: 'outerwear', keywords: ['blazer', 'coat', 'jacket', 'trench', 'parka', 'puffer'] },
  { name: 'shoes', keywords: ['shoes', 'boot', 'boots', 'sneaker', 'loafers', 'heels', 'sandals', 'flats'] },
  { name: 'bags', keywords: ['bag', 'tote', 'clutch', 'crossbody', 'purse', 'handbag'] },
  { name: 'accessories', keywords: ['belt', 'scarf', 'sunglasses', 'jewelry', 'hat', 'necklace', 'earring'] }
];

const COLORS = ['Black', 'White', 'Ivory', 'Cream', 'Camel', 'Beige', 'Navy', 'Grey', 'Terracotta', 'Olive', 'Brown', 'Blue', 'Pink', 'Red', 'Green'];
const STYLES = ['Minimalist', 'Casual Chic', 'Classic Tailored', 'Elegant', 'Bohemian', 'Streetwear', 'Formal'];

async function handleCategorizeItem(body) {
  const { imageUrl } = body || {};
  const lower = String(imageUrl || '').toLowerCase();

  let category = 'other';
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(k => lower.includes(k))) {
      category = cat.name;
      break;
    }
  }

  // Pick color
  let color = 'Neutral';
  for (const c of COLORS) {
    if (lower.includes(c.toLowerCase())) {
      color = c;
      break;
    }
  }
  if (color === 'Neutral') {
    const hash = (lower.length || 7) % COLORS.length;
    color = COLORS[hash];
  }

  // Pick style
  const styleHash = (lower.length || 3) % STYLES.length;
  const style = STYLES[styleHash];

  return {
    category: category === 'other' ? 'tops' : category,
    color: color,
    style: style
  };
}

module.exports = {
  handleCategorizeItem
};
