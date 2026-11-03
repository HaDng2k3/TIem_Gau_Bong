import React, { useState } from 'react';
import { 
  Heart, ShoppingBag, Star, ShieldCheck, Check, Sparkles, 
  Truck, ArrowRight, RefreshCw, Info, 
  Maximize2, Ruler, MessageCircle, Gift, CheckCircle2, ChevronRight, Award
} from 'lucide-react';
import { useWishlist } from './context/WishlistContext';

export default function ProductDetailPage({ 
  product, 
  onBackToHome, 
  onBackToCollection, 
  onOrderProduct,
  onAddToCart,
  onSelectProduct 
}) {
  // Flagship product data defaults to "Bé Gấu Chơi Nơ Ca-Rô"
  const defaultProduct = {
    id: 'prod-5',
    name: 'Bé Gấu Chơi Nơ Ca-Rô',
    category: 'Gấu Teddy Mùa Thu',
    tag: 'Best Seller',
    tagColor: 'bg-amber-500',
    subtitle: 'Dòng gấu bông lông xoắn velvet cao cấp thêu tay tỉ mỉ, mềm êm tựa mây trời',
    rating: 5.0,
    reviews: 295,
    soldCount: 1420,
    sku: 'TEDDY-CARO-50',
    basePrice: 340000,
    originalPrice: 420000,
    sizes: [
      { 
        id: '35cm', 
        name: '35 cm', 
        desc: 'Nhỏ nhắn xinh xắn, vừa vặn balo dạo phố', 
        price: 260000, 
        originalPrice: 320000,
        heightStanding: 35,
        heightSitting: 25,
        weight: '350g',
        waist: '32cm',
        bestFor: 'Bỏ balo mang đi cafe chụp ảnh, đặt bàn học, tựa nhẹ tay lái xe'
      },
      { 
        id: '50cm', 
        name: '50 cm', 
        desc: 'Chuẩn ôm ngủ, tựa lưng vừa tay nhất', 
        price: 340000, 
        originalPrice: 420000,
        recommended: true,
        heightStanding: 50,
        heightSitting: 38,
        weight: '650g',
        waist: '48cm',
        bestFor: 'Kích thước lý tưởng nhất để ôm ngủ, tựa sofa đọc sách, để góc giường'
      },
      { 
        id: '70cm', 
        name: '70 cm', 
        desc: 'Cỡ lớn ôm trọn vòng tay ấm áp', 
        price: 480000, 
        originalPrice: 590000,
        heightStanding: 70,
        heightSitting: 52,
        weight: '1.200g',
        waist: '68cm',
        bestFor: 'Món quà bất ngờ tuyệt đỉnh cho sinh nhật / kỷ niệm, ôm trọn cả người'
      },
      { 
        id: '100cm', 
        name: '100 cm', 
        desc: 'Khổng lồ đại tướng gác chân siêu êm', 
        price: 690000, 
        originalPrice: 850000,
        heightStanding: 100,
        heightSitting: 75,
        weight: '2.500g',
        waist: '95cm',
        bestFor: 'Làm người bạn gác chân, tựa cả người xem phim, trang trí phòng cực chill'
      }
    ],
    bowColors: [
      { id: 'brown', name: 'Nơ Ca-Rô Cacao', colorCode: '#6B4226', borderCode: '#8B5A2B', vibe: 'Cổ điển & ấm áp' },
      { id: 'green', name: 'Nơ Ca-Rô Xanh Rêu', colorCode: '#4A5D4E', borderCode: '#36483A', vibe: 'Rừng thông mùa thu' },
      { id: 'red', name: 'Nơ Ca-Rô Đỏ Mận', colorCode: '#8B2635', borderCode: '#6A1A27', vibe: 'Ngọt ngào & rạng rỡ' }
    ],
    gallery: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1200&q=85',
        title: 'Bé gấu toàn cảnh với nơ ca-rô',
        desc: 'Dáng ngồi bụ bẫm tròn xoe, lông xoắn ánh nâu mật ong'
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=1200&q=85',
        title: 'Cận cảnh sợi lông velvet xoắn tơ',
        desc: 'Chi tiết sợi lông: Các chùm lông xoắn nhiệt 3D siêu mềm, không rụng'
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=85',
        title: 'Trong hộp quà Kraft & rơm thông',
        desc: 'Đóng gói nắp gập vintage kèm lá phong & ruy băng lụa cao cấp'
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=85',
        title: 'Độ ôm vừa tay thực tế',
        desc: 'Bé gấu tròn trịa căng đầy gòn bi, bóp vào nảy ngay lập tức'
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85',
        title: 'Góc chụp nghiêng & nơ dệt cotton',
        desc: 'Từng đường may giấu chỉ thủ công, mũi thêu tay cẩn trọng'
      }
    ]
  };

  const currentProd = product ? { ...defaultProduct, ...product } : defaultProduct;

  // Selected options state
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(1); // Default 50cm
  const [selectedBow, setSelectedBow] = useState(currentProd.bowColors?.[0] || { id: 'brown', name: 'Nơ Ca-Rô Cacao' });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeInfoTab, setActiveInfoTab] = useState('fur'); // 'fur' | 'standards' | 'care'

  // Customization add-on state
  const [includeGiftBox, setIncludeGiftBox] = useState(true);
  const [includeHandwrittenCard, setIncludeHandwrittenCard] = useState(true);
  const [cardMessage, setCardMessage] = useState('Chúc người thương luôn nhoẻn miệng cười ấm áp trong những ngày gió mùa thu về!');
  const [embroideryOption, setEmbroideryOption] = useState(false);
  const [embroideryName, setEmbroideryName] = useState('');

  // Fullscreen Preview Modal
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const activeSize = currentProd.sizes?.[selectedSizeIndex] || currentProd.sizes?.[0] || {
    id: 'default',
    name: '50 cm',
    desc: 'Chuẩn ôm ngủ, tựa lưng vừa tay nhất',
    price: currentProd.basePrice || 340000,
    originalPrice: currentProd.originalPrice || 420000,
    heightStanding: 50,
    heightSitting: 38,
    weight: '650g',
    waist: '48cm',
    bestFor: 'Kích thước lý tưởng nhất để ôm ngủ, tựa sofa đọc sách'
  };

  const calculatedPrice = (activeSize.price || currentProd.basePrice || 340000) + (embroideryOption ? 30000 : 0);
  const calculatedOriginalPrice = (activeSize.originalPrice || currentProd.originalPrice || 420000) + (embroideryOption ? 30000 : 0);
  const discountPercent = calculatedOriginalPrice > calculatedPrice 
    ? Math.round(((calculatedOriginalPrice - calculatedPrice) / calculatedOriginalPrice) * 100) 
    : 0;

  const [localWishlist, setLocalWishlist] = useState(false);
  let wishlistCtx = null;
  try {
    wishlistCtx = useWishlist();
  } catch (e) {
    // context optional
  }
  const isWishlist = wishlistCtx ? wishlistCtx.isInWishlist(currentProd.id || currentProd.name) : localWishlist;

  const handleToggleWishlist = () => {
    if (wishlistCtx) {
      wishlistCtx.toggleWishlist({
        id: currentProd.id || 'prod-5',
        name: currentProd.name,
        price: currentProd.price,
        originalPrice: currentProd.originalPrice,
        size: currentProd.sizes?.[selectedSizeIndex]?.label || 'Size M (35cm)',
        image: currentProd.images?.[0] || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
        tag: 'Bán chạy nhất 🔥'
      });
    } else {
      setLocalWishlist(!localWishlist);
    }
  };
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        id: `${currentProd.id}-${activeSize.id}`,
        name: `${currentProd.name} (${activeSize.name} - ${selectedBow.name})`,
        price: calculatedPrice,
        image: currentProd.gallery[activeImageIndex].url,
        size: activeSize.name,
        bow: selectedBow.name,
        giftMessage: includeHandwrittenCard ? cardMessage : '',
        embroidery: embroideryOption ? embroideryName : null,
        includeGiftBox
      }, quantity);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleTriggerBuyNow = () => {
    if (onOrderProduct) {
      onOrderProduct({
        id: `${currentProd.id}-${activeSize.id}`,
        name: `${currentProd.name} (${activeSize.name} - ${selectedBow.name})`,
        price: calculatedPrice,
        image: currentProd.gallery[activeImageIndex].url,
        size: activeSize.name,
        bow: selectedBow.name,
        giftMessage: includeHandwrittenCard ? cardMessage : '',
        embroidery: embroideryOption ? embroideryName : null,
        includeGiftBox
      });
    }
  };

  // Related products
  const relatedBears = [
    {
      id: 'prod-6',
      name: 'Bé Gấu Bí Ngô Thêu Tay Mùa Vàng',
      price: 295000,
      oldPrice: 350000,
      tag: 'Bản giới hạn',
      rating: 4.9,
      reviews: 184,
      image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=400&q=80',
      furDesc: 'Lông cừu xoắn màu kem mật ong'
    },
    {
      id: 'prod-4',
      name: 'Bé Cún Bông Bơ Sữa Tai Cụp',
      price: 245000,
      oldPrice: 280000,
      tag: 'Chỉ còn 3 bé',
      rating: 4.9,
      reviews: 53,
      image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=400&q=80',
      furDesc: 'Lông nhung tuyết siêu mịn'
    },
    {
      id: 'prod-7',
      name: 'Gấu Cây Sồi Nâu Rêu Vintage',
      price: 380000,
      oldPrice: 420000,
      tag: 'Độc Quyền',
      rating: 4.9,
      reviews: 84,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80',
      furDesc: 'Lông sợi dài tự nhiên ấm áp'
    },
    {
      id: 'prod-9',
      name: 'Gấu Cozy Áo Choàng Len Mùa Đông',
      price: 390000,
      oldPrice: 460000,
      tag: 'Hot Trend',
      rating: 5.0,
      reviews: 204,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
      furDesc: 'Lông velvet ánh caramel'
    }
  ];

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-cozy-text selection:bg-cozy-secondary/30 pb-20">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#6B4226] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-300/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="font-bold text-sm">Đã thêm vào giỏ hàng thành công!</p>
            <p className="text-xs text-amber-100/80">{currentProd.name} • {activeSize.name}</p>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Status */}
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-cozy-text/70">
          <nav className="flex items-center gap-2">
            <button onClick={onBackToHome} className="hover:text-cozy-primary transition">Trang chủ</button>
            <ChevronRight className="w-3.5 h-3.5 text-cozy-text/40" />
            <button onClick={onBackToCollection} className="hover:text-cozy-primary transition">BST Mùa Thu 2024</button>
            <ChevronRight className="w-3.5 h-3.5 text-cozy-text/40" />
            <span className="text-cozy-primary font-bold">{currentProd.name}</span>
          </nav>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-[#F3E6D5] px-3 py-1 rounded-full text-cozy-text font-bold">
              Mã SP: {currentProd.sku}
            </span>
            <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang có sẵn tại Studio (Ship ngay 2H)
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Stage: 2 Columns */}
      <section className="max-w-[1400px] mx-auto px-6 pt-2 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ================= LEFT COLUMN: Visual Inspection, Fur Loupe & Size Ruler ================= */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Interactive Image Showcase */}
            <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-cozy-border">
              
              {/* Image Frame */}
              <div 
                className="relative h-[480px] md:h-[520px] rounded-[2rem] overflow-hidden bg-[#FBF7F0] select-none border border-cozy-border/50 group"
              >
                {/* Real Photo & Studio Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <div className="bg-[#FAF4EB]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-cozy-primary border border-cozy-border shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Chụp Thật 100% Tại Studio Tiệm
                  </div>
                  <div className="bg-emerald-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3" />
                    Không Rụng Sợi • Đạt Chuẩn Da Liễu
                  </div>
                </div>

                {/* Fullscreen Action Button */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="bg-white/90 backdrop-blur p-2 rounded-full text-cozy-text shadow-sm hover:bg-white transition border border-cozy-border"
                    title="Xem ảnh toàn màn hình"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Base Image */}
                <img 
                  src={currentProd.gallery[activeImageIndex].url} 
                  alt={currentProd.gallery[activeImageIndex].title}
                  className="w-full h-full object-cover transition duration-300"
                />
              </div>

              {/* Thumbnails Gallery */}
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {currentProd.gallery.map((thumb, index) => (
                  <button
                    key={thumb.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                      activeImageIndex === index 
                        ? 'border-cozy-primary scale-105 shadow-md ring-2 ring-cozy-primary/20' 
                        : 'border-cozy-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
                    {index === 1 && (
                      <span className="absolute bottom-0 inset-x-0 bg-cozy-primary text-white text-[9px] font-bold text-center py-0.5">
                        Cận Lông
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Caption of current view */}
              <div className="mt-3 px-2 flex justify-between items-center text-xs text-cozy-text/70">
                <span className="font-bold text-cozy-text">{currentProd.gallery[activeImageIndex].title}</span>
                <span className="italic text-[11px]">{currentProd.gallery[activeImageIndex].desc}</span>
              </div>
            </div>

            {/* Feature Banner: Lông Kháng Khuẩn & An Toàn Dị Ứng */}
            <div className="bg-[#FAF0E4] rounded-[2rem] p-6 border border-[#ECD9C5] shadow-xs">
              <div className="flex items-center gap-2 text-cozy-primary font-bold text-sm mb-2">
                <ShieldCheck className="w-5 h-5 text-cozy-primary" />
                <span>★ Lông Kháng Khuẩn (Khắc Phục Hoàn Toàn Nỗi Lo Dị Ứng Bông Vải)</span>
              </div>
              <p className="text-xs text-cozy-text/80 leading-relaxed font-medium mb-5">
                Tiệm cam kết 100% sợi lông velvet siêu mịn thế hệ mới được xử lý nhiệt chân sợi. Dù bé có dụi mặt, ôm sát mũi hay giặt phơi nhiều lần cũng tuyệt đối không rụng lông tơ, an toàn cho cả trẻ sơ sinh.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-white text-center">
                  <div className="text-lg mb-1">✋</div>
                  <div className="font-bold text-xs text-cozy-text">Vuốt Không Rụng</div>
                  <div className="text-[10px] text-cozy-text/60 mt-0.5">Khóa nhiệt chân sợi</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-white text-center">
                  <div className="text-lg mb-1">☁️</div>
                  <div className="font-bold text-xs text-cozy-text">Gòn Bi 3D Kháng Lún</div>
                  <div className="text-[10px] text-cozy-text/60 mt-0.5">Nảy êm trọn đời</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-white text-center">
                  <div className="text-lg mb-1">🌿</div>
                  <div className="font-bold text-xs text-cozy-text">Chống Bám Bụi</div>
                  <div className="text-[10px] text-cozy-text/60 mt-0.5">Tĩnh điện cực thấp</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-3 border border-white text-center">
                  <div className="text-lg mb-1">🌸</div>
                  <div className="font-bold text-xs text-cozy-text">Ủ Thơm Thảo Mộc</div>
                  <div className="text-[10px] text-cozy-text/60 mt-0.5">Tinh dầu cúc la mã</div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                THƯỚC ĐO TRỰC QUAN KÍCH THƯỚC THỰC TẾ (SIZE COMPARISON TOOL)
                Tương ứng với mockup Stitch màn hình b07fcbd3df8847d1ad015303ffe21d55
               ========================================================================= */}
            <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-cozy-border">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cozy-primary/10 text-cozy-primary flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-cozy-text">
                      Thước Đo Trực Quan Khi Đặt Thực Tế
                    </h3>
                    <p className="text-xs text-cozy-text/60 font-medium">
                      So sánh tỷ lệ chiều cao & độ ôm bé gấu với người thực tế (1m60) và đồ vật quen thuộc
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF4EB] p-1 rounded-full border border-cozy-border">
                  {currentProd.sizes.map((sz, idx) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                        selectedSizeIndex === idx
                          ? 'bg-[#6B4226] text-white shadow-xs'
                          : 'text-cozy-text/70 hover:text-cozy-text'
                      }`}
                    >
                      {sz.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Interactive Ruler Stage */}
              <div className="mt-6 bg-[#FAF6F0] rounded-2xl p-6 border border-cozy-border/60 relative overflow-hidden">
                
                {/* Visual Comparative Canvas */}
                <div className="flex items-end justify-between min-h-[300px] pt-8 px-4 border-b-2 border-stone-300 relative">
                  
                  {/* Height Ruler Lines on the left */}
                  <div className="absolute left-2 top-4 bottom-0 w-12 flex flex-col justify-between text-[10px] text-stone-500 font-bold select-none border-r border-dashed border-stone-300 pr-2">
                    <div className="flex items-center justify-end gap-1">160cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">100cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">70cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">50cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">35cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">15cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                    <div className="flex items-center justify-end gap-1">0cm <span className="w-2 h-[1px] bg-stone-400"></span></div>
                  </div>

                  {/* Reference Objects Section */}
                  <div className="pl-14 flex items-end gap-6 pb-0">
                    
                    {/* Item 1: Phone (15cm) */}
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-12 bg-stone-800 rounded-lg shadow-sm border border-stone-400 flex items-center justify-center text-[8px] text-white font-mono">
                        15cm
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold mt-2">iPhone</span>
                    </div>

                    {/* Item 2: Backpack (35cm) */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-20 bg-amber-800/70 rounded-t-2xl rounded-b-lg shadow-sm border border-amber-900/30 flex flex-col items-center justify-center text-[9px] text-white font-bold p-1 text-center">
                        🎒 35cm
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold mt-2">Balo mini</span>
                    </div>

                    {/* Item 3: Standard Sleeping Pillow (50cm) */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-28 bg-[#EAE0D5] rounded-2xl shadow-sm border border-stone-300 flex flex-col items-center justify-center text-[9px] text-cozy-text font-bold p-1 text-center">
                        🛌 50cm
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold mt-2">Gối ngủ</span>
                    </div>
                  </div>

                  {/* Active Teddy Bear (Dynamically Resized to Scale) */}
                  <div className="flex flex-col items-center z-10">
                    <div 
                      className="transition-all duration-500 relative flex flex-col items-center justify-end filter drop-shadow-xl"
                      style={{
                        height: `${Math.round((activeSize.heightStanding / 160) * 260)}px`,
                        width: `${Math.max(65, Math.round((activeSize.heightStanding / 160) * 190))}px`
                      }}
                    >
                      {/* Bear Tag on top */}
                      <div className="bg-[#D47343] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap mb-1 animate-bounce">
                        Bé Gấu: {activeSize.name}
                      </div>

                      {/* Scaled Bear Graphic */}
                      <div className="w-full h-full bg-[#FAF0E4] rounded-[2rem] border-2 border-[#D47343] relative overflow-hidden flex flex-col items-center justify-between p-2 shadow-inner">
                        <img 
                          src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80" 
                          alt="Bear scale"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                        {/* Bow tie indicator */}
                        <div 
                          className="absolute top-1/3 w-6 h-3 rounded-xs shadow-xs border border-white"
                          style={{ backgroundColor: selectedBow.colorCode }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs text-cozy-primary font-bold mt-2">
                      {activeSize.name} ({activeSize.weight})
                    </span>
                  </div>

                  {/* Human Figure Silhouette (1m60 Standard Height) */}
                  <div className="flex flex-col items-center">
                    <div className="h-[260px] w-16 relative flex flex-col items-center justify-end opacity-85">
                      {/* Stylized Human Silhouette */}
                      {/* Head */}
                      <div className="w-8 h-8 rounded-full bg-[#6B4226]/40 mb-1 border border-[#6B4226]/50"></div>
                      {/* Torso & Legs */}
                      <div className="w-12 h-28 bg-[#6B4226]/30 rounded-t-3xl rounded-b-md border border-[#6B4226]/40 flex flex-col items-center pt-2">
                        <div className="w-6 h-8 bg-[#6B4226]/40 rounded-full"></div>
                      </div>
                      <div className="w-10 h-28 flex gap-1.5 justify-center">
                        <div className="w-3.5 h-full bg-[#6B4226]/30 rounded-b-md"></div>
                        <div className="w-3.5 h-full bg-[#6B4226]/30 rounded-b-md"></div>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-600 font-bold mt-2">Người (1m60)</span>
                  </div>
                </div>

                {/* Ground Line Tag */}
                <div className="mt-2 text-center text-[10px] text-stone-400 font-medium">
                  Sàn nhà / Mặt phẳng đặt gấu (0 cm)
                </div>

                {/* Real-life Usage Recommendation Note */}
                <div className="mt-5 bg-white p-4 rounded-xl border border-cozy-border flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    💡
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-cozy-text">
                      Gợi ý thực tế cho size {activeSize.name}:
                    </p>
                    <p className="text-cozy-text/80 leading-relaxed font-medium">
                      {activeSize.bestFor}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-cozy-text/70 border-t border-dashed border-cozy-border mt-2 font-medium">
                      <span>• Chiều cao ngồi: <strong>{activeSize.heightSitting} cm</strong></span>
                      <span>• Vòng bụng: <strong>{activeSize.waist}</strong></span>
                      <span>• Cân nặng bông: <strong>~{activeSize.weight}</strong> (đầm tay)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Info, Pricing, Size/Bow Selector, CTA ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Title & Rating Card */}
            <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-cozy-border space-y-5">
              
              {/* Collection Badge */}
              <div className="flex items-center justify-between">
                <span className="bg-[#FAF0E4] text-cozy-primary text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#ECD9C5]">
                  ✨ BST Mùa Thu 2024 • Bán Chạy Nhất Tiệm
                </span>
                
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-full border transition cursor-pointer ${
                    isWishlist 
                      ? 'bg-rose-50 text-rose-500 border-rose-200' 
                      : 'bg-white text-gray-400 border-cozy-border hover:text-rose-500'
                  }`}
                  title="Lưu vào danh sách yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-3xl font-bold text-cozy-text tracking-tight mb-2">
                  {currentProd.name}
                </h1>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium">
                  {currentProd.subtitle}
                </p>
              </div>

              {/* Trust Metric (Stars, Reviews, Sold) */}
              <div className="flex items-center gap-4 text-xs pt-1 border-y border-cozy-border/60 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-cozy-text">5.0</span>
                  <span className="text-cozy-text/60">({currentProd.reviews} đánh giá)</span>
                </div>
                <div className="w-[1px] h-4 bg-cozy-border"></div>
                <div className="text-cozy-text/80 font-medium">
                  Đã bán: <strong className="text-cozy-text font-bold">{currentProd.soldCount} bé</strong>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-[#FAF4EB] rounded-2xl p-4 border border-cozy-border">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold text-cozy-primary">
                    {calculatedPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-sm font-semibold text-stone-400 line-through">
                    {calculatedOriginalPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                    -{discountPercent}%
                  </span>
                </div>

                <div className="mt-2 text-xs text-cozy-text/80 font-medium flex items-center gap-2">
                  <Gift className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>
                    <strong>Quà Tặng Mùa Thu:</strong> Miễn phí Hộp quà Kraft Vintage + Ruy băng + Thiệp viết tay riêng (Trị giá 45.000đ)
                  </span>
                </div>
              </div>

              {/* 1. SELECT SIZE (Chọn Kích Thước) */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cozy-text uppercase tracking-wider text-[11px]">
                    1. Chọn Kích Thước Bé Gấu:
                  </span>
                  <span className="text-cozy-primary font-bold">
                    Đã chọn: {activeSize.name}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {currentProd.sizes.map((sz, idx) => (
                    <button
                      key={sz.id}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-2xl text-left border transition-all relative ${
                        selectedSizeIndex === idx
                          ? 'border-cozy-primary bg-[#FAF0E4] shadow-xs'
                          : 'border-cozy-border bg-white hover:border-cozy-primary/50'
                      }`}
                    >
                      {sz.recommended && (
                        <span className="absolute -top-2.5 right-3 bg-cozy-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                          Khuyên dùng ★
                        </span>
                      )}
                      <div className="font-bold text-sm text-cozy-text flex items-center justify-between">
                        <span>{sz.name}</span>
                        <span className="text-cozy-primary text-xs font-bold">
                          {sz.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <p className="text-[10px] text-cozy-text/65 line-clamp-1 mt-1 font-medium">
                        {sz.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. SELECT BOW STYLE (Chọn Kiểu Nơ Ca-Rô) */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cozy-text uppercase tracking-wider text-[11px]">
                    2. Chọn Kiểu Nơ Ca-Rô:
                  </span>
                  <span className="text-cozy-text/80 font-medium">
                    {selectedBow.name} ({selectedBow.vibe})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {currentProd.bowColors.map((bow) => (
                    <button
                      key={bow.id}
                      onClick={() => setSelectedBow(bow)}
                      className={`flex-1 p-2.5 rounded-xl border flex items-center gap-2.5 transition text-xs font-bold ${
                        selectedBow.id === bow.id
                          ? 'border-cozy-primary bg-[#FAF0E4] text-cozy-text'
                          : 'border-cozy-border bg-white text-cozy-text/70 hover:bg-stone-50'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-white shadow-xs shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: bow.colorCode }}
                      >
                        {selectedBow.id === bow.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate text-[11px]">{bow.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. GIFT BOX & HANDWRITTEN CARD CUSTOMIZATION */}
              <div className="space-y-3 pt-3 border-t border-cozy-border/60">
                <span className="font-bold text-cozy-text uppercase tracking-wider text-[11px] block">
                  3. Dịch Vụ Quà Tặng & Cá Nhân Hóa:
                </span>

                <div className="space-y-2.5">
                  
                  {/* Option: Kraft Gift Box */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-[#FBF7F0] border border-cozy-border cursor-pointer hover:bg-[#F8EFE5] transition">
                    <input 
                      type="checkbox" 
                      checked={includeGiftBox}
                      onChange={(e) => setIncludeGiftBox(e.target.checked)}
                      className="mt-0.5 rounded text-cozy-primary focus:ring-cozy-primary accent-[#D47343]"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-cozy-text">Hộp quà Kraft cứng cáp & ruy băng nơ lụa</span>
                      <span className="ml-2 text-emerald-700 font-bold text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">Miễn phí mùa thu</span>
                      <p className="text-[11px] text-cozy-text/65 mt-0.5">Bảo vệ bé gấu an toàn, lót rơm gỗ thông thơm dịu thoang thoảng.</p>
                    </div>
                  </label>

                  {/* Option: Handwritten Card */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-[#FBF7F0] border border-cozy-border cursor-pointer hover:bg-[#F8EFE5] transition">
                    <input 
                      type="checkbox" 
                      checked={includeHandwrittenCard}
                      onChange={(e) => setIncludeHandwrittenCard(e.target.checked)}
                      className="mt-0.5 rounded text-cozy-primary focus:ring-cozy-primary accent-[#D47343]"
                    />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-cozy-text">Tiệm viết thiệp tay hộ bạn bằng mực nâu cổ điển</span>
                      <span className="ml-2 text-emerald-700 font-bold text-[10px] bg-emerald-100 px-1.5 py-0.2 rounded">Miễn phí</span>
                      <p className="text-[11px] text-cozy-text/65 mt-0.5">Nắn nót từng dòng chúc yêu thương gửi gắm người nhận.</p>
                    </div>
                  </label>

                  {/* Handwritten Card Input & Live Preview */}
                  {includeHandwrittenCard && (
                    <div className="bg-[#FAF0E4] p-3.5 rounded-2xl border border-[#ECD9C5] space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-cozy-text font-bold">
                        <span>💌 Nội dung lời chúc trên thiệp:</span>
                        <span className="text-[10px] text-cozy-text/60">{cardMessage.length}/120 ký tự</span>
                      </div>
                      <textarea
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        maxLength={120}
                        rows={2}
                        className="w-full bg-white border border-cozy-border rounded-xl p-2.5 text-xs focus:outline-none focus:border-cozy-primary font-medium"
                        placeholder="Nhập lời chúc bạn muốn Tiệm nắn nót viết tay..."
                      />
                      {/* Live Handwritten Preview */}
                      <div className="bg-white/90 p-3 rounded-xl border border-dashed border-amber-800/30">
                        <span className="text-[10px] text-stone-400 uppercase font-bold block mb-1">Mẫu chữ viết tay thực tế trên thiệp:</span>
                        <p className="font-handwriting text-lg text-[#6B4226] leading-snug">
                          "{cardMessage || 'Lời chúc ấm áp từ trái tim...'}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Option: Custom Name Embroidery */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-[#FBF7F0] border border-cozy-border cursor-pointer hover:bg-[#F8EFE5] transition">
                    <input 
                      type="checkbox" 
                      checked={embroideryOption}
                      onChange={(e) => setEmbroideryOption(e.target.checked)}
                      className="mt-0.5 rounded text-cozy-primary focus:ring-cozy-primary accent-[#D47343]"
                    />
                    <div className="text-xs flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cozy-text">Thêu tên người thương lên bàn chân bé gấu</span>
                        <span className="text-cozy-primary font-bold text-xs">+30.000đ</span>
                      </div>
                      <p className="text-[11px] text-cozy-text/65 mt-0.5">Kỷ niệm độc bản thêu tay chỉ nổi màu caramel.</p>

                      {embroideryOption && (
                        <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={embroideryName}
                            onChange={(e) => setEmbroideryName(e.target.value)}
                            placeholder="Nhập tên hoặc biệt danh cần thêu (tối đa 10 ký tự)..."
                            maxLength={10}
                            className="w-full bg-white border border-cozy-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cozy-primary"
                          />
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantity Selector & Stock Indicator */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-cozy-text">Số lượng:</span>
                  <div className="flex items-center border border-cozy-border rounded-xl bg-white shadow-xs">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-cozy-text font-bold hover:bg-stone-100 rounded-l-xl transition"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-cozy-text">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-cozy-text font-bold hover:bg-stone-100 rounded-r-xl transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-emerald-700 font-bold">🟢 Còn lại 18 bé</span>
                  <span className="text-[11px] text-cozy-text/60 block">Sẵn sàng ship hỏa tốc</span>
                </div>
              </div>

              {/* ACTION CTA BUTTONS */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleTriggerBuyNow}
                  className="w-full bg-[#6B4226] hover:bg-[#53331c] text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 text-base active:scale-[0.99]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Mua Ngay & Tặng Người Thương ♡</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-[#FAF4EB] text-cozy-text border-2 border-cozy-border py-3.5 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-xs"
                >
                  <Heart className="w-4 h-4 text-cozy-primary" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>
              </div>

              {/* Hotline Quick Consultation */}
              <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-cozy-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-cozy-text">Cần tư vấn trực tiếp kích thước?</p>
                    <p className="text-[11px] text-cozy-text/70">Tiệm gửi ảnh & video chụp thật trước khi ship</p>
                  </div>
                </div>
                <a 
                  href="tel:0901234567" 
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-full font-bold text-[11px] transition shadow-xs"
                >
                  Chat Zalo
                </a>
              </div>

              {/* Guarantees List */}
              <div className="pt-2 border-t border-cozy-border/60 grid grid-cols-2 gap-3 text-[11px] font-semibold text-cozy-text/80">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>Hỏa tốc 2H tại TP.HCM & HN</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>Bảo hành gòn & may trọn đời</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>Đổi trả 7 ngày nếu không êm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>100% Gòn bi 3D tinh khiết</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: CAM KẾT TRỰC QUAN VỀ CHẤT LÔNG & RUỘT BÔNG (3 Feature Cards)
          Theo đúng thiết kế của màn hình Stitch
         ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold tracking-widest text-cozy-secondary uppercase block mb-2">
            AN TÂM TUYỆT ĐỐI KHI ĐẶT HÀNG
          </span>
          <h2 className="text-3xl font-bold text-cozy-text tracking-tight">
            Cam Kết Trực Quan Về Chất Lông & Ruột Bông
          </h2>
          <p className="text-xs text-cozy-text/70 mt-2 font-medium">
            Mỗi bé gấu được chăm chút thủ công như một tác phẩm may mặc cao cấp, an toàn tuyệt đối cho người thân.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-[2rem] p-8 border border-cozy-border shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0E4] text-cozy-primary flex items-center justify-center text-2xl shadow-xs">
              🌾
            </div>
            <h3 className="font-bold text-lg text-cozy-text">
              Không Rụng Lông - Không Kích Ứng
            </h3>
            <p className="text-xs text-cozy-text/75 leading-relaxed font-medium">
              Sợi microfiber xoắn nhiệt 3D thế hệ mới. Khách hàng có thể dùng tay vuốt mạnh, chải lược hay giặt máy mà không rụng bất kỳ sợi lông nào, tuyệt đối không gây hắt hơi hay dị ứng đường hô hấp.
            </p>
            <div className="pt-2 border-t border-cozy-border text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Thử nghiệm chịu lực vuốt 500g đạt chuẩn 100%
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[2rem] p-8 border border-cozy-border shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0E4] text-cozy-primary flex items-center justify-center text-2xl shadow-xs">
              ☁️
            </div>
            <h3 className="font-bold text-lg text-cozy-text">
              100% Gòn Tinh Khiết Kháng Khuẩn
            </h3>
            <p className="text-xs text-cozy-text/75 leading-relaxed font-medium">
              Sử dụng bông gòn hạt bi 3D đàn hồi cao cấp nhập khẩu, trắng muốt tinh khiết. Tuyệt đối nói KHÔNG với vải vụn, tạp chất xốp hay bông tái chế. Ôm cực kỳ êm đầm tay và không bị xẹp vón sau giặt.
            </p>
            <div className="pt-2 border-t border-cozy-border text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Miễn phí dặm gòn bảo hành trọn đời tại tiệm
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[2rem] p-8 border border-cozy-border shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0E4] text-cozy-primary flex items-center justify-center text-2xl shadow-xs">
              🧵
            </div>
            <h3 className="font-bold text-lg text-cozy-text">
              Đường May Giấu Chỉ Chắc Chắn
            </h3>
            <p className="text-xs text-cozy-text/75 leading-relaxed font-medium">
              Kỹ thuật may lộn mép đôi 2 lớp chỉ nylon gia cường. Mắt và mũi gấu được đính chốt chìm bên trong không rơi rớt, an toàn khi trẻ nhỏ cắn hoặc kéo mạnh trong lúc chơi đùa.
            </p>
            <div className="pt-2 border-t border-cozy-border text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Chốt an toàn chìm chịu lực kéo & đứt 15kg
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION: SỢI VELVET TƠ MỊN & BẢNG KẾT QUẢ TIÊU CHUẨN KIỂM ĐỊNH
          Khối chi tiết sâu theo Stitch screen
         ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="bg-[#F8EFE5] rounded-[2.5rem] p-8 md:p-12 border border-[#ECD9C5] shadow-xs">
          
          {/* Section Navigation Tabs */}
          <div className="flex gap-4 border-b border-[#E0D0C0] pb-4 mb-8">
            <button
              onClick={() => setActiveInfoTab('fur')}
              className={`font-bold text-sm pb-2 transition relative ${
                activeInfoTab === 'fur'
                  ? 'text-cozy-text border-b-2 border-cozy-primary'
                  : 'text-cozy-text/60 hover:text-cozy-text'
              }`}
            >
              Chất Liệu Sợi Velvet Tơ Mịn
            </button>
            <button
              onClick={() => setActiveInfoTab('standards')}
              className={`font-bold text-sm pb-2 transition relative ${
                activeInfoTab === 'standards'
                  ? 'text-cozy-text border-b-2 border-cozy-primary'
                  : 'text-cozy-text/60 hover:text-cozy-text'
              }`}
            >
              Bảng Tiêu Chuẩn & Kiểm Định An Toàn
            </button>
            <button
              onClick={() => setActiveInfoTab('care')}
              className={`font-bold text-sm pb-2 transition relative ${
                activeInfoTab === 'care'
                  ? 'text-cozy-text border-b-2 border-cozy-primary'
                  : 'text-cozy-text/60 hover:text-cozy-text'
              }`}
            >
              Hướng Dẫn Giặt Sấy Tại Nhà
            </button>
          </div>

          {/* Tab 1: Fur Texture & Sensory Experience */}
          {activeInfoTab === 'fur' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="bg-[#FAF4EB] text-cozy-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
                  Cảm Nhận Xúc Giác Thực Tế
                </span>
                <h3 className="text-3xl font-bold text-cozy-text mb-4">
                  Sợi Velvet Tơ Mịn - Chạm Là Thấy Ấm Áp
                </h3>
                <p className="text-sm text-cozy-text/80 leading-relaxed font-medium mb-4">
                  Khác với những loại gấu bông phủ lông thô cứng trên thị trường, Bé Gấu Chơi Nơ Ca-Rô sở hữu lớp lông dệt từ sợi microfiber velvet xoắn nhẹ mô phỏng cảm giác mềm mại như lông cừu non mùa thu.
                </p>
                <p className="text-sm text-cozy-text/80 leading-relaxed font-medium mb-6">
                  Khi chạm tay vào, bạn sẽ cảm nhận được độ mát dịu ban đầu của sợi tơ, sau đó giữ lại hơi ấm cơ thể nhanh chóng. Bé gấu không hề tạo ra hiện tượng tĩnh điện châm chích khó chịu trong thời tiết hanh khô.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-cozy-text">
                    <span className="w-6 h-6 rounded-full bg-cozy-primary text-white flex items-center justify-center text-[11px]">✓</span>
                    <span>Mật độ dệt: 14.500 sợi tơ xoắn trên mỗi cm²</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-cozy-text">
                    <span className="w-6 h-6 rounded-full bg-cozy-primary text-white flex items-center justify-center text-[11px]">✓</span>
                    <span>Hương thơm tự nhiên: Ủ tinh dầu cúc la mã hữu cơ kháng khuẩn</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-cozy-text">
                    <span className="w-6 h-6 rounded-full bg-cozy-primary text-white flex items-center justify-center text-[11px]">✓</span>
                    <span>Vải nơ cổ: Cotton dệt sợi nhuộm mộc, không phai màu khi giặt</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-sm">
                <h4 className="font-bold text-sm text-cozy-text mb-4 flex items-center gap-2">
                  <span>🔬</span> Thước Đo Thông Số Kiểm Định Tiêu Chuẩn
                </h4>
                
                <div className="space-y-4 text-xs font-medium">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Độ mềm mịn cảm quan</span>
                      <strong className="text-cozy-primary">9.9 / 10</strong>
                    </div>
                    <div className="w-full bg-[#FAF0E4] h-2 rounded-full overflow-hidden">
                      <div className="bg-cozy-primary h-full w-[99%] rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Tỷ lệ rụng lông khi vuốt chải</span>
                      <strong className="text-emerald-700">0.00% (Tuyệt đối an toàn)</strong>
                    </div>
                    <div className="w-full bg-[#FAF0E4] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[100%] rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Độ phục hồi form sau 5.000 lần ôm ép</span>
                      <strong className="text-cozy-primary">98.5%</strong>
                    </div>
                    <div className="w-full bg-[#FAF0E4] h-2 rounded-full overflow-hidden">
                      <div className="bg-cozy-primary h-full w-[98.5%] rounded-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Chỉ số an toàn da liễu cho trẻ sơ sinh</span>
                      <strong className="text-emerald-700">Đạt chuẩn OEKO-TEX Standard 100</strong>
                    </div>
                    <div className="w-full bg-[#FAF0E4] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[100%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Standards Table */}
          {activeInfoTab === 'standards' && (
            <div className="bg-white rounded-3xl p-6 border border-cozy-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cozy-border text-cozy-text/70 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Hạng Mục Thử Nghiệm</th>
                    <th className="py-3 px-4">Tiêu Chuẩn Tiệm Gấu Bông HD</th>
                    <th className="py-3 px-4">Gấu Bông Trôi Nổi Trên Thị Trường</th>
                    <th className="py-3 px-4">Kết Quả Đánh Giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cozy-border/60 font-medium">
                  <tr>
                    <td className="py-3 px-4 font-bold">Chất liệu lông bề mặt</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">Sợi Velvet Microfiber dệt nhiệt</td>
                    <td className="py-3 px-4 text-stone-500">Lông nỉ tái chế bám bụi</td>
                    <td className="py-3 px-4 text-cozy-primary font-bold">Xuất Sắc</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">Độ rụng lông khi chải</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">0.00% (Không đứt gãy sợi)</td>
                    <td className="py-3 px-4 text-rose-600">Rụng nhiều, dễ bay vào mũi</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">An Toàn Tuyệt Đối</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">Ruột nhồi bên trong</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">100% Gòn hạt bi 3D trắng loại A</td>
                    <td className="py-3 px-4 text-rose-600">Pha vải vụn, xốp phế liệu</td>
                    <td className="py-3 px-4 text-cozy-primary font-bold">Đạt Chuẩn Y Tế</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">Hàm lượng Formaldehyde</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">0 ppm (Không phát hiện)</td>
                    <td className="py-3 px-4 text-rose-600">Thường có mùi hóa chất nồng</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">Đạt Chuẩn Trẻ Em</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">Độ bền đường chỉ may</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">Chỉ nylon kép lộn mép giấu mối</td>
                    <td className="py-3 px-4 text-stone-500">May 1 lớp dễ bục chỉ khi kéo</td>
                    <td className="py-3 px-4 text-cozy-primary font-bold">Bảo Hành Trọn Đời</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Care Instructions */}
          {activeInfoTab === 'care' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-cozy-border">
                <div className="text-xl mb-2">🧺</div>
                <h4 className="font-bold text-sm text-cozy-text mb-1">Giặt Máy Dễ Dàng</h4>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium">
                  Bỏ bé gấu vào túi giặt lưới, chọn chế độ giặt nhẹ với nước lạnh hoặc nước ấm dưới 30°C. Bé sẽ thơm tho sạch sẽ mà không bao giờ xù lông.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-cozy-border">
                <div className="text-xl mb-2">☀️</div>
                <h4 className="font-bold text-sm text-cozy-text mb-1">Phơi Nơi Thoáng Gió</h4>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium">
                  Phơi bé gấu dưới ánh nắng nhẹ buổi sáng hoặc nơi lộng gió. Vỗ nhẹ vào thân bé để các hạt gòn bi 3D nở phồng căng tròn như mới mua.
                </p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-cozy-border">
                <div className="text-xl mb-2">🧸</div>
                <h4 className="font-bold text-sm text-cozy-text mb-1">Dặm Gòn Miễn Phí</h4>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium">
                  Bất cứ khi nào sau nhiều năm ôm ngủ, bạn có thể ghé Studio Tiệm Gấu Bông HD để được dặm thêm gòn bi tinh khiết hoàn toàn miễn phí trọn đời.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          SECTION: NHỮNG BÉ GẤU CÙNG BỘ SƯU TẬP (RELATED BEARS CAROUSEL)
         ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-cozy-secondary uppercase block mb-1">
              KHÁM PHÁ THÊM NGƯỜI BẠN MÙA THU
            </span>
            <h2 className="text-2xl font-bold text-cozy-text">
              Những Bé Gấu Cùng Bộ Sưu Tập
            </h2>
          </div>
          <button 
            onClick={onBackToCollection}
            className="text-xs font-bold text-cozy-primary hover:text-cozy-text flex items-center gap-1 transition"
          >
            Xem toàn bộ 10 mẫu thu <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedBears.map((bear) => (
            <div 
              key={bear.id}
              onClick={() => onSelectProduct && onSelectProduct(bear)}
              className="bg-white rounded-3xl p-4 border border-cozy-border hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col"
            >
              <div className="rounded-2xl overflow-hidden mb-4 relative h-60 bg-[#FAF4EB]">
                <span className="absolute top-3 left-3 z-10 bg-cozy-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {bear.tag}
                </span>
                <img 
                  src={bear.image} 
                  alt={bear.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-bold text-cozy-text">{bear.rating}</span>
                  <span className="text-stone-400 text-[10px]">({bear.reviews} đánh giá)</span>
                </div>
                <h4 className="font-bold text-sm text-cozy-text mb-1 line-clamp-1 group-hover:text-cozy-primary transition">
                  {bear.name}
                </h4>
                <p className="text-[11px] text-cozy-text/60 mb-3 line-clamp-1 font-medium">
                  {bear.furDesc}
                </p>

                <div className="mt-auto flex justify-between items-center pt-2 border-t border-cozy-border/60">
                  <div>
                    <span className="font-bold text-sm text-cozy-primary">
                      {bear.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-[11px] text-stone-400 line-through ml-1.5">
                      {bear.oldPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) {
                        onAddToCart({
                          id: bear.id,
                          name: bear.name,
                          price: bear.price,
                          image: bear.image,
                          size: bear.size,
                          tag: bear.badge
                        }, 1);
                      } else if (onOrderProduct) {
                        onOrderProduct(bear);
                      }
                    }}
                    className="p-2 bg-[#FAF4EB] hover:bg-cozy-primary hover:text-white rounded-xl transition text-cozy-text shadow-xs cursor-pointer"
                    title="Nhặt bé gấu vào combo"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION: ĐÁNH GIÁ THỰC TẾ KÈM ẢNH UNBOX TỪ KHÁCH HÀNG (295 Đánh giá)
         ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-cozy-border shadow-sm">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-cozy-border">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-cozy-secondary uppercase block mb-1">
                PHẢN HỒI CHÂN THỰC
              </span>
              <h2 className="text-2xl font-bold text-cozy-text">
                Khách Hàng Nói Gì Về Lông & Kích Thước Bé Gấu?
              </h2>
              <p className="text-xs text-cozy-text/60 mt-1 font-medium">
                100% đánh giá từ khách hàng đã đặt hàng và chụp ảnh unbox tại nhà
              </p>
            </div>

            <div className="flex items-center gap-6 bg-[#FAF4EB] p-4 rounded-2xl border border-cozy-border">
              <div className="text-center">
                <span className="text-3xl font-bold text-cozy-primary block leading-none">5.0</span>
                <div className="flex text-amber-500 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-cozy-text/60 font-semibold block mt-1">295 đánh giá</span>
              </div>
              <div className="w-[1px] h-10 bg-cozy-border"></div>
              <div className="text-xs space-y-1 font-medium text-cozy-text/80">
                <p>• <strong>99.4%</strong> hài lòng tuyệt đối về độ mềm của lông</p>
                <p>• <strong>98.7%</strong> xác nhận kích thước chuẩn thước đo</p>
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-cozy-border/70 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 font-bold flex items-center justify-center text-xs">
                    LH
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-cozy-text">Lê Hoàng Mai</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Đã mua bé size 50cm</span>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">2 ngày trước</span>
              </div>

              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>

              <p className="text-xs text-cozy-text/85 leading-relaxed font-medium">
                "Thực sự mê lông của bé này xỉu up xỉu down! Mình bị viêm mũi dị ứng rất sợ gấu rụng bụi lông, mà bé này vuốt chải mạnh không hề rơi 1 sợi nào luôn. Size 50cm ôm ngủ vừa khít trong lòng, nơ ca-rô vintage thêu rất khéo."
              </p>

              <div className="pt-2 flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=120&q=80" 
                  alt="Review photo 1" 
                  className="w-14 h-14 rounded-xl object-cover border border-cozy-border" 
                />
                <img 
                  src="https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=120&q=80" 
                  alt="Review photo 2" 
                  className="w-14 h-14 rounded-xl object-cover border border-cozy-border" 
                />
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-cozy-border/70 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center text-xs">
                    TH
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-cozy-text">Trần Hoài Nam</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Đã mua bé size 70cm tặng bạn gái</span>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">5 ngày trước</span>
              </div>

              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>

              <p className="text-xs text-cozy-text/85 leading-relaxed font-medium">
                "Mình mua size 70cm làm quà sinh nhật cho bạn gái. Hộp quà Kraft đóng nơ lụa siêu chỉn chu, thiệp tay tiệm viết chữ nắn nót rất có hồn. Gấu to ôm trọn người, bông gòn bi đàn hồi êm đầm chứ không bị nhão. 10/10 điểm!"
              </p>

              <div className="pt-2 flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=120&q=80" 
                  alt="Review photo 3" 
                  className="w-14 h-14 rounded-xl object-cover border border-cozy-border" 
                />
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-cozy-border/70 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-200 text-teal-800 font-bold flex items-center justify-center text-xs">
                    MN
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-cozy-text">Minh Ngọc</h5>
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Đã mua bé size 35cm</span>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">1 tuần trước</span>
              </div>

              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-current" />
                ))}
              </div>

              <p className="text-xs text-cozy-text/85 leading-relaxed font-medium">
                "Size 35cm bỏ vừa vặn balo đi học và đi cafe chụp ảnh luôn nha mọi người. Mùi tinh dầu cúc la mã tiệm xịt thơm thoang thoảng rất thư giãn. Đường may lộn giấu chỉ kỹ càng, bé gấu tròn trịa cưng xỉu."
              </p>

              <div className="pt-2 flex items-center gap-2">
                <img 
                  src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=120&q=80" 
                  alt="Review photo 4" 
                  className="w-14 h-14 rounded-xl object-cover border border-cozy-border" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FULLSCREEN MODAL (Phóng to ảnh xem chi tiết lông) ================= */}
      {isFullscreenModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              onClick={() => setIsFullscreenModalOpen(false)}
              className="absolute -top-12 right-0 bg-white/20 text-white hover:bg-white/40 p-2 rounded-full transition text-sm font-bold flex items-center gap-1.5"
            >
              ✕ Đóng xem ảnh
            </button>
            <img 
              src={currentProd.gallery[activeImageIndex].url} 
              alt={currentProd.gallery[activeImageIndex].title}
              className="max-h-[82vh] w-auto object-contain rounded-2xl shadow-2xl" 
            />
            <div className="text-white text-center mt-3 text-sm font-medium">
              {currentProd.gallery[activeImageIndex].title} — {currentProd.gallery[activeImageIndex].desc}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
