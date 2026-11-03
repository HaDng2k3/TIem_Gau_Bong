import React, { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  PackageOpen,
  PenTool,
  Truck,
  BookOpen,
  Sparkles,
  Clock,
  Eye,
  Calendar,
  Search,
  X,
  Share2
} from 'lucide-react';
import { useWishlist } from './context/WishlistContext';
import ArticleModal from './components/ArticleModal';
import * as api from './services/api';

export default function HomePage({ setCurrentPage, onOrderProduct, onAddToCart, onViewProductDetail, onSelectCategory, settings = {} }) {
  const [cardMessage, setCardMessage] = useState("Chúc người thương luôn nhoẻn miệng cười ấm áp trong những ngày mùa thu!");
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Dynamic products from API
  const [dbProducts, setDbProducts] = useState([]);
  const [homeProductFilter, setHomeProductFilter] = useState('all');

  // Load products from backend
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const prods = await api.getProducts();
        if (isMounted && Array.isArray(prods) && prods.length > 0) {
          setDbProducts(prods);
        }
      } catch (err) {
        console.error('Error fetching home products:', err);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  // Articles state
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [selectedArticleCategory, setSelectedArticleCategory] = useState('Tất cả');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  // Home products filter & calculation
  const DEFAULT_HOME_PRODUCTS = [
    { id: 'prod-1', tag: 'Best Seller', tagColor: 'bg-cozy-secondary', title: 'Teddy Mùa Thu Quàng Khăn Len', category: 'Gấu Teddy', price: '395.000đ', rawPrice: 395000, old: '450.000đ', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { id: 'prod-2', tag: 'Hot Trend', tagColor: 'bg-cozy-primary', title: 'Giftbox Teddy Nâu Vintage (Kèm Thiệp)', category: 'Combo Quà & Thiệp', price: '345.000đ', rawPrice: 345000, old: '420.000đ', image: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=400&q=80' },
    { id: 'prod-3', tag: 'Mới Về', tagColor: 'bg-green-600', title: 'Gấu Trúc Mũm Mĩm Nằm Ngủ', category: 'Búp Bê & Khác', price: '280.000đ', rawPrice: 280000, old: '', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=400&q=80' },
    { id: 'prod-4', tag: 'Chỉ còn 3 bé', tagColor: 'bg-red-500', title: 'Bé Cún Bông Bơ Sữa Tai Cụp', category: 'Búp Bê & Khác', price: '245.000đ', rawPrice: 245000, old: '', image: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=400&q=80' }
  ];

  const displayProducts = useMemo(() => {
    let source = dbProducts.length > 0 ? dbProducts.map((p, i) => ({
      id: p.id || `prod-db-${i}`,
      tag: p.tag || 'Mới Về',
      tagColor: p.tagColor || 'bg-cozy-secondary',
      title: p.name,
      category: p.category || 'Gấu Teddy',
      price: typeof p.price === 'number' ? `${p.price.toLocaleString('vi-VN')}đ` : p.price,
      rawPrice: typeof p.price === 'number' ? p.price : parseInt(String(p.price).replace(/\D/g, ''), 10) || 300000,
      old: p.originalPrice ? (typeof p.originalPrice === 'number' ? `${p.originalPrice.toLocaleString('vi-VN')}đ` : p.originalPrice) : '',
      image: p.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80',
      description: p.description
    })) : DEFAULT_HOME_PRODUCTS;

    if (homeProductFilter === 'teddy') {
      source = source.filter(p => (p.category || '').toLowerCase().includes('teddy') || (p.title || '').toLowerCase().includes('teddy'));
    } else if (homeProductFilter === 'combo') {
      source = source.filter(p => (p.category || '').toLowerCase().includes('combo') || (p.title || '').toLowerCase().includes('thiệp') || (p.title || '').toLowerCase().includes('giftbox'));
    }

    return source.slice(0, 4);
  }, [dbProducts, homeProductFilter]);

  // Load articles from backend / local storage
  useEffect(() => {
    let isMounted = true;
    async function fetchArticles() {
      try {
        setArticlesLoading(true);
        const data = await api.getArticles();
        if (isMounted && data) {
          setArticles(data);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        if (isMounted) setArticlesLoading(false);
      }
    }
    fetchArticles();
    return () => { isMounted = false; };
  }, []);

  // Filtered articles
  const categoriesList = [
    'Tất cả',
    'Mẹo Chăm Sóc',
    'Gợi Ý Quà Tặng',
    'Hậu Trường Tiệm',
    'Cẩm Nang Mua Sắm',
    'Bộ Sưu Tập Mới'
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedArticleCategory === 'Tất cả' || article.category === selectedArticleCategory;
    const matchesSearch = !articleSearchQuery.trim() ||
      article.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      (article.summary && article.summary.toLowerCase().includes(articleSearchQuery.toLowerCase())) ||
      (article.tags && article.tags.some(t => t.toLowerCase().includes(articleSearchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
  const regularArticles = featuredArticle
    ? filteredArticles.filter(a => a.id !== featuredArticle.id)
    : filteredArticles;

  const handleOpenArticle = (article) => {
    setActiveArticleModal(article);
    setIsArticleModalOpen(true);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="px-8 py-16 max-w-7xl mx-auto flex items-center gap-16">
        <div className="flex-1">
          <div className="text-[11px] font-bold tracking-[0.2em] text-cozy-primary uppercase mb-6 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-cozy-primary"></span>
            Autumn Warmth Collection
          </div>
          <h1 className="text-[3.5rem] font-bold leading-[1.1] mb-6 tracking-tight">
            Gói Trọn Yêu Thương,<br/>Gửi Hơi Ấm Mùa Thu
          </h1>
          <p className="text-cozy-text/80 mb-10 leading-relaxed max-w-lg font-medium text-lg">
            Tiệm gấu bông thủ công với từng đường may mềm mại, dịch vụ đóng hộp quà Kraft vintage thêm mùi cỏ ram khô và những dòng thiệp nắn nót trao gửi tâm tình.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => onViewProductDetail ? onViewProductDetail() : setCurrentPage('collection')} className="bg-cozy-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Xem Bé Gấu Nơ Ca-Rô (Hot) <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentPage('collection')} className="bg-white border-2 border-cozy-border text-cozy-text px-8 py-4 rounded-full font-bold shadow-sm hover:bg-cozy-border/30 transition flex items-center gap-2">
              Khám Phá BST Mùa Thu
            </button>
          </div>
          
          <div className="mt-14 flex items-center gap-10 text-sm font-semibold">
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-cozy-primary">15.000+</span><span className="text-cozy-text/60">Bé gấu đã tìm chủ</span></div>
            <div className="w-[1px] h-10 bg-cozy-border"></div>
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-cozy-primary">100%</span><span className="text-cozy-text/60">Độ êm dịu, an toàn</span></div>
            <div className="w-[1px] h-10 bg-cozy-border"></div>
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-cozy-primary">Hỏa Tốc 2H</span><span className="text-cozy-text/60">Giao nhanh nội thành</span></div>
          </div>
        </div>
        
        <div className="flex-1 relative cursor-pointer" onClick={() => onViewProductDetail && onViewProductDetail()}>
          <div className="absolute -top-6 -right-6 bg-cozy-secondary text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg transform rotate-3 flex items-center gap-1.5">
            🔥 Best Seller Mùa Thu • Xem Chi Tiết
          </div>
          <img 
            src={settings.heroBanner || "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80"} 
            alt={settings.shopName || "Gấu Mùa Thu"} 
            className="rounded-[2.5rem] shadow-2xl w-full h-[550px] object-cover hover:scale-[1.02] transition duration-500" 
          />
          
          {/* Floating Price Tag */}
          <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-cozy-border/50 animate-bounce" style={{ animationDuration: '3s' }}>
            <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=100&q=80" className="w-14 h-14 rounded-2xl object-cover" alt="Thumb" />
            <div>
              <p className="font-bold text-sm mb-1">Bé Gấu Chơi Nơ Ca-Rô</p>
              <div className="flex items-center gap-2">
                <span className="text-cozy-primary font-bold text-lg">340.000đ</span>
                <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Lông xoắn 3D</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between gap-6">
          {['Gấu Teddy Mùa Thu', 'Thỏ Bông Biscuit', 'Gấu Ôm Khổng Lồ', 'Búp Bê & Khác', 'Combo Quà & Thiệp'].map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (onSelectCategory) {
                  if (cat.includes('Teddy')) onSelectCategory('Gấu Teddy');
                  else onSelectCategory(cat);
                } else if (setCurrentPage) {
                  setCurrentPage('collection');
                }
              }}
              className="bg-white rounded-3xl p-5 flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-cozy-border flex-1 group"
            >
              <div className="w-20 h-20 bg-cozy-bg rounded-full flex items-center justify-center p-2 group-hover:scale-105 transition duration-300">
                 <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=100&q=80" className="w-full h-full rounded-full object-cover" alt={cat} />
              </div>
              <span className="font-bold text-sm text-center px-2 group-hover:text-cozy-primary transition">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold text-cozy-secondary mb-3 uppercase tracking-widest">BỘ SƯU TẬP MỚI NHẤT</p>
            <h2 className="text-3xl font-bold tracking-tight">BST Mùa Thu "Autumn Warmth 2024"</h2>
            <p className="text-cozy-text/60 mt-3 font-medium">Lông mềm mịn không rụng sợi, ruột gòn tinh khiết siêu êm 100%.</p>
          </div>
          <div className="flex gap-2.5 sm:gap-3 flex-wrap">
            <button 
              onClick={() => setHomeProductFilter('all')} 
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                homeProductFilter === 'all'
                  ? 'bg-cozy-text text-white shadow-md'
                  : 'bg-white border-2 border-cozy-border text-cozy-text hover:bg-cozy-bg'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setHomeProductFilter('teddy')} 
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                homeProductFilter === 'teddy'
                  ? 'bg-cozy-text text-white shadow-md'
                  : 'bg-white border-2 border-cozy-border text-cozy-text hover:bg-cozy-bg'
              }`}
            >
              🧸 Gấu Teddy
            </button>
            <button 
              onClick={() => setHomeProductFilter('combo')} 
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                homeProductFilter === 'combo'
                  ? 'bg-cozy-text text-white shadow-md'
                  : 'bg-white border-2 border-cozy-border text-cozy-text hover:bg-cozy-bg'
              }`}
            >
              🎁 Kèm Thiệp Xinh
            </button>
            <button 
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                else if (setCurrentPage) setCurrentPage('collection');
              }}
              className="bg-white border-2 border-cozy-primary text-cozy-primary hover:bg-cozy-primary hover:text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              Xem tất cả BST ➔
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayProducts.map((prod, i) => (
            <div key={prod.id || i} className="bg-white rounded-[2rem] p-4 border border-cozy-border hover:shadow-xl hover:-translate-y-1 transition-all group relative flex flex-col">
              <div className={`absolute top-6 left-6 z-10 ${prod.tagColor || 'bg-cozy-secondary'} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider`}>
                {prod.tag}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist({
                    id: prod.id,
                    name: prod.title,
                    price: prod.rawPrice,
                    tag: prod.tag,
                    image: prod.image
                  });
                }}
                className={`absolute top-6 right-6 z-10 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-sm transition cursor-pointer ${
                  isInWishlist(prod.title) ? 'text-rose-500 fill-rose-500' : 'text-gray-400 hover:text-red-500 hover:bg-white'
                }`}
                title="Lưu vào danh sách yêu thích"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(prod.title) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              
              <div 
                onClick={() => onViewProductDetail && onViewProductDetail({ 
                  id: prod.id, 
                  name: prod.title, 
                  basePrice: prod.rawPrice, 
                  price: prod.rawPrice,
                  originalPrice: prod.old,
                  image: prod.image,
                  category: prod.category,
                  description: prod.description
                })}
                className="rounded-2xl overflow-hidden mb-5 relative h-64 bg-cozy-bg cursor-pointer"
              >
                <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="px-2 pb-2 flex flex-col flex-1">
                <div className="flex text-cozy-secondary mb-2">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-sm">★</span>)}
                </div>
                <h3 
                  onClick={() => onViewProductDetail && onViewProductDetail({ 
                    id: prod.id, 
                    name: prod.title, 
                    basePrice: prod.rawPrice, 
                    price: prod.rawPrice,
                    originalPrice: prod.old,
                    image: prod.image,
                    category: prod.category,
                    description: prod.description
                  })}
                  className="font-bold text-sm mb-3 line-clamp-2 h-10 leading-snug cursor-pointer hover:text-cozy-primary transition"
                >
                  {prod.title}
                </h3>
                <div className="flex justify-between items-end mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-cozy-primary font-bold text-lg">{prod.price}</span>
                    {prod.old && <span className="text-gray-400 line-through text-xs font-semibold">{prod.old}</span>}
                  </div>
                  <button 
                    onClick={() => {
                      const prodData = { 
                        id: prod.id, 
                        name: prod.title, 
                        price: prod.rawPrice, 
                        image: prod.image,
                        tag: prod.tag,
                        category: prod.category
                      };
                      if (onAddToCart) {
                        onAddToCart(prodData, 1);
                      } else if (onOrderProduct) {
                        onOrderProduct(prodData);
                      }
                    }} 
                    className="bg-cozy-primary text-white p-3 rounded-xl hover:bg-cozy-text transition shadow-md cursor-pointer flex items-center gap-1.5"
                    title="Nhặt bé gấu vào combo giỏ quà"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-xs font-bold hidden sm:inline">Nhặt combo</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Membership Banner */}
      <section className="px-8 py-4 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#FFF4EE] via-[#FCFAF7] to-[#FEF4DB] border border-[#EAE0D5] rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#6B4226] text-amber-300 flex items-center justify-center text-3xl shadow-sm shrink-0">
              👑
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#D47343] uppercase tracking-wider mb-1">
                <span>Gia Đình Gấu Nhỏ VIP</span>
                <span>•</span>
                <span>Tích Lá Vàng Đổi Quà</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#52321c]">
                Xếp Hạng Thành Viên: Tích Chi Tiêu, Mở Khóa Quà Tặng Hoàng Gia
              </h3>
              <p className="text-xs sm:text-sm text-[#6B4226]/80 mt-1 font-medium max-w-xl">
                Cứ 10.000đ = 1 Lá Vàng. Thăng hạng Gấu Xinh & Gấu Queen nhận freeship trọn đời, quà sinh nhật 500k và dịch vụ bác sĩ gấu bông miễn phí!
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('membership')}
            className="shrink-0 bg-[#6B4226] hover:bg-[#52321c] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md cursor-pointer active:scale-95"
          >
            <span>Xem Xếp Hạng & Đặc Quyền</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Service Steps */}
      <section className="bg-white py-20 mt-8 border-t border-cozy-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold text-cozy-secondary mb-3 uppercase tracking-widest">DỊCH VỤ ĐỘC QUYỀN CỦA TIỆM</p>
            <h2 className="text-3xl font-bold tracking-tight">Tự Tay Chuẩn Bị Hộp Quà Tặng Người Thương</h2>
            <p className="text-cozy-text/60 mt-4 font-medium">Chỉ với 4 bước đơn giản, Tiệm thay bạn nắn nót chuẩn bị món quà đầy ắp yêu thương.</p>
          </div>
          
          <div className="flex justify-between items-start relative px-4">
            <div className="absolute top-10 left-12 w-[calc(100%-6rem)] h-0.5 bg-cozy-border border-dashed border-b-2 border-cozy-border/50 -z-10"></div>
            {[
              { num: '1', icon: <Heart className="w-6 h-6"/>, title: 'Chọn Bé Gấu Yêu Thích', desc: 'Đa dạng kích thước và mẫu mã, độ êm 100% ruột gòn tinh khiết.' },
              { num: '2', icon: <PackageOpen className="w-6 h-6"/>, title: 'Hộp Kraft & Ruy Băng', desc: 'Hộp quà cứng cáp vintage rải đầy rơm lót thơm dịu thật nổi bật.' },
              { num: '3', icon: <PenTool className="w-6 h-6"/>, title: 'Viết Thiệp Nắn Nót', desc: 'Gửi gắm tâm tình chân thành, tiệm viết tay bằng mực nâu cổ điển.' },
              { num: '4', icon: <Truck className="w-6 h-6"/>, title: 'Giao Tận Tay Bất Ngờ', desc: 'Giao hỏa tốc trao gửi trọn vẹn tình cảm trước khi shipper bấm chuông.' }
            ].map((step, i) => (
              <div key={i} className="bg-cozy-bg p-8 rounded-[2rem] w-[17rem] text-center border-4 border-white shadow-sm flex flex-col items-center relative group hover:border-cozy-bg hover:bg-white transition-all">
                <div className="w-10 h-10 bg-cozy-bg border-4 border-white rounded-full flex items-center justify-center text-cozy-secondary font-bold absolute -top-5 text-sm group-hover:bg-cozy-secondary group-hover:text-white transition-colors">
                  {step.num}
                </div>
                <div className="text-cozy-primary mb-5 mt-2 bg-white p-4 rounded-full shadow-sm">{step.icon}</div>
                <h3 className="font-bold mb-3">{step.title}</h3>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BÀI VIẾT & CẨM NANG SECTION ==================== */}
      <section id="bai-viet" className="px-6 lg:px-8 py-20 max-w-7xl mx-auto scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#C25E2E] uppercase tracking-[0.2em] mb-2.5 bg-[#FFF0E6] px-3.5 py-1.5 rounded-full border border-[#FADCC7]">
              <span>🍂</span>
              <span>GÓC BÀI VIẾT & CẨM NANG TIỆM GẤU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4A2E1B] tracking-tight">
              Nhật Ký & Chia Sẻ Từ Tiệm
            </h2>
            <p className="text-[#6B4226]/80 text-sm sm:text-base font-medium mt-2 max-w-2xl leading-relaxed">
              Khám phá các mẹo bảo quản gấu luôn thơm mềm, ý tưởng chọn quà tinh tế và những câu chuyện ấm áp đằng sau từng mũi may thủ công.
            </p>
          </div>

          {/* Quick Search inside Articles */}
          <div className="relative w-full md:w-72 shrink-0">
            <input
              type="text"
              value={articleSearchQuery}
              onChange={(e) => setArticleSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, mẹo hay..."
              className="w-full bg-white border border-[#E0D2C4] rounded-full py-2.5 pl-10 pr-9 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#C25E2E] shadow-2xs placeholder:text-[#A89282]"
            />
            <Search className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3" />
            {articleSearchQuery && (
              <button
                onClick={() => setArticleSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 custom-scrollbar">
          {categoriesList.map((cat) => {
            const count = cat === 'Tất cả' 
              ? articles.length 
              : articles.filter(a => a.category === cat).length;
            const isActive = selectedArticleCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedArticleCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#7A3E1D] text-white shadow-sm'
                    : 'bg-white border border-[#E0D2C4] text-[#6B4226] hover:bg-[#FAF4EB] hover:border-[#C25E2E]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F2E6D9] text-[#7A3E1D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {articlesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-[2rem] p-5 border border-[#EAE0D5] h-80 flex flex-col justify-between">
                <div className="bg-[#EAE0D5] h-40 rounded-2xl w-full mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-[#EAE0D5] h-4 rounded w-3/4"></div>
                  <div className="bg-[#EAE0D5] h-3 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search / Filter State */}
        {!articlesLoading && filteredArticles.length === 0 && (
          <div className="bg-white rounded-[2.5rem] border border-[#EAE0D5] p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF0E6] text-3xl flex items-center justify-center mx-auto mb-4">
              📖
            </div>
            <h3 className="font-extrabold text-lg text-[#4A2E1B] mb-2">
              Không tìm thấy bài viết nào
            </h3>
            <p className="text-xs sm:text-sm text-[#6B4226]/70 mb-5 leading-relaxed">
              {articleSearchQuery
                ? `Không có bài viết nào khớp với từ khóa "${articleSearchQuery}". Bạn hãy thử tìm kiếm từ khóa khác xem sao nhé.`
                : `Chưa có bài viết nào trong danh mục "${selectedArticleCategory}".`}
            </p>
            <button
              onClick={() => {
                setSelectedArticleCategory('Tất cả');
                setArticleSearchQuery('');
              }}
              className="bg-[#7A3E1D] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#5E2E14] transition shadow-xs cursor-pointer"
            >
              Xem tất cả bài viết
            </button>
          </div>
        )}

        {/* Articles List Content */}
        {!articlesLoading && filteredArticles.length > 0 && (
          <div className="space-y-8">
            {/* Spotlight / Featured Article (Large Card) */}
            {featuredArticle && !articleSearchQuery && selectedArticleCategory === 'Tất cả' && (
              <div
                onClick={() => handleOpenArticle(featuredArticle)}
                className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-[#EAE0D5] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden"
              >
                {/* Image on left */}
                <div className="lg:col-span-7 h-64 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden relative bg-[#EAE0D5]">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-[#C25E2E] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Nổi Bật
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-[#52321c] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {featuredArticle.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </div>
                </div>

                {/* Info on right */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full py-2">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#8C6D53] font-semibold mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredArticle.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {(featuredArticle.views || 1).toLocaleString('vi-VN')} lượt xem
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#4A2E1B] group-hover:text-[#C25E2E] transition leading-snug mb-3">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#6B4226]/80 font-medium leading-relaxed line-clamp-3 mb-6">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F0E4D7]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FFF0E0] border border-[#D9C8BA] flex items-center justify-center text-sm shadow-2xs">
                        {featuredArticle.authorAvatar || '🧸'}
                      </div>
                      <span className="text-xs font-extrabold text-[#4A2E1B]">
                        {featuredArticle.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#C25E2E] group-hover:translate-x-1.5 transition-transform">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Other Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(articleSearchQuery || selectedArticleCategory !== 'Tất cả' ? filteredArticles : regularArticles).map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleOpenArticle(art)}
                  className="bg-white rounded-[2rem] p-5 border border-[#EAE0D5] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    {/* Cover Image */}
                    <div className="h-52 rounded-2xl overflow-hidden mb-4 relative bg-[#EAE0D5]">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#7A3E1D] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {art.category}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readTime}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2.5 text-[11px] text-[#8C6D53] font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {art.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(art.views || 1).toLocaleString('vi-VN')}
                      </span>
                      {art.likes > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-rose-500 font-bold">
                            <Heart className="w-3 h-3 fill-rose-500" />
                            {art.likes}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-extrabold text-base sm:text-lg text-[#4A2E1B] group-hover:text-[#C25E2E] transition line-clamp-2 leading-snug mb-2.5">
                      {art.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-xs text-[#6B4226]/80 font-medium line-clamp-2 leading-relaxed mb-4">
                      {art.summary}
                    </p>
                  </div>

                  {/* Footer / Author & CTA */}
                  <div className="flex items-center justify-between pt-3.5 border-t border-[#F5EBE1] mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{art.authorAvatar || '🧸'}</span>
                      <span className="text-[11px] font-bold text-[#6B4226]">
                        {art.author}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-extrabold text-[#C25E2E] group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Article Detail Modal */}
      <ArticleModal
        isOpen={isArticleModalOpen}
        article={activeArticleModal}
        onClose={() => setIsArticleModalOpen(false)}
        onSelectArticle={(art) => setActiveArticleModal(art)}
        onGoToCollection={() => setCurrentPage('collection')}
        onViewProductDetail={onViewProductDetail}
      />

      {/* Interactive Card Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] p-12 flex gap-16 shadow-2xl border border-cozy-border relative overflow-hidden">
          {/* bg decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cozy-bg rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex-1 relative z-10">
            <div className="text-[10px] font-bold text-cozy-secondary mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-px bg-cozy-secondary"></span> TRẢI NGHIỆM TRỰC TIẾP
            </div>
            <h2 className="text-3xl font-bold mb-5 tracking-tight">Thử Viết Thiệp Cho Người Thương</h2>
            <p className="text-cozy-text/70 mb-8 font-medium leading-relaxed">
              Nhập lời chúc của bạn để xem trước tấm thiệp với font chữ viết tay xinh xắn mà tiệm sẽ chép lại nắn nót.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3">Lời chúc của bạn (Tối đa 50 từ):</label>
              <textarea 
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="w-full bg-cozy-bg border-2 border-cozy-border rounded-2xl p-5 h-36 focus:outline-none focus:border-cozy-primary resize-none font-medium text-sm leading-relaxed"
                placeholder="Nhập lời chúc..."
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button className="bg-cozy-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
                Lưu lời chúc này
              </button>
              <button className="bg-white border-2 border-cozy-border text-cozy-text px-8 py-4 rounded-full font-bold shadow-sm hover:bg-cozy-bg transition text-sm">
                Chọn mẫu thiệp
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center z-10">
            {/* Kraft Paper Preview */}
            <div className="bg-[#E2C7A8] w-[95%] aspect-[4/3] rounded shadow-2xl p-10 relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
               {/* Texture Overlay */}
               <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay rounded" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}></div>
               
               <div className="text-center font-bold text-[10px] uppercase tracking-[0.2em] text-[#5C3D2E]/60 mb-8 pb-3 border-b border-[#5C3D2E]/20">
                 Tiệm Gấu Bông HD - Mùa Yêu Thương
               </div>
               
               <p className="font-handwriting text-[2rem] leading-relaxed text-[#4A3022] text-center px-4 font-semibold">
                 {cardMessage || "Hãy nhập lời chúc để xem trước thiệp nhé..."}
               </p>
               
               {/* Washi tape decoration */}
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-white/30 backdrop-blur-md -rotate-2 transform shadow-sm border border-white/40"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
