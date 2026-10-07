import React, { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, ShieldCheck } from 'lucide-react';
import HomePage from './HomePage';
import CollectionPage from './CollectionPage';
import AdminPage from './AdminPage';
import OrderModal from './OrderModal';
import * as api from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'collection' | 'admin'
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderingProduct, setOrderingProduct] = useState(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [settings, setSettings] = useState({
    topBanner: '✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k'
  });

  // Load shop settings and pending order count
  useEffect(() => {
    async function loadShopInfo() {
      try {
        const [st, orders] = await Promise.all([
          api.getSettings(),
          api.getOrders({ status: 'pending' })
        ]);
        if (st) setSettings(st);
        if (orders) setPendingOrdersCount(orders.length);
      } catch (err) {
        console.error('Error fetching shop info:', err);
      }
    }
    loadShopInfo();
  }, [currentPage]);

  // Handle open order modal with specific product or default
  const handleOpenOrder = (prod) => {
    setOrderingProduct(prod || null);
    setIsOrderModalOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setPendingOrdersCount(prev => prev + 1);
  };

  // If user navigated to backend portal
  if (currentPage === 'admin') {
    return <AdminPage onBackToStore={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-cozy-bg font-sans text-cozy-text selection:bg-cozy-secondary/30 flex flex-col justify-between">
      {/* Top Banner with dynamic setting */}
      <div className="bg-cozy-bg py-2 text-center text-sm font-semibold border-b border-cozy-border">
        {settings.topBanner || '✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k'}
      </div>

      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between bg-cozy-bg/95 backdrop-blur-md sticky top-0 z-40 border-b border-cozy-border">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <span className="text-2xl font-bold text-cozy-primary tracking-tight">Tiệm Gấu Bông HD</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Tìm bé gấu ấm áp..." 
            className="w-full bg-white border border-cozy-border rounded-full py-2.5 px-12 text-sm focus:outline-none focus:border-cozy-secondary transition font-medium shadow-sm"
          />
          <Search className="w-4 h-4 text-cozy-text/50 absolute left-5 top-3.5" />
        </div>

        <nav className="flex items-center gap-6 text-sm font-bold">
          <button 
            onClick={() => setCurrentPage('home')} 
            className={`${currentPage === 'home' ? 'text-cozy-primary border-b-2 border-cozy-primary pb-1' : 'hover:text-cozy-primary transition'}`}
          >
            Trang chủ
          </button>
          <button 
            onClick={() => setCurrentPage('collection')} 
            className={`${currentPage === 'collection' ? 'text-cozy-primary border-b-2 border-cozy-primary pb-1' : 'hover:text-cozy-primary transition'}`}
          >
            BST Mùa Thu
          </button>
          <button 
            onClick={() => setCurrentPage('collection')} 
            className="hover:text-cozy-primary transition"
          >
            Gấu Teddy
          </button>
          <button 
            onClick={() => handleOpenOrder()} 
            className="hover:text-cozy-primary transition"
          >
            Quà Tặng & Thiệp
          </button>
          
          {/* Quick Access to Backend Portal */}
          <button
            onClick={() => setCurrentPage('admin')}
            className="bg-[#6B4226] hover:bg-[#52321c] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm group"
            title="Truy cập Trang Quản Trị Backend"
          >
            <span>⚙️ Quản Trị Backend</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4 ml-1 border-l border-cozy-border pl-5">
            <button className="hover:text-cozy-primary transition"><Heart className="w-5 h-5" /></button>
            <button 
              onClick={() => setCurrentPage('admin')} 
              className="hover:text-cozy-primary transition" 
              title="Tài khoản Quản Trị"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleOpenOrder()} 
              className="relative hover:text-cozy-primary transition"
              title="Giỏ hàng & Đặt mua"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-2 bg-cozy-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                1
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content routing */}
      <main className="flex-1">
        {currentPage === 'home' ? (
          <HomePage setCurrentPage={setCurrentPage} onOrderProduct={handleOpenOrder} />
        ) : (
          <CollectionPage onOrderProduct={handleOpenOrder} />
        )}
      </main>

      {/* Shared Footer */}
      <footer className="bg-[#FAF4EB] border-t border-cozy-border py-16">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-5 gap-12">
          <div className="col-span-2">
            <h3 className="text-xl font-bold text-cozy-text mb-5">Tiệm Gấu Bông HD</h3>
            <p className="text-sm text-cozy-text/70 leading-relaxed font-medium mb-4 max-w-xs">
              Giao tâm nhỏ xíu, gửi yêu ấm áp, trao gởi những cái ôm êm ái và những món quà handmade đong đầy tình cảm.
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-[#F8EFE5] inline-block px-4 py-2 rounded-lg text-xs font-bold text-cozy-primary border border-[#EAE0D5]">
                🧸 Handmade with gentle care
              </div>
              <button
                onClick={() => setCurrentPage('admin')}
                className="text-xs font-bold text-[#6B4226] hover:text-[#D47343] underline transition"
              >
                Trang Quản Trị Backend →
              </button>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">Khám Phá Của Tiệm</h4>
            <ul className="space-y-4 text-xs font-medium text-cozy-text/70">
              <li><button onClick={() => setCurrentPage('collection')} className="hover:text-cozy-primary transition">BST Mùa Thu 2024</button></li>
              <li><button onClick={() => setCurrentPage('collection')} className="hover:text-cozy-primary transition">Gấu Teddy Cổ Điển</button></li>
              <li><button onClick={() => handleOpenOrder()} className="hover:text-cozy-primary transition">Hộp Quà & Thiệp Viết Tay</button></li>
              <li><button onClick={() => setCurrentPage('admin')} className="hover:text-cozy-primary transition">Trang Quản Trị Hệ Thống</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">Chăm Sóc & Hỗ Trợ</h4>
            <ul className="space-y-4 text-xs font-medium text-cozy-text/70">
              <li><a href="#" className="hover:text-cozy-primary transition">Hướng Dẫn Vệ Sinh Gấu</a></li>
              <li><a href="#" className="hover:text-cozy-primary transition">Chính Sách Đổi Trả</a></li>
              <li><a href="#" className="hover:text-cozy-primary transition">Tra Cứu Vận Chuyển</a></li>
              <li><a href="#" className="hover:text-cozy-primary transition">Giải Thêm Câu Hỏi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm">Gửi Lời Yêu Thương</h4>
            <p className="text-xs text-cozy-text/70 mb-4 font-medium">Đăng ký nhận thông tin về các bạn gấu mới về tiệm và ưu đãi ngọt ngào.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email của bạn..." className="bg-white border border-cozy-border px-3 py-2 rounded-md text-xs w-full focus:outline-none focus:border-cozy-primary" />
              <button className="bg-cozy-text text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-cozy-primary transition">Gửi</button>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 mt-12 pt-6 border-t border-cozy-border flex justify-between items-center text-xs font-medium text-cozy-text/50">
          <div>© 2026 Tiệm Gấu Bông HD. Giữ trọn kỷ niệm ngọt ngào & mộc mạc.</div>
          <div className="flex items-center gap-1">♡ Theo gót trái tim êm ái mỗi ngày</div>
        </div>
      </footer>

      {/* Global Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={orderingProduct}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
