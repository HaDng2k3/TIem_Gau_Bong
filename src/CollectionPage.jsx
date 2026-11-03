import React, { useState, useEffect, useMemo } from 'react';
import { Search, Heart, User, ShoppingBag, ArrowRight, PackageOpen, PenTool, Truck, ChevronDown, Star, Plus, Check, X, RefreshCw } from 'lucide-react';
import { useWishlist } from './context/WishlistContext';
import * as api from './services/api';

const SIZE_FILTERS = ['all', '25cm', '40cm', '55cm'];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Phổ biến nhất' },
  { id: 'rating', label: 'Đánh giá cao nhất' },
  { id: 'price-asc', label: 'Giá: thấp → cao' },
  { id: 'price-desc', label: 'Giá: cao → thấp' }
];

const FAQ_ITEMS = [
  {
    q: '1. Tôi có thể tự giặt bé gấu bông tại nhà như thế nào?',
    a: 'Bạn giặt tay bằng nước ấm dưới 30°C với một chút nước giặt dịu nhẹ, bóp nhẹ (không vắt xoắn), sau đó cuộn khăn bông thấm bớt nước và phơi nơi thoáng mát, tránh nắng gắt. Khi khô, vỗ nhẹ để gòn phồng lại. Gấu có phụ kiện thêu/len nên dùng túi giặt hoặc dịch vụ giặt gấu của tiệm.'
  },
  {
    q: '2. Tiệm viết tay thiệp tặng quà có tính thêm phí không?',
    a: 'Hoàn toàn miễn phí! Mọi đơn hàng đều được tiệm nắn nót viết tay thiệp Kraft bằng mực nâu theo lời nhắn bạn nhập ở bước đặt hàng.'
  },
  {
    q: '3. Chính sách đổi trả sản phẩm trong 7 ngày diễn ra như thế nào?',
    a: 'Trong 7 ngày kể từ khi nhận hàng, nếu bé gấu bị lỗi đường may, bung chỉ hoặc không đúng mẫu, bạn liên hệ hotline 1900 8556 kèm ảnh/video mở hộp. Tiệm sẽ đổi mới miễn phí và chịu phí vận chuyển hai chiều.'
  },
  {
    q: '4. Giao hàng hỏa tốc 2 giờ áp dụng ở những khu vực nào?',
    a: 'Giao hỏa tốc 2H (+30.000đ) áp dụng cho các quận nội thành Hà Nội và TP. Hồ Chí Minh, với đơn đặt từ 08:30 đến 19:30 hằng ngày. Các khu vực khác giao tiêu chuẩn 2–4 ngày.'
  }
];

// Dữ liệu dự phòng mặc định phòng khi mất kết nối mạng
const DEFAULT_PRODUCTS = [
  { id: 'prod-1', name: 'Teddy Mùa Thu Quàng Khăn Len', category: 'Gấu Teddy', price: 395000, tag: 'Best Seller', rating: '5.0', reviews: 142, size: '40cm', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-5', name: 'Gấu Chơi Nơ Ca-Rô Cổ Điển', category: 'Gấu Teddy', price: 320000, tag: 'Best Seller', rating: '5.0', reviews: 295, size: '40cm', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-6', name: 'Gấu Bí Ngô Thêu Tay Mùa Vàng', category: 'Gấu Teddy Mùa Thu', price: 295000, tag: 'Phiên bản giới hạn', rating: '4.9', reviews: 184, size: '25cm', image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-7', name: 'Gấu Cây Sồi Nâu Rêu Vintage', category: 'Gấu Teddy Mùa Thu', price: 380000, tag: 'Độc Quyền', rating: '4.9', reviews: 84, size: '55cm', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-8', name: 'Thỏ Bông Biscuit Váy Yếm Hồng', category: 'Thỏ Bông Biscuit', price: 285000, tag: 'Best Seller', rating: '5.0', reviews: 112, size: '40cm', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-9', name: 'Gấu Ôm Khổng Lồ 1m6 Nâu Caramel', category: 'Gấu Ôm Khổng Lồ', price: 790000, tag: 'Cỡ Đại', rating: '5.0', reviews: 76, size: '55cm', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-2', name: 'Giftbox Teddy Nâu Vintage (Kèm Thiệp)', category: 'Combo Quà & Thiệp', price: 345000, tag: 'Hot Trend', rating: '4.9', reviews: 98, size: '40cm', image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-3', name: 'Gấu Trúc Mũm Mĩm Nằm Ngủ', category: 'Búp Bê & Khác', price: 280000, tag: 'Mới Về', rating: '4.8', reviews: 64, size: '25cm', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80' },
  { id: 'prod-4', name: 'Bé Cún Bông Bơ Sữa Tai Cụp', category: 'Búp Bê & Khác', price: 245000, tag: 'Chỉ còn 3 bé', rating: '4.9', reviews: 53, size: '25cm', image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80' }
];

// Hàm bỏ dấu tiếng Việt để tìm kiếm không dấu
const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

const parsePrice = (p) => parseInt(String(p).replace(/\D/g, ''), 10) || 0;

export default function CollectionPage({
  onOrderProduct,
  onAddToCart,
  onViewProductDetail,
  initialSearch = '',
  initialCategory = 'all',
  focusSection = null
}) {
  const [cardMessage, setCardMessage] = useState("Gửi một cái ôm ấm áp cho những mùa thu đến người đặc biệt nhất của mình...");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'all');
  const [activeSize, setActiveSize] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchText, setSearchText] = useState(initialSearch);
  const [dbProducts, setDbProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Tải danh sách sản phẩm và danh mục thực tế từ backend
  const fetchProductsAndCategories = async () => {
    try {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      if (Array.isArray(prods) && prods.length > 0) {
        setDbProducts(prods);
      }
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm BST:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Đồng bộ category khi nhận prop mới (VD: click menu "Gấu Teddy" hoặc "BST Mùa Thu")
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Đồng bộ từ khóa tìm kiếm từ thanh tìm kiếm trên header
  useEffect(() => {
    setSearchText(initialSearch);
  }, [initialSearch]);

  // Cuộn tới khu vực được yêu cầu (VD: "Quà Tặng & Thiệp" trên menu)
  useEffect(() => {
    if (!focusSection) return;
    const t = setTimeout(() => {
      document.getElementById(focusSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(t);
  }, [focusSection]);

  // Chuẩn hóa danh sách sản phẩm kết hợp DB và fallback
  const allProducts = useMemo(() => {
    const list = dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS;
    return list.map((item, idx) => {
      const priceNum = typeof item.price === 'number'
        ? item.price
        : parseInt(String(item.price).replace(/\D/g, ''), 10) || 320000;
      const formattedPrice = `${priceNum.toLocaleString('vi-VN')}đ`;

      // Tự động nhận diện size nếu sản phẩm chưa có thuộc tính size
      let derivedSize = item.size || '40cm';
      const lowerName = (item.name || '').toLowerCase();
      if (lowerName.includes('1m6') || lowerName.includes('khổng lồ') || lowerName.includes('55cm')) {
        derivedSize = '55cm';
      } else if (lowerName.includes('mini') || lowerName.includes('25cm') || lowerName.includes('nhỏ')) {
        derivedSize = '25cm';
      }

      return {
        id: item.id || `prod-col-${idx + 1}`,
        name: item.name,
        price: formattedPrice,
        rawPrice: priceNum,
        originalPrice: item.originalPrice
          ? (typeof item.originalPrice === 'number' ? `${item.originalPrice.toLocaleString('vi-VN')}đ` : item.originalPrice)
          : '',
        tag: item.tag || 'Mới về',
        tagColor: item.tagColor || 'bg-cozy-secondary',
        rating: item.rating ? String(item.rating) : '5.0',
        reviews: typeof item.reviews === 'number' ? item.reviews : 85,
        category: item.category || 'Gấu Teddy',
        size: derivedSize,
        img: item.image || item.img || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
        description: item.description || 'Bé gấu xinh xắn, ruột gòn tinh khiết 100%.',
        stock: item.stock !== undefined ? item.stock : 15,
        idx
      };
    });
  }, [dbProducts]);

  // Danh sách các tab bộ lọc danh mục động
  const categoryFilterList = useMemo(() => {
    const filters = [{ id: 'all', label: '🔥 Tất cả sản phẩm' }];
    const addedNames = new Set(['all']);

    // Luôn đưa danh mục 'Gấu Teddy' lên đầu danh sách bộ lọc
    filters.push({ id: 'Gấu Teddy', label: '🧸 Gấu Teddy' });
    addedNames.add('gấu teddy');

    // Thêm các danh mục khác từ API / DB
    categories.forEach(c => {
      const name = c.name?.trim();
      if (name && !addedNames.has(name.toLowerCase())) {
        addedNames.add(name.toLowerCase());
        let icon = '🧸';
        const lower = name.toLowerCase();
        if (lower.includes('thỏ')) icon = '🐰';
        else if (lower.includes('khổng lồ')) icon = '🐻';
        else if (lower.includes('combo') || lower.includes('quà')) icon = '🎁';
        else if (lower.includes('khăn len')) icon = '🧣';
        else if (lower.includes('thêu')) icon = '🌻';
        filters.push({ id: name, label: `${icon} ${name}` });
      }
    });

    // Thêm các category phát sinh từ sản phẩm nếu chưa có trong danh sách
    allProducts.forEach(p => {
      const name = p.category?.trim();
      if (name && !addedNames.has(name.toLowerCase())) {
        addedNames.add(name.toLowerCase());
        filters.push({ id: name, label: `🧸 ${name}` });
      }
    });

    return filters;
  }, [categories, allProducts]);

  // Lọc sản phẩm theo danh mục, kích thước, tìm kiếm và sắp xếp
  const visibleProducts = useMemo(() => {
    const raw = searchText.trim();
    const q = raw.toLowerCase();
    const qNorm = removeVietnameseTones(raw);

    let list = allProducts.filter((p) => {
      // 1. Bộ lọc danh mục (Hỗ trợ chuẩn xác Gấu Teddy & các danh mục khác)
      if (activeCategory !== 'all') {
        const cat = (p.category || '').toLowerCase();
        const activeLower = activeCategory.toLowerCase();
        const pName = (p.name || '').toLowerCase();

        if (activeLower === 'gấu teddy' || activeLower === 'teddy') {
          // Khớp cả 'Gấu Teddy', 'Gấu Teddy Mùa Thu' hoặc tên chứa 'teddy'
          const isTeddy = cat.includes('teddy') || pName.includes('teddy') || cat === 'gấu teddy';
          if (!isTeddy) return false;
        } else {
          // Khớp danh mục cụ thể khác
          const matchCat = cat === activeLower || cat.includes(activeLower) || activeLower.includes(cat);
          if (!matchCat) return false;
        }
      }

      // 2. Bộ lọc kích thước
      if (activeSize !== 'all' && p.size !== activeSize) {
        return false;
      }

      // 3. Tìm kiếm theo tên hoặc tag
      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          removeVietnameseTones(p.name).includes(qNorm) ||
          removeVietnameseTones(p.tag).includes(qNorm);
        if (!match) return false;
      }

      return true;
    });

    // 4. Sắp xếp
    if (sortBy === 'popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    if (sortBy === 'rating') list = [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) || b.reviews - a.reviews);
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.rawPrice - b.rawPrice);
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.rawPrice - a.rawPrice);

    return list;
  }, [allProducts, activeCategory, activeSize, sortBy, searchText]);

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveSize('all');
    setSortBy('popular');
    setSearchText('');
  };

  return (
    <div className="bg-[#FAF4EB] min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 pt-8 pb-12">
        <div className="bg-[#F8EFE5] rounded-[2rem] p-6 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="max-w-2xl relative z-10">
            <div className="bg-cozy-secondary text-white font-bold text-xs px-4 py-2 rounded-full inline-block mb-6 uppercase tracking-wider shadow-sm">
              {activeCategory === 'Gấu Teddy Mùa Thu'
                ? '✨ Phiên Bản Mùa Thu 2024 • Số Lượng Giới Hạn'
                : activeCategory === 'Gấu Teddy'
                ? '🧸 Dòng Gấu Bông Cổ Điển & Quàng Khăn'
                : '✨ Kho Gấu Bông & Quà Tặng Thủ Công • Đầy Đủ Mẫu Mã'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-cozy-text mb-6 leading-tight">
              {activeCategory === 'Gấu Teddy Mùa Thu'
                ? 'BST Mùa Thu: Khúc Ca Lá Vàng'
                : activeCategory === 'Gấu Teddy'
                ? 'Gấu Teddy Cổ Điển & Mùa Thu'
                : activeCategory === 'all'
                ? 'Tất Cả Sản Phẩm Của Tiệm'
                : `Sản Phẩm: ${activeCategory}`}
            </h1>
            <p className="text-cozy-text/70 text-base sm:text-lg mb-10 leading-relaxed font-medium">
              {activeCategory === 'all'
                ? 'Khám phá trọn bộ các bé gấu bông mềm mịn, thú nhồi bông thủ công và combo quà tặng thiệp viết tay ấm áp được tuyển chọn tỉ mỉ tại Tiệm Gấu Bông HD.'
                : 'Đón chào mùa se lạnh với những người bạn gấu nhồi bông thủ công ấm áp. Từng sợi bông êm ái, chiếc nơ ca-rô cổ điển và họa tiết thêu tỉ mỉ được chắt chiu từ hơi thở ấm nóng của lò sưởi, hạt dẻ và tách trà quế.'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <PackageOpen className="w-5 h-5 text-cozy-primary"/>, t: 'Hộp quà Kraft vintage', d: 'Êm ái & phong cách' },
                { icon: <PenTool className="w-5 h-5 text-cozy-primary"/>, t: 'Thiệp viết tay cổ điển', d: 'Nắn nót từng lời chúc' },
                { icon: <Heart className="w-5 h-5 text-cozy-primary"/>, t: 'Bông gòn 3D tinh khiết', d: 'Chống khuẩn, không xẹp' },
                { icon: <Truck className="w-5 h-5 text-cozy-primary"/>, t: 'Hỏa tốc 2 giờ kèm ảnh', d: 'Check bé gấu trước giao' },
              ].map((f, i) => (
                <div key={i} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-white">
                  <div className="mb-3">{f.icon}</div>
                  <div className="font-bold text-sm mb-1">{f.t}</div>
                  <div className="text-[10px] text-cozy-text/60 font-medium">{f.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="relative z-10 w-full max-w-[450px] aspect-square cursor-pointer"
            onClick={() => onViewProductDetail && onViewProductDetail({
              name: 'Bé Gấu Chơi Nơ Ca-Rô',
              basePrice: 340000,
              image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80'
            })}
          >
             <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover rounded-[2rem] shadow-2xl rotate-2 hover:scale-[1.02] transition duration-300" alt="Hero Bear" />
             <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex justify-between items-center border border-white">
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">Thiết Kế Tiêu Biểu Mùa Thu</p>
                  <p className="font-bold text-lg text-cozy-text">Bé Gấu Chơi Nơ Ca-Rô</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewProductDetail) onViewProductDetail({
                      name: 'Bé Gấu Chơi Nơ Ca-Rô',
                      basePrice: 340000,
                      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80'
                    });
                  }}
                  className="bg-cozy-secondary hover:bg-cozy-primary text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition"
                >
                  Xem Chi Tiết & Kích Thước →
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-cozy-border pb-6">
        
        {/* Dynamic Category Tabs */}
        <div className="flex gap-2.5 flex-wrap items-center">
          {categoryFilterList.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveCategory(g.id)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCategory === g.id
                  ? 'bg-cozy-text text-white shadow-md'
                  : 'bg-white text-cozy-text border border-cozy-border hover:bg-cozy-bg'
              }`}
            >
              <span>{g.label}</span>
              {activeCategory === g.id && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full ml-1">
                  {visibleProducts.length}
                </span>
              )}
            </button>
          ))}

          {/* Refresh Button */}
          <button
            onClick={() => fetchProductsAndCategories()}
            className="p-2 rounded-full bg-white border border-cozy-border text-[#6B4226] hover:text-[#C25E2E] hover:rotate-180 transition-all duration-300 shadow-2xs"
            title="Làm mới danh sách sản phẩm từ quản trị"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C25E2E]' : ''}`} />
          </button>
        </div>

        {/* Search, Size & Sort */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm trong BST..."
              className="bg-white border border-cozy-border rounded-full pl-9 pr-8 py-2 text-sm font-medium focus:outline-none focus:border-cozy-primary w-48"
            />
            {searchText && (
              <button onClick={() => setSearchText('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-cozy-text cursor-pointer" title="Xóa tìm kiếm">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500">Size:</span>
            <div className="bg-white border border-cozy-border rounded-full p-1 flex">
              {SIZE_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSize(s)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    activeSize === s ? 'bg-cozy-text text-white' : 'text-gray-500 hover:text-cozy-text'
                  }`}
                >
                  {s === 'all' ? 'Tất cả' : s}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-cozy-border pl-4 pr-9 py-2 rounded-full text-sm font-bold cursor-pointer focus:outline-none focus:border-cozy-primary"
              aria-label="Sắp xếp sản phẩm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-gray-500">
              {activeCategory === 'all' ? 'Tất cả sản phẩm của cửa hàng' : `Danh mục: ${activeCategory}`} ({visibleProducts.length}/{allProducts.length} sản phẩm)
            </p>
            {searchText && (
              <span className="inline-flex items-center gap-1 bg-[#FFF4E5] text-[#C25E2E] px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#FADCC7]">
                Từ khóa: "<strong>{searchText}</strong>"
                <button
                  onClick={() => setSearchText('')}
                  className="hover:text-black cursor-pointer ml-1 text-sm font-bold"
                  title="Xóa tìm kiếm"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-cozy-secondary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cozy-secondary animate-pulse"></span>
            Đang có sẵn tại cửa hàng
          </p>
        </div>

        {visibleProducts.length === 0 && (
          <div className="bg-white border border-dashed border-cozy-border rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">🧸</p>
            <p className="font-bold mb-1">Chưa có bé gấu nào khớp bộ lọc của bạn</p>
            <p className="text-sm text-gray-500 mb-4">Thử đổi danh mục, size hoặc từ khóa khác nhé.</p>
            <button onClick={resetFilters} className="bg-cozy-text text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-cozy-primary transition cursor-pointer">
              Xóa bộ lọc
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {visibleProducts.map((prod) => {
            const i = prod.idx;
            return (
            <div key={prod.id || i} className="bg-white rounded-[1.5rem] p-3 border border-cozy-border hover:shadow-xl hover:-translate-y-1 transition-all group relative flex flex-col">
              <div className="absolute top-5 left-5 z-10 bg-cozy-secondary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                {prod.tag}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist({
                    id: prod.id,
                    name: prod.name,
                    price: prod.rawPrice,
                    tag: prod.tag,
                    image: prod.img
                  });
                }}
                className={`absolute top-5 right-5 z-10 p-2 rounded-full shadow-sm transition cursor-pointer ${
                  isInWishlist(prod.name)
                    ? 'bg-white text-rose-500 fill-rose-500 opacity-100'
                    : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100'
                }`}
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(prod.name) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              
              <div 
                onClick={() => onViewProductDetail && onViewProductDetail({
                  id: prod.id,
                  name: prod.name,
                  basePrice: prod.rawPrice,
                  price: prod.rawPrice,
                  originalPrice: prod.originalPrice,
                  image: prod.img,
                  category: prod.category,
                  tag: prod.tag,
                  description: prod.description
                })}
                className="rounded-xl overflow-hidden mb-4 relative h-48 bg-cozy-bg shrink-0 cursor-pointer"
              >
                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition">
                  🔍 Xem chi tiết & đo size
                </span>
              </div>
              <div className="flex flex-col flex-1 px-1">
                <div className="flex items-center gap-1 text-cozy-secondary mb-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">{prod.rating}</span>
                  <span className="text-[10px] text-gray-400">({prod.reviews} lượt mua)</span>
                </div>
                <h3 
                  onClick={() => onViewProductDetail && onViewProductDetail({
                    id: prod.id,
                    name: prod.name,
                    basePrice: prod.rawPrice,
                    price: prod.rawPrice,
                    originalPrice: prod.originalPrice,
                    image: prod.img,
                    category: prod.category,
                    tag: prod.tag,
                    description: prod.description
                  })}
                  className="font-bold text-sm mb-1 line-clamp-1 cursor-pointer hover:text-cozy-primary transition"
                >
                  {prod.name}
                </h3>
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">
                  {prod.category} • {prod.size}
                </p>
                <div className="flex justify-between items-end mt-auto">
                  <div className="flex flex-col">
                    <span className="text-cozy-primary font-bold">{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {prod.originalPrice}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      const prodData = { 
                        id: prod.id, 
                        name: prod.name, 
                        price: prod.rawPrice, 
                        image: prod.img,
                        tag: prod.tag,
                        size: prod.size,
                        category: prod.category
                      };
                      if (onAddToCart) {
                        onAddToCart(prodData, 1);
                      } else if (onOrderProduct) {
                        onOrderProduct(prodData);
                      }
                    }} 
                    className="bg-cozy-text text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cozy-primary transition flex items-center gap-1 shadow-sm cursor-pointer"
                    title="Nhặt bé gấu vào combo quà"
                  >
                    <Plus className="w-3 h-3"/> Nhặt combo
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* Upsell Banner & Preview */}
      <section id="qua-tang-thiep" className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 scroll-mt-24">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 flex flex-col lg:flex-row gap-10 lg:gap-16 shadow-xl border border-cozy-border">
          <div className="flex-1">
            <div className="bg-cozy-bg text-cozy-text font-bold text-xs px-3 py-1.5 rounded-md inline-block mb-6 border border-cozy-border">
              🎁 Đặc Quyền Quà Tặng Mùa Thu
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">Gói Trọn Yêu Thương Trong<br/>Từng Nếp Giấy Kraft</h2>
            <p className="text-cozy-text/70 mb-8 font-medium">
              Mỗi bạn gấu bông gửi đi không đơn thuần là một món quà, mà là chiếc ôm sưởi ấm tâm hồn. Tiệm chăm chút từng chi tiết đóng gói chuẩn aesthetic hoài niệm để người nhận mỉm cười ngay từ giây phút mở hộp.
            </p>
            
            <div className="space-y-6 mb-10">
              {[
                { n: '1', t: 'Hộp quà Kraft cứng cáp nắp gập', d: 'Bảo vệ bé gấu an toàn, thắt nơ ruy băng lụa nâu caramel trang nhã.' },
                { n: '2', t: 'Rơm lót gỗ thông tự nhiên', d: 'Giữ form êm ái kèm lá phong sấy khô thơm thoang thoảng.' },
                { n: '3', t: 'Thiệp viết tay nét chữ cổ điển', d: 'Tiệm hỗ trợ viết nắn nót từng dòng chúc bằng mực nâu ấm áp.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-cozy-secondary text-white flex justify-center items-center font-bold shrink-0 shadow-sm">{item.n}</div>
                  <div>
                    <h4 className="font-bold mb-1">{item.t}</h4>
                    <p className="text-sm text-gray-500">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                const boxItem = {
                  id: 'giftbox-kraft-combo',
                  name: 'Combo Hộp Quà Kraft Vintage + Thiệp Viết Tay',
                  price: 45000,
                  size: 'Full combo quà',
                  tag: 'Đặc Quyền',
                  image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=400&q=80'
                };
                if (onAddToCart) {
                  onAddToCart(boxItem, 1);
                } else if (onOrderProduct) {
                  onOrderProduct(boxItem);
                }
              }}
              className="bg-cozy-text text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-cozy-primary transition flex items-center gap-3 cursor-pointer"
            >
              <PackageOpen className="w-5 h-5"/> Thêm combo hộp quà (+45.000đ)
            </button>
            <p className="text-xs text-gray-400 mt-3 font-medium italic">* Miễn phí giao hàng tiêu chuẩn cho đơn từ 500.000đ</p>
          </div>
          
          <div className="flex-1 bg-cozy-bg rounded-[2rem] p-8 border border-cozy-border relative">
             <div className="text-xs font-bold text-gray-400 mb-6 flex justify-between items-center">
               <span>✨ XEM TRƯỚC THIỆP VIẾT TAY VINTAGE</span>
               <span>Mẫu thiệp Kraft cổ điển</span>
             </div>
             
             <div className="mb-6">
                <label className="block text-sm font-bold mb-2">Lời nhắn nhủ của bạn tới người thương:</label>
                <textarea 
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full bg-white border border-cozy-border rounded-xl p-4 h-24 focus:outline-none focus:border-cozy-primary resize-none text-sm font-medium"
                ></textarea>
             </div>

             <div className="bg-[#EAE0D5] p-6 rounded-xl shadow-inner relative">
                <div className="text-[10px] text-gray-500 font-bold mb-2 uppercase flex justify-between">
                  Preview thiệp thực tế: <Heart className="w-3 h-3 text-gray-400"/>
                </div>
                <div className="bg-white p-6 rounded shadow-md transform rotate-1 relative">
                  <div className="absolute top-0 bottom-0 left-4 w-px bg-blue-100"></div>
                  <div className="absolute top-0 bottom-0 left-5 w-px bg-blue-100"></div>
                  <p className="font-handwriting text-2xl leading-relaxed text-cozy-text min-h-[100px] relative z-10">
                    {cardMessage}
                  </p>
                  <div className="text-right mt-4 relative z-10 text-[10px] text-gray-400 font-bold">From: Tiệm Gấu Bông HD với yêu thương 🍂</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-8 py-16 text-center">
        <p className="text-xs font-bold text-cozy-secondary mb-2 uppercase tracking-widest">HỎI ĐÁP CÙNG TIỆM</p>
        <h2 className="text-3xl font-bold mb-3">Những Điều Bạn Thường Băn Khoăn</h2>
        <p className="text-gray-500 mb-10">Tất tần tật thắc mắc về các bé gấu mùa thu và dịch vụ tại Tiệm Gấu Bông HD</p>

        <div className="space-y-4 text-left">
          {FAQ_ITEMS.map((item, i) => (
             <div key={i} className="bg-white border border-cozy-border rounded-xl hover:shadow-md transition">
               <button
                 type="button"
                 className="w-full p-5 cursor-pointer flex justify-between items-center gap-4 text-left"
                 onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                 aria-expanded={activeFaq === i}
               >
                 <span className="font-bold text-sm">{item.q}</span>
                 <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
               </button>
               {activeFaq === i && (
                 <p className="px-5 pb-5 -mt-1 text-sm text-gray-600 leading-relaxed">{item.a}</p>
               )}
             </div>
          ))}
        </div>
      </section>

    </div>
  );
}
