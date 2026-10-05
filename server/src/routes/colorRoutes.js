const express = require('express');
const router = express.Router();
const {
  getAnalysis,
  runAnalysis,
  getAllPalettes,
  getWardrobeMatch,
} = require('../controllers/colorController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/palettes', getAllPalettes);
router.get('/', protect, getAnalysis);
router.post('/', protect, upload.single('selfie'), runAnalysis);
router.get('/match-wardrobe', protect, getWardrobeMatch);

module.exports = router;
