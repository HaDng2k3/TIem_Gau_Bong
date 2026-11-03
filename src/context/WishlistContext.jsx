import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WISHLIST_STORAGE_KEY = 'tiem_gau_bong_wishlist_v1';

// Initial default wishlist items matching the exact reference design
export const INITIAL_WISHLIST_ITEMS = [
  {
    id: 'wish-1',
    name: 'Bé Gấu Chai Nơ Ca-Rô',
    price: 340000,
    originalPrice: 400000,
    discount: '-15%',
    tag: 'Bán chạy nhất 🔥',
    tagType: 'bestseller',
    stockStatus: 'Còn 5 bé cuối cùng',
    size: 'Size M (35cm)',
    packaging: '🍂 Đóng gói: 1 B',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    hasGiftOption: true,
    addedAt: '2026-10-25T10:00:00.000Z'
  },
  {
    id: 'wish-2',
    name: 'Bé Gấu Pumpkins Thu',
    price: 260000,
    originalPrice: null,
    discount: null,
    tag: 'Hút mắt 🍂',
    tagType: 'featured',
    stockStatus: 'Còn hàng (12 bé)',
    size: 'Size S (25cm)',
    packaging: '1 Bầu bí ngô',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80',
    hasGiftOption: false,
    addedAt: '2026-10-24T14:20:00.000Z'
  },
  {
    id: 'wish-3',
    name: 'Bé Gấu Amber Nắng Ấm',
    price: 340000,
    originalPrice: null,
    discount: null,
    tag: 'Kèm hoa hướng dương 🌻',
    tagType: 'sunflower',
    stockStatus: 'Còn hàng',
    size: 'Size M (35cm)',
    packaging: '1 Áo trắng kem',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80',
    hasGiftOption: false,
    addedAt: '2026-10-23T09:15:00.000Z'
  },
  {
    id: 'wish-4',
    name: 'Bé Gấu Cozy Mùa Đông...',
    fullName: 'Bé Gấu Cozy Mùa Đông Đan Tay',
    price: 460000,
    originalPrice: null,
    discount: null,
    tag: 'Sắp hết - Còn 1 bé',
    tagType: 'urgent',
    stockStatus: 'Nhanh tay rước nhé!',
    size: 'Size L (50cm)',
    packaging: 'Áo Len Đan Tay',
    category: 'gau-om-size-lon',
    categoryName: 'Gấu Ôm Size Lớn',
    image: 'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?auto=format&fit=crop&w=600&q=80',
    hasGiftOption: false,
    addedAt: '2026-10-22T18:40:00.000Z'
  },
  {
    id: 'wish-5',
    name: 'Hộp Quà Kraft Kèm Thiệ...',
    fullName: 'Hộp Quà Kraft Kèm Thiệp & Bó Hoa Khô',
    price: 65000,
    priceNote: '(Miễn phí đơn > 500k)',
    originalPrice: null,
    discount: null,
    tag: 'Gợi ý khi mua kèm gấu ✨',
    tagType: 'combo-suggest',
    stockStatus: null,
    size: 'Phụ kiện gói quà',
    packaging: 'Thiệp có hoa khô',
    category: 'phu-kien-hop-qua',
    categoryName: 'Phụ Kiện & Hộp Quà',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    hasGiftOption: false,
    isAccessory: true,
    addedAt: '2026-10-21T11:00:00.000Z'
  }
];

// Fallback recommendations matching the reference screen
export const RECOMMENDED_FALL_IN_LOVE = [
  {
    id: 'rec-1',
    name: 'Bé Gấu Ginger Mật Ong',
    price: 360000,
    tag: 'Khăn len dệt đỏ',
    description: 'Lông xù xoắn mềm mại, tone mật ong dịu êm',
    size: 'Size M (38cm)',
    packaging: 'Khăn len đỏ',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-2',
    name: 'Bé Gấu Oak Rừng Sâu',
    price: 380000,
    tag: 'Nơ xanh ngọc lục bảo',
    description: 'Lông xoắn sherpa sang trọng, đơm chân họa tiết',
    size: 'Size M (35cm)',
    packaging: 'Nơ nhung xanh',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rec-3',
    name: 'Bé Gấu Cinnamon Quế Nồng',
    price: 350000,
    tag: 'Thêu hình quả cuộn',
    description: 'Sắc đỏ đất nung ấm áp, thêu nổi biểu tượng quế',
    size: 'Size M (35cm)',
    packaging: 'Thêu quả quế',
    category: 'bst-mua-thu',
    categoryName: 'BST Mùa Thu',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80'
  }
];

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to read wishlist from localStorage:', e);
    }
    // Khách mới: danh sách yêu thích trống (có thể khôi phục mẫu bằng resetToDefault)
    return [];
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (e) {
      console.warn('Failed to write wishlist to localStorage:', e);
    }
  }, [wishlistItems]);

  const showToast = (message, icon = '💖') => {
    const id = Date.now();
    setToastMessage({ message, icon, id });
    setTimeout(() => {
      // Chỉ ẩn đúng toast này, tránh tắt nhầm toast mới hơn
      setToastMessage(prev => (prev?.id === id ? null : prev));
    }, 3200);
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(
      item => item.id === productId || item.name?.toLowerCase() === productId?.toLowerCase()
    );
  };

  const addToWishlist = (product) => {
    if (!product || !product.name) return;
    const exists = isInWishlist(product.id || product.name);
    if (exists) {
      showToast(`Bé "${product.name}" đã có trong danh sách rồi nè!`, '✨');
      return;
    }

    const priceNum = typeof product.price === 'number'
      ? product.price
      : parseInt(String(product.price).replace(/\D/g, ''), 10) || 300000;

    const newItem = {
      id: product.id || `wish-${Date.now()}`,
      name: product.name,
      fullName: product.name,
      price: priceNum,
      originalPrice: product.originalPrice || null,
      discount: product.discount || null,
      tag: product.tag || 'Mới thêm',
      tagType: 'new',
      stockStatus: product.stockStatus || 'Còn hàng',
      size: product.size || '35cm',
      packaging: product.packaging || 'Đóng gói chuẩn tiệm',
      category: product.category || 'bst-mua-thu',
      categoryName: product.categoryName || 'BST Mùa Thu',
      image: product.image || product.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
      hasGiftOption: false,
      addedAt: new Date().toISOString()
    };

    setWishlistItems(prev => [newItem, ...prev]);
    showToast(`Đã lưu "${product.name}" vào danh sách yêu thích!`, '💖');
  };

  const removeFromWishlist = (productId) => {
    const item = wishlistItems.find(i => i.id === productId || i.name === productId);
    setWishlistItems(prev => prev.filter(i => i.id !== productId && i.name !== productId));
    if (item) {
      showToast(`Đã gỡ "${item.name}" khỏi danh sách`, '🗑️');
    }
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const prodId = product.id || product.name;
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    showToast('Đã làm trống danh sách yêu thích', '🧹');
  };

  const resetToDefault = () => {
    setWishlistItems(INITIAL_WISHLIST_ITEMS);
    showToast('Đã khôi phục 5 bé gấu mẫu!', '🧸');
  };

  const totalWishlist = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        totalWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        resetToDefault,
        showToast,
        toastMessage
      }}
    >
      {children}
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#4A2E1B] text-[#FFF8EE] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#D47343]/40 animate-slideIn text-sm font-semibold">
          <span className="text-xl">{toastMessage.icon}</span>
          <span>{toastMessage.message}</span>
        </div>
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
