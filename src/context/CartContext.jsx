import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'tiem_gau_bong_cart_v1';

// Default combo items matching the reference design for initial pleasant experience
const INITIAL_CART_ITEMS = [
  {
    id: 'prod-col-1',
    name: 'Bé Gấu Chai Nơ Ca-Rô',
    price: 340000,
    originalPrice: 380000,
    quantity: 1,
    size: '35cm',
    tag: 'BST Mùa Thu 2024',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'prod-col-2',
    name: 'Bé Gấu Pumpkin Vui (Bí Ngô)',
    price: 160000,
    originalPrice: 190000,
    quantity: 1,
    size: '25cm',
    tag: 'Phiên bản Giới hạn',
    image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=400&q=80'
  }
];

export const COMBO_SUGGESTIONS = [
  {
    id: 'suggest-1',
    name: 'Gấu Mini Móc Khóa Balo',
    price: 45000,
    originalPrice: 60000,
    size: '12cm',
    tag: 'Phụ kiện hot',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'suggest-2',
    name: 'Nơ Len Đan Tay Cổ Điển',
    price: 25000,
    originalPrice: 35000,
    size: 'Phụ kiện',
    tag: 'Handmade 100%',
    image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'suggest-3',
    name: 'Túi Thơm Hoa Khô Oải Hương',
    price: 30000,
    originalPrice: 40000,
    size: 'Hương tự nhiên',
    tag: 'Thơm dịu êm',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=300&q=80'
  }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Tôn trọng giỏ hàng rỗng mà khách đã chủ động xoá (không tự nạp lại hàng mẫu)
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    // Khách mới: giỏ hàng trống, không tự thêm sản phẩm mẫu (INITIAL_CART_ITEMS chỉ giữ để tham khảo)
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Add item to cart
  const addToCart = (product, quantity = 1, options = {}) => {
    if (!product || !product.name) return;

    const prodId = product.id || `item-${Date.now()}`;
    const prodPrice = typeof product.price === 'number'
      ? product.price
      : parseInt(String(product.price).replace(/\D/g, ''), 10) || 0;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === prodId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      const newItem = {
        id: prodId,
        name: product.name,
        price: prodPrice,
        originalPrice: product.originalPrice || (prodPrice + 40000),
        quantity: Math.max(1, quantity),
        size: options.size || product.size || '35cm',
        tag: product.tag || 'Mẫu Mùa Thu',
        image: product.image || product.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80'
      };
      return [...prev, newItem];
    });

    setLastAddedItem(product.name);
    setIsCartOpen(true);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove single item
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
  };

  // Computed values
  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  // Free shipping threshold: 500.000đ
  const FREE_SHIPPING_THRESHOLD = 500000;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShipProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Combo Discount rule:
  // - >= 2 items: Giảm 5% hoặc ưu đãi combo đặc biệt
  // - >= 3 items: Giảm 10%
  let comboDiscount = 0;
  let comboDiscountText = '';
  if (totalItems >= 3) {
    comboDiscount = Math.round(subtotal * 0.1);
    comboDiscountText = 'Ưu đãi combo 3+ món (-10%)';
  } else if (totalItems >= 2) {
    comboDiscount = Math.round(subtotal * 0.05);
    comboDiscountText = 'Ưu đãi combo 2 món (-5%)';
  }

  // Shipping fee is 15.000đ unless freeship
  const baseShippingFee = totalItems > 0 ? (isFreeShipping ? 0 : 15000) : 0;
  const grandTotal = Math.max(0, subtotal - comboDiscount + baseShippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        comboDiscount,
        comboDiscountText,
        baseShippingFee,
        isFreeShipping,
        amountToFreeShip,
        freeShipProgress,
        FREE_SHIPPING_THRESHOLD,
        grandTotal,
        lastAddedItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
