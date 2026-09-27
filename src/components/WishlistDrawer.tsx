import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    setSelectedProduct,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsWishlistOpen(false)}
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
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#8C1D3B] fill-[#8C1D3B]" />
              <h2 className="font-serif text-2xl text-[#FAF7F2] font-normal tracking-tight">
                Saved Heirlooms
              </h2>
            </div>

            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-[#ECE5DC]/70 hover:text-white rounded-full hover:bg-[#1E1B1A]"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div 
            className="flex-1 overflow-y-auto overscroll-contain p-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-[#ECE5DC]/20 mx-auto mb-3" />
                <p className="font-serif text-xl text-[#FAF7F2] mb-1">Your Wishlist is Empty</p>
                <p className="text-xs text-[#ECE5DC]/60 max-w-xs mx-auto">
                  Click the heart icon on any saree to save it for your bridal consultation.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-2xl bg-[#181414] border border-[#FAF7F2]/5 group"
                  >
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsWishlistOpen(false);
                      }}
                      className="w-20 h-26 object-cover rounded-xl cursor-pointer hover:opacity-90"
                    />

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-mono">
                            {product.category}
                          </span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-[#ECE5DC]/40 hover:text-[#8C1D3B] p-1"
                            aria-label="Remove from wishlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h3
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsWishlistOpen(false);
                          }}
                          className="font-serif text-base text-[#FAF7F2] hover:text-[#C5A880] cursor-pointer font-medium leading-snug"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-mono font-semibold text-[#FAF7F2]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        <button
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product.id);
                          }}
                          className="px-3 py-1.5 bg-[#541123] hover:bg-[#781830] text-[#FAF7F2] text-[11px] uppercase tracking-wider font-semibold rounded-lg flex items-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C5A880]" />
                          <span>Move to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#FAF7F2]/10 bg-[#0F0D0D]">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-3 bg-[#1C1818] hover:bg-[#252020] text-[#ECE5DC] text-xs uppercase tracking-widest font-mono rounded-xl border border-[#FAF7F2]/10 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
