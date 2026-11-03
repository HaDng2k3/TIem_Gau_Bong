import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  ShieldCheck,
  Package,
  LogOut,
  Sparkles,
  ChevronDown,
  Gift,
  Send,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  ArrowRight,
  Camera,
  Upload
} from 'lucide-react';
import HomePage from './HomePage';
import CollectionPage from './CollectionPage';
import ProductDetailPage from './ProductDetailPage';
import AdminPage from './AdminPage';
import TrackingPage from './TrackingPage';
import AuthPage from './AuthPage';
import MembershipPage from './MembershipPage';
import WishlistPage from './WishlistPage';
import LoyaltyPage from './LoyaltyPage';
import OrderModal from './OrderModal';
import CartDrawer from './components/CartDrawer';
import FloatingCartButton from './components/FloatingCartButton';
import MinigameModal from './components/MinigameModal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { LoyaltyProvider, useLoyalty } from './context/LoyaltyContext';
import * as api from './services/api';

function Storefront() {
  const { openCart, totalItems, addToCart, clearCart, cartItems } = useCart();
  const { user, isAuthenticated, logout, updateUser: updateAuthUser } = useAuth();
  const { totalWishlist, showToast } = useWishlist();
  const { balance = 48500 } = useLoyalty();

  // Modal đổi ảnh tài khoản người dùng trực tiếp trên header
  const [isHeaderAvatarModalOpen, setIsHeaderAvatarModalOpen] = useState(false);
  const [headerAvatarUrl, setHeaderAvatarUrl] = useState('');

  // Kiểm tra tài khoản hiện tại có quyền Admin hay không
  const isUserAdmin = Boolean(
    isAuthenticated && 
    user && 
    (user.role === 'admin' || user.account === 'admin' || user.email === 'admin@tiembong.vn')
  );

  // Determine initial page from URL path or default to 'home'
  const getInitialPage = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/vi-xu' || path === '/tich-diem-doi-xu' || path === '/loyalty' || window.location.hash === '#vi-xu' || window.location.hash === '#tich-diem-doi-xu') {
        return 'loyalty';
      }
      if (path === '/danh-sach-yeu-thich' || path === '/wishlist' || window.location.hash === '#wishlist') {
        return 'wishlist';
      }
      if (path === '/tra-cuu-don-hang' || window.location.hash === '#tra-cuu-don-hang') {
        return 'tracking';
      }
      if (path === '/dang-nhap' || path === '/auth' || window.location.hash === '#auth') {
        return 'auth';
      }
      if (path === '/hoi-vien' || path === '/membership') {
        return 'membership';
      }
      if (path === '/admin' || window.location.hash === '#admin' || window.location.hash === '#quan-tri') return 'admin';
      if (path === '/collection') return 'collection';
      if (path === '/san-pham' || path.startsWith('/san-pham') || window.location.hash === '#san-pham') {
        return 'product-detail';
      }
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage); // 'home' | 'collection' | 'tracking' | 'admin' | 'product-detail' | 'auth' | 'membership' | 'wishlist' | 'loyalty'
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [trackingInitialCode, setTrackingInitialCode] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMinigameOpen, setIsMinigameOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const userDropdownRef = useRef(null);

  // Search state & refs
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
  const [collectionCategory, setCollectionCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.get('cat') === 'teddy') return 'Gấu Teddy';
      if (p.get('cat') === 'autumn') return 'Gấu Teddy Mùa Thu';
      if (p.get('cat')) return p.get('cat');
    }
    return 'all';
  });
  const [collectionFocusSection, setCollectionFocusSection] = useState(null);
  const searchContainerRef = useRef(null);
  const mobileSearchContainerRef = useRef(null);

  const [settings, setSettings] = useState({
    shopName: 'Tiệm Gấu Bông HD',
    slogan: 'ARTISANAL & WARM PLUSHIES',
    logo: '',
    heroBanner: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    authBanner: '',
    topBanner: '✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k'
  });

  // Close user dropdown & search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        (!mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(e.target))
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tải danh sách sản phẩm phục vụ tìm kiếm toàn trang
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const prods = await api.getProducts();
        if (isMounted && Array.isArray(prods) && prods.length > 0) {
          setCatalogProducts(prods);
        }
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm cho tìm kiếm:', err);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  // Navigate helper to also sync browser history
  const navigateTo = (page, pathUrl) => {
    setCurrentPage(page);
    setShowUserDropdown(false);
    if (typeof window !== 'undefined' && window.history) {
      const url =
        pathUrl ||
        (page === 'loyalty'
          ? '/vi-xu'
          : page === 'wishlist'
          ? '/danh-sach-yeu-thich'
          : page === 'tracking'
          ? '/tra-cuu-don-hang'
          : page === 'auth'
          ? '/dang-nhap'
          : page === 'membership'
          ? '/hoi-vien'
          : page === 'home'
          ? '/'
          : page === 'product-detail'
          ? '/san-pham'
          : `/${page}`);
      window.history.pushState({ page }, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetail = (prod) => {
    setSelectedProductDetail(prod || null);
    navigateTo('product-detail', '/san-pham');
  };

  // Danh sách sản phẩm dự phòng phong phú cho tìm kiếm
  const DEFAULT_SEARCH_PRODUCTS = [
    {
      id: "prod-1",
      name: "Teddy Mùa Thu Quàng Khăn Len",
      category: "Gấu Teddy Mùa Thu",
      price: 395000,
      originalPrice: 450000,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Bé Teddy lông xoắn vintage cao cấp, quàng chiếc khăn len dệt tay ấm áp."
    },
    {
      id: "prod-2",
      name: "Giftbox Teddy Nâu Vintage (Kèm Thiệp)",
      category: "Combo Quà & Thiệp",
      price: 345000,
      originalPrice: 420000,
      tag: "Hot Trend",
      image: "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80",
      description: "Set quà gồm 1 bé gấu Teddy, hộp giấy Kraft vintage thắt nơ ruy băng lụa."
    },
    {
      id: "prod-3",
      name: "Gấu Trúc Mũm Mĩm Nằm Ngủ",
      category: "Búp Bê & Khác",
      price: 280000,
      originalPrice: 320000,
      tag: "Mới Về",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
      description: "Bé gấu trúc dáng nằm mũm mĩm siêu cưng, chất lông nhung mềm như bông gòn."
    },
    {
      id: "prod-4",
      name: "Bé Cún Bông Bơ Sữa Tai Cụp",
      category: "Búp Bê & Khác",
      price: 245000,
      originalPrice: 280000,
      tag: "Chỉ còn 3 bé",
      image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80",
      description: "Bé cún tai cụp màu bơ sữa ngọt ngào, ánh mắt tròn xoe ngây thơ."
    },
    {
      id: "prod-5",
      name: "Gấu Chơi Nơ Ca-Rô Cổ Điển",
      category: "Gấu Teddy",
      price: 320000,
      originalPrice: 360000,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Dòng gấu cổ điển được yêu thích nhất của tiệm, điểm nhấn chiếc nơ ca-rô ca-ri ấm cúng."
    },
    {
      id: "prod-6",
      name: "Gấu Bí Ngô Thêu Tay Mùa Vàng",
      category: "Gấu Teddy Mùa Thu",
      price: 295000,
      originalPrice: 350000,
      tag: "Phiên bản giới hạn",
      image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80",
      description: "Chi tiết quả bí ngô mini thêu chỉ nổi tinh tế trước ngực, mang đậm không khí thu ấm áp."
    },
    {
      id: "prod-7",
      name: "Gấu Cây Sồi Nâu Rêu Vintage",
      category: "Gấu Teddy Mùa Thu",
      price: 380000,
      originalPrice: 420000,
      tag: "Độc Quyền",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
      description: "Tông màu nâu rêu độc đáo lấy cảm hứng từ những cánh rừng sồi mùa rụng lá."
    },
    {
      id: "prod-8",
      name: "Thỏ Bông Biscuit Váy Yếm Hồng",
      category: "Thỏ Bông Biscuit",
      price: 285000,
      originalPrice: 330000,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
      description: "Bé thỏ Biscuit đôi tai dài rủ xuống, diện chiếc váy yếm đũi mộc mạc và đáng yêu."
    },
    {
      id: "prod-9",
      name: "Gấu Ôm Khổng Lồ 1m6 Nâu Caramel",
      category: "Gấu Ôm Khổng Lồ",
      price: 790000,
      originalPrice: 950000,
      tag: "Cỡ Đại",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Bé gấu đại tướng 1m6 ôm siêu đầm tay, là món quà tỏ tình hoặc sinh nhật cực kỳ ấn tượng."
    },
    {
      id: "prod-10",
      name: "Gấu Gừng Ấm Ginger",
      category: "Gấu Khăn Len",
      price: 310000,
      originalPrice: 360000,
      tag: "Mới về",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80",
      description: "Bé gấu sắc màu gừng nướng ngọt lịm mang lại cảm giác ấm lòng trong tiết trời lạnh."
    },
    {
      id: "prod-11",
      name: "Gấu Cozy Áo Choàng Len",
      category: "Gấu Khăn Len",
      price: 390000,
      originalPrice: 450000,
      tag: "Áo Len Nâu",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80",
      description: "Chiếc áo choàng len nâu đan tay tỉ mỉ, mềm êm tựa mây trời."
    }
  ];

  const removeVietnameseTones = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  };

  const allSearchableProducts = useMemo(() => {
    const combined = [...catalogProducts];
    const existingNames = new Set(combined.map((p) => p.name?.toLowerCase().trim()));
    DEFAULT_SEARCH_PRODUCTS.forEach((item) => {
      if (!existingNames.has(item.name.toLowerCase().trim())) {
        combined.push(item);
      }
    });
    return combined;
  }, [catalogProducts]);

  const filteredSearchResults = useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return [];
    const q = raw.toLowerCase();
    const qNorm = removeVietnameseTones(raw);

    return allSearchableProducts.filter((p) => {
      const name = p.name || '';
      const cat = p.category || '';
      const tag = p.tag || '';
      const desc = p.description || '';

      const matchRaw =
        name.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q) ||
        tag.toLowerCase().includes(q) ||
        desc.toLowerCase().includes(q);

      if (matchRaw) return true;

      const matchNorm =
        removeVietnameseTones(name).includes(qNorm) ||
        removeVietnameseTones(cat).includes(qNorm) ||
        removeVietnameseTones(tag).includes(qNorm) ||
        removeVietnameseTones(desc).includes(qNorm);

      return matchNorm;
    });
  }, [searchQuery, allSearchableProducts]);

  const handleSearchSubmit = (e, overrideQuery) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = (overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    if (!query) return;

    setCollectionSearchQuery(query);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    navigateTo('collection');
  };

  const handleSelectSearchResult = (prod) => {
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    handleViewProductDetail({
      id: prod.id,
      name: prod.name,
      basePrice: typeof prod.price === 'number' ? prod.price : parseInt(String(prod.price).replace(/\D/g, ''), 10) || 320000,
      price: prod.price,
      originalPrice: prod.originalPrice,
      image: prod.image || prod.img,
      category: prod.category,
      tag: prod.tag,
      description: prod.description
    });
  };

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      const page = e.state?.page || getInitialPage();
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Load shop settings, products and pending order count
  useEffect(() => {
    async function loadShopInfo() {
      try {
        const [st, orders, prods] = await Promise.all([
          api.getSettings(),
          api.getOrders({ status: 'pending' }),
          api.getProducts()
        ]);
        if (st) setSettings(prev => ({ ...prev, ...st }));
        if (orders) setPendingOrdersCount(orders.length);
        if (Array.isArray(prods) && prods.length > 0) setCatalogProducts(prods);
      } catch (err) {
        console.error('Error fetching shop info:', err);
      }
    }
    loadShopInfo();

    const handleSettingsUpdated = (e) => {
      if (e.detail) {
        setSettings(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('shop-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('shop-settings-updated', handleSettingsUpdated);
  }, [currentPage]);

  // Handle open order modal with specific product or direct
  const handleOpenOrder = (prod) => {
    if (prod) {
      setOrderingProduct(prod);
      setCheckoutItems([]);
      setIsOrderModalOpen(true);
    } else {
      openCart();
    }
  };

  // Handle proceed to checkout from Cart Drawer
  const handleProceedToCheckoutFromCart = (items) => {
    setOrderingProduct(null);
    setCheckoutItems(items);
    setIsOrderModalOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setPendingOrdersCount((prev) => prev + 1);
  };

  const handleNavigateToTrackingWithOrder = (orderId) => {
    setTrackingInitialCode(orderId);
    navigateTo('tracking', `/tra-cuu-don-hang?code=${orderId}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    showToast('Cảm ơn bạn đã gửi lời yêu thương! Tiệm sẽ gửi quà sinh nhật sớm nhất nhé! 💌', '🎁');
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail('');
    }, 3000);
  };

  // If user navigated to backend portal
  if (currentPage === 'admin') {
    return (
      <AdminPage 
        onBackToStore={() => navigateTo('home')} 
        onNavigateToAuth={() => navigateTo('auth', '/dang-nhap')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4EB] font-sans text-cozy-text selection:bg-[#E5A93C]/30 flex flex-col justify-between relative">
      
      {/* Top Banner with dynamic setting */}
      <div className="bg-cozy-primary text-white py-2 text-center text-xs sm:text-sm font-semibold border-b border-[#C25E2E]/30 shadow-xs">
        {settings.topBanner || '✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k'}
      </div>

      {/* Header */}
      <header className="px-6 lg:px-10 py-3.5 flex items-center justify-between bg-[#FAF4EB]/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#EAE0D5]">
        {/* Logo with Artisanal & Warm Plushies subtitle */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => navigateTo('home')}
        >
          <div className="w-10 h-10 rounded-full border border-[#D9C8BA] bg-white flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition overflow-hidden shrink-0">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.shopName || "Tiệm Gấu Bông"} className="w-full h-full object-cover" />
            ) : (
              <span>🧸</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold text-[#4A2E1B] tracking-tight leading-none">
              {settings.shopName || 'Tiệm Gấu Bông HD'}
            </span>
            <span className="text-[9px] font-bold tracking-[0.16em] text-[#8C5E43] uppercase mt-0.5">
              {settings.slogan || 'ARTISANAL & WARM PLUSHIES'}
            </span>
          </div>
        </div>

        {/* Search Bar Desktop */}
        <div className="flex-1 max-w-md mx-6 relative hidden md:block" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchOpen(false);
              }}
              placeholder="Tìm bé gấu ấm áp..."
              className="w-full bg-white border border-[#E0D2C4] rounded-full py-2 pl-11 pr-10 text-xs sm:text-sm focus:outline-none focus:border-[#C25E2E] focus:ring-2 focus:ring-[#C25E2E]/15 transition font-medium shadow-2xs placeholder:text-[#A89282]"
            />
            <button
              type="submit"
              className="absolute left-3.5 top-2.5 text-[#8C6D53] hover:text-[#C25E2E] transition cursor-pointer"
              title="Tìm kiếm"
            >
              <Search className="w-4 h-4" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3.5 top-2.5 text-[#A89282] hover:text-[#7A3E1D] transition cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Search Dropdown Popup */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#EDE2D5] overflow-hidden z-50 animate-in fade-in duration-150">
              {/* If query entered */}
              {searchQuery.trim() ? (
                <div>
                  <div className="px-4 py-2.5 bg-[#FAF4EB] border-b border-[#EAE0D5] flex items-center justify-between text-xs text-[#6B4226]">
                    <span className="font-semibold">
                      Kết quả tìm kiếm cho: <strong className="text-[#C25E2E]">"{searchQuery}"</strong>
                    </span>
                    <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#E0D2C4]">
                      {filteredSearchResults.length} bé gấu
                    </span>
                  </div>

                  {filteredSearchResults.length > 0 ? (
                    <div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[#F5EFE9]">
                        {filteredSearchResults.slice(0, 6).map((item) => (
                          <div
                            key={item.id || item.name}
                            onClick={() => handleSelectSearchResult(item)}
                            className="p-3 flex items-center gap-3.5 hover:bg-[#FFF9F3] cursor-pointer transition group"
                          >
                            <img
                              src={item.image || item.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=120&q=80'}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-[#EAE0D5] bg-[#FAF4EB] shrink-0 group-hover:scale-105 transition"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-[#4A2E1B] truncate group-hover:text-[#C25E2E] transition">
                                  {item.name}
                                </h4>
                                {item.tag && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#FEEFD9] text-[#96421C] shrink-0">
                                    {item.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#8C6D53] truncate mt-0.5">
                                {item.category || item.description || 'Chất lông mềm êm'}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-extrabold text-[#C25E2E]">
                                  {typeof item.price === 'number'
                                    ? item.price.toLocaleString('vi-VN') + 'đ'
                                    : item.price}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-[10px] text-[#A89282] line-through">
                                    {typeof item.originalPrice === 'number'
                                      ? item.originalPrice.toLocaleString('vi-VN') + 'đ'
                                      : item.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#C25E2E] opacity-0 group-hover:opacity-100 transition shrink-0 -translate-x-1 group-hover:translate-x-0" />
                          </div>
                        ))}
                      </div>

                      {/* Footer View All */}
                      <button
                        type="button"
                        onClick={(e) => handleSearchSubmit(e)}
                        className="w-full py-2.5 px-4 bg-[#FAF4EB] hover:bg-[#F3E7D9] text-[#7A3E1D] hover:text-[#C25E2E] text-xs font-bold transition flex items-center justify-center gap-1.5 border-t border-[#EAE0D5] cursor-pointer"
                      >
                        <span>Xem tất cả {filteredSearchResults.length} bé gấu trong Bộ Sưu Tập</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF2EB] flex items-center justify-center text-xl mb-2.5">
                        🧸
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-[#4A2E1B]">
                        Không tìm thấy bé gấu nào phù hợp
                      </p>
                      <p className="text-xs text-[#8C6D53] mt-1">
                        Thử tìm kiếm với các từ khóa gợi ý bên dưới xem sao nhé!
                      </p>
                      <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                        {['Gấu Teddy', 'Nơ Ca-Rô', 'Bí Ngô', 'Khăn Len', 'Thỏ Biscuit'].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              setSearchQuery(chip);
                              handleSearchSubmit(null, chip);
                            }}
                            className="text-[11px] font-semibold bg-[#FAF4EB] hover:bg-[#EAE0D5] text-[#6B4226] px-2.5 py-1 rounded-full border border-[#E0D2C4] transition cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* When input is focused but empty */
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A3E1D] mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C25E2E]" />
                    <span>Gợi ý tìm kiếm phổ biến</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['Gấu Teddy', 'Nơ Ca-Rô', 'Bí Ngô Mùa Thu', 'Gấu Quàng Khăn Len', 'Thỏ Biscuit', 'Cún Bơ Sữa'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip);
                          handleSearchSubmit(null, chip);
                        }}
                        className="text-xs font-medium bg-[#FAF4EB] hover:bg-[#F3E7D9] text-[#6B4226] hover:text-[#C25E2E] px-3 py-1.5 rounded-full border border-[#E0D2C4] transition cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2.5 border-t border-[#F0E4D8]">
                    <span className="text-[11px] font-bold text-[#8C6D53] uppercase tracking-wider block mb-2">
                      Bé gấu nổi bật nhất
                    </span>
                    <div className="space-y-1.5">
                      {allSearchableProducts.slice(0, 3).map((item) => (
                        <div
                          key={item.id || item.name}
                          onClick={() => handleSelectSearchResult(item)}
                          className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#FAF4EB] cursor-pointer transition group"
                        >
                          <img
                            src={item.image || item.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=80&q=80'}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#EAE0D5]"
                          />
                          <span className="text-xs font-bold text-[#4A2E1B] group-hover:text-[#C25E2E] truncate flex-1">
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-[#C25E2E]">
                            {typeof item.price === 'number'
                              ? item.price.toLocaleString('vi-VN') + 'đ'
                              : item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2.5 lg:gap-4 text-xs sm:text-sm font-bold">
          {/* Trang chủ */}
          <button
            onClick={() => navigateTo('home')}
            className="text-[#6B4226] hover:text-[#C25E2E] transition cursor-pointer"
          >
            Trang chủ
          </button>

          {/* BST Mùa Thu */}
          <button
            onClick={() => {
              setCollectionCategory('Gấu Teddy Mùa Thu');
              setCollectionSearchQuery('');
              setCollectionFocusSection(null);
              navigateTo('collection', '/collection?cat=autumn');
            }}
            className={`transition cursor-pointer hidden sm:block ${
              currentPage === 'collection' && collectionCategory === 'Gấu Teddy Mùa Thu'
                ? 'text-[#C25E2E] underline underline-offset-4 decoration-2'
                : 'text-[#6B4226] hover:text-[#C25E2E]'
            }`}
          >
            BST Mùa Thu
          </button>

          {/* Sản Phẩm - Chứa tất cả sản phẩm của cửa hàng */}
          <button
            onClick={() => {
              setCollectionCategory('all');
              setCollectionSearchQuery('');
              setCollectionFocusSection(null);
              navigateTo('collection', '/san-pham');
            }}
            className={`transition cursor-pointer hidden md:block ${
              currentPage === 'collection' && collectionCategory === 'all' && !collectionFocusSection
                ? 'text-[#C25E2E] underline underline-offset-4 decoration-2'
                : 'text-[#6B4226] hover:text-[#C25E2E]'
            }`}
          >
            Sản Phẩm
          </button>

          {/* Quà Tặng & Thiệp */}
          <button
            onClick={() => {
              setCollectionCategory('all');
              setCollectionFocusSection('qua-tang-thiep');
              if (currentPage !== 'collection') {
                navigateTo('collection', '/collection#qua-tang-thiep');
              } else {
                document.getElementById('qua-tang-thiep')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[#6B4226] hover:text-[#C25E2E] transition cursor-pointer hidden md:block"
          >
            Quà Tặng & Thiệp
          </button>

          {/* Bài Viết Cửa Hàng */}
          <button
            onClick={() => {
              if (currentPage !== 'home') {
                navigateTo('home');
                setTimeout(() => {
                  const el = document.getElementById('bai-viet');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              } else {
                const el = document.getElementById('bai-viet');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[#6B4226] hover:text-[#C25E2E] transition cursor-pointer hidden md:flex items-center gap-1"
            title="Xem các bài viết và mẹo hay của tiệm gấu"
          >
            <span>📖</span>
            <span>Bài Viết</span>
          </button>

          {/* Tra Cứu Đơn hàng */}
          <button
            onClick={() => navigateTo('tracking')}
            className="text-[#6B4226] hover:text-[#C25E2E] transition cursor-pointer hidden sm:block"
          >
            Đơn Hàng
          </button>

          {/* Xu & Tích Điểm Đổi Thưởng */}
          <button
            onClick={() => navigateTo('loyalty', '/vi-xu')}
            className="transition cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E0D2C4] bg-white/70 hover:bg-[#FFF8EE] hover:border-[#C25E2E] text-[#6B4226] hover:text-[#C25E2E]"
            title="Tích điểm & Đổi xu (Loyalty Points)"
          >
            <span className="text-sm">🪙</span>
            <span>Xu</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full border bg-[#FFF4E5] text-[#6B4226] border-[#FADCC7]">
              {balance.toLocaleString('vi-VN')}
            </span>
          </button>

          {/* Right Icon Actions */}
          <div className="flex items-center gap-3 sm:gap-4 ml-1 pl-3 sm:pl-4 border-l border-[#EAE0D5]">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                if (!isMobileSearchOpen) {
                  setIsSearchOpen(true);
                }
              }}
              className="md:hidden text-[#6B4226] hover:text-[#C25E2E] transition cursor-pointer p-1.5"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Heart Button with Counter Badge */}
            <button
              onClick={() => navigateTo('wishlist', '/danh-sach-yeu-thich')}
              className={`relative transition cursor-pointer p-1.5 rounded-full group ${
                currentPage === 'wishlist'
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-[#6B4226] hover:text-[#C25E2E]'
              }`}
              title="Danh sách yêu thích (Wishlist)"
            >
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  currentPage === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#C25E2E] text-white text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full shadow-xs animate-fadeIn">
                  {totalWishlist}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger Button with badge */}
            <button
              onClick={() => openCart()}
              className="relative hover:text-[#C25E2E] text-[#6B4226] transition cursor-pointer p-1.5 group"
              title="Mở Giỏ Quà Của Bạn (Cart Drawer)"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-[#7A3E1D] text-white text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center rounded-full shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile Avatar / Auth Trigger */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setShowUserDropdown(!showUserDropdown);
                  } else {
                    navigateTo('auth');
                  }
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition shadow-xs cursor-pointer overflow-hidden ${
                  isAuthenticated
                    ? 'ring-2 ring-[#7A3E1D] ring-offset-1 bg-[#7A3E1D]'
                    : 'bg-[#7A3E1D] hover:bg-[#602F13]'
                }`}
                title={isAuthenticated ? `Tài khoản: ${user?.name}` : 'Đăng nhập / Đăng ký'}
              >
                {isAuthenticated && user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>

              {/* User Dropdown Menu */}
              {isAuthenticated && showUserDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-[#EDE2D5] p-3 text-xs z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#F0E4D8] mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="relative group shrink-0">
                        <img
                          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover border border-[#E0D0C0]"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-[#3B2213] truncate">{user?.name || 'Bạn Gấu Nhỏ'}</p>
                        <span className="text-[10px] bg-[#FEEFD9] text-[#96421C] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {user?.memberTier || 'Thành viên Mùa Thu 🍂'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setHeaderAvatarUrl(user?.avatar || '');
                        setIsHeaderAvatarModalOpen(true);
                        setShowUserDropdown(false);
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#7A3E1D] hover:bg-[#FAF0E6] border border-[#E0D0C0] transition flex items-center gap-1 shrink-0 cursor-pointer"
                      title="Sửa ảnh đại diện tài khoản"
                    >
                      <Camera className="w-3 h-3 text-[#D47343]" />
                      <span>Sửa ảnh</span>
                    </button>
                  </div>

                  <div className="bg-[#FAF2EB] rounded-xl p-2.5 mb-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B4226]">
                      <span>🎟️ Voucher chào bạn mới:</span>
                      <strong className="text-[#96421C]">30.000đ</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6B4226]">
                      <span>🕹️ Lượt gắp gấu:</span>
                      <strong className="text-[#96421C]">{user?.clawGameTurns || 3} lượt</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {/* Chỉ tài khoản Admin mới thấy mục truy cập Trang Quản Trị */}
                    {isUserAdmin && (
                      <button
                        onClick={() => {
                          navigateTo('admin', '/admin');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E2D0] text-[#7A3E1D] font-bold transition flex items-center justify-between cursor-pointer border border-[#E0D0C0] mb-1.5"
                      >
                        <span className="flex items-center gap-1.5">⚙️ Trang Quản Trị</span>
                        <span className="text-[9px] bg-[#7A3E1D] text-white px-1.5 py-0.5 rounded-full font-bold">ADMIN</span>
                      </button>
                    )}
                    <button
                      onClick={() => navigateTo('loyalty', '/vi-xu')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF4EB] text-[#4A2F1B] font-semibold transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">🪙 Ví Xu Gấu Bông</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                        {balance.toLocaleString('vi-VN')} Xu
                      </span>
                    </button>
                    <button
                      onClick={() => navigateTo('wishlist', '/danh-sach-yeu-thich')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF4EB] text-[#4A2F1B] font-semibold transition flex items-center justify-between cursor-pointer"
                    >
                      <span>💖 Danh sách yêu thích</span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full">
                        {totalWishlist} bé
                      </span>
                    </button>
                    <button
                      onClick={() => navigateTo('membership')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF4EB] text-[#4A2F1B] font-semibold transition flex items-center justify-between cursor-pointer"
                    >
                      <span>👑 Xếp Hạng & Điểm Lá Vàng</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">VIP</span>
                    </button>
                    <button
                      onClick={() => navigateTo('tracking')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#FAF4EB] text-[#4A2F1B] font-semibold transition cursor-pointer"
                    >
                      📦 Tra cứu đơn hàng của tôi
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </nav>
      </header>

      {/* Mobile Search Bar Row */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 py-2.5 bg-[#FAF4EB] border-b border-[#EAE0D5] relative shadow-inner" ref={mobileSearchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              placeholder="Tìm bé gấu ấm áp..."
              className="w-full bg-white border border-[#E0D2C4] rounded-full py-2 pl-10 pr-9 text-xs focus:outline-none focus:border-[#C25E2E] font-medium placeholder:text-[#A89282]"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 text-[#8C6D53]"
            >
              <Search className="w-4 h-4" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#A89282]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Mobile search suggestions dropdown */}
          {searchQuery.trim() && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-[#EDE2D5] overflow-hidden max-h-60 overflow-y-auto divide-y divide-[#F5EFE9]">
              {filteredSearchResults.length > 0 ? (
                <>
                  {filteredSearchResults.slice(0, 5).map((item) => (
                    <div
                      key={item.id || item.name}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-2.5 flex items-center gap-2.5 hover:bg-[#FFF9F3] cursor-pointer"
                    >
                      <img
                        src={item.image || item.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=80&q=80'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#4A2E1B] truncate">{item.name}</p>
                        <p className="text-xs font-bold text-[#C25E2E]">
                          {typeof item.price === 'number' ? item.price.toLocaleString('vi-VN') + 'đ' : item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={(e) => handleSearchSubmit(e)}
                    className="w-full py-2 text-center text-xs font-bold text-[#C25E2E] bg-[#FAF4EB]"
                  >
                    Xem tất cả ({filteredSearchResults.length}) trong BST ➔
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-xs text-[#8C6D53]">
                  Không tìm thấy bé gấu nào phù hợp.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={(p) => navigateTo(p)}
            onSelectCategory={(cat) => {
              setCollectionCategory(cat);
              setCollectionSearchQuery('');
              navigateTo('collection');
            }}
            onOrderProduct={handleOpenOrder}
            onAddToCart={addToCart}
            onViewProductDetail={handleViewProductDetail}
            settings={settings}
          />
        )}
        {currentPage === 'collection' && (
          <CollectionPage
            initialSearch={collectionSearchQuery}
            initialCategory={collectionCategory}
            focusSection={collectionFocusSection}
            onOrderProduct={handleOpenOrder}
            onAddToCart={addToCart}
            onViewProductDetail={handleViewProductDetail}
          />
        )}
        {currentPage === 'wishlist' && (
          <WishlistPage
            onBackToHome={() => navigateTo('home')}
            onNavigateToCollection={() => {
              setCollectionCategory('all');
              navigateTo('collection');
            }}
            onViewProductDetail={handleViewProductDetail}
            onOpenOrderModal={handleOpenOrder}
          />
        )}
        {currentPage === 'product-detail' && (
          <ProductDetailPage
            product={selectedProductDetail}
            onBackToHome={() => navigateTo('home')}
            onBackToCollection={() => {
              setCollectionCategory('all');
              navigateTo('collection');
            }}
            onOrderProduct={handleOpenOrder}
            onAddToCart={addToCart}
            onSelectProduct={handleViewProductDetail}
          />
        )}
        {currentPage === 'tracking' && (
          <TrackingPage
            initialCode={trackingInitialCode}
            onBackToHome={() => navigateTo('home')}
          />
        )}
        {currentPage === 'membership' && (
          <MembershipPage
            onNavigateToHome={() => navigateTo('home')}
            onNavigateToCollection={() => {
              setCollectionCategory('all');
              navigateTo('collection');
            }}
            onNavigateToProductDetail={(prod) => handleViewProductDetail(prod)}
            onOpenCart={openCart}
          />
        )}
        {currentPage === 'auth' && (
          <AuthPage
            onBackToHome={() => navigateTo('home')}
            onLoginSuccess={() => navigateTo('home')}
            settings={settings}
          />
        )}
        {currentPage === 'loyalty' && (
          <LoyaltyPage
            onBackToHome={() => navigateTo('home')}
            onGoToCollection={() => {
              setCollectionCategory('all');
              navigateTo('collection');
            }}
            onOpenCart={openCart}
            onApplyCoinsToCheckout={({ product, appliedCoins }) => {
              handleOpenOrder(product);
            }}
          />
        )}
      </main>

      {/* Shared Footer Matching Stitch Reference Exactly */}
      <footer className="bg-[#FAF4EB] border-t border-[#EAE0D5] pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Logo & About & Certification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-[#D9C8BA] bg-white flex items-center justify-center text-lg shadow-2xs overflow-hidden shrink-0">
                {settings.logo ? (
                  <img src={settings.logo} alt={settings.shopName || "Logo"} className="w-full h-full object-cover" />
                ) : (
                  <span>🧸</span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-[#4A2E1B]">{settings.shopName || 'Tiệm Gấu Bông HD'}</h3>
            </div>
            
            <p className="text-xs text-[#6B4226]/80 leading-relaxed font-medium">
              Ngôi nhà ấm cúng dành cho những tâm hồn yêu sự mềm mại và ngọt ngào. Từng bạn gấu đều được tuyển chọn bông gòn cao cấp kháng khuẩn, gói trọn tình cảm và hương thơm hoa khô dịu nhẹ.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#FFF8EE] border border-[#F2DECD] px-3 py-1.5 rounded-xl text-xs font-bold text-[#7A3E1D] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#C25E2E]" />
              <span>100% GÒN TINH KHIẾT KHÁNG KHUẨN</span>
            </div>
          </div>

          {/* Col 2: Chăm Sóc Khách Hàng */}
          <div>
            <h4 className="font-extrabold mb-5 text-sm tracking-wide text-[#4A2E1B]">
              Chăm Sóc Khách Hàng
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold text-[#6B4226]/85">
              <li className="flex items-center gap-2">
                <span>🔄</span>
                <span className="hover:text-[#C25E2E] transition cursor-pointer">Chính sách đổi trả 7 ngày ôm thử</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🧺</span>
                <span className="hover:text-[#C25E2E] transition cursor-pointer">Dịch vụ giặt gấu & phục hồi độ phồng</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✍️</span>
                <span className="hover:text-[#C25E2E] transition cursor-pointer">Dịch vụ viết thiệp nắp thủ công</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⚡</span>
                <span className="hover:text-[#C25E2E] transition cursor-pointer">Giao hoả tốc 2h nội thành</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📖</span>
                <span 
                  onClick={() => {
                    if (currentPage !== 'home') {
                      navigateTo('home');
                      setTimeout(() => {
                        const el = document.getElementById('bai-viet');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    } else {
                      const el = document.getElementById('bai-viet');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-[#C25E2E] transition cursor-pointer"
                >
                  Nhật ký & Bài viết của Tiệm
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Ghé Thăm Tiệm */}
          <div>
            <h4 className="font-extrabold mb-5 text-sm tracking-wide text-[#4A2E1B]">
              Ghé Thăm Tiệm
            </h4>
            <div className="space-y-4 text-xs font-medium text-[#6B4226]/85">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C25E2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#4A2E1B]">Cửa hàng Mùa Thu (Trụ sở)</p>
                  <p className="text-[11px] text-[#8C5E43]">142 Đường Phố Xưa, Quận Hoàn Kiếm, Hà Nội</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C25E2E] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#4A2E1B]">Cửa hàng Cánh Gỗ</p>
                  <p className="text-[11px] text-[#8C5E43]">88 Đường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#7A3E1D] font-bold bg-[#FFF9F3] border border-[#F0DFD0] p-2 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-[#C25E2E]" />
                <span>Mở cửa mỗi ngày 08:30 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Col 4: Gửi Lời Yêu Thương */}
          <div>
            <h4 className="font-extrabold mb-5 text-sm tracking-wide text-[#4A2E1B]">
              Gửi Lời Yêu Thương
            </h4>
            <p className="text-xs text-[#6B4226]/80 font-medium mb-3 leading-relaxed">
              Nhận thông báo khi bộ sưu tập giới hạn ra mắt và ưu đãi sinh nhật đặc quyền.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Email của bạn..."
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-white border border-[#E0D0C0] rounded-xl px-3.5 py-2.5 text-xs text-[#4A2E1B] placeholder:text-[#A89282] focus:outline-none focus:border-[#C25E2E]"
              />
              <button
                type="submit"
                className="bg-[#7A3E1D] hover:bg-[#602F13] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-xs"
              >
                {newsletterSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="flex items-center gap-2 text-xs font-bold text-[#7A3E1D]">
              <PhoneCall className="w-3.5 h-3.5 text-[#C25E2E]" />
              <span>Hotline hỗ trợ: <strong className="text-[#C25E2E]">1900 8556</strong> (8h - 21h)</span>
            </div>
          </div>

        </div>

        {/* Sub-Footer Line */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 mt-12 pt-6 border-t border-[#EAE0D5] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-[#6B4226]/70">
          <div>© 2024 Tiệm Gấu Bông HD. Giữ trọn ấm áp mùa thu và mọi khoảnh khắc yêu thương.</div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#" className="hover:text-[#C25E2E] transition">Điều khoản sử dụng</a>
            <span>|</span>
            <a href="#" className="hover:text-[#C25E2E] transition">Bảo mật thông tin</a>
            <span>|</span>
            <a href="#" className="hover:text-[#C25E2E] transition">Chứng nhận an toàn đồ chơi</a>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedToCheckoutFromCart} />

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Claw Machine Minigame Modal */}
      <MinigameModal
        isOpen={isMinigameOpen}
        onClose={() => setIsMinigameOpen(false)}
      />

      {/* Global Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={orderingProduct}
        checkoutItems={checkoutItems}
        onClearCart={clearCart}
        onOrderSuccess={handleOrderSuccess}
        onNavigateToTracking={handleNavigateToTrackingWithOrder}
      />

      {/* Modal Cập Nhật Ảnh Tài Khoản Header */}
      {isHeaderAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setIsHeaderAvatarModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#52321c] mb-1">Cập Nhật Ảnh Đại Diện</h3>
            <p className="text-xs text-[#6B4226]/75 mb-4 font-medium">
              Tải ảnh đại diện từ máy tính hoặc chọn mẫu có sẵn
            </p>

            <div className="flex justify-center mb-4">
              <img
                src={headerAvatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border-3 border-[#D47343] shadow-md"
              />
            </div>

            {/* Chọn ảnh từ máy */}
            <div className="space-y-3 mb-4 text-left">
              <label className="flex items-center justify-center gap-2 bg-white hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold py-2.5 px-4 rounded-2xl border border-[#D47343]/30 cursor-pointer transition text-xs shadow-2xs">
                <Upload className="w-4 h-4 text-[#D47343]" />
                <span>Chọn ảnh từ máy tính</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 8 * 1024 * 1024) {
                        alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setHeaderAvatarUrl(event.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <div>
                <span className="block text-[11px] font-bold text-[#6B4226]/70 mb-1">Hoặc dán URL ảnh:</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={headerAvatarUrl}
                  onChange={(e) => setHeaderAvatarUrl(e.target.value)}
                  className="w-full bg-white border border-[#EAE0D5] rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#D47343]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE0D5]">
              <button
                type="button"
                onClick={() => setIsHeaderAvatarModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#EAE0D5] text-xs font-bold text-gray-600 hover:bg-stone-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!headerAvatarUrl) {
                    setIsHeaderAvatarModalOpen(false);
                    return;
                  }
                  if (user?.id) {
                    try {
                      await api.updateUser(user.id, { avatar: headerAvatarUrl });
                    } catch {
                      // ignore
                    }
                  }
                  if (updateAuthUser) {
                    updateAuthUser({ avatar: headerAvatarUrl });
                  }
                  setIsHeaderAvatarModalOpen(false);
                  showToast('Đã cập nhật ảnh đại diện tài khoản thành công! ✨', '🧸');
                }}
                className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const content = (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <LoyaltyProvider>
            <Storefront />
          </LoyaltyProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        {content}
      </GoogleOAuthProvider>
    );
  }

  return content;
}
