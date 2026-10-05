const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

const { handleColorAnalysis, handleEvaluateWardrobeColors } = require('./colorAnalysis');
const { handleCategorizeItem } = require('./categorizeItem');
const { handleGenerateCollage, handleEditCollage } = require('./collageGenerator');
const { handleStyleConsultationStream, handleStyleInspirationSearch } = require('./styleConsultation');
const { handleAnalyzeOutfit } = require('./outfitAnalyzer');
const { handleSearchProducts, handleSearchProductImage } = require('./productSearch');
const { handleFetchUrlImages, handleImportUrlImage } = require('./imageTools');
const {
  handleLandingTryonPairs,
  handleCheckSubscription,
  handleCreateCheckout,
  handlePurchaseCredits,
  handleContactForm,
  handleLogFunnelEvent,
  handleAffiliateAttach
} = require('./subscription');

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.slice(7);
    return jwt.verify(token, config.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// All edge functions route through POST /functions/v1/:name
router.post('/:functionName', async (req, res) => {
  const { functionName } = req.params;
  const user = getAuthUser(req);

  try {
    switch (functionName) {
      case 'style-consultation':
        return await handleStyleConsultationStream(req, res, user);

      case 'style-inspiration-search':
        return res.status(200).json(await handleStyleInspirationSearch(req.body));

      case 'color-analysis':
        return res.status(200).json(await handleColorAnalysis(req.body, user));

      case 'evaluate-wardrobe-colors':
        return res.status(200).json(await handleEvaluateWardrobeColors(req.body, user));

      case 'categorize-item':
        return res.status(200).json(await handleCategorizeItem(req.body));

      case 'generate-collage':
        return res.status(200).json(await handleGenerateCollage(req.body, user));

      case 'edit-collage':
        return res.status(200).json(await handleEditCollage(req.body, user));

      case 'analyze-outfit':
        return res.status(200).json(await handleAnalyzeOutfit(req.body, user));

      case 'search-products':
        return res.status(200).json(await handleSearchProducts(req.body));

      case 'search-product-image':
        return res.status(200).json(await handleSearchProductImage(req.body));

      case 'fetch-url-images':
        return res.status(200).json(await handleFetchUrlImages(req.body));

      case 'import-url-image':
        return res.status(200).json(await handleImportUrlImage(req.body));

      case 'landing-tryon-pairs':
        return res.status(200).json(handleLandingTryonPairs());

      case 'check-subscription':
        return res.status(200).json(handleCheckSubscription(user));

      case 'create-checkout':
        return res.status(200).json(handleCreateCheckout(req.body));

      case 'purchase-credits':
        return res.status(200).json(handlePurchaseCredits(req.body));

      case 'contact-form':
        return res.status(200).json(handleContactForm(req.body));

      case 'log-funnel-event':
        return res.status(200).json(handleLogFunnelEvent(req.body));

      case 'affiliate-attach':
        return res.status(200).json(handleAffiliateAttach(req.body));

      default:
        console.warn(`[Unknown Edge Function]: ${functionName}`);
        return res.status(200).json({ ok: true, function: functionName });
    }
  } catch (err) {
    console.error(`[Error in function ${functionName}]:`, err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
