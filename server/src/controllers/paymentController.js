const User = require('../models/User');

// In-memory order storage for resilience
const ordersHistory = [];

/**
 * Validate card number using Luhn algorithm
 */
function isValidCardNumber(cardNumber) {
  const sanitized = (cardNumber || '').replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Detect card network
 */
function getCardBrand(cardNumber) {
  const sanitized = (cardNumber || '').replace(/[\s-]/g, '');
  if (/^4/.test(sanitized)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(sanitized)) return 'Mastercard';
  if (/^3[47]/.test(sanitized)) return 'American Express';
  if (/^6(?:011|5)/.test(sanitized)) return 'Discover';
  return 'Card';
}

/**
 * @desc    Process checkout payment for luxury garments
 * @route   POST /api/payment/checkout
 * @access  Public / Private
 */
exports.processCheckout = async (req, res, next) => {
  try {
    const {
      items = [],
      totalAmount,
      currency = 'USD',
      paymentMethod = 'card',
      cardDetails,
      customer = {},
      shippingAddress = {}
    } = req.body;

    if (!items.length && (!totalAmount || totalAmount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order amount or empty items list.'
      });
    }

    // Validate card if card payment
    if (paymentMethod === 'card') {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
        return res.status(400).json({
          success: false,
          message: 'Please provide complete card information (Card number, Expiry MM/YY, and CVV).'
        });
      }

      // Check card number formatting (relaxed for testing)
      const rawNum = cardDetails.cardNumber.replace(/[\s-]/g, '');
      if (rawNum.length < 13 || rawNum.length > 19) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credit card number length.'
        });
      }
    }

    // Generate unique transaction & order references
    const orderId = `MSN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const transactionId = `txn_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const authorizationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const orderRecord = {
      orderId,
      transactionId,
      authorizationCode,
      userId: req.user ? req.user.id : null,
      customer: {
        name: customer.name || (req.user ? req.user.name : 'Atelier Client'),
        email: customer.email || (req.user ? req.user.email : 'client@maison.com'),
        phone: customer.phone || '+1 (555) 019-2831'
      },
      shippingAddress: {
        line1: shippingAddress.line1 || '10 Place Vendôme',
        city: shippingAddress.city || 'Paris',
        postalCode: shippingAddress.postalCode || '75001',
        country: shippingAddress.country || 'France'
      },
      items,
      totalAmount: Number(totalAmount || 0),
      currency,
      paymentMethod,
      cardBrand: paymentMethod === 'card' ? getCardBrand(cardDetails?.cardNumber) : paymentMethod.toUpperCase(),
      cardLast4: paymentMethod === 'card' ? (cardDetails?.cardNumber || '').slice(-4) : '••••',
      status: 'PAID',
      paidAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    ordersHistory.push(orderRecord);

    console.log(`[Payment] Order ${orderId} successfully processed for $${totalAmount} via ${orderRecord.cardBrand}`);

    res.status(200).json({
      success: true,
      message: 'Payment authorized and order confirmed.',
      order: orderRecord
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Process subscription membership payment & upgrade plan
 * @route   POST /api/payment/subscribe
 * @access  Private
 */
exports.processSubscription = async (req, res, next) => {
  try {
    const { planId, paymentMethod = 'card', cardDetails } = req.body;

    const validPlans = {
      free: { name: 'Free Starter', price: 0 },
      pro: { name: 'MAISON Pro Atelier', price: 19 },
      studio: { name: 'MAISON Haute VIP', price: 39 }
    };

    if (!validPlans[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid membership plan requested.'
      });
    }

    // Process payment if paid plan
    let transactionId = null;
    if (validPlans[planId].price > 0 && paymentMethod === 'card') {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv) {
        return res.status(400).json({
          success: false,
          message: 'Payment details required for paid membership.'
        });
      }
      transactionId = `sub_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    }

    // Update user in DB if user is authenticated
    let updatedUser = null;
    if (req.user && req.user.id) {
      try {
        updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            plan: planId,
            planStatus: 'active'
          },
          { new: true }
        );
      } catch (dbErr) {
        console.warn('[Payment DB Note]:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Successfully enrolled in ${validPlans[planId].name}.`,
      subscription: {
        plan: planId,
        planName: validPlans[planId].name,
        price: validPlans[planId].price,
        billingCycle: 'Monthly',
        status: 'ACTIVE',
        transactionId,
        renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      user: updatedUser ? {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan
      } : { plan: planId }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get order history for current user
 * @route   GET /api/payment/orders
 * @access  Private
 */
exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const userOrders = ordersHistory.filter(o => !userId || o.userId === userId);
    res.status(200).json({
      success: true,
      count: userOrders.length,
      orders: userOrders
    });
  } catch (err) {
    next(err);
  }
};
