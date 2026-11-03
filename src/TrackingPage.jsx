import React, { useState, useEffect } from 'react';
import { 
  Search, Heart, Package, Clock, Truck, ShieldCheck, 
  MapPin, Phone, MessageSquare, Download, CheckCircle, 
  AlertCircle, ChevronRight, Share2, Sparkles, X, FileText, Check
} from 'lucide-react';
import * as api from './services/api';

const ORDER_STATUS_LABELS = {
  pending: { text: 'Chờ tiệm xác nhận', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  processing: { text: 'Đang chuẩn bị & viết thiệp', cls: 'bg-sky-100 text-sky-800 border-sky-200' },
  shipping: { text: 'Đang giao hỏa tốc', cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { text: 'Đã giao thành công', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled: { text: 'Đã hủy', cls: 'bg-rose-100 text-rose-800 border-rose-200' }
};

export default function TrackingPage({ onBackToHome, initialCode, initialOrderCode }) {
  // Ưu tiên: mã truyền từ App (sau khi đặt hàng) -> ?code= trên URL -> đơn mẫu
  const codeFromUrl =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') : null;
  const startCode = (initialCode || initialOrderCode || codeFromUrl || 'HD-AUTUMN-8921').toUpperCase();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderCode, setActiveOrderCode] = useState(startCode);
  const [realOrder, setRealOrder] = useState(null);
  const [lookupState, setLookupState] = useState('idle'); // 'idle' | 'loading' | 'found' | 'not-found'
  const [activePhotoModal, setActivePhotoModal] = useState(null); // 'inside' | 'outside' | null
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic user editable states for rescheduling or address change demo
  const [deliveryTime, setDeliveryTime] = useState('17:30 - 18:00');
  const [newTimeInput, setNewTimeInput] = useState('18:30 - 19:00');
  const [deliveryAddress, setDeliveryAddress] = useState('Tòa Lancaster, 20 Núi Trúc, Phường Giảng Võ, Q. Ba Đình, Hà Nội.');
  const [newAddressInput, setNewAddressInput] = useState(deliveryAddress);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tra cứu đơn hàng thật (theo mã đơn hoặc số điện thoại) từ API / localStorage
  useEffect(() => {
    let cancelled = false;
    const code = activeOrderCode?.trim();
    if (!code || code === 'HD-AUTUMN-8921') {
      setRealOrder(null);
      setLookupState('idle');
      return;
    }
    setLookupState('loading');
    api
      .getOrders({ search: code })
      .then((orders) => {
        if (cancelled) return;
        const list = Array.isArray(orders) ? orders : [];
        const exact = list.find((o) => o.id?.toUpperCase() === code.toUpperCase()) || list[0];
        setRealOrder(exact || null);
        setLookupState(exact ? 'found' : 'not-found');
      })
      .catch(() => {
        if (!cancelled) {
          setRealOrder(null);
          setLookupState('not-found');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activeOrderCode]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    setActiveOrderCode(searchQuery.trim().toUpperCase());
    showToast(`Đã tải thông tin hành trình đơn #${searchQuery.trim().toUpperCase()}`);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setDeliveryTime(newTimeInput);
    setIsRescheduleModalOpen(false);
    showToast(`✅ Đã cập nhật khung giờ giao mới: ${newTimeInput}`);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setDeliveryAddress(newAddressInput);
    setIsAddressModalOpen(false);
    showToast(`✅ Đã chuyển thông tin địa chỉ mới tới shipper hỏa tốc!`);
  };

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-[#6B4226] font-sans pb-20">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#6B4226] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Header container */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8C6D58] mb-6">
          <button onClick={onBackToHome} className="hover:text-[#D47343] transition">Trang Chủ</button>
          <span>/</span>
          <span className="text-[#6B4226]">Tra Cứu Đơn Hàng</span>
          <span>/</span>
          <span className="bg-[#FEEAD8] text-[#C25E2E] px-2.5 py-0.5 rounded-full font-bold">
            #{activeOrderCode}
          </span>
        </div>

        {/* Top Header & Search bar side-by-side */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FEF3E2] text-[#C25E2E] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3 border border-[#FADCC7]">
              <span>🧡</span> Mỗi Chú Gấu Là Một Cái Ôm Yêu Thương
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#4A3022] tracking-tight flex items-center gap-3">
              Hành Trình Gửi Trao Quà Tặng 🧸
            </h1>
            <p className="text-sm text-[#8C6D58] mt-2 max-w-2xl font-medium leading-relaxed">
              Mỗi chú gấu bông là một món quà trao gửi yêu thương. Bạn có thể theo dõi từng bước nắn nót chuẩn bị và ngắm nhìn ảnh chụp thực tế hộp quà trước khi giao.
            </p>
          </div>

          {/* Tra cứu đơn khác widget */}
          <div className="bg-white p-4 rounded-3xl border border-[#EAE0D5] shadow-sm w-full lg:w-[440px]">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-[#6B4226] tracking-wider uppercase text-[11px]">Tra cứu đơn khác</span>
              <span className="text-stone-400 font-medium">Mã đơn hoặc SĐT</span>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ví dụ: HD-98214 hoặc 0988..."
                  className="w-full bg-[#FAF4EB]/60 border border-[#EAE0D5] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#D47343] transition"
                />
              </div>
              <button
                type="submit"
                className="bg-[#6B4226] hover:bg-[#52321c] text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <span>Kiểm tra</span>
                <span>➔</span>
              </button>
            </form>
            {/* Quick demo chips */}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F0E4D7] text-[10px]">
              <span className="text-stone-400">Mẫu sẵn:</span>
              <button 
                type="button"
                onClick={() => { setActiveOrderCode('HD-AUTUMN-8921'); showToast('Đang xem đơn HD-AUTUMN-8921'); }}
                className="text-[#D47343] hover:underline font-bold"
              >
                #HD-AUTUMN-8921
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => { setActiveOrderCode('ORD-1002'); showToast('Đang xem đơn ORD-1002'); }}
                className="text-[#6B4226] hover:underline font-bold"
              >
                #ORD-1002
              </button>
            </div>
          </div>
        </div>

        {/* ================= KẾT QUẢ TRA CỨU ĐƠN HÀNG THẬT ================= */}
        {lookupState === 'loading' && (
          <div className="bg-white border border-[#EAE0D5] rounded-3xl p-5 mb-6 text-sm font-semibold text-[#8C6D58] animate-pulse">
            Đang tìm đơn #{activeOrderCode}...
          </div>
        )}
        {lookupState === 'not-found' && (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 mb-6 text-sm text-rose-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Không tìm thấy đơn hàng "{activeOrderCode}"</p>
              <p className="text-xs mt-1">Bạn kiểm tra lại mã đơn (VD: ORD-12345) hoặc số điện thoại đặt hàng, hay gọi hotline 1900 8556 để tiệm hỗ trợ nhé. Phần bên dưới chỉ là đơn minh họa.</p>
            </div>
          </div>
        )}
        {lookupState === 'found' && realOrder && (
          <section className="bg-white border border-[#EAE0D5] rounded-[2rem] p-6 mb-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-[11px] uppercase font-bold tracking-wider text-[#8C6D58]">Đơn hàng của bạn</p>
                <h2 className="text-2xl font-bold text-[#4A3022]">#{realOrder.id}</h2>
                <p className="text-xs text-[#8C6D58] mt-0.5">
                  Đặt lúc {new Date(realOrder.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                  (ORDER_STATUS_LABELS[realOrder.status] || ORDER_STATUS_LABELS.pending).cls
                }`}
              >
                {(ORDER_STATUS_LABELS[realOrder.status] || ORDER_STATUS_LABELS.pending).text}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                {(realOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 bg-[#FAF4EB] rounded-xl p-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {it.image && <img src={it.image} alt={it.productName} className="w-9 h-9 rounded-lg object-cover" />}
                      <span className="font-semibold text-[#4A3022] truncate">{it.productName}</span>
                    </div>
                    <span className="font-bold text-[#8C5D39] shrink-0">x{it.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-[#6B4226]">
                <p><strong>Người nhận:</strong> {realOrder.customerName} • {realOrder.customerPhone}</p>
                <p><strong>Địa chỉ:</strong> {realOrder.customerAddress}</p>
                <p><strong>Giao hàng:</strong> {realOrder.shippingMethod}</p>
                <p><strong>Thanh toán:</strong> {realOrder.paymentMethod}</p>
                {realOrder.giftCardMessage && (
                  <p className="font-handwriting text-base bg-[#FFFDF9] border border-[#E8DACB] rounded-xl p-2 mt-2">
                    “{realOrder.giftCardMessage}”
                  </p>
                )}
                <p className="pt-2 border-t border-[#EFE5D8] text-sm">
                  <strong>Tổng thanh toán:</strong>{' '}
                  <span className="font-black text-[#D47343]">
                    {Number(realOrder.totalAmount || 0).toLocaleString('vi-VN')}đ
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ================= CARD 1: DELIVERY STATUS BANNER CONTAINER ================= */}
        <section className="bg-[#FAF0E6]/90 border border-[#EFE1D2] rounded-[2.5rem] p-6 lg:p-8 shadow-sm mb-12">
          {/* Top Pill Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="bg-[#6B4226] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Đang trên đường giao tới người thương 🛵</span>
            </div>
            <div className="bg-[#FEEAD8] text-[#C25E2E] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#FADCC7]">
              Giao Hỏa Tốc Hôm Nay ⚡
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (approx 65% / 8 cols) */}
            <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
              {/* Row of 2 Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Time Box */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE5D8] shadow-xs">
                  <div className="text-[11px] font-bold uppercase text-[#8C6D58] flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#D47343]" />
                    <span>Dự kiến trao tay</span>
                  </div>
                  <div className="text-2xl font-bold text-[#4A3022] tracking-tight">
                    {deliveryTime}
                  </div>
                  <div className="text-xs text-[#8C6D58] font-medium mt-1">
                    Hôm nay (Giao quà bất ngờ)
                  </div>
                </div>

                {/* Waybill Code Box */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE5D8] shadow-xs">
                  <div className="text-[11px] font-bold uppercase text-[#8C6D58] flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-[#D47343]" />
                    <span>Mã vận đơn & đơn vị</span>
                  </div>
                  <div className="text-2xl font-bold text-[#4A3022] tracking-tight">
                    GHN-HD98214
                  </div>
                  <div className="text-xs text-[#8C6D58] font-medium mt-1">
                    Shipper Hỏa Tốc • Đội Chuyên Giao Quà
                  </div>
                </div>
              </div>

              {/* Recipient Details Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#EFE5D8] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#D47343] font-bold text-sm">
                      👤
                    </div>
                    <div>
                      <span className="font-bold text-[#4A3022] text-sm sm:text-base">Thảo My</span>
                      <span className="text-[#8C6D58] text-xs font-medium ml-2">• 0989 *** 121</span>
                    </div>
                  </div>
                  <span className="bg-[#FEF3E2] text-[#C25E2E] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FADCC7] flex items-center gap-1">
                    Bảo mật người gửi 🔒
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#6B4226] font-medium pl-10 mb-3">
                  {deliveryAddress}
                </p>

                {/* Special Note Box */}
                <div className="bg-[#FFF9F3] border border-[#FCDCC5] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#8C5D39] leading-relaxed">
                  <span className="text-base shrink-0">📝</span>
                  <div>
                    <strong className="text-[#C25E2E]">Ghi chú đặc biệt:</strong> Quà tặng bí mật, shipper vui lòng gọi trước 15 phút và không để người nhận biết người gửi trước khi mở thiệp!
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Meter & Shipper Contact (approx 35% / 4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-[#EFE5D8] shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Tiến độ chặng giao
                </div>

                <div className="flex items-center gap-4">
                  {/* Gauge SVG */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#FAF0E6]"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#D47343]"
                        strokeDasharray="82, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#4A3022]">
                      82%
                    </div>
                  </div>

                  <div>
                    <div className="text-base font-bold text-[#4A3022]">
                      Cách điểm đến 1.8 km
                    </div>
                    <div className="text-xs text-[#8C6D58] font-medium mt-0.5">
                      Shipper: Anh Tuấn (Xe 29-B1 682.49)
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action buttons */}
              <div className="grid grid-cols-2 gap-2.5 mt-6 pt-5 border-t border-[#F0E4D7]">
                <button
                  onClick={() => showToast('Đang định vị shipper trên bản đồ trực tiếp...')}
                  className="bg-white border border-[#E5D7C7] hover:bg-[#FAF4EB] text-xs font-bold text-[#6B4226] py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition shadow-2xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D47343]" />
                  <span>Theo dõi map</span>
                </button>
                <a
                  href="tel:0988123456"
                  className="bg-[#FCE8D7] hover:bg-[#F9DEC8] text-xs font-bold text-[#C25E2E] py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition text-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Liên hệ Điều Phối</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CARD 2: 6 BƯỚC TRAO GỬI YÊU THƯƠNG THỦ CÔNG ================= */}
        <section className="mb-14">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[11px] font-bold text-[#C25E2E] tracking-widest uppercase mb-1">
                Tỉ mỉ từng khâu
              </div>
              <h2 className="text-2xl font-bold text-[#4A3022] tracking-tight">
                6 Bước Trao Gửi Yêu Thương Thủ Công
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D58] bg-white px-3.5 py-1.5 rounded-full border border-[#EAE0D5] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cập nhật thời gian thực</span>
            </div>
          </div>

          {/* Steps container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-white rounded-3xl p-6 border border-[#EFE5D8] shadow-sm">
            {/* Step 1 */}
            <div className="flex flex-col justify-between p-3 rounded-2xl hover:bg-[#FAF5EE] transition">
              <div>
                <div className="inline-flex items-center gap-1 bg-[#6B4226] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" />
                  <span>14:10 • Xong</span>
                </div>
                <h3 className="font-bold text-sm text-[#4A3022] mb-1.5">1. Chọn Gấu</h3>
                <p className="text-xs text-[#7A6251] leading-relaxed">
                  Tiệm chọn bé Gấu Chai Nơ Ca-rô hoàn hảo nhất từ kho búp bê mùa thu ấm áp.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col justify-between p-3 rounded-2xl hover:bg-[#FAF5EE] transition">
              <div>
                <div className="inline-flex items-center gap-1 bg-[#6B4226] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" />
                  <span>14:45 • Xong</span>
                </div>
                <h3 className="font-bold text-sm text-[#4A3022] mb-1.5">2. Spa & Thơm</h3>
                <p className="text-xs text-[#7A6251] leading-relaxed">
                  Chải lông tơ mềm mại, khử trùng nano ấm và xịt ướp hương thơm quả mọng dịu ngọt.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col justify-between p-3 rounded-2xl hover:bg-[#FAF5EE] transition">
              <div>
                <div className="inline-flex items-center gap-1 bg-[#6B4226] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" />
                  <span>15:10 • Xong</span>
                </div>
                <h3 className="font-bold text-sm text-[#4A3022] mb-1.5">3. Đóng Hộp Kraft</h3>
                <p className="text-xs text-[#7A6251] leading-relaxed">
                  Đặt bé vào hộp Kraft vân sóng phủ rơm giấy mộc mạc, thắt ruy băng satin cam đất.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col justify-between p-3 rounded-2xl hover:bg-[#FAF5EE] transition">
              <div>
                <div className="inline-flex items-center gap-1 bg-[#6B4226] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <Check className="w-3 h-3" />
                  <span>15:25 • Xong</span>
                </div>
                <h3 className="font-bold text-sm text-[#4A3022] mb-1.5">4. Nắn Nót Viết Thiệp</h3>
                <p className="text-xs text-[#7A6251] leading-relaxed">
                  Nghệ nhân viết tay thiệp chúc bằng mực nâu cổ điển theo đúng lời nhắn gửi của bạn.
                </p>
              </div>
            </div>

            {/* Step 5 (Current active step) */}
            <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#FFF9F3] border-2 border-[#D47343] shadow-sm relative -m-1">
              <div>
                <div className="inline-flex items-center gap-1 bg-[#D47343] text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-3 shadow-xs">
                  <span>🛵 15:45 • Đang giao</span>
                </div>
                <h3 className="font-bold text-sm text-[#D47343] mb-1.5">5. Giao Hỏa Tốc</h3>
                <p className="text-xs text-[#7A6251] leading-relaxed">
                  Shipper đang băng qua phố Núi Trúc, dự kiến đến nơi trong khoảng 20-30 phút nữa.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col justify-between p-3 rounded-2xl opacity-60">
              <div>
                <div className="inline-flex items-center gap-1 border border-dashed border-stone-300 text-stone-500 text-[10px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <span>🎁 Chờ hoàn tất</span>
                </div>
                <h3 className="font-bold text-sm text-stone-500 mb-1.5">6. Trao Tận Tay</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Đón giao nụ cười và chụp ảnh kỷ niệm bàn giao với người nhận Thảo My.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CARD 3: ẢNH CHỤP THỰC TẾ HỘP QUÀ TRƯỚC KHI GIAO ================= */}
        <section className="bg-[#FFF9F4] rounded-[2.5rem] p-6 lg:p-10 border border-[#F0E4D8] shadow-sm mb-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-block bg-[#FEF3E2] text-[#D47343] text-[11px] font-bold px-3 py-1 rounded-full mb-2 border border-[#FADCC7]">
                ⭐ Tiêu Chuẩn Tiệm Gấu Bông HD
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#4A3022] tracking-tight">
                Ảnh Chụp Thực Tế Hộp Quà Trước Khi Giao
              </h2>
              <p className="text-xs sm:text-sm text-[#8C6D58] mt-1 font-medium">
                Chụp thực tế tại bàn đóng gói lúc 15:30 hôm nay. Quà được gói niêm phong đúng mẫu bạn yêu cầu.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Đang tải bộ ảnh gói quà độ phân giải cao...')}
                className="bg-[#6B4226] hover:bg-[#52321c] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Ảnh Về Máy</span>
              </button>
              <button
                onClick={() => setActivePhotoModal('inside')}
                className="bg-white hover:bg-[#FAF4EB] text-[#6B4226] border border-[#E0D0C0] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Xem Chi Tiết</span>
              </button>
            </div>
          </div>

          {/* 3 Columns Grid: Photo 1, Photo 2, Handwritten Card Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo 1: Inside the gift box */}
            <div 
              onClick={() => setActivePhotoModal('inside')}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#EAE0D5] shadow-xs flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <span className="absolute top-3 left-3 z-10 bg-[#3D271D]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  ● GÓI MỞ HỘP & BÉ GẤU
                </span>
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="Ảnh mở hộp quà"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs font-bold text-[#8C6D58] border-t border-[#F0E4D7]">
                <span>Ảnh 01/02 - Bên trong</span>
                <span className="text-stone-400 font-semibold">15:30:40</span>
              </div>
            </div>

            {/* Photo 2: Outside / Bow tied finish */}
            <div 
              onClick={() => setActivePhotoModal('outside')}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#EAE0D5] shadow-xs flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                <span className="absolute top-3 left-3 z-10 bg-[#3D271D]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  ● ĐÓNG GÓI & NƠ HOÀN THIỆN
                </span>
                <img
                  src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80"
                  alt="Ảnh hộp quà hoàn thiện"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 flex items-center justify-between text-xs font-bold text-[#8C6D58] border-t border-[#F0E4D7]">
                <span>Ảnh 02/02 - Ngoại quan</span>
                <span className="text-stone-400 font-semibold">15:31:12</span>
              </div>
            </div>

            {/* Card 3: Handwritten Card Live Preview + Checklist */}
            <div className="flex flex-col justify-between">
              {/* Kraft Vintage Card */}
              <div className="bg-[#E5C9A8] rounded-2xl p-5 shadow-xs border border-[#D4B594] relative overflow-hidden flex-1 flex flex-col justify-between">
                {/* Vintage overlay texture effect */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: 'radial-gradient(circle, #5C3D2E 10%, transparent 11%)', backgroundSize: '12px 12px' }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#6B4226] uppercase border-b border-[#D0B290] pb-2 mb-3">
                    <span className="flex items-center gap-1.5">
                      <span>💌</span> THIỆP VIẾT TAY KÈM THEO
                    </span>
                    <span className="font-handwriting text-base italic text-[#8C5D39]">lovely wishes</span>
                  </div>

                  <p className="font-handwriting text-xl sm:text-2xl text-[#4A3022] leading-relaxed font-semibold my-2 px-1">
                    "Gửi My bé bỏng, mong mùa thu này em luôn ấm áp nhất khi ôm chú gấu nhỏ này bên cạnh nhé! Cố lên bài thi tuần này nha em yêu ❤️"
                  </p>
                  <p className="font-handwriting text-lg text-right text-[#6B4226] font-bold">
                    — From Item with all my love
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-bold text-[#7A5B44] pt-3 mt-3 border-t border-[#D0B290]">
                  <span>Mực nâu Sepia mộc</span>
                  <span>Chép tay bởi nghệ nhân Tiệm (15:25pm)</span>
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="bg-white rounded-2xl p-4 mt-4 border border-[#EAE0D5] shadow-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B4226] mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Chứng nhận chuẩn bị hoàn tất</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#7A6251] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đã kiểm tra đường kim mũi chỉ & nở bông</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đã xịt ướp hương quả ấm (giữ mùi 72 giờ)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đã gửi ảnh lưu trữ cho bạn trước khi đóng bao</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CARD 4: CHI TIẾT MÓN QUÀ & THANH TOÁN ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-start">
          {/* Left Column: Product in order (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-[#EFE5D8] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#4A3022]">Chi Tiết Món Quà Trong Đơn</h2>
              <span className="bg-[#FAF0E6] text-[#C25E2E] text-xs font-bold px-3 py-1 rounded-full">
                1 Sản phẩm
              </span>
            </div>

            {/* Product Card */}
            <div className="bg-[#FFF5EB] rounded-2xl p-4 border border-[#F3DFC9] flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-white border border-[#EAE0D5]">
                <img
                  src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=300&q=80"
                  alt="Bé Gấu Chai Nơ Ca-Rô"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base text-[#4A3022]">Bé Gấu Chai Nơ Ca-Rô (Size 35cm)</h3>
                  <span className="text-[#D47343] font-bold text-lg">340.000đ</span>
                </div>
                <p className="text-xs text-[#8C6D58] font-medium leading-relaxed mb-3">
                  Bộ sưu tập: Autumn Warmth 2024 • Lông tơ mềm xoắn cao cấp, kèm nơ cổ ca-rô dệt thủ công.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start text-[11px] font-bold">
                  <span className="bg-white border border-[#EAE0D5] px-2.5 py-0.5 rounded-md text-[#6B4226]">
                    Size: M - 35cm
                  </span>
                  <span className="bg-white border border-[#EAE0D5] px-2.5 py-0.5 rounded-md text-[#6B4226]">
                    Độ mềm mịn: 5/5 ⭐
                  </span>
                  <span className="bg-white border border-[#EAE0D5] px-2.5 py-0.5 rounded-md text-[#6B4226]">
                    Số lượng: 01
                  </span>
                </div>
              </div>
            </div>

            {/* Gói quà tặng thủ công tặng kèm (0đ) */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Gói quà tặng thủ công tặng kèm (0đ)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[#6B4226]">
                <div className="bg-[#FAF4EB]/80 p-3 rounded-xl border border-[#EFE1D2] flex items-center gap-2.5">
                  <span className="text-base">🎁</span>
                  <span>Hộp Kraft vân sóng cao cấp + Nơ Satin</span>
                </div>
                <div className="bg-[#FAF4EB]/80 p-3 rounded-xl border border-[#EFE1D2] flex items-center gap-2.5">
                  <span className="text-base">🌾</span>
                  <span>Rơm thông tự nhiên ủ hương dịu ấm</span>
                </div>
                <div className="bg-[#FAF4EB]/80 p-3 rounded-xl border border-[#EFE1D2] flex items-center gap-2.5">
                  <span className="text-base">💌</span>
                  <span>Thiệp viết tay lời chúc theo yêu cầu</span>
                </div>
                <div className="bg-[#FAF4EB]/80 p-3 rounded-xl border border-[#EFE1D2] flex items-center gap-2.5">
                  <span className="text-base">📷</span>
                  <span>Chụp ảnh thực tế trước khi xuất đơn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment summary (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 lg:p-8 border border-[#EFE5D8] shadow-sm">
            <h2 className="text-xl font-bold text-[#4A3022] mb-6">Thanh Toán</h2>

            <div className="space-y-3.5 text-xs font-medium text-[#7A6251]">
              <div className="flex justify-between">
                <span>Tạm tính gấu bông</span>
                <span className="font-bold text-[#4A3022]">340.000đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí đóng gói quà & thiệp tay</span>
                <span className="font-bold text-emerald-600">0đ (Miễn phí)</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển Hỏa Tốc Hà Nội</span>
                <span className="font-bold text-[#4A3022]">20.000đ</span>
              </div>
              <div className="flex justify-between">
                <span>Voucher Gặp Gấu Thu (Freeship)</span>
                <span className="font-bold text-rose-500">-50.000đ</span>
              </div>

              <div className="border-t border-[#F0E4D7] pt-4 mt-2 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#4A3022]">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-[#D47343]">310.000đ</span>
              </div>
            </div>

            {/* Payment badge */}
            <div className="bg-[#FFF9F3] border border-[#FCDCC5] rounded-xl p-3.5 mt-5 text-xs text-[#8C5D39] flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã thanh toán 100% qua QR Chuyển khoản Vietcombank</span>
            </div>

            {/* Electronic invoice VAT button */}
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="w-full mt-4 py-3 bg-[#FAF0E6] hover:bg-[#F5E4D4] text-[#6B4226] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FileText className="w-4 h-4 text-[#D47343]" />
              <span>Tải Hóa Đơn Điện Tử (VAT)</span>
            </button>
          </div>
        </section>

        {/* ================= CARD 5: CẦN ĐIỀU CHỈNH GIỜ GIAO HOẶC ĐỊA CHỈ? ================= */}
        <section className="bg-[#FAF0E6] border border-[#EFE1D2] rounded-[2.5rem] p-6 lg:p-10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="text-[11px] font-bold text-[#C25E2E] tracking-wider uppercase mb-2 flex items-center justify-center lg:justify-start gap-1.5">
              <span>🎧</span> Đội Ngũ Chăm Sóc Cửa Hàng Luôn Sẵn Sàng
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#4A3022] tracking-tight">
              Cần Điều Chỉnh Giờ Giao Hoặc Địa Chỉ?
            </h2>
            <p className="text-xs sm:text-sm text-[#8C6D58] mt-2 font-medium leading-relaxed">
              Nếu người nhận vắng nhà hoặc bạn muốn hẹn lại khung giờ giao bất ngờ đặc biệt, hãy thông báo ngay. Tiệm cam kết giữ bí mật trọn vẹn cho tới khi người thương mở hộp!
            </p>
          </div>

          {/* 2x2 Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setIsRescheduleModalOpen(true)}
              className="bg-white hover:bg-[#FAF4EB] text-[#6B4226] border border-[#E0D0C0] px-5 py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs whitespace-nowrap"
            >
              <Clock className="w-4 h-4 text-[#D47343]" />
              <span>Hẹn Lại Giờ Giao Bí Mật</span>
            </button>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-white hover:bg-[#FAF4EB] text-[#6B4226] border border-[#E0D0C0] px-5 py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#D47343]" />
              <span>Đổi Địa Chỉ / Người Nhận</span>
            </button>
            <a
              href="https://zalo.me"
              target="_blank"
              rel="noreferrer"
              className="bg-[#FEEAD8] hover:bg-[#FCDDC1] text-[#C25E2E] px-5 py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat Zalo với Quản Lý</span>
            </a>
            <a
              href="tel:0936123456"
              className="bg-[#6B4226] hover:bg-[#52321c] text-white px-5 py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm whitespace-nowrap text-center"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>Hotline Khẩn: 0936.123.456</span>
            </a>
          </div>
        </section>
      </div>

      {/* ================= MODAL: XEM CHI TIẾT ẢNH ================= */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-4/3 w-full bg-stone-900">
              <img
                src={
                  activePhotoModal === 'inside'
                    ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80'
                    : 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80'
                }
                alt="Ảnh phóng to"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#4A3022] text-base">
                  {activePhotoModal === 'inside' ? 'Ảnh 01/02 - Bên trong hộp quà & bé gấu' : 'Ảnh 02/02 - Hộp quà đóng nắp & thắt nơ satin'}
                </h3>
                <p className="text-xs text-[#8C6D58] mt-1">Được lưu vết tự động vào hệ thống lúc 15:30 chiều nay.</p>
              </div>
              <button
                onClick={() => {
                  showToast('Đã lưu ảnh về máy tính');
                  setActivePhotoModal(null);
                }}
                className="bg-[#6B4226] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#52321c] transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Tải ảnh gốc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: HẸN LẠI GIỜ GIAO BÍ MẬT ================= */}
      {isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsRescheduleModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#D47343] mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#4A3022] mb-1">Hẹn Lại Khung Giờ Giao Bí Mật</h3>
            <p className="text-xs text-[#8C6D58] mb-4">
              Tiệm sẽ báo ngay cho Shipper phụ trách đơn #{activeOrderCode} để không bấm chuông sai thời điểm.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                  Chọn khung giờ mong muốn hôm nay:
                </label>
                <select
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#D47343]"
                >
                  <option value="18:00 - 18:30">18:00 - 18:30 (Tối nay)</option>
                  <option value="18:30 - 19:00">18:30 - 19:00 (Tối nay - Khuyên dùng)</option>
                  <option value="19:30 - 20:00">19:30 - 20:00 (Tối nay)</option>
                  <option value="09:00 - 10:00 Sáng mai">09:00 - 10:00 (Sáng mai)</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#6B4226] hover:bg-[#52321c] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Xác nhận giờ mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ĐỔI ĐỊA CHỈ HOẶC NGƯỜI NHẬN ================= */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#D47343] mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#4A3022] mb-1">Cập Nhật Địa Chỉ Giao Hàng</h3>
            <p className="text-xs text-[#8C6D58] mb-4">
              Hệ thống sẽ cập nhật tọa độ tuyến giao mới tới shipper hỏa tốc.
            </p>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6B4226] mb-1.5">
                  Địa chỉ nhận hàng mới:
                </label>
                <textarea
                  rows={3}
                  value={newAddressInput}
                  onChange={(e) => setNewAddressInput(e.target.value)}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  placeholder="Nhập số nhà, tên tòa nhà, phố..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-500 hover:bg-stone-100 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-[#6B4226] hover:bg-[#52321c] text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: HÓA ĐƠN VAT ================= */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#4A3022] mb-1">Hóa Đơn Điện Tử Đã Sẵn Sàng</h3>
            <p className="text-xs text-[#8C6D58] mb-5">
              Hóa đơn điện tử VAT hợp lệ kèm chữ ký số của Tiệm Gấu Bông HD cho đơn #{activeOrderCode}.
            </p>
            <div className="bg-[#FAF4EB] p-4 rounded-2xl text-xs text-left mb-5 space-y-1.5 border border-[#EAE0D5]">
              <div className="flex justify-between">
                <span className="text-stone-500">Mã tra cứu:</span>
                <span className="font-bold text-[#6B4226]">VAT-2024-8921</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tổng thanh toán:</span>
                <span className="font-bold text-[#D47343]">310.000đ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Trạng thái:</span>
                <span className="font-bold text-emerald-600">Đã phát hành</span>
              </div>
            </div>
            <button
              onClick={() => {
                showToast('Đang tải file hóa đơn PDF...');
                setIsInvoiceModalOpen(false);
              }}
              className="w-full bg-[#6B4226] hover:bg-[#52321c] text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Tải file Hóa Đơn PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
