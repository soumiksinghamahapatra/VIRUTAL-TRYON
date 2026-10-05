const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

router.get('/products', (req, res) => {
  res.json(PRODUCTS);
});

router.post(
  '/try-on',
  upload.fields([
    { name: 'clothingImage', maxCount: 1 },
    { name: 'personImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const clothingFile = req.files?.clothingImage?.[0];
      const personFile = req.files?.personImage?.[0];

      if (!clothingFile && !personFile) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both clothing and portrait images.',
        });
      }

      const clothingName = req.body.clothingName || 'Tailored Garment';
      const clothingDesc = req.body.clothingDescription || '';
      const customApiKey = req.body.apiKey;

      const apiKey = customApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          success: false,
          error: 'No Gemini API key found. Please provide your Gemini API key.',
        });
      }

      const { GoogleGenAI } = require('@google/genai');
      // Ensure GOOGLE_API_KEY environment variable doesn't override if custom key is provided
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Create a professional e-commerce high-fashion portrait. Take the ${clothingName} (${clothingDesc}) from the first garment image and dress the person from the second portrait image in it. Maintain natural lighting, photorealistic fabric draping, authentic shadows, and the person's exact face, skin tone, hair, and posture. Generate a clean full-body shot of the person wearing the garment.`;

      const input = [];
      if (clothingFile) {
        input.push({
          type: 'image',
          mime_type: clothingFile.mimetype,
          data: clothingFile.buffer.toString('base64'),
        });
      }
      if (personFile) {
        input.push({
          type: 'image',
          mime_type: personFile.mimetype,
          data: personFile.buffer.toString('base64'),
        });
      }
      input.push({ type: 'text', text: prompt });

      console.log('[Try-On] Calling Gemini interactions API with gemini-3.1-flash-image...');

      try {
        const interaction = await ai.interactions.create({
          model: 'gemini-3.1-flash-image',
          input,
        });

        let outputImage = null;
        let outputText = '';

        if (interaction && interaction.steps) {
          for (const step of interaction.steps) {
            if (step.type === 'model_output' && step.content) {
              for (const block of step.content) {
                if (block.type === 'text') outputText += block.text;
                if (block.type === 'image') outputImage = block.data;
              }
            }
          }
        }

        if (outputImage) {
          return res.json({
            success: true,
            image: `data:image/png;base64,${outputImage}`,
            description: outputText || `Photorealistic fitting generated for ${clothingName}.`,
          });
        }

        return res.status(500).json({
          success: false,
          error: 'The Gemini model completed the request but did not return image data.',
          details: outputText,
        });
      } catch (apiErr) {
        console.error('[Try-On] Gemini API call error:', apiErr.message);

        // Check for 429 quota limitation
        if (apiErr.message && (apiErr.message.includes('429') || apiErr.message.includes('quota') || apiErr.message.includes('Rate limit'))) {
          return res.status(429).json({
            success: false,
            isQuotaError: true,
            error: 'Google Gemini Free Tier Rate Limit (Limit: 0 requests on Free Tier for gemini-3.1-flash-image).',
            details: apiErr.message,
            tip: 'Google Cloud requires a Pay-As-You-Go billing account linked to your Gemini project for Image Generation (https://aistudio.google.com). Free-tier keys have 0 daily requests for image models.',
          });
        }

        return res.status(500).json({
          success: false,
          error: `Gemini API error: ${apiErr.message}`,
        });
      }
    } catch (err) {
      console.error('[Try-On Route Error]:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal try-on error',
      });
    }
  }
);

module.exports = router;
