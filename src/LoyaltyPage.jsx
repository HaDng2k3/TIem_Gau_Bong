import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Gift, 
  ChevronRight, 
  Calendar, 
  Camera, 
  ShoppingBag, 
  Gamepad2, 
  Coins, 
  Info, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Clock, 
  Star, 
  X, 
  Copy, 
  Heart, 
  HelpCircle, 
  ExternalLink,
  Flame,
  Tag,
  PenTool,
  RotateCcw
} from 'lucide-react';
import { useLoyalty } from './context/LoyaltyContext';

export default function LoyaltyPage({ 
  onBackToHome, 
  onGoToCollection, 
  onOpenCart, 
  onApplyCoinsToCheckout 
}) {
  const { 
    balance, 
    transactions, 
    streakDays, 
    hasCheckedInToday, 
    clawPlaysLeft, 
    myVouchers, 
    checkInDaily, 
    playClawMachine, 
    submitReviewReward, 
    redeemVoucher 
  } = useLoyalty();

  // Filter tabs for transactions
  const [historyTab, setHistoryTab] = useState('all'); // 'all' | 'received' | 'used' | 'expired'
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Interactive Simulator State (Dùng Xu Giảm Trừ Demo)
  const [isCoinDeductionActive, setIsCoinDeductionActive] = useState(true);
  const [appliedCoins, setAppliedCoins] = useState(() => Math.min(balance, 48500));
  
  // Product Demo specs
  const demoProduct = {
    name: "Bé Gấu Chai Na Ca-Rô",
    category: "Mùa Thu",
    size: "Size M (35cm)",
    packaging: "Đóng gói túi Kraft",
    price: 340000,
    shippingFee: 30000,
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80"
  };

  // Max coins allowed for this order (50% of 340.000 = 170.000)
  const maxCoinsForOrder = Math.min(balance, Math.round(demoProduct.price * 0.5));

  // Calculations for Demo Receipt
  const effectiveCoins = isCoinDeductionActive ? Math.min(appliedCoins, maxCoinsForOrder) : 0;
  const demoTotal = Math.max(0, demoProduct.price + demoProduct.shippingFee - effectiveCoins);
  const demoCashback = Math.round(demoProduct.price * 0.05);

  // Interactive Modals
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showClawModal, setShowClawModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Claw Machine State inside modal
  const [clawState, setClawState] = useState('idle'); // 'idle' | 'dropping' | 'grabbing' | 'won'
  const [clawPrize, setClawPrize] = useState(null);

  // Review Modal State
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewText, setReviewText] = useState('Bé gấu rất xinh xắn, lông mềm mượt và quàng khăn ấm áp y hệt ảnh tiệm chụp!');
  const [hasPhotoPreview, setHasPhotoPreview] = useState(true);

  // Gift Card Message Modal State
  const [giftNote, setGiftNote] = useState('Chúc bạn một mùa thu thật ấm áp và luôn mỉm cười rạng rỡ như ánh nắng sớm mai!');
  const [fragrance, setFragrance] = useState('hoa-cuc'); // 'hoa-cuc' | 'vani' | 'none'

  // Voucher Catalog for Exchange
  const availableVouchers = [
    {
      id: 'v-20k',
      name: 'Voucher Giảm 20.000đ Đơn Hàng',
      desc: 'Áp dụng cho mọi đơn gấu bông bất kỳ từ 199.000đ',
      coinCost: 20000,
      badge: 'Phổ biến nhất'
    },
    {
      id: 'v-50k',
      name: 'Voucher Giảm 50.000đ Đơn Hàng',
      desc: 'Áp dụng cho đơn hàng từ 499.000đ hoặc combo 2 bé gấu',
      coinCost: 50000,
      badge: 'Tiết kiệm cao'
    },
    {
      id: 'v-freeship',
      name: 'Voucher Miễn Phí Vận Chuyển Toàn Quốc',
      desc: 'Freeship mọi miền tổ quốc (tối đa 35.000đ)',
      coinCost: 15000,
      badge: 'Được chuộng'
    },
    {
      id: 'v-giftbox',
      name: 'Tặng Miễn Phí Hộp Kraft Signature & Nơ Lụa',
      desc: 'Tặng trọn bộ hộp quà mộc mạc cao cấp trị giá 45.000đ',
      coinCost: 12000,
      badge: 'Quà tặng'
    },
    {
      id: 'v-mini-bear',
      name: 'Voucher Tặng Kèm Bé Gấu Móc Khóa Mini 12cm',
      desc: 'Tặng 1 móc khóa gấu bông xinh xắn đính kèm đơn hàng',
      coinCost: 28000,
      badge: 'Độc quyền'
    }
  ];

  // Handler for Daily Check-in
  const handleCheckIn = () => {
    const res = checkInDaily();
    triggerToast(res.message);
  };

  // Handler for Claw Machine
  const handleStartClaw = () => {
    if (clawPlaysLeft <= 0) {
      triggerToast('Hôm nay bạn đã hết lượt chơi rồi, mai quay lại nhé!');
      return;
    }
    setClawState('dropping');
    setTimeout(() => {
      setClawState('grabbing');
      setTimeout(() => {
        const res = playClawMachine();
        if (res.success) {
          setClawPrize(res.amount);
          setClawState('won');
        } else {
          setClawState('idle');
          triggerToast(res.message);
        }
      }, 1600);
    }, 1200);
  };

  // Handler for submitting photo review
  const handleSendReview = (e) => {
    e.preventDefault();
    const res = submitReviewReward("Bé Gấu Chai Na Ca-Rô");
    setShowReviewModal(false);
    triggerToast(res.message);
  };

  // Handler for redeeming voucher
  const handleRedeemVoucher = (voucher) => {
    const res = redeemVoucher(voucher);
    triggerToast(res.message);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (historyTab === 'all') return true;
    if (historyTab === 'received') return tx.type === 'received';
    if (historyTab === 'used') return tx.type === 'used';
    if (historyTab === 'expired') return tx.type === 'expired';
    return true;
  });

  const displayedTransactions = showAllTransactions 
    ? filteredTransactions 
    : filteredTransactions.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF4EB] text-cozy-text font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#6B4226] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-slideIn text-sm font-semibold border border-amber-300/30">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-5">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-cozy-text/60 mb-6">
          <button 
            onClick={onBackToHome} 
            className="hover:text-cozy-primary transition flex items-center gap-1 cursor-pointer"
          >
            <span>🏠 Trang Chủ</span>
          </button>
          <span>/</span>
          <span>Tài Khoản</span>
          <span>/</span>
          <span className="bg-[#FFF4E8] text-cozy-primary px-3 py-1 rounded-full border border-[#FADCC7] font-bold flex items-center gap-1">
            <span>🪙 Ví Xu Gấu Bông & Tích Điểm</span>
          </span>
        </div>

        {/* ================= SECTION 1: WALLET DASHBOARD (2 CARDS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* LEFT CARD: SỐ DƯ KHẢ DỤNG */}
          <div className="lg:col-span-7 bg-white rounded-[28px] p-6 sm:p-8 border border-cozy-border shadow-xs relative overflow-hidden flex flex-col justify-between">
            {/* Soft decorative background circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              {/* Member Tier & Phone Badge Row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3E2] text-[#B85C2E] border border-[#FADCC7]">
                  <Star className="w-3.5 h-3.5 fill-[#B85C2E] text-[#B85C2E]" />
                  <span>Hội Viên Gấu Bông Vàng</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF4EB] text-cozy-text/70 border border-cozy-border">
                  <Calendar className="w-3.5 h-3.5 text-cozy-text/50" />
                  <span>Tích luỹ tự động theo SĐT: 098****254</span>
                </span>
              </div>

              {/* Main Balance Display */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-md flex items-center justify-center text-white shrink-0 mt-1">
                  {/* Cute Paw / Bear Coin Icon */}
                  <span className="text-3xl">🐾</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-wider text-cozy-text/50 uppercase mb-1">
                    SỐ DƯ KHẢ DỤNG
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-[#6B4226] tracking-tight">
                      {balance.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-cozy-text/80">
                      Xu Gấu
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges / Sub info rows */}
              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C461F] bg-[#FFF8F0] px-3.5 py-1.5 rounded-xl border border-[#F6DEC9]">
                  <Tag className="w-3.5 h-3.5 text-cozy-primary" />
                  <span>Giá trị quy đổi: <span className="underline decoration-amber-400">{balance.toLocaleString('vi-VN')}đ</span> giảm trừ thẳng</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cozy-text/60 pl-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Có 5.000 xu sẽ hết hạn vào 31/12/2026</span>
                </div>
              </div>
            </div>

            {/* Reassurance Callout Box */}
            <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl p-4 text-xs text-cozy-text/80 leading-relaxed flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cozy-text font-bold">Minh bạch & Đơn giản: </strong>
                <span>
                  1 Xu Gấu = 1 VNĐ. Bạn được trừ thẳng vào giỏ hàng ngay khi đặt gấu bông mà không cần đổi mã coupon phức tạp hay điều kiện ràng buộc.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: HÀNH ĐỘNG NHANH */}
          <div className="lg:col-span-5 bg-white rounded-[28px] p-6 sm:p-8 border border-cozy-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-bold text-cozy-text">Hành Động Nhanh</h3>
                <span className="text-[10px] font-bold text-cozy-text/40 tracking-widest uppercase">TIỆN ÍCH VÍ</span>
              </div>

              <div className="space-y-3">
                {/* Button 1: Primary Orange/Brown */}
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="w-full bg-[#9F4820] hover:bg-[#873A14] text-white p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-left">Đổi Xu Sang Voucher Quà Tặng</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Button 2: Quests */}
                <button
                  onClick={() => {
                    const el = document.getElementById('quests-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-white hover:bg-[#FAF4EB] text-cozy-text border border-cozy-border p-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FEF3E2] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-left">Nhiệm Vụ Kiếm Thêm Xu (+19.000 Xu)</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cozy-text/40 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Button 3: Rules & Policy */}
                <button
                  onClick={() => setShowRulesModal(true)}
                  className="w-full bg-white hover:bg-[#FAF4EB] text-cozy-text border border-cozy-border p-4 rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-between group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FAF4EB] flex items-center justify-center shrink-0">
                      <HelpCircle className="w-4 h-4 text-cozy-primary" />
                    </div>
                    <span className="text-left">Quy Định & Thể Lệ Dùng Xu</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cozy-text/40 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Bottom note */}
            <div className="pt-5 mt-4 border-t border-cozy-border/60 text-center">
              <span className="text-xs text-cozy-text/60 italic flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Xu được cập nhật tức thì sau khi giao hàng thành công</span>
              </span>
            </div>
          </div>

        </div>


        {/* ================= SECTION 2: CHECKOUT DEDUCTION SIMULATOR ================= */}
        <div className="mb-14">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cozy-primary uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TÍNH NĂNG ĐỘC QUYỀN TẠI TIỆM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#6B4226] tracking-tight">
                Dùng Xu Giảm Trừ Trực Tiếp Khi Thanh Toán
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-cozy-text/70 max-w-md font-medium leading-relaxed">
              Không cần quy đổi mã voucher rườm rà. Bạn chỉ cần gạt công tắc hoặc chọn số xu mong muốn ngay trước khi hoàn tất đặt hàng.
            </p>
          </div>

          {/* Interactive Card */}
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-cozy-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: CONTROLS & PRODUCT */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product preview card */}
              <div className="bg-[#FAF4EB]/70 border border-cozy-border rounded-2xl p-4 flex items-center gap-4">
                <div className="relative shrink-0">
                  <img 
                    src={demoProduct.image} 
                    alt={demoProduct.name} 
                    className="w-20 h-20 rounded-xl object-cover shadow-xs border border-cozy-border" 
                  />
                  <span className="absolute -top-1.5 -left-1.5 bg-[#B85C2E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    Bán Chạy
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-cozy-text truncate">
                      {demoProduct.name}
                    </h4>
                    <span className="font-black text-sm sm:text-base text-[#6B4226]">
                      {demoProduct.price.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <p className="text-xs text-cozy-text/70 mt-0.5">
                    Phân loại: Mùa Thu • {demoProduct.size} • {demoProduct.packaging}
                  </p>
                  <p className="text-[11px] font-semibold text-cozy-primary mt-1 flex items-center gap-1">
                    <span>🎁 Tặng kèm hộp Kraft vintage & thiệp tay • Số lượng: 01 bé</span>
                  </p>
                </div>
              </div>

              {/* Coin Deduction Control Box */}
              <div className="bg-[#FFF9F2] border border-[#F6DEC9] rounded-2xl p-5 space-y-4">
                {/* Top switch row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold text-sm">
                      🪙
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-cozy-text">
                        Dùng Xu Giảm Tiền Đơn Hàng
                      </div>
                      <div className="text-[11px] text-cozy-text/60">
                        Số xu khả dụng: <strong className="text-[#6B4226]">{balance.toLocaleString('vi-VN')} Xu</strong>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => setIsCoinDeductionActive(!isCoinDeductionActive)}
                    className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer relative ${
                      isCoinDeductionActive ? 'bg-[#D47343]' : 'bg-gray-300'
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                        isCoinDeductionActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Expanded Controls when Active */}
                {isCoinDeductionActive && (
                  <div className="pt-3 border-t border-[#F2D7C2] space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cozy-text">Số xu áp dụng cho đơn này:</span>
                      <span className="text-[11px] font-semibold text-cozy-primary bg-white px-2 py-0.5 rounded-md border border-[#F2D7C2]">
                        🛡️ Tối đa 50% đơn ({maxCoinsForOrder.toLocaleString('vi-VN')} Xu)
                      </span>
                    </div>

                    {/* Number input and Max button */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={0}
                          max={maxCoinsForOrder}
                          step={500}
                          value={appliedCoins}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setAppliedCoins(Math.min(val, maxCoinsForOrder));
                          }}
                          className="w-full bg-white border border-[#E8C5AC] rounded-xl py-2.5 px-4 pr-12 text-sm font-bold text-cozy-text focus:outline-none focus:border-cozy-primary shadow-xs"
                        />
                        <span className="absolute right-4 top-2.5 text-xs font-bold text-cozy-text/50">
                          Xu
                        </span>
                      </div>
                      <button
                        onClick={() => setAppliedCoins(maxCoinsForOrder)}
                        className="bg-[#E5A93C] hover:bg-[#D4992C] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer shrink-0"
                      >
                        Dùng Tối Đa
                      </button>
                    </div>

                    {/* Interactive Slider */}
                    <div className="space-y-1.5 pt-1">
                      <input
                        type="range"
                        min={0}
                        max={maxCoinsForOrder}
                        step={500}
                        value={appliedCoins}
                        onChange={(e) => setAppliedCoins(Number(e.target.value))}
                        className="w-full h-2 bg-[#EAD8CA] rounded-lg appearance-none cursor-pointer accent-[#D47343]"
                      />
                      <div className="flex justify-between text-[10px] font-semibold text-cozy-text/50">
                        <span>0 Xu</span>
                        <span>25.000 Xu</span>
                        <span>{maxCoinsForOrder.toLocaleString('vi-VN')} Xu (Hiện có)</span>
                      </div>
                    </div>

                    {/* Quick Selection Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-cozy-text/60 font-medium">Chọn nhanh:</span>
                      {[10000, 20000, 35000].map(val => (
                        <button
                          key={val}
                          onClick={() => setAppliedCoins(Math.min(val, maxCoinsForOrder))}
                          className={`text-xs px-3 py-1 rounded-lg border font-bold transition cursor-pointer ${
                            appliedCoins === val
                              ? 'bg-white border-cozy-primary text-cozy-primary shadow-xs'
                              : 'bg-white/80 border-[#E8C5AC] text-cozy-text hover:bg-white'
                          }`}
                        >
                          {val.toLocaleString('vi-VN')} Xu
                        </button>
                      ))}
                      <button
                        onClick={() => setAppliedCoins(maxCoinsForOrder)}
                        className={`text-xs px-3 py-1 rounded-lg border font-bold transition cursor-pointer ${
                          appliedCoins === maxCoinsForOrder
                            ? 'bg-white border-cozy-primary text-cozy-primary shadow-xs'
                            : 'bg-white/80 border-[#E8C5AC] text-cozy-text hover:bg-white'
                        }`}
                      >
                        Toàn bộ {maxCoinsForOrder.toLocaleString('vi-VN')} Xu
                      </button>
                    </div>
                  </div>
                )}

                {/* Safe Reassurance */}
                <div className="pt-2 text-[11px] text-cozy-text/70 flex items-start gap-2 border-t border-[#F2D7C2]/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cam kết an tâm:</strong> Nếu đơn hàng bị hoàn/hủy, toàn bộ số xu đã dùng sẽ được hoàn trả 100% vào ví trong vòng 5 phút.
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PHIẾU TÍNH TIỀN DEMO (RECEIPT) */}
            <div className="lg:col-span-5 bg-[#FAF4EB]/80 border border-cozy-border rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cozy-border mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧾</span>
                    <h4 className="font-bold text-sm text-cozy-text">Phiếu Tính Tiền Demo</h4>
                  </div>
                  <span className="bg-[#FEF3E2] text-[#B85C2E] border border-[#FADCC7] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    HOÀN LẠI 5% ORDER
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-cozy-text/80">
                    <span>Tạm tính sản phẩm</span>
                    <span className="font-bold text-cozy-text">{demoProduct.price.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between text-cozy-text/80">
                    <span>Phí giao hàng ấm áp (Hà Nội)</span>
                    <span className="font-bold text-cozy-text">{demoProduct.shippingFee.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between items-center text-cozy-text/80">
                    <span>Hộp quà Kraft & Thiệp viết tay</span>
                    <span className="bg-[#FEF3E2] text-cozy-primary text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#FADCC7]">
                      0đ (Tặng kèm)
                    </span>
                  </div>

                  {isCoinDeductionActive && effectiveCoins > 0 && (
                    <div className="flex justify-between text-cozy-primary font-bold bg-white p-2.5 rounded-xl border border-[#FADCC7]">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5" />
                        <span>Giảm trừ từ ví Xu Gấu:</span>
                      </span>
                      <span>-{effectiveCoins.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  {/* Dotted separator */}
                  <div className="border-b border-dashed border-cozy-border my-2" />

                  <div className="pt-1 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-cozy-text block">Tổng Cần Thanh Toán:</span>
                      {effectiveCoins > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-700">
                          Tiết kiệm được {effectiveCoins.toLocaleString('vi-VN')}đ nhờ tích lũy xu gấu
                        </span>
                      )}
                    </div>
                    <span className="text-2xl font-black text-[#6B4226]">
                      {demoTotal.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <button
                  onClick={() => {
                    if (onApplyCoinsToCheckout) {
                      onApplyCoinsToCheckout({
                        product: demoProduct,
                        appliedCoins: effectiveCoins
                      });
                    } else if (onOpenCart) {
                      onOpenCart();
                    }
                  }}
                  className="w-full bg-[#6B4226] hover:bg-[#52321c] text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Đến Giỏ Hàng Để Áp Dụng Ngay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[11px] text-center text-cozy-text/60">
                  Hoặc chọn thêm gấu để nhận thêm +5% hoàn xu
                </p>

                {/* Cashback reward note */}
                <div className="bg-[#FEF3E2] border border-[#FADCC7] rounded-xl p-3 text-xs text-[#8C461F] flex items-center gap-2.5 font-medium">
                  <Gift className="w-4 h-4 text-cozy-primary shrink-0" />
                  <span>
                    Sau khi nhận bé gấu này, bạn sẽ nhận tiếp <strong>+{demoCashback.toLocaleString('vi-VN')} Xu</strong> cho lần mua kế tiếp!
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* ================= SECTION 3: QUESTS (NHIỆM VỤ TÍCH THÊM XU GẤU) ================= */}
        <div id="quests-section" className="mb-14 scroll-mt-20">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cozy-primary uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GIA TĂNG SỐ DƯ TIẾT KIỆM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#6B4226] tracking-tight">
                Nhiệm Vụ Tích Thêm Xu Gấu
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-cozy-text/70 font-medium">
              Hoàn thành để nhận thêm tới 25.000 Xu mỗi tuần
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* QUEST 1: MUA SẮM TÍCH LUỸ */}
            <div className="bg-white rounded-3xl p-6 border border-cozy-border shadow-xs hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-cozy-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    🛍️
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                    TỰ ĐỘNG 100%
                  </span>
                </div>

                <h3 className="text-base font-bold text-cozy-text mb-2">
                  Mua Sắm Tích Luỹ
                </h3>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium mb-4">
                  Hoàn trực tiếp 5% giá trị đơn hàng thành Xu Gấu ngay khi giao thành công.
                </p>
              </div>

              <div className="pt-4 border-t border-cozy-border flex items-center justify-between">
                <span className="font-extrabold text-xs text-cozy-primary bg-[#FFF4E8] px-2.5 py-1 rounded-lg">
                  +5% Giá Trị
                </span>
                <button
                  onClick={onGoToCollection}
                  className="text-xs font-bold text-cozy-text hover:text-cozy-primary transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Mua ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* QUEST 2: ĐÁNH GIÁ KÈM ẢNH/VIDEO */}
            <div className="bg-white rounded-3xl p-6 border border-cozy-border shadow-xs hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-cozy-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    📷
                  </div>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                    CHIA SẺ CẢM NHẬN
                  </span>
                </div>

                <h3 className="text-base font-bold text-cozy-text mb-2">
                  Đánh Giá Kèm Ảnh/Video
                </h3>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium mb-4">
                  Gửi feedback 5 sao kèm hình ảnh thực tế bé gấu xinh xắn nhận ngay +3.000 Xu.
                </p>
              </div>

              <div className="pt-4 border-t border-cozy-border flex items-center justify-between">
                <span className="font-extrabold text-xs text-cozy-primary bg-[#FFF4E8] px-2.5 py-1 rounded-lg">
                  +3.000 Xu / bài
                </span>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-xs font-bold text-cozy-text hover:text-cozy-primary transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Viết đánh giá</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* QUEST 3: ĐIỂM DANH ẤM ÁP */}
            <div className="bg-white rounded-3xl p-6 border border-cozy-border shadow-xs hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-cozy-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    📅
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                    ĐANG DUY TRÌ NGÀY THỨ {streakDays}
                  </span>
                </div>

                <h3 className="text-base font-bold text-cozy-text mb-2">
                  Điểm Danh Ấm Áp
                </h3>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium mb-4">
                  Ghé tiệm mỗi sáng nhận +200 Xu. Chuỗi 7 ngày liên tiếp thưởng thêm +1.500 Xu.
                </p>
              </div>

              <div className="pt-4 border-t border-cozy-border flex items-center justify-between">
                <span className="font-extrabold text-xs text-cozy-primary bg-[#FFF4E8] px-2.5 py-1 rounded-lg">
                  +200 Xu / ngày
                </span>
                <button
                  onClick={handleCheckIn}
                  disabled={hasCheckedInToday}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer ${
                    hasCheckedInToday
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#E5A93C] hover:bg-[#D4992C] text-white shadow-xs'
                  }`}
                >
                  {hasCheckedInToday ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã điểm danh</span>
                    </>
                  ) : (
                    <span>Điểm danh</span>
                  )}
                </button>
              </div>
            </div>

            {/* QUEST 4: GẮP GẤU MÙA THU */}
            <div className="bg-white rounded-3xl p-6 border border-cozy-border shadow-xs hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-cozy-primary flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                    🎮
                  </div>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-full">
                    TRÒ CHƠI VUI NHỘN
                  </span>
                </div>

                <h3 className="text-base font-bold text-cozy-text mb-2">
                  Gắp Gấu Mùa Thu
                </h3>
                <p className="text-xs text-cozy-text/70 leading-relaxed font-medium mb-4">
                  1 lượt quay miễn phí hàng ngày. 100% trúng thưởng ngẫu nhiên từ 500 - 5.000 Xu.
                </p>
              </div>

              <div className="pt-4 border-t border-cozy-border flex items-center justify-between">
                <span className="font-extrabold text-xs text-cozy-text/70">
                  Lượt chơi: <strong className="text-cozy-primary">{clawPlaysLeft}/1</strong>
                </span>
                <button
                  onClick={() => setShowClawModal(true)}
                  className="bg-[#9F4820] hover:bg-[#853C17] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Bập ngay</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>


        {/* ================= SECTION 4: TRANSACTION HISTORY (SAO KÊ MINH BẠCH) ================= */}
        <div className="mb-14">
          <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-cozy-border shadow-xs">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cozy-border">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-cozy-primary uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SAO KÊ MINH BẠCH</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#6B4226] tracking-tight">
                  Lịch Sử Biến Động Xu Gấu
                </h3>
              </div>

              {/* Segmented Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-[#FAF4EB] p-1.5 rounded-2xl border border-cozy-border">
                {[
                  { id: 'all', label: 'Tất Cả' },
                  { id: 'received', label: 'Đã Nhận (+)' },
                  { id: 'used', label: 'Đã Dùng (-)' },
                  { id: 'expired', label: 'Hết Hạn' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setHistoryTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      historyTab === tab.id
                        ? 'bg-[#6B4226] text-white shadow-xs'
                        : 'text-cozy-text/70 hover:text-cozy-text'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction List Items */}
            <div className="divide-y divide-cozy-border/60">
              {displayedTransactions.length === 0 ? (
                <div className="py-12 text-center text-cozy-text/50 text-sm font-medium">
                  Chưa có giao dịch nào trong danh mục này.
                </div>
              ) : (
                displayedTransactions.map((tx) => {
                  const isNegative = tx.amount < 0;
                  return (
                    <div 
                      key={tx.id} 
                      className="py-4.5 sm:py-5 flex items-center justify-between gap-4 hover:bg-[#FAF4EB]/40 px-3 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-base ${
                          isNegative 
                            ? 'bg-[#FAF0E6] text-[#6B4226]' 
                            : 'bg-[#FFF4E8] text-[#D47343]'
                        }`}>
                          {isNegative ? '🛍️' : '🎁'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-cozy-text">
                              {tx.title}
                            </h4>
                            {tx.tag && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF4EB] text-cozy-text/70 border border-cozy-border">
                                {tx.tag}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-cozy-text/60 mt-0.5 flex items-center gap-2">
                            <span>{tx.date}</span>
                            <span>•</span>
                            <span className="text-cozy-text/80 font-medium">{tx.subText}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className={`font-black text-sm sm:text-base ${
                          isNegative ? 'text-[#8C461F]' : 'text-[#D47343]'
                        }`}>
                          {isNegative 
                            ? `${tx.amount.toLocaleString('vi-VN')} Xu` 
                            : `+${tx.amount.toLocaleString('vi-VN')} Xu`}
                        </div>
                        <div className="text-[10px] font-medium text-cozy-text/50 mt-0.5">
                          Số dư sau GD: {tx.balanceAfter ? tx.balanceAfter.toLocaleString('vi-VN') : balance.toLocaleString('vi-VN')} Xu
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* History Footer */}
            <div className="pt-6 mt-4 border-t border-cozy-border flex flex-col sm:flex-row items-center justify-between text-xs text-cozy-text/60 gap-3">
              <div>
                Hiển thị {displayedTransactions.length} trong tổng số {filteredTransactions.length} giao dịch gần nhất
              </div>
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="font-bold text-[#6B4226] hover:text-cozy-primary transition flex items-center gap-1 cursor-pointer"
              >
                <span>{showAllTransactions ? 'Thu gọn danh sách ↑' : `Xem đầy đủ ${filteredTransactions.length} giao dịch gần nhất →`}</span>
              </button>
            </div>

          </div>
        </div>


        {/* ================= SECTION 5: SPECIAL GIFT MESSAGE BANNER ================= */}
        <div className="bg-gradient-to-r from-[#FFF8F0] to-[#FAF0E6] rounded-[28px] p-6 sm:p-8 border border-cozy-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-cozy-border shadow-xs">
              <img 
                src="https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=400&q=80" 
                alt="Hộp quà vintage" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-cozy-primary uppercase mb-1">
                GỬI QUÀ & YÊU THƯƠNG
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-cozy-text mb-1">
                Bạn gửi gắm cho người đặc biệt?
              </h3>
              <p className="text-xs text-cozy-text/70 max-w-xl font-medium leading-relaxed">
                Tiệm miễn phí hoàn toàn dịch vụ viết thiệp tay cổ điển và xịt nước hoa hoa cúc nhẹ dịu thơm thoang thoảng cho mọi đơn hàng.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMessageModal(true)}
            className="bg-[#6B4226] hover:bg-[#52321c] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>✍️ Soạn Lời Chúc Gửi Kèm</span>
          </button>
        </div>

      </div>


      {/* ================= MODAL 1: ĐỔI XU SANG VOUCHER ================= */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-cozy-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowVoucherModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-cozy-text/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4E8] text-cozy-primary mx-auto flex items-center justify-center text-2xl mb-2">
                🎁
              </div>
              <h3 className="text-xl font-black text-cozy-text">Đổi Xu Sang Voucher Quà Tặng</h3>
              <p className="text-xs text-cozy-text/70 mt-1">
                Số dư hiện có: <strong className="text-cozy-primary">{balance.toLocaleString('vi-VN')} Xu</strong>
              </p>
            </div>

            <div className="space-y-3.5 mb-6">
              {availableVouchers.map(v => {
                const canAfford = balance >= v.coinCost;
                return (
                  <div 
                    key={v.id} 
                    className="p-4 rounded-2xl border border-cozy-border hover:border-cozy-primary/50 transition flex items-center justify-between gap-3 bg-[#FAF4EB]/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-cozy-text">{v.name}</h4>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {v.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-cozy-text/60 mt-0.5">{v.desc}</p>
                      <div className="mt-1 text-xs font-bold text-cozy-primary">
                        Cần: {v.coinCost.toLocaleString('vi-VN')} Xu
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeemVoucher(v)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        canAfford 
                          ? 'bg-[#9F4820] hover:bg-[#853C17] text-white shadow-xs'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Đổi Ngay' : 'Thiếu Xu'}
                    </button>
                  </div>
                );
              })}
            </div>

            {myVouchers.length > 0 && (
              <div className="pt-4 border-t border-cozy-border">
                <h4 className="font-bold text-xs text-cozy-text mb-2">Mã voucher đã đổi của bạn:</h4>
                <div className="space-y-2">
                  {myVouchers.map((mv, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-dashed border-cozy-primary flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-cozy-text">{mv.name}</span>
                        <span className="block text-[11px] text-cozy-primary font-mono font-bold">{mv.code}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(mv.code);
                          triggerToast(`Đã sao chép mã ${mv.code}`);
                        }}
                        className="p-2 hover:bg-[#FFF4E8] rounded-lg text-cozy-primary transition cursor-pointer"
                        title="Sao chép mã"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ================= MODAL 2: GẮP GẤU MÙA THU (MINI GAME) ================= */}
      {showClawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 border border-cozy-border shadow-2xl relative text-center">
            <button
              onClick={() => {
                setShowClawModal(false);
                setClawState('idle');
                setClawPrize(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-cozy-text/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#FEF3E2] text-cozy-primary mb-2">
              MINI GAME TRÚNG 100%
            </span>
            <h3 className="text-2xl font-black text-cozy-text mb-1">Máy Gắp Gấu Mùa Thu 🧸</h3>
            <p className="text-xs text-cozy-text/70 mb-6 font-medium">
              Thả càng gắp bé gấu may mắn mang về từ 500 - 5.000 Xu Gấu!
            </p>

            {/* Claw machine arcade display box */}
            <div className="w-full h-56 bg-gradient-to-b from-[#FFF5E6] to-[#FFE0BD] rounded-3xl border-4 border-[#E5A93C] relative overflow-hidden flex flex-col items-center justify-between p-4 mb-6 shadow-inner">
              
              {/* Mechanical claw track & claw */}
              <div className="w-full relative flex justify-center">
                <div className={`transition-all duration-700 ${
                  clawState === 'dropping' ? 'translate-y-16 scale-110' :
                  clawState === 'grabbing' ? 'translate-y-20 scale-125' :
                  clawState === 'won' ? '-translate-y-1 scale-100' : 'translate-y-0'
                }`}>
                  <div className="w-1.5 h-10 bg-gray-400 mx-auto" />
                  <div className="text-3xl filter drop-shadow">🏗️</div>
                </div>
              </div>

              {/* Stuffed bears in the bin */}
              <div className="flex items-center justify-center gap-3 text-4xl">
                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🧸</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐻</span>
                <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🐼</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🦊</span>
              </div>

              {/* Status indicator */}
              <div className="bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-cozy-text shadow-xs">
                {clawState === 'idle' && 'Nhấn nút phía dưới để thả càng gắp!'}
                {clawState === 'dropping' && 'Càng gắp đang hạ xuống...'}
                {clawState === 'grabbing' && 'Đang gắp bé gấu xinh xắn...'}
                {clawState === 'won' && `🎉 Trúng thưởng: +${clawPrize?.toLocaleString('vi-VN')} Xu Gấu!`}
              </div>
            </div>

            {/* Actions */}
            {clawState === 'won' ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold">
                  Chúc mừng bạn! {clawPrize?.toLocaleString('vi-VN')} Xu đã được cộng ngay vào ví của bạn!
                </div>
                <button
                  onClick={() => {
                    setShowClawModal(false);
                    setClawState('idle');
                  }}
                  className="w-full bg-[#6B4226] text-white font-bold py-3 rounded-2xl text-xs cursor-pointer shadow-md"
                >
                  Tuyệt Vời & Đóng Lại
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartClaw}
                disabled={clawState !== 'idle' || clawPlaysLeft <= 0}
                className={`w-full py-3.5 rounded-2xl font-black text-sm tracking-wide transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  clawPlaysLeft > 0 && clawState === 'idle'
                    ? 'bg-[#E5A93C] hover:bg-[#D4992C] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Gamepad2 className="w-5 h-5" />
                <span>{clawPlaysLeft > 0 ? 'BẬP NGAY (LƯỢT MIỄN PHÍ)' : 'HẾT LƯỢT HÔM NAY'}</span>
              </button>
            )}
          </div>
        </div>
      )}


      {/* ================= MODAL 3: ĐÁNH GIÁ KÈM ẢNH (NHẬN 3.000 XU) ================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-cozy-border shadow-2xl relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-cozy-text/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl block mb-2">📸</span>
              <h3 className="text-xl font-black text-cozy-text">Gửi Cảm Nhận Nhận 3.000 Xu</h3>
              <p className="text-xs text-cozy-text/70 mt-1">
                Chia sẻ khoảnh khắc ấm áp cùng bé gấu để nhận ngay điểm thưởng
              </p>
            </div>

            <form onSubmit={handleSendReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cozy-text mb-1">Chọn mức độ yêu thích:</label>
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewStars(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= reviewStars 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cozy-text mb-1">Lời nhắn gửi tiệm:</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#FAF4EB] border border-cozy-border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-cozy-primary"
                  placeholder="Bé gấu mềm mượt, thơm mùi hoa cúc..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cozy-text mb-1">Hình ảnh đính kèm:</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border-2 border-dashed border-cozy-primary/50 overflow-hidden relative group">
                    <img 
                      src={demoProduct.image} 
                      alt="Ảnh feedback" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-center justify-center font-bold">
                      Đã chọn
                    </div>
                  </div>
                  <div className="text-xs text-cozy-text/70">
                    <div className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>1 ảnh đã tải lên</span>
                    </div>
                    <span className="text-[11px] text-cozy-text/50">Hệ thống AI duyệt ảnh hợp lệ ngay lập tức</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#9F4820] hover:bg-[#853C17] text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-md cursor-pointer mt-2"
              >
                Gửi Đánh Giá & Nhận +3.000 Xu Ngay
              </button>
            </form>
          </div>
        </div>
      )}


      {/* ================= MODAL 4: QUY ĐỊNH & THỂ LỆ ================= */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-8 border border-cozy-border shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-cozy-text/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4E8] text-cozy-primary flex items-center justify-center text-xl">
                📖
              </div>
              <div>
                <h3 className="text-lg font-black text-cozy-text">Quy Định & Thể Lệ Dùng Xu Gấu</h3>
                <p className="text-xs text-cozy-text/60">Chính sách minh bạch & bảo vệ quyền lợi bạn đọc</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-cozy-text/80 leading-relaxed">
              <div className="p-3.5 bg-[#FAF4EB] rounded-2xl border border-cozy-border">
                <strong className="text-cozy-text block mb-1">1. Tỷ lệ quy đổi:</strong>
                <span>1 Xu Gấu = 1 VNĐ. Xu được giảm trừ trực tiếp vào tổng tiền thanh toán của đơn hàng tiếp theo.</span>
              </div>

              <div className="p-3.5 bg-[#FAF4EB] rounded-2xl border border-cozy-border">
                <strong className="text-cozy-text block mb-1">2. Hạn mức áp dụng:</strong>
                <span>Bạn có thể sử dụng tối đa lên tới 50% giá trị đơn hàng bằng Xu Gấu. Phần còn lại có thể thanh toán bằng COD hoặc Chuyển khoản.</span>
              </div>

              <div className="p-3.5 bg-[#FAF4EB] rounded-2xl border border-cozy-border">
                <strong className="text-cozy-text block mb-1">3. Thời hạn hiệu lực:</strong>
                <span>Xu Gấu có hạn dùng trong vòng 12 tháng kể từ ngày giao dịch thành công. Tiệm sẽ gửi thông báo trước 30 ngày nếu có xu sắp hết hạn.</span>
              </div>

              <div className="p-3.5 bg-[#FAF4EB] rounded-2xl border border-cozy-border">
                <strong className="text-cozy-text block mb-1">4. Chính sách hoàn xu an tâm:</strong>
                <span>Nếu đơn hàng bị hủy hoặc hoàn trả theo quy định của tiệm, 100% số xu bạn đã sử dụng sẽ được hoàn trả tự động vào ví trong vòng 5 phút.</span>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full bg-[#6B4226] text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer mt-6 shadow-sm"
            >
              Đã Hiểu & Đóng Lại
            </button>
          </div>
        </div>
      )}


      {/* ================= MODAL 5: SOẠN LỜI CHÚC GỬI KÈM ================= */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 border border-cozy-border shadow-2xl relative">
            <button
              onClick={() => setShowMessageModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-cozy-text/60 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <span className="text-3xl block mb-2">💌</span>
              <h3 className="text-xl font-black text-cozy-text">Viết Thiệp Tay & Xịt Nước Hoa</h3>
              <p className="text-xs text-cozy-text/70 mt-1 font-medium">
                Dịch vụ hoàn toàn miễn phí đi kèm với chiếc ôm ấm áp
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-cozy-text mb-1">Lời chúc viết tay lên thiệp Kraft:</label>
                <textarea
                  rows={4}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  className="w-full bg-[#FFFBF5] border border-[#F2D7C2] rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-cozy-primary font-handwriting text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cozy-text mb-1.5">Mùi hương xịt lên gấu & hộp quà:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'hoa-cuc', label: 'Hoa Cúc Nhẹ', icon: '🌼' },
                    { id: 'vani', label: 'Vani Ấm', icon: '🍦' },
                    { id: 'none', label: 'Tự Nhiên', icon: '🌿' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFragrance(f.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                        fragrance === f.id
                          ? 'bg-[#FFF4E8] border-cozy-primary text-cozy-primary shadow-xs'
                          : 'bg-[#FAF4EB] border-cozy-border text-cozy-text/70'
                      }`}
                    >
                      <span className="text-base">{f.icon}</span>
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowMessageModal(false);
                  triggerToast('Đã lưu lời chúc viết tay & mùi hương ấm áp cho đơn hàng!');
                }}
                className="w-full bg-[#6B4226] hover:bg-[#52321c] text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-md cursor-pointer mt-2"
              >
                Lưu Lời Chúc Vào Giỏ Quà
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
