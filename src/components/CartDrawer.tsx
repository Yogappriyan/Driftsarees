import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { handleImageError, normalizeImageUrl } from '../utils/imageFallback';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    clearCart,
    setSelectedProduct,
    createOrderFromCart,
  } = useShop();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('DF-2026-881');
  const [formData, setFormData] = useState({
    name: 'Aishwarya Rao',
    phone: '+91 98450 12345',
    address: '42, Lavelle Road, Richmond Town',
    city: 'Bengaluru',
    pincode: '560001',
  });

  const freeShippingThreshold = 25000;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrderFromCart(formData);
    setCreatedOrderNumber(order.orderNumber);
    setCheckoutStep('success');
  };

  const resetDrawer = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
    }, 400);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetDrawer}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-screen max-w-md bg-[#131010] border-l border-[#FAF7F2]/10 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#FAF7F2]/10 flex items-center justify-between bg-[#0F0D0D]">
            <div>
              <h2 className="font-serif text-2xl text-[#FAF7F2] font-normal tracking-tight">
                Your Bridal Bag
              </h2>
              <span className="text-xs text-[#C5A880] tracking-widest font-mono">
                {cartCount} {cartCount === 1 ? 'CREATION' : 'CREATIONS'}
              </span>
            </div>

            <button
              onClick={resetDrawer}
              className="p-2 text-[#ECE5DC]/70 hover:text-white rounded-full hover:bg-[#1E1B1A]"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div 
            className="flex-1 overflow-y-auto overscroll-contain p-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {checkoutStep === 'cart' && (
              <>
                {/* Free Shipping Progress Meter */}
                <div className="mb-6 p-4 rounded-xl bg-[#1B1717] border border-[#FAF7F2]/5">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[#ECE5DC]/80">
                      {remainingForFreeShipping === 0
                        ? '🎉 Unlocked Complimentary Insured Shipping'
                        : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} for Free Insured Shipping`}
                    </span>
                    <span className="text-[#C5A880]">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#252020] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8C1D3B] to-[#C5A880] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="font-serif text-xl text-[#FAF7F2] mb-2">Your Bag is Empty</p>
                    <p className="text-xs text-[#ECE5DC]/60 max-w-xs mx-auto mb-6">
                      Explore our handloom collection to discover timeless heirloom weaves.
                    </p>
                    <button
                      onClick={resetDrawer}
                      className="px-6 py-2.5 bg-[#541123] text-[#FAF7F2] text-xs uppercase tracking-widest rounded-full font-semibold"
                    >
                      Browse Heirlooms
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item, idx) => (
                      <motion.div
                        key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className="flex gap-4 p-3 rounded-2xl bg-[#181414] border border-[#FAF7F2]/5 relative group"
                      >
                        {/* Thumbnail */}
                        <img
                          src={normalizeImageUrl(item.product.primaryImage)}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          onClick={() => {
                            setSelectedProduct(item.product);
                            setIsCartOpen(false);
                          }}
                          className="w-20 h-26 object-cover rounded-xl cursor-pointer hover:opacity-90"
                        />

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3
                                onClick={() => {
                                  setSelectedProduct(item.product);
                                  setIsCartOpen(false);
                                }}
                                className="font-serif text-base text-[#FAF7F2] hover:text-[#C5A880] cursor-pointer font-medium leading-snug"
                              >
                                {item.product.name}
                              </h3>
                              <button
                                onClick={() =>
                                  removeFromCart(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor
                                  )
                                }
                                className="text-[#ECE5DC]/40 hover:text-[#8C1D3B] p-1 transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-[11px] text-[#ECE5DC]/60 font-mono mt-0.5">
                              Size: {item.selectedSize} · Color: {item.selectedColor}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-[#FAF7F2]/10 rounded-lg overflow-hidden bg-[#120F0F]">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    -1
                                  )
                                }
                                className="px-2.5 py-1 text-xs text-[#ECE5DC]/70 hover:text-white hover:bg-[#201B1B]"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-mono text-[#FAF7F2]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.selectedSize,
                                    item.selectedColor,
                                    1
                                  )
                                }
                                className="px-2.5 py-1 text-xs text-[#ECE5DC]/70 hover:text-white hover:bg-[#201B1B]"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <span className="text-sm font-mono font-semibold text-[#FAF7F2] tabular-nums">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <div className="text-sm text-[#C5A880] uppercase tracking-widest font-mono border-b border-[#FAF7F2]/10 pb-2">
                  White-Glove Delivery Address
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#ECE5DC]/70 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181414] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#ECE5DC]/70 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#181414] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#ECE5DC]/70 mb-1">
                    Street Address & Suite
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#181414] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#ECE5DC]/70 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#181414] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#ECE5DC]/70 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-[#181414] border border-[#FAF7F2]/10 rounded-xl px-3.5 py-2 text-sm text-[#FAF7F2] outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-[#1B1717] border border-[#FAF7F2]/5 text-xs text-[#ECE5DC]/80 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Insured shipping with temperature-controlled velvet box</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-3 bg-[#1C1818] text-[#ECE5DC] rounded-xl text-xs uppercase tracking-wider font-mono hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-[#541123] to-[#781830] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-semibold rounded-xl shadow-lg"
                  >
                    Confirm & Complete Order
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 'success' && (
              <div className="text-center py-12 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#541123] border border-[#C5A880] flex items-center justify-center text-[#C5A880] mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl text-[#FAF7F2] mb-1">
                  Order #{createdOrderNumber} Confirmed
                </h3>
                <p className="text-xs text-[#C5A880] font-mono tracking-widest uppercase mb-4">
                  ATELIER ALLOTMENT RESERVED
                </p>
                <p className="text-xs text-[#ECE5DC]/80 max-w-xs leading-relaxed mb-6">
                  Thank you, {formData.name}. Our master weavers have allocated your drape for final quality testing, fall/pico finish, and luxury velvet-lined dispatch.
                </p>
                <button
                  onClick={() => {
                    clearCart();
                    resetDrawer();
                  }}
                  className="px-8 py-3 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg"
                >
                  Return to Maison
                </button>
              </div>
            )}
          </div>

          {/* Footer Subtotal & Actions */}
          {cart.length > 0 && checkoutStep === 'cart' && (
            <div className="p-6 border-t border-[#FAF7F2]/10 bg-[#0F0D0D]">
              <div className="flex items-center justify-between text-xs text-[#ECE5DC]/70 mb-1">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-sm text-[#FAF7F2]">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#ECE5DC]/70 mb-4">
                <span>Shipping & Hallmark Certification</span>
                <span className="text-[#C5A880] font-mono">
                  {remainingForFreeShipping === 0 ? 'COMPLIMENTARY' : '₹950'}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-serif text-[#FAF7F2] border-t border-[#FAF7F2]/10 pt-3 mb-4">
                <span>Estimated Total</span>
                <span className="text-xl font-mono text-[#C5A880] font-bold">
                  ₹{(cartTotal + (remainingForFreeShipping === 0 ? 0 : 950)).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full py-4 bg-gradient-to-r from-[#541123] to-[#781830] hover:from-[#69152C] hover:to-[#8C1D3B] text-[#FAF7F2] text-xs uppercase tracking-[0.25em] font-bold rounded-full border border-[#8C1D3B]/60 flex items-center justify-between px-6 shadow-xl shadow-[#541123]/40 group transition-all"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
