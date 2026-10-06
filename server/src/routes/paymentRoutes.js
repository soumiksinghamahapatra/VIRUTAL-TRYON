const express = require('express');
const router = express.Router();
const { processCheckout, processSubscription, getOrders } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth for checkout (allows guest checkout or authenticated checkout)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/checkout', optionalAuth, processCheckout);
router.post('/subscribe', protect, processSubscription);
router.get('/orders', protect, getOrders);

module.exports = router;
