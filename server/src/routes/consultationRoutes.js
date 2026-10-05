const express = require('express');
const router = express.Router();
const {
  getConsultation,
  sendMessage,
  resetSession,
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getConsultation);
router.post('/message', sendMessage);
router.post('/reset', resetSession);

module.exports = router;
