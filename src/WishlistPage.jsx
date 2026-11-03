import React, { useState, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  Share2,
  Trash2,
  Bell,
  ArrowUpDown,
  Check,
  Copy,
  Sparkles,
  Gift,
  Truck,
  ArrowRight,
  ExternalLink,
  X,
  Bookmark,
  Send,
  HelpCircle,
  PackageOpen,
  PenTool,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useWishlist, RECOMMENDED_FALL_IN_LOVE } from './context/WishlistContext';
import { useCart } from './context/CartContext';

export default function WishlistPage({
  onBackToHome,
  onNavigateToCollection,
  onViewProductDetail,
  onOpenOrderModal
}) {
  const {
    wishlistItems,
    totalWishlist,
    removeFromWishlist,
    addToWishlist,
    clearWishlist,
    resetToDefault,
    showToast
  } = useWishlist();

  const { addToCart, openCart } = useCart();

  // Filter tab state: 'all' | 'bst-mua-thu' | 'gau-om-size-lon' | 'phu-kien-hop-qua'
  const [activeCategory, setActiveCategory] = useState('all');

  // Sort state: 'recent' | 'price-asc' | 'price-desc' | 'low-stock'
  const [sortBy, setSortBy] = useState('recent');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Modals state
  const [isPriceAlertModalOpen, setIsPriceAlertModalOpen] = useState(false);
  const [isPostcardModalOpen, setIsPostcardModalOpen] = useState(false);
  const [isGiftOptionModalOpen, setIsGiftOptionModalOpen] = useState(false);
  const [selectedGiftBear, setSelectedGiftBear] = useState(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Share link copy status
  const [copiedLink, setCopiedLink] = useState(false);
  const shareUrl = 'https://tiemgaubonghd.vn/wishlist/u8fe34';

  // Gift customization options
  const [giftBoxStyle, setGiftBoxStyle] = useState('kraft-vintage');
  const [cardMessage, setCardMessage] = useState('Gửi tặng bạn một cái ôm thật ấm áp mùa thu này...');
  const [ribbonColor, setRibbonColor] = useState('nau-tay');

  // Price alert state
  const [alertContact, setAlertContact] = useState('');
  const [alertType, setAlertType] = useState({ priceDrop: true, lowStock: true, voucher: false });
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Postcard state
  const [recipientName, setRecipientName] = useState('Người Thương');
  const [senderName, setSenderName] = useState('Bé Yêu');
  const [postcardMessage, setPostcardMessage] = useState('Mùa đông sắp tới rồi, tớ đang ước rước bạn gấu này về ôm ngủ. Nếu cậu muốn gửi tặng tớ một bất ngờ ấm áp thì xem list này nhé! 🍂🧸');

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = {
      all: wishlistItems.length,
      'bst-mua-thu': 0,
      'gau-om-size-lon': 0,
      'phu-kien-hop-qua': 0
    };
    wishlistItems.forEach(item => {
      if (item.category === 'bst-mua-thu') counts['bst-mua-thu']++;
      else if (item.category === 'gau-om-size-lon') counts['gau-om-size-lon']++;
      else if (item.category === 'phu-kien-hop-qua') counts['phu-kien-hop-qua']++;
    });
    return counts;
  }, [wishlistItems]);

  // Filter & sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...wishlistItems];

    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'low-stock') {
      result.sort((a, b) => {
        const aIsLow = a.tagType === 'urgent' || a.stockStatus?.includes('cuối cùng') || a.stockStatus?.includes('1 bé');
        const bIsLow = b.tagType === 'urgent' || b.stockStatus?.includes('cuối cùng') || b.stockStatus?.includes('1 bé');
        return (bIsLow ? 1 : 0) - (aIsLow ? 1 : 0);
      });
    }

    return result;
  }, [wishlistItems, activeCategory, sortBy]);

  // Add all items to Cart
  const handleAddAllToCart = () => {
    if (wishlistItems.length === 0) return;
    wishlistItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        size: item.size,
        tag: item.tag,
        image: item.image
      }, 1);
    });
    showToast(`Đã thêm tất cả ${wishlistItems.length} món vào giỏ hàng! 🛍️`, '🎉');
    openCart();
  };

  // Add single item to cart
  const handleAddSingleToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.fullName || item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      size: item.size,
      tag: item.tag,
      image: item.image
    }, 1);
    showToast(`Đã thêm "${item.name}" vào giỏ hàng! 🛍️`, '🛒');
  };

  // Copy share URL
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Đã sao chép liên kết danh sách ước mơ! 💌', '📋');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Open gift customization for bear
  const handleOpenGiftOption = (item) => {
    setSelectedGiftBear(item);
    setIsGiftOptionModalOpen(true);
  };

  // Confirm gift options
  const handleConfirmGiftCustomization = () => {
    if (selectedGiftBear) {
      addToCart({
        id: `${selectedGiftBear.id}-giftbox`,
        name: `${selectedGiftBear.name} (Kèm hộp Kraft & Thiệp viết tay)`,
        price: selectedGiftBear.price + 45000,
        originalPrice: (selectedGiftBear.originalPrice || selectedGiftBear.price) + 70000,
        size: selectedGiftBear.size,
        tag: 'Gói quà vintage',
        image: selectedGiftBear.image
      }, 1);
      setIsGiftOptionModalOpen(false);
      showToast('Đã thêm bé gấu kèm gói quà & thiệp tay vào giỏ!', '🎁');
      openCart();
    }
  };

  // Handle price alert subscription submit
  const handlePriceAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertContact.trim()) return;
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setIsPriceAlertModalOpen(false);
      setAlertContact('');
      showToast('Đã đăng ký nhận tin hạ giá thành công! 🔔', '✨');
    }, 1500);
  };

  const sortLabels = {
    recent: 'Mới thêm gần đây',
    'price-asc': 'Giá tăng dần',
    'price-desc': 'Giá giảm dần',
    'low-stock': 'Ưu tiên sắp hết hàng'
  };

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-[#4A2E1B] pb-24 font-sans selection:bg-[#E5A93C]/30">
      
      {/* Breadcrumb matching exact screenshot */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-4 pb-2 text-xs font-semibold text-[#8C5E43] flex items-center gap-2">
        <button
          onClick={onBackToHome}
          className="hover:text-[#D47343] transition flex items-center gap-1 cursor-pointer"
        >
          <span>🏠</span>
          <span>Trang chủ</span>
        </button>
        <span className="text-[#D0B8A8]">/</span>
        <span className="text-[#C25E2E] font-bold">Danh sách yêu thích</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-3">
        
        {/* HERO BANNER SECTION */}
        <section className="bg-gradient-to-r from-[#FFF3E5] via-[#FFF7EE] to-[#FFEFE0] border border-[#F6DEC9] rounded-[2rem] p-7 md:p-9 shadow-xs relative overflow-hidden mb-8">
          {/* Subtle cozy ambient decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Badge pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#FFE8D6] text-[#C25E2E] border border-[#FADCC7] text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-2xs">
                <span>🏷️</span>
                <span>Góc Nhỏ Của Bạn x Tiệm Gấu Bông HD</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl md:text-4xl font-bold text-[#4A2E1B] tracking-tight mb-2.5">
                Bộ Sưu Tập Bé Gấu Muốn Rước 💖
              </h1>

              {/* Subtitle */}
              <p className="text-sm md:text-base text-[#6B4226]/80 font-medium leading-relaxed mb-5">
                Lưu lại những cái ôm ấm áp để rước về nhà khi có dịp đặc biệt, hoặc nhận thông báo tức thì khi bé gấu được giảm giá hay sắp hết hàng.
              </p>

              {/* Info Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#7A3E1D] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                  Đang lưu {wishlistItems.length} bé gấu
                </span>
                <span className="bg-white/90 text-[#7A3E1D] border border-[#ECD9C6] text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5">
                  <span>☁️</span>
                  <span>Đã tự động lưu trên trình duyệt (LocalStorage)</span>
                </span>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[260px]">
              <button
                onClick={() => setIsPostcardModalOpen(true)}
                className="bg-[#F9C35F] hover:bg-[#F3B745] text-[#4A2E1B] font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer border border-[#EAA43A]/40"
              >
                <span>Chia sẻ danh sách cho người ấy</span>
                <span>💌</span>
              </button>

              <button
                onClick={handleAddAllToCart}
                disabled={wishlistItems.length === 0}
                className={`text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 ${
                  wishlistItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-[#7A3E1D] hover:bg-[#602F13] cursor-pointer'
                }`}
              >
                <span>Thêm tất cả vào giỏ hàng</span>
                <span>🛍️</span>
              </button>

              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setIsClearConfirmOpen(true)}
                  disabled={wishlistItems.length === 0}
                  className="text-[#8C5E43] hover:text-[#5C3013] text-xs font-semibold py-1 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition disabled:opacity-40"
                >
                  <span>🗑️</span>
                  <span>Làm trống danh sách</span>
                </button>
                {wishlistItems.length === 0 && (
                  <button
                    onClick={resetToDefault}
                    className="text-[#C25E2E] hover:text-[#9B451C] text-xs font-bold py-1 px-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition underline"
                  >
                    <span>Khôi phục 5 bé mẫu 🧸</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* FILTER & SORT BAR */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `Tất cả bé gấu (${categoryCounts.all})` },
              { id: 'bst-mua-thu', label: `BST Mùa Thu (${categoryCounts['bst-mua-thu']})` },
              { id: 'gau-om-size-lon', label: `Gấu Ôm Size Lớn (${categoryCounts['gau-om-size-lon']})` },
              { id: 'phu-kien-hop-qua', label: `Phụ Kiện & Hộp Quà (${categoryCounts['phu-kien-hop-qua']})` }
            ].map(tab => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer shadow-2xs ${
                    isActive
                      ? 'bg-[#7A3E1D] text-white shadow-xs'
                      : 'bg-[#F5EBE1] hover:bg-[#EAE0D5] text-[#6B4226]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Price Alert Button & Sort Dropdown */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Nhận tin hạ giá button */}
            <button
              onClick={() => setIsPriceAlertModalOpen(true)}
              className="bg-[#F7E7CE] hover:bg-[#EEDBBF] text-[#7A3E1D] font-bold text-xs px-3.5 py-2 rounded-full shadow-2xs flex items-center gap-1.5 transition cursor-pointer border border-[#E9D5B9]"
              title="Đăng ký nhận thông báo khi có sản phẩm giảm giá"
            >
              <Bell className="w-3.5 h-3.5 text-[#C25E2E] fill-[#C25E2E]" />
              <span>Nhận tin hạ giá</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="bg-white border border-[#EAE0D5] hover:border-[#D0B8A8] text-[#6B4226] font-bold text-xs px-3.5 py-2 rounded-full shadow-2xs flex items-center gap-1.5 cursor-pointer transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8C5E43]" />
                <span>{sortLabels[sortBy]}</span>
                <span className="text-[10px] text-[#8C5E43]">∨</span>
              </button>

              {isSortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#EAE0D5] rounded-2xl shadow-xl z-40 py-2 w-48 animate-fadeIn">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-[#FAF4EB] transition ${
                          sortBy === key ? 'text-[#C25E2E] font-bold bg-[#FFF7EE]' : 'text-[#6B4226]'
                        }`}
                      >
                        <span>{label}</span>
                        {sortBy === key && <Check className="w-3.5 h-3.5 text-[#C25E2E]" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

        </section>

        {/* WISHLIST PRODUCT CARDS GRID */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredAndSortedItems.map((item) => {
              const isGiftCardItem = item.id === 'wish-5';
              const isDiscounted = !!item.discount || (item.originalPrice && item.originalPrice > item.price);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-3.5 border border-[#EAE0D5] hover:border-[#D47343]/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Overlays */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-[#FAF4EB]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Top-Left Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
                        {item.tag && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                              item.tagType === 'urgent'
                                ? 'bg-rose-600 text-white'
                                : item.tagType === 'combo-suggest'
                                ? 'bg-amber-500 text-white'
                                : item.tagType === 'bestseller'
                                ? 'bg-[#E5A93C] text-white'
                                : 'bg-[#E5A93C] text-white'
                            }`}
                          >
                            {item.tag}
                          </span>
                        )}
                        {item.discount && (
                          <span className="bg-[#9E2A2B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            {item.discount}
                          </span>
                        )}
                      </div>

                      {/* Top-Right Heart Button (Remove from wishlist) */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-rose-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition cursor-pointer z-10"
                        title="Bỏ thích bé gấu"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>

                      {/* Bottom-Left Overlay on Image (Stock Warning or Status) */}
                      {item.stockStatus && (
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.8 rounded-full backdrop-blur-xs shadow-xs ${
                              item.tagType === 'urgent'
                                ? 'bg-rose-900/80 text-rose-100'
                                : 'bg-black/60 text-white'
                            }`}
                          >
                            {item.stockStatus}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Specifications Row */}
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#8C5E43] mb-1.5 px-1">
                      <span>{item.size}</span>
                      {item.packaging && (
                        <>
                          <span className="text-[#D0B8A8]">•</span>
                          <span>{item.packaging}</span>
                        </>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onViewProductDetail && onViewProductDetail(item)}
                      className="font-bold text-sm text-[#4A2E1B] hover:text-[#C25E2E] transition line-clamp-1 mb-2 px-1 cursor-pointer"
                      title={item.fullName || item.name}
                    >
                      {item.name}
                    </h3>

                    {/* Price & Original Price */}
                    <div className="flex items-baseline gap-2 mb-3 px-1">
                      <span className="text-base font-bold text-[#C25E2E]">
                        {item.price.toLocaleString('vi-VN')}đ
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through font-semibold">
                          {item.originalPrice.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                      {item.priceNote && (
                        <span className="text-[10px] text-[#8C5E43] font-medium">
                          {item.priceNote}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      {/* Primary Button */}
                      <button
                        onClick={() => handleAddSingleToCart(item)}
                        className={`flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer ${
                          isGiftCardItem
                            ? 'bg-[#825E1B] hover:bg-[#6C4E16] text-white'
                            : 'bg-[#7A3E1D] hover:bg-[#602F13] text-white'
                        }`}
                      >
                        {isGiftCardItem ? (
                          <>
                            <span>🛍️ Thêm vào giỏ</span>
                          </>
                        ) : (
                          <>
                            <span>🛒 Chuyển vào giỏ hàng</span>
                          </>
                        )}
                      </button>

                      {/* Nút xóa sản phẩm khỏi danh sách yêu thích */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="py-2.5 px-3 rounded-xl border border-[#F5D7C9] bg-[#FFF2ED] hover:bg-[#FFE0D6] text-[#C25E2E] hover:text-[#9B3710] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs hover:shadow-xs group/del"
                        title="Xóa bé gấu khỏi danh sách yêu thích"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5 group-hover/del:scale-110 transition-transform" />
                        <span>Xóa</span>
                      </button>
                    </div>

                    {/* Secondary Button: Tùy chọn quà tặng & thiệp tay */}
                    {item.hasGiftOption && (
                      <button
                        onClick={() => handleOpenGiftOption(item)}
                        className="w-full bg-[#FFF9F3] border border-[#ECD9C6] hover:bg-[#F9ECE0] text-[#7A3E1D] font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <span>🎁 Tùy chọn quà tặng & thiệp tay</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl p-12 border border-[#EAE0D5] text-center max-w-xl mx-auto my-8 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF0E6] border border-[#ECD9C6] flex items-center justify-center text-4xl mx-auto mb-4">
              🧸
            </div>
            <h3 className="text-xl font-bold text-[#4A2E1B] mb-2">
              Chưa có bé gấu nào trong mục này 🍂
            </h3>
            <p className="text-xs text-[#8C5E43] font-medium leading-relaxed mb-6">
              Hãy thả tim những người bạn gấu êm mềm để lưu giữ góc riêng ấm áp của bạn và người thương nhé!
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetToDefault}
                className="bg-[#7A3E1D] hover:bg-[#602F13] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục 5 bé gấu mẫu</span>
              </button>
              <button
                onClick={onNavigateToCollection}
                className="bg-[#FAF0E6] hover:bg-[#F0DFC8] text-[#7A3E1D] border border-[#E0D0C0] text-xs font-bold px-5 py-2.5 rounded-full transition cursor-pointer"
              >
                <span>Dạo xem BST Mùa Thu →</span>
              </button>
            </div>
          </div>
        )}

        {/* SHARE SECTION: "Muốn gửi danh sách này cho người thương?" */}
        <section className="bg-gradient-to-r from-[#FFF0E6] to-[#FFEBE0] border border-[#FCD8C1] rounded-3xl p-7 md:p-9 my-10 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Description */}
            <div className="max-w-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C25E2E] mb-2">
                <span>💌</span>
                <span>Gợi Ý Quà Tặng Tế Nhị</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#4A2E1B] tracking-tight mb-2">
                Muốn gửi danh sách này cho người thương?
              </h2>
              <p className="text-xs md:text-sm text-[#6B4226]/80 font-medium leading-relaxed mb-3">
                Tạo liên kết bí mật hoặc mã bưu thiếp xinh xắn gửi qua Zalo / Messenger. Người ấy sẽ mở ra chiếc thiệp tương tác đựng đúng các bé gấu bạn đang mong ước!
              </p>
              <button
                onClick={() => setIsPostcardModalOpen(true)}
                className="text-xs font-bold text-[#C25E2E] hover:text-[#9B451C] underline flex items-center gap-1 cursor-pointer transition"
              >
                <span>💌 Mở xem thử giao diện bưu thiếp người ấy sẽ thấy →</span>
              </button>
            </div>

            {/* Right Copy Link Input */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-white border border-[#FADCC7] rounded-xl py-3 px-4 text-xs font-semibold text-[#6B4226] shadow-2xs select-all focus:outline-none"
                />
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-[#7A3E1D] hover:bg-[#602F13] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Đã chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* RECOMMENDATION SECTION: "Có thể bạn cũng sẽ phải lòng 🧸" */}
        <section className="my-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#C25E2E] mb-1 flex items-center gap-1.5">
                <span>💡</span>
                <span>GỢI Ý GHÉP ĐÔI ẤM ÁP</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A2E1B] tracking-tight">
                Có thể bạn cũng sẽ phải lòng 🧸
              </h2>
            </div>
            <p className="text-xs text-[#8C5E43] font-medium max-w-xs md:text-right">
              Những bé gấu cùng tone màu mùa thu rất hợp để gói chung một hộp quà.
            </p>
          </div>

          {/* 3 Recommended Cards Grid matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDED_FALL_IN_LOVE.map((rec) => {
              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-3xl p-4 border border-[#EAE0D5] hover:border-[#D47343]/50 shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden mb-3 bg-[#FAF4EB]">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Tag on bottom-left of image */}
                      <div className="absolute bottom-2.5 left-2.5 z-10">
                        <span className="bg-black/60 text-white text-[10px] font-bold px-2.5 py-0.8 rounded-full backdrop-blur-xs shadow-xs">
                          {rec.tag}
                        </span>
                      </div>

                      {/* Heart Button top-right */}
                      <button
                        onClick={() => addToWishlist(rec)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-rose-500 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition cursor-pointer z-10"
                        title="Lưu vào danh sách"
                      >
                        <Heart className="w-4 h-4 hover:fill-rose-500" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-[#4A2E1B] mb-1">
                      {rec.name}
                    </h3>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-[#8C5E43] font-medium leading-relaxed mb-4">
                      {rec.description}
                    </p>
                  </div>

                  {/* Price & Action: Lưu ngay */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#FAF0E6]">
                    <span className="text-base font-bold text-[#C25E2E]">
                      {rec.price.toLocaleString('vi-VN')}đ
                    </span>

                    <button
                      onClick={() => addToWishlist(rec)}
                      className="bg-[#FFF8EE] hover:bg-[#FBE9D0] text-[#7A3E1D] border border-[#F2D7B8] text-xs font-bold px-4 py-2 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-2xs hover:shadow-xs"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#C25E2E]" />
                      <span>Lưu ngay</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: BƯU THIẾP GỬI NGƯỜI THƯƠNG (INTERACTIVE ROMANTIC POSTCARD) */}
      {/* ==================================================================== */}
      {isPostcardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#E0D0C0] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsPostcardModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFE8D6] text-[#C25E2E] flex items-center justify-center text-2xl mx-auto mb-2 shadow-2xs">
                💌
              </div>
              <h3 className="text-xl font-bold text-[#4A2E1B]">
                Bưu Thiếp Bí Mật Gửi Người Ấy
              </h3>
              <p className="text-xs text-[#8C5E43] font-medium mt-1">
                Người ấy mở liên kết sẽ nhận được tấm thiệp hoa khô vintage kèm danh sách những bé gấu bạn yêu thích nhất!
              </p>
            </div>

            {/* Vintage Postcard Preview Box */}
            <div className="bg-[#FFFDF9] border-2 border-dashed border-[#D9C4B2] rounded-2xl p-5 shadow-inner mb-6 relative">
              <div className="absolute top-3 right-3 w-10 h-10 border border-[#C25E2E]/40 rounded-lg flex items-center justify-center text-xs text-[#C25E2E] font-bold rotate-6 bg-[#FFF2E8]">
                HD 🧸
              </div>

              <div className="text-xs font-bold text-[#C25E2E] mb-2">
                🍂 TIỆM GẤU BÔNG HD • POSTCARD MÙA THU
              </div>

              {/* Editable Greetings */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-bold text-[#8C5E43] block mb-1">
                    Gửi đến (Người thương):
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-[#FAF4EB]/60 border border-[#E0D0C0] rounded-lg px-3 py-1.5 text-xs font-bold text-[#4A2E1B] focus:outline-none focus:border-[#C25E2E]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8C5E43] block mb-1">
                    Lời nhắn gửi:
                  </label>
                  <textarea
                    rows={3}
                    value={postcardMessage}
                    onChange={(e) => setPostcardMessage(e.target.value)}
                    className="w-full bg-[#FAF4EB]/60 border border-[#E0D0C0] rounded-lg p-2.5 text-xs text-[#4A2E1B] font-medium focus:outline-none focus:border-[#C25E2E]"
                  />
                </div>
              </div>

              {/* Wishlist Thumbnails Inside Postcard */}
              <div className="border-t border-[#EAE0D5] pt-3">
                <p className="text-[11px] font-bold text-[#8C5E43] mb-2">
                  🧸 Các bé gấu trong danh sách mong ước ({wishlistItems.length} bé):
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {wishlistItems.map(item => (
                    <div
                      key={item.id}
                      className="shrink-0 w-20 text-center bg-[#FAF4EB] p-1.5 rounded-xl border border-[#EAE0D5]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg mx-auto mb-1"
                      />
                      <p className="text-[10px] font-bold text-[#4A2E1B] truncate">{item.name}</p>
                      <p className="text-[9px] font-semibold text-[#C25E2E]">{item.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 bg-[#7A3E1D] hover:bg-[#602F13] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLink ? 'Đã sao chép link!' : 'Sao chép link gửi Zalo / Messenger'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: NHẬN TIN HẠ GIÁ (PRICE DROP & RESTOCK ALERT) */}
      {/* ==================================================================== */}
      {isPriceAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#E0D0C0] rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsPriceAlertModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FCE8D5] text-[#C25E2E] flex items-center justify-center text-2xl mx-auto mb-2 shadow-2xs">
                🔔
              </div>
              <h3 className="text-xl font-bold text-[#4A2E1B]">
                Nhận Thông Báo Hạ Giá & Còn Ít
              </h3>
              <p className="text-xs text-[#8C5E43] font-medium mt-1">
                Tiệm sẽ gửi thông báo tức thì qua Zalo hoặc Email ngay khi bé gấu bạn thích có ưu đãi hoặc sắp hết hàng!
              </p>
            </div>

            <form onSubmit={handlePriceAlertSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#6B4226] block mb-1.5">
                  Số điện thoại Zalo hoặc Email nhận tin:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0912 345 678 hoặc email@gmail.com"
                  value={alertContact}
                  onChange={(e) => setAlertContact(e.target.value)}
                  className="w-full bg-white border border-[#E0D0C0] rounded-xl px-4 py-2.5 text-xs text-[#4A2E1B] font-semibold focus:outline-none focus:border-[#C25E2E]"
                />
              </div>

              {/* Alert preferences */}
              <div className="bg-white rounded-2xl p-4 border border-[#EAE0D5] space-y-2.5 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#6B4226]">
                  <input
                    type="checkbox"
                    checked={alertType.priceDrop}
                    onChange={(e) => setAlertType(prev => ({ ...prev, priceDrop: e.target.checked }))}
                    className="accent-[#C25E2E] rounded"
                  />
                  <span>Báo khi bé gấu có đợt giảm giá / flash sale</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#6B4226]">
                  <input
                    type="checkbox"
                    checked={alertType.lowStock}
                    onChange={(e) => setAlertType(prev => ({ ...prev, lowStock: e.target.checked }))}
                    className="accent-[#C25E2E] rounded"
                  />
                  <span>Cảnh báo khi chỉ còn 1 - 2 bé cuối cùng</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#6B4226]">
                  <input
                    type="checkbox"
                    checked={alertType.voucher}
                    onChange={(e) => setAlertType(prev => ({ ...prev, voucher: e.target.checked }))}
                    className="accent-[#C25E2E] rounded"
                  />
                  <span>Nhận voucher độc quyền 10% sinh nhật</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#7A3E1D] hover:bg-[#602F13] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {alertSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Đã lưu thông báo thành công!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Xác nhận bật thông báo</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: TÙY CHỌN QUÀ TẶNG & THIỆP TAY */}
      {/* ==================================================================== */}
      {isGiftOptionModalOpen && selectedGiftBear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#E0D0C0] rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsGiftOptionModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFE8D6] text-[#C25E2E] flex items-center justify-center text-2xl mx-auto mb-2 shadow-2xs">
                🎁
              </div>
              <h3 className="text-xl font-bold text-[#4A2E1B]">
                Tùy Chọn Quà Tặng & Thiệp Thủ Công
              </h3>
              <p className="text-xs text-[#8C5E43] font-medium mt-1">
                Gói quà chỉn chu cho <span className="font-bold text-[#C25E2E]">{selectedGiftBear.name}</span>
              </p>
            </div>

            {/* Gift Options Form */}
            <div className="space-y-4 mb-6">
              {/* Box style */}
              <div>
                <label className="text-xs font-bold text-[#6B4226] block mb-2">
                  Kiểu hộp quà vintage:
                </label>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                  {[
                    { id: 'kraft-vintage', label: 'Hộp Kraft Thắt Nơ Lụa', fee: 'Miễn phí' },
                    { id: 'premium-wood', label: 'Hộp Gỗ Thông Mùa Thu', fee: '+35.000đ' }
                  ].map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setGiftBoxStyle(b.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        giftBoxStyle === b.id
                          ? 'bg-white border-[#C25E2E] text-[#C25E2E] shadow-xs'
                          : 'bg-white/60 border-[#EAE0D5] text-[#6B4226]'
                      }`}
                    >
                      <div className="font-bold">{b.label}</div>
                      <div className="text-[10px] text-gray-500">{b.fee}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Handwritten Note message */}
              <div>
                <label className="text-xs font-bold text-[#6B4226] block mb-1.5">
                  Dòng thiệp viết tay nắn nót (miễn phí):
                </label>
                <textarea
                  rows={3}
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  placeholder="Nhập lời chúc bạn muốn người thợ nắn nót viết lên thiệp..."
                  className="w-full bg-white border border-[#E0D0C0] rounded-xl p-3 text-xs text-[#4A2E1B] font-medium focus:outline-none focus:border-[#C25E2E]"
                />
              </div>

              {/* Free Dried Flowers */}
              <div className="bg-[#FFFDF9] p-3.5 rounded-2xl border border-[#ECD9C6] flex items-center gap-3">
                <span className="text-2xl">🌾</span>
                <div className="text-xs">
                  <p className="font-bold text-[#4A2E1B]">Đính kèm bó hoa khô & mùi cỏ ram</p>
                  <p className="text-[11px] text-[#8C5E43]">
                    Tiệm ướp hương thơm dịu nhẹ thoang thoảng mùa thu khi mở hộp.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirm */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmGiftCustomization}
                className="w-full bg-[#7A3E1D] hover:bg-[#602F13] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xác nhận & Thêm combo vào giỏ</span>
                <span>🛍️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: CONFIRM CLEAR WISHLIST */}
      {/* ==================================================================== */}
      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#E0D0C0] rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-[#4A2E1B] mb-2">
              Làm trống danh sách yêu thích?
            </h3>
            <p className="text-xs text-[#8C5E43] font-medium mb-6">
              Bạn có chắc muốn xóa tất cả các bé gấu khỏi danh sách ước mong này không?
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setIsClearConfirmOpen(false)}
                className="flex-1 bg-white border border-[#E0D0C0] text-[#6B4226] font-bold text-xs py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                onClick={() => {
                  clearWishlist();
                  setIsClearConfirmOpen(false);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
