const express = require('express');
const router = express.Router();
const { getPlans, upgradePlan } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plans', getPlans);
router.post('/upgrade', protect, upgradePlan);

module.exports = router;
