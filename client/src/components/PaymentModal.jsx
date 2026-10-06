import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ isOpen, onClose, orderData, onPaymentSuccess }) => {
  const { user, updateUser } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'applepay' | 'klarna'
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [shippingAddress, setShippingAddress] = useState({
    line1: '12 Place Vendôme',
    city: 'Paris',
    postalCode: '75001',
    country: 'France'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  if (!isOpen) return null;

  const isSubscription = orderData?.type === 'subscription';
  const totalAmount = orderData?.totalAmount || 0;
  const currency = orderData?.currency || 'USD';

  // Format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setExpiry(raw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSubscription) {
        const payload = {
          planId: orderData.planId,
          paymentMethod,
          cardDetails: paymentMethod === 'card' ? { cardNumber, expiry, cvv, cardHolder } : null
        };
        const res = await paymentAPI.subscribe(payload);
        if (res.data.success) {
          updateUser({ plan: orderData.planId });
          setSuccessResult({
            orderId: res.data.subscription?.transactionId || `SUB-${Date.now().toString(36).toUpperCase()}`,
            type: 'subscription',
            planName: res.data.subscription?.planName || 'MAISON Membership',
            message: res.data.message
          });
          if (onPaymentSuccess) onPaymentSuccess(res.data);
        }
      } else {
        const payload = {
          items: orderData.items || [],
          totalAmount,
          currency,
          paymentMethod,
          cardDetails: paymentMethod === 'card' ? { cardNumber, expiry, cvv, cardHolder } : null,
          customer: {
            name: cardHolder || user?.name || 'Atelier Client',
            email: user?.email || 'client@maison.com'
          },
          shippingAddress
        };
        const res = await paymentAPI.checkout(payload);
        if (res.data.success) {
          setSuccessResult(res.data.order);
          if (onPaymentSuccess) onPaymentSuccess(res.data.order);
        }
      }
    } catch (err) {
      console.error('Payment failure:', err);
      setError(err.response?.data?.message || 'Payment authorization failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-black w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          /* Success Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto text-black animate-scaleIn">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                Payment Authorized
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-black">
                {isSubscription ? 'Welcome to the Atelier' : 'Order Confirmed'}
              </h2>
              <p className="text-xs text-neutral-600 max-w-md mx-auto font-light">
                {isSubscription
                  ? 'Your membership benefits have been unlocked immediately.'
                  : `Your acquisition has been confirmed under reference ${successResult.orderId}. Complimentary white-glove packaging is now in progress.`}
              </p>
            </div>

            <div className="border border-neutral-200 p-6 bg-neutral-50 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Reference</span>
                <span className="font-mono font-semibold text-black">{successResult.orderId || successResult.transactionId}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Amount Charged</span>
                <span className="font-semibold text-black">${totalAmount} {currency}</span>
              </div>
              {successResult.estimatedDelivery && (
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Estimated Arrival</span>
                  <span className="font-medium text-black">{successResult.estimatedDelivery}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Security Protocol</span>
                <span className="text-neutral-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" /> 256-Bit SSL Encrypted
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 bg-black text-white text-xs uppercase tracking-[0.25em] font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Return to Atelier
            </button>
          </div>
        ) : (
          /* Payment Form Screen */
          <div className="p-6 sm:p-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 border-b border-neutral-200 pb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-black" /> Secure Atelier Checkout
              </span>
              <h2 className="font-serif text-3xl font-light text-black">
                {isSubscription ? `Enroll in ${orderData.planName}` : 'Complete Acquisition'}
              </h2>
              <p className="text-xs text-neutral-500 font-light">
                Total Payable: <strong className="text-black font-semibold text-sm">${totalAmount} {currency}</strong>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 border border-red-300 bg-red-50 text-red-800 text-xs leading-relaxed">
                {error}
              </div>
            )}

            {/* Express Checkout Options */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                Express Payment
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`py-3 px-4 border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'applepay'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 hover:border-black text-black bg-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-4 border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 hover:border-black text-black bg-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Credit Card</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 •••• •••• 8912"
                        className="w-full text-xs font-mono border border-neutral-300 px-3 py-3 text-black focus:border-black outline-none tracking-widest pr-10"
                      />
                      <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM / YY"
                        className="w-full text-xs font-mono border border-neutral-300 px-3 py-3 text-black focus:border-black outline-none tracking-wider text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="w-full text-xs font-mono border border-neutral-300 px-3 py-3 text-black focus:border-black outline-none tracking-widest text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                      Cardholder Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full text-xs border border-neutral-300 px-3 py-3 text-black focus:border-black outline-none uppercase tracking-wider"
                    />
                  </div>
                </div>
              ) : (
                <div className="border border-neutral-200 p-6 bg-neutral-50 text-center space-y-2">
                  <Smartphone className="w-8 h-8 text-black mx-auto" />
                  <p className="font-serif text-lg text-black">Touch ID / Face ID Authentication</p>
                  <p className="text-xs text-neutral-500 font-light">
                    Click authorize below to simulate instant 1-touch biometric checkout with Apple Pay.
                  </p>
                </div>
              )}

              {/* Shipping address info (for physical garments) */}
              {!isSubscription && (
                <div className="border-t border-neutral-200 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
                      Destination Address
                    </span>
                    <span className="text-[10px] text-neutral-400">Complimentary Courier</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      placeholder="Street Address"
                      className="col-span-2 border border-neutral-300 px-3 py-2 text-black focus:border-black outline-none"
                    />
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      className="border border-neutral-300 px-3 py-2 text-black focus:border-black outline-none"
                    />
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="Postal Code"
                      className="border border-neutral-300 px-3 py-2 text-black focus:border-black outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-neutral-500 gap-2 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" /> 256-Bit SSL Encryption
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-black" /> Insured Delivery
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-black" /> 30-Day Returns
                </span>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize ${totalAmount} {currency}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
