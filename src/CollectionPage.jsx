import React, { useState } from 'react';
import { Search, Heart, User, ShoppingBag, ArrowRight, PackageOpen, PenTool, Truck, ChevronDown, Star, Plus, Check } from 'lucide-react';

export default function CollectionPage({ onOrderProduct }) {
  const [cardMessage, setCardMessage] = useState("Gửi một cái ôm ấm áp cho những mùa thu đến người đặc biệt nhất của mình...");
  const [activeFaq, setActiveFaq] = useState(null);

  const products = [
    { name: 'Gấu Chơi Nơ Ca-Rô', price: '320.000đ', tag: 'Best Seller', rating: '5.0', reviews: 295, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Bí Ngô Thêu Tay', price: '295.000đ', tag: 'Phiên bản giới hạn', rating: '4.9', reviews: 184, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Cây Sồi Nâu Rêu', price: '380.000đ', tag: 'Độc Quyền', rating: '4.9', reviews: 84, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Gừng Ấm Ginger', price: '310.000đ', tag: 'Mới về', rating: '5.0', reviews: 112, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Quế Nồng Cinnamon', price: '310.000đ', tag: 'Hương Quế', rating: '4.8', reviews: 94, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Sương Mai Mũ Len', price: '330.000đ', tag: 'Mũ Be/Xanh', rating: '4.9', reviews: 127, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Ngô Non Crisp', price: '305.000đ', tag: 'Mềm Mịn', rating: '4.9', reviews: 151, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Cozy Áo Choàng Len', price: '390.000đ', tag: 'Áo Len Nâu', rating: '5.0', reviews: 204, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Hổ Phách Amber', price: '335.000đ', tag: 'Siêu phẩm', rating: '4.9', reviews: 87, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gấu Mùa Gặt Harvest', price: '345.000đ', tag: 'Kèm giỏ', rating: '5.0', reviews: 62, img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="bg-[#FAF4EB] min-h-screen pb-20">
      
      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-8 pt-8 pb-12">
        <div className="bg-[#F8EFE5] rounded-[2rem] p-12 flex items-center justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="max-w-2xl relative z-10">
            <div className="bg-cozy-secondary text-white font-bold text-xs px-4 py-2 rounded-full inline-block mb-6 uppercase tracking-wider shadow-sm">
              ✨ Phiên Bản Mùa Thu 2024 • Số Lượng Giới Hạn
            </div>
            <h1 className="text-5xl font-bold text-cozy-text mb-6 leading-tight">
              BST Mùa Thu: Khúc Ca Lá Vàng & Ấm Áp
            </h1>
            <p className="text-cozy-text/70 text-lg mb-10 leading-relaxed font-medium">
              Đón chào mùa se lạnh với 10 người bạn gấu nhồi bông thủ công đặc biệt. Từng sợi bông êm ái, chiếc nơ ca-rô cổ điển và họa tiết thêu tỉ mỉ được chắt chiu từ hơi thở ấm nóng của lò sưởi, hạt dẻ và tách trà quế.
            </p>
            
            <div className="grid grid-cols-4 gap-4">
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

          <div className="relative z-10 w-[450px] h-[450px]">
             <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover rounded-[2rem] shadow-2xl rotate-2" alt="Hero Bear" />
             <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-1">Thiết Kế Tiêu Biểu</p>
                  <p className="font-bold text-lg">Gấu Chơi Khăn Ca-rô</p>
                </div>
                <button className="bg-cozy-secondary text-white px-5 py-2 rounded-full font-bold text-sm">Độc Quyền</button>
             </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-between border-b border-cozy-border pb-6">
        <div className="flex gap-3">
          <button className="bg-cozy-text text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md flex items-center gap-2">🔥 Tất cả 10 mẫu thu</button>
          <button className="bg-white text-cozy-text border border-cozy-border px-5 py-2.5 rounded-full text-sm font-bold hover:bg-cozy-bg transition flex items-center gap-2">🧣 Gấu quàng khăn len</button>
          <button className="bg-white text-cozy-text border border-cozy-border px-5 py-2.5 rounded-full text-sm font-bold hover:bg-cozy-bg transition flex items-center gap-2">🌻 Gấu thêu họa tiết</button>
          <button className="bg-white text-cozy-text border border-cozy-border px-5 py-2.5 rounded-full text-sm font-bold hover:bg-cozy-bg transition flex items-center gap-2">🧸 Gấu khác</button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500">Size:</span>
            <div className="bg-white border border-cozy-border rounded-full p-1 flex">
              <button className="bg-cozy-text text-white px-4 py-1.5 rounded-full text-xs font-bold">Tất cả</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-cozy-text">25cm</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-cozy-text">40cm</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:text-cozy-text">55cm</button>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-cozy-border px-4 py-2 rounded-full cursor-pointer">
            <span className="text-sm font-bold">Phổ biến nhất</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm font-bold text-gray-500">Bộ sưu tập (10 bạn gấu bông)</p>
          <p className="text-sm font-bold text-cozy-secondary flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cozy-secondary animate-pulse"></span> Đang có sẵn tại cửa hàng</p>
        </div>
        
        <div className="grid grid-cols-5 gap-6">
          {products.map((prod, i) => (
            <div key={i} className="bg-white rounded-[1.5rem] p-3 border border-cozy-border hover:shadow-xl hover:-translate-y-1 transition-all group relative flex flex-col">
              <div className="absolute top-5 left-5 z-10 bg-cozy-secondary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">{prod.tag}</div>
              <button className="absolute top-5 right-5 z-10 bg-white/80 p-2 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white transition opacity-0 group-hover:opacity-100"><Heart className="w-4 h-4" /></button>
              
              <div className="rounded-xl overflow-hidden mb-4 relative h-48 bg-cozy-bg shrink-0">
                <img src={prod.img} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="flex flex-col flex-1 px-1">
                <div className="flex items-center gap-1 text-cozy-secondary mb-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold">{prod.rating}</span>
                  <span className="text-[10px] text-gray-400">({prod.reviews} lượt mua)</span>
                </div>
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{prod.name}</h3>
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">Vải nhung lông thỏ • 40cm</p>
                <div className="flex justify-between items-end mt-auto">
                  <span className="text-cozy-primary font-bold">{prod.price}</span>
                  <button 
                    onClick={() => onOrderProduct && onOrderProduct({ 
                      id: `prod-col-${i+1}`, 
                      name: prod.name, 
                      price: parseInt(prod.price.replace(/\D/g, '')), 
                      image: prod.img 
                    })} 
                    className="bg-cozy-text text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cozy-primary transition flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3 h-3"/> Mua
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upsell Banner & Preview */}
      <section className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="bg-white rounded-[2.5rem] p-12 flex gap-16 shadow-xl border border-cozy-border">
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

            <button className="bg-cozy-text text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-cozy-primary transition flex items-center gap-3">
              <PackageOpen className="w-5 h-5"/> Thêm combo hộp quà (+45.000đ)
            </button>
            <p className="text-xs text-gray-400 mt-3 font-medium italic">* Miễn phí cho đơn hàng từ 299k</p>
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
          {[
             '1. Tôi có thể tự giặt bé gấu bông tại nhà như thế nào?',
             '2. Tiệm viết tay thiệp tặng quà có tính thêm phí không?',
             '3. Chính sách đổi trả sản phẩm trong 7 ngày diễn ra như thế nào?',
             '4. Giao hàng hỏa tốc 2 giờ áp dụng ở những khu vực nào?'
          ].map((q, i) => (
             <div key={i} className="bg-white border border-cozy-border rounded-xl p-5 cursor-pointer hover:shadow-md transition flex justify-between items-center" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
               <span className="font-bold text-sm">{q}</span>
               <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
             </div>
          ))}
        </div>
      </section>

    </div>
  );
}
