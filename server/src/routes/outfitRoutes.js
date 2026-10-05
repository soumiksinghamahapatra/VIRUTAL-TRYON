const express = require('express');
const router = express.Router();
const {
  getOutfits,
  createOutfit,
  deleteOutfit,
  analyzeOutfitInspo,
} = require('../controllers/outfitController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getOutfits)
  .post(createOutfit);

router.delete('/:id', deleteOutfit);
router.post('/analyze-inspo', upload.single('image'), analyzeOutfitInspo);

module.exports = router;
