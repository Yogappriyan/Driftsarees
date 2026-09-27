import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ToastMessage, AtelierOrder, OrderStatus } from '../types';
import { PRODUCTS, INITIAL_ORDERS } from '../data/products';

interface ShopContextType {
  products: Product[];
  orders: AtelierOrder[];
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  adminTab: 'products' | 'analytics' | 'orders';
  setAdminTab: (tab: 'products' | 'analytics' | 'orders') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeView: 'home' | 'collection' | 'craft' | 'lookbook';
  setActiveView: (view: 'home' | 'collection' | 'craft' | 'lookbook') => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  selectedMoodFilter: string;
  setSelectedMoodFilter: (mood: string) => void;
  toast: ToastMessage | null;
  addToCart: (product: Product, size?: string, color?: string, sourceEl?: HTMLElement | null) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  clearCart: () => void;
  flyAnimation: { x: number; y: number; image: string } | null;
  cursorMode: 'default' | 'view' | 'drag' | 'magnetic';
  setCursorMode: (mode: 'default' | 'view' | 'drag' | 'magnetic') => void;

  // Product Management (Admin)
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleBestseller: (id: string) => void;
  toggleNewDrop: (id: string) => void;

  // Order Management (Admin)
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  createOrderFromCart: (customerInfo: { name: string; phone: string; address: string; city: string }) => AtelierOrder;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<AtelierOrder[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>(() => [
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Rosé Pink',
    },
  ]);
  const [wishlist, setWishlist] = useState<string[]>([PRODUCTS[1].id]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'products' | 'analytics' | 'orders'>('analytics');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'collection' | 'craft' | 'lookbook'>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('All');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [flyAnimation, setFlyAnimation] = useState<{ x: number; y: number; image: string } | null>(null);
  const [cursorMode, setCursorMode] = useState<'default' | 'view' | 'drag' | 'magnetic'>('default');

  const addToCart = (
    product: Product,
    size?: string,
    color?: string,
    sourceEl?: HTMLElement | null
  ) => {
    const chosenSize = size || product.sizes[0] || 'M';
    const chosenColor = color || (product.colors[0]?.name ?? 'Default');

    if (sourceEl) {
      const rect = sourceEl.getBoundingClientRect();
      setFlyAnimation({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        image: product.primaryImage,
      });
      setTimeout(() => setFlyAnimation(null), 850);
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + 1,
        };
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize: chosenSize,
          selectedColor: chosenColor,
        },
      ];
    });

    setToast({
      id: `${Date.now()}`,
      title: 'Added to your Bridal Bag',
      subtitle: `${product.name} (${chosenSize} / ${chosenColor})`,
      image: product.primaryImage,
    });
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    size: string,
    color: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          ) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      }
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        setToast({
          id: `${Date.now()}`,
          title: 'Saved to Wishlist',
          subtitle: prod.name,
          image: prod.primaryImage,
        });
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Product Management Functions
  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setToast({
      id: `${Date.now()}`,
      title: 'Saree Added to Atelier Catalog',
      subtitle: `${newProd.name} · ₹${newProd.price.toLocaleString('en-IN')}`,
      image: newProd.primaryImage,
    });
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    if (selectedProduct && selectedProduct.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
    setToast({
      id: `${Date.now()}`,
      title: 'Product Updated',
      subtitle: `${updatedProd.name} details saved.`,
      image: updatedProd.primaryImage,
    });
  };

  const deleteProduct = (id: string) => {
    const prodToDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    setWishlist((prev) => prev.filter((wId) => wId !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    setToast({
      id: `${Date.now()}`,
      title: 'Saree Removed from Atelier',
      subtitle: prodToDelete ? prodToDelete.name : 'Removed successfully',
    });
  };

  const toggleBestseller = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isBestseller: !p.isBestseller } : p
      )
    );
  };

  const toggleNewDrop = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isNew: !p.isNew } : p))
    );
  };

  // Order Management Functions
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setToast({
      id: `${Date.now()}`,
      title: 'Order Status Updated',
      subtitle: `Status changed to: ${status}`,
    });
  };

  const createOrderFromCart = (customerInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
  }): AtelierOrder => {
    const orderNum = `DF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: AtelierOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      city: customerInfo.city,
      address: customerInfo.address,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: cart.map((c) => ({
        productName: c.product.name,
        category: c.product.category,
        price: c.product.price,
        quantity: c.quantity,
        size: c.selectedSize,
        color: c.selectedColor,
        image: c.product.primaryImage,
      })),
      totalAmount: cartTotal,
      status: 'Atelier Allocated',
      paymentMethod: 'Prepaid Razorpay / UPI Verified',
      notes: 'Customer requested complimentary bespoke Fall and Pico finish.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Auto clear toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAdminOpen,
        setIsAdminOpen,
        adminTab,
        setAdminTab,
        selectedProduct,
        setSelectedProduct,
        activeView,
        setActiveView,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedMoodFilter,
        setSelectedMoodFilter,
        toast,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        cartTotal,
        cartCount,
        clearCart,
        flyAnimation,
        cursorMode,
        setCursorMode,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleBestseller,
        toggleNewDrop,
        updateOrderStatus,
        createOrderFromCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
