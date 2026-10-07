import React, { useState } from 'react';
import { Heart, ShoppingBag, ArrowRight, PackageOpen, PenTool, Truck } from 'lucide-react';

export default function HomePage({ setCurrentPage, onOrderProduct }) {
  const [cardMessage, setCardMessage] = useState("Chúc người thương luôn nhoẻn miệng cười ấm áp trong mùa thu này!");

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
            <button onClick={() => setCurrentPage('collection')} className="bg-cozy-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Khám Phá BST Mùa Thu <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onOrderProduct && onOrderProduct()} className="bg-white border-2 border-cozy-border text-cozy-text px-8 py-4 rounded-full font-bold shadow-sm hover:bg-cozy-border/30 transition flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-cozy-primary" /> Dịch Vụ Gói Quà
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
        
        <div className="flex-1 relative">
          <div className="absolute -top-6 -right-6 bg-cozy-secondary text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg transform rotate-3">
            🔥 Best Seller Mùa Thu
          </div>
          <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80" alt="Gấu Mùa Thu" className="rounded-[2.5rem] shadow-2xl w-full h-[550px] object-cover" />
          
          {/* Floating Price Tag */}
          <div className="absolute -bottom-8 -left-8 bg-white p-5 rounded-3xl shadow-2xl flex items-center gap-5 border border-cozy-border/50 animate-bounce" style={{ animationDuration: '3s' }}>
            <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=100&q=80" className="w-14 h-14 rounded-2xl object-cover" alt="Thumb" />
            <div>
              <p className="font-bold text-sm mb-1">Gấu Teddy Mùa Thu</p>
              <p className="text-cozy-primary font-bold text-lg">320.000đ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between gap-6">
          {['Gấu Teddy Mùa Thu', 'Thỏ Bông Biscuit', 'Gấu Ôm Khổng Lồ', 'Búp Bê & Khác', 'Combo Quà & Thiệp'].map((cat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border border-cozy-border flex-1">
              <div className="w-20 h-20 bg-cozy-bg rounded-full flex items-center justify-center p-2">
                 <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=100&q=80" className="w-full h-full rounded-full object-cover" alt={cat} />
              </div>
              <span className="font-bold text-sm text-center px-2">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[11px] font-bold text-cozy-secondary mb-3 uppercase tracking-widest">BỘ SƯU TẬP MỚI NHẤT</p>
            <h2 className="text-3xl font-bold tracking-tight">BST Mùa Thu "Autumn Warmth 2024"</h2>
            <p className="text-cozy-text/60 mt-3 font-medium">Lông mềm mịn không rụng sợi, ruột gòn tinh khiết siêu êm 100%.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-cozy-text text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md">Tất cả</button>
            <button className="bg-white border-2 border-cozy-border text-cozy-text px-6 py-2.5 rounded-full text-sm font-bold hover:bg-cozy-bg transition">Gấu Ôm Cỡ Tròn</button>
            <button className="bg-white border-2 border-cozy-border text-cozy-text px-6 py-2.5 rounded-full text-sm font-bold hover:bg-cozy-bg transition">Kèm Thiệp Xinh</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {[
            { tag: 'Best Seller', tagColor: 'bg-cozy-secondary', title: 'Teddy Mùa Thu Quàng Khăn Len', price: '395.000đ', old: '450.000đ' },
            { tag: 'Hot Trend', tagColor: 'bg-cozy-primary', title: 'Giftbox Teddy Nâu Vintage (Kèm Thiệp)', price: '345.000đ', old: '420.000đ' },
            { tag: 'Mới Về', tagColor: 'bg-green-600', title: 'Gấu Trúc Mũm Mĩm Nằm Ngủ', price: '280.000đ', old: '' },
            { tag: 'Chỉ còn 3 bé', tagColor: 'bg-red-500', title: 'Bé Cún Bông Bơ Sữa Tai Cụp', price: '245.000đ', old: '' }
          ].map((prod, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-4 border border-cozy-border hover:shadow-xl hover:-translate-y-1 transition-all group relative">
              <div className={`absolute top-6 left-6 z-10 ${prod.tagColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider`}>{prod.tag}</div>
              <button className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-white transition"><Heart className="w-4 h-4" /></button>
              
              <div className="rounded-2xl overflow-hidden mb-5 relative h-64 bg-cozy-bg">
                <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80" alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="px-2 pb-2">
                <div className="flex text-cozy-secondary mb-2">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-sm">★</span>)}
                </div>
                <h3 className="font-bold text-sm mb-3 line-clamp-2 h-10 leading-snug">{prod.title}</h3>
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-cozy-primary font-bold text-lg">{prod.price}</span>
                    {prod.old && <span className="text-gray-400 line-through text-xs font-semibold">{prod.old}</span>}
                  </div>
                  <button 
                    onClick={() => onOrderProduct && onOrderProduct({ 
                      id: `prod-${i+1}`, 
                      name: prod.title, 
                      price: parseInt(prod.price.replace(/\D/g, '')), 
                      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=400&q=80' 
                    })} 
                    className="bg-cozy-primary text-white p-3 rounded-xl hover:bg-cozy-text transition shadow-md"
                    title="Đặt mua bé gấu này"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
