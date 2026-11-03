import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Gift,
  Check,
  ChevronRight,
  ChevronDown,
  Star,
  Heart,
  Camera,
  Share2,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Gamepad2,
  Users,
  Copy,
  Leaf,
  ShoppingBag,
  ExternalLink,
  Award,
  Clock,
  Sparkle,
  PhoneCall,
  Flame,
  CheckCircle2,
  Upload,
  X
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import * as api from './services/api';

export default function MembershipPage({
  onNavigateToHome,
  onNavigateToCollection,
  onNavigateToProductDetail,
  onOpenCart
}) {
  const { user, updateUser: updateAuthUser } = useAuth();

  // User state
  const [userPoints, setUserPoints] = useState(1420);
  const [userSpend, setUserSpend] = useState(1850000);
  const [avatarUrl, setAvatarUrl] = useState(
    () => user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  // Sync avatar khi user thay đổi
  React.useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user?.avatar]);

  // Accordion state (FAQ) - question 1 open by default
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals state
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Minigame state
  const [isClawing, setIsClawing] = useState(false);
  const [clawResult, setClawResult] = useState(null);

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Redeem rewards catalog
  const rewardsList = [
    {
      id: 'rw-1',
      title: 'Voucher Giảm 20.000đ',
      cost: 200,
      description: 'Áp dụng cho mọi đơn hàng gấu bông từ 150k.',
      icon: '🎫',
      code: 'LAVANG20K'
    },
    {
      id: 'rw-2',
      title: 'Túi Giặt Gấu Mùa Thu',
      cost: 350,
      description: 'Lưới mắt nhỏ cao cấp bảo vệ lông gấu khi giặt máy.',
      icon: '🧺',
      code: 'TUIGIAT-THU'
    },
    {
      id: 'rw-3',
      title: 'Nơ Cổ Vintage Nghệ Nhân',
      cost: 400,
      description: 'Ruy băng satin dệt tay gắn ren kem cài cổ bé gấu.',
      icon: '🎀',
      code: 'NOVINTAGE'
    },
    {
      id: 'rw-4',
      title: 'Gói Tinh Dầu Hương Hoa Cỏ Khô',
      cost: 500,
      description: 'Xịt thơm dịu nhẹ lưu hương 7 ngày trên gấu bông.',
      icon: '🍂',
      code: 'TINHDAULAVANG'
    },
    {
      id: 'rw-5',
      title: 'Vé Spa Khử Khuẩn & Chải Lông',
      cost: 800,
      description: 'Làm sạch lông xoắn, hút ẩm và xông hơi tinh dầu tràm.',
      icon: '🧼',
      code: 'SPAGAUFREE'
    },
    {
      id: 'rw-6',
      title: 'Voucher Giảm 100.000đ',
      cost: 1000,
      description: 'Áp dụng cho đơn hàng bất kỳ từ 399k mừng sinh nhật.',
      icon: '🎁',
      code: 'QUEEN100K'
    },
    {
      id: 'rw-7',
      title: 'Gối Ôm Quàng Tay Bé Gấu Nhỏ',
      cost: 1400,
      description: 'Món quà may thủ công ấm áp độc quyền cho hội viên.',
      icon: '🧸',
      code: 'GOIOMGAU'
    }
  ];

  const handleRedeem = (item) => {
    if (userPoints < item.cost) {
      showToast(`Bạn cần thêm ${item.cost - userPoints} Lá Vàng để đổi món này nhé!`);
      return;
    }
    setUserPoints((prev) => prev - item.cost);
    showToast(`🎉 Đổi thành công "${item.title}"! Mã ưu đãi của bạn: ${item.code}`);
  };

  const handlePlayClaw = () => {
    if (isClawing) return;
    setIsClawing(true);
    setClawResult(null);

    setTimeout(() => {
      const bonusPoints = Math.floor(Math.random() * 31) + 10; // 10 to 40
      setIsClawing(false);
      setClawResult(bonusPoints);
      setUserPoints((prev) => prev + bonusPoints);
      showToast(`✨ Chúc mừng bạn gắp trúng bé gấu may mắn! +${bonusPoints} Lá Vàng`);
    }, 2000);
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://tiemgaubong.vn/invite?code=THAOMY99');
    showToast('✨ Đã sao chép link giới thiệu vào bộ nhớ tạm!');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    setUserPoints((prev) => prev + 50);
    showToast('💌 Cảm ơn bạn đã gửi feedback! Tiệm tặng bạn +50 Lá Vàng & Voucher 20k');
    setTimeout(() => {
      setIsFeedbackModalOpen(false);
      setFeedbackSubmitted(false);
      setFeedbackText('');
    }, 1500);
  };

  return (
    <div className="bg-[#FAF4EB] min-h-screen text-[#6B4226] font-sans pb-16 selection:bg-[#E5A93C]/30 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#6B4226] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/30 flex items-center gap-3 animate-fadeIn text-sm font-semibold max-w-md">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B4226]/60 mb-4">
          <button
            onClick={onNavigateToHome}
            className="hover:text-[#D47343] transition flex items-center gap-1 cursor-pointer"
          >
            <span>Trang Chủ</span>
          </button>
          <span>/</span>
          <span className="text-[#6B4226]/80">Hội Viên VIP</span>
          <span>/</span>
          <span className="text-[#D47343] font-bold">Xếp Hạng & Đặc Quyền</span>
        </div>

        {/* Hero Section Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 bg-[#FDEEDB] text-[#C25E2E] px-3 py-1 rounded-full text-xs font-bold border border-[#FADCC7] mb-3">
              <Gift className="w-3.5 h-3.5 text-[#C25E2E]" />
              <span>Chương Trình Tri Ân Khách Hàng Thân Thiết 2024</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#52321c] tracking-tight leading-snug">
              Gia Đình Gấu Nhỏ: Xếp Hạng & Đặc Quyền Hội Viên 👑
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-xs sm:text-sm text-[#6B4226]/80 leading-relaxed font-medium">
              Càng ôm nhiều gấu, tình cảm càng đong đầy. Tích lũy chi tiêu & hoạt động để mở khóa những món quà đặc quyền,
              dịch vụ may vá riêng và tri ân riêng cho từng mùa Mùa Thu.
            </p>
          </div>

          {/* Action Buttons Top Right */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            {/* Points Badge Button */}
            <button
              onClick={() => setIsRewardModalOpen(true)}
              className="bg-[#FAF0E4] hover:bg-[#F5E4D2] text-[#6B4226] border border-[#E8D4C0] px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
              title="Nhấn để xem kho quà tặng quy đổi từ Lá Vàng"
            >
              <Leaf className="w-4 h-4 text-[#D47343] fill-[#D47343]/30" />
              <span>{userPoints.toLocaleString('vi-VN')} Lá Vàng Đã Có</span>
            </button>

            {/* Redeem Button */}
            <button
              onClick={() => setIsRewardModalOpen(true)}
              className="bg-[#6B4226] hover:bg-[#54331c] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-md hover:shadow-lg cursor-pointer transform active:scale-95"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>Đổi Quà Ngay</span>
            </button>
          </div>
        </div>

        {/* 2 Cards Grid: Profile Pass & Rank Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Left Card: Customer Membership Pass (5 cols) */}
          <div className="lg:col-span-5 bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden flex flex-col justify-between">
            {/* Subtle decorative background watermarks */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F6EDE2] rounded-full blur-2xl opacity-60 pointer-events-none -mr-10 -mt-10"></div>

            <div>
              {/* User row */}
              <div className="flex items-center justify-between pb-5 border-b border-[#EAE0D5]/70">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={avatarUrl}
                      alt="Thảo My"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E5A93C] ring-offset-2 ring-offset-[#FCFAF7] shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#6B4226] text-amber-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-white">
                      ★
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-base text-[#52321c]">{user?.name || 'Thảo My'}</h2>
                      <span className="bg-[#EAEAEA] text-[#555] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#D5D5D5] tracking-wide">
                        {user?.memberTier ? 'VIP' : 'SILVER'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B4226]/70 font-medium mt-0.5">{user?.memberTier || 'Thành viên thân thiết'}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="text-[11px] font-bold text-[#6B4226]/80 hover:text-[#D47343] bg-white border border-[#EAE0D5] hover:border-[#D47343]/50 px-2.5 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera className="w-3 h-3 text-[#D47343]" />
                  <span>Sửa ảnh</span>
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 py-5 border-b border-[#EAE0D5]/70">
                <div>
                  <span className="text-[11px] font-bold text-[#6B4226]/60 block mb-1">
                    Điểm Thưởng Tích Lũy
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#52321c]">
                      {userPoints.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-xs font-bold text-[#D47343] flex items-center gap-0.5">
                      Lá Vàng <Leaf className="w-3 h-3 fill-[#D47343]" />
                    </span>
                  </div>
                </div>

                <div className="border-l border-[#EAE0D5]/80 pl-4">
                  <span className="text-[11px] font-bold text-[#6B4226]/60 block mb-1">
                    Chi Tiêu Trong Năm
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#52321c]">
                      {userSpend.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-sm font-bold text-[#6B4226]/80">đ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Pass Footer */}
            <div className="pt-4 flex items-center justify-between text-xs text-[#6B4226]/70 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D47343]" />
                <span>Hạn duy trì: 31/12/2024</span>
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-[#6B4226]/50 uppercase">
                TIỆM GẤU BÔNG HD PASS
              </span>
            </div>
          </div>

          {/* Right Card: Level-up Progress Card (7 cols) */}
          <div className="lg:col-span-7 bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-[#D47343] uppercase block mb-1">
                    // HÀNH TRÌNH THĂNG HẠNG TIẾP THEO //
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#52321c]">
                    Tiến Độ Chinh Phục Ngôi Vị Gấu Queen
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-[#52321c]">62%</span>
                  <span className="block text-[10px] font-bold text-[#6B4226]/60 uppercase tracking-tight">
                    MỤC TIÊU 3.000.000đ
                  </span>
                </div>
              </div>

              {/* Stepper Progress Bar */}
              <div className="relative mb-8 px-2 sm:px-6">
                {/* Background Line */}
                <div className="absolute top-3.5 left-6 right-6 h-1 bg-[#EAE0D5] -z-0"></div>
                {/* Active Progress Line: 62% of distance */}
                <div
                  className="absolute top-3.5 left-6 h-1 bg-gradient-to-r from-[#6B4226] via-[#E5A93C] to-[#E5A93C] -z-0 transition-all duration-1000"
                  style={{ width: '62%' }}
                ></div>

                {/* Stepper Nodes */}
                <div className="flex justify-between items-start relative z-10">
                  {/* Step 1: Bé Gấu */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#6B4226] text-white flex items-center justify-center text-xs shadow-xs mb-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-xs font-bold text-[#52321c]">Bé Gấu</span>
                    <span className="text-[10px] text-[#6B4226]/60 font-medium">0đ</span>
                  </div>

                  {/* Step 2: Gấu Xinh (Active Current) */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-[#E5A93C] text-white flex items-center justify-center text-xs shadow-md ring-4 ring-[#FAF0DC] mb-2">
                      <Star className="w-3.5 h-3.5 fill-white" />
                    </div>
                    <span className="text-xs font-bold text-[#52321c] flex items-center gap-1">
                      Gấu Xinh <span className="text-amber-500">⭐</span>
                    </span>
                    <span className="text-[10px] text-[#6B4226]/60 font-medium">1.000.000đ</span>
                    <span className="mt-1 bg-[#FDEEDB] text-[#C25E2E] text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-[#FADCC7]">
                      ĐANG ĐẠT
                    </span>
                  </div>

                  {/* Step 3: Gấu Queen (Target) */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-7 h-7 rounded-full bg-white border-2 border-[#D47343] text-[#D47343] flex items-center justify-center text-xs shadow-xs mb-2">
                      <Crown className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#52321c]">Gấu Queen 👑</span>
                    <span className="text-[10px] text-[#6B4226]/60 font-medium">3.000.000đ</span>
                    <span className="mt-1 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-amber-200">
                      Đích đến 🎯
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Highlight Box */}
            <div className="bg-[#FFF4EE] border border-[#FCE0D2] rounded-2xl p-4 flex items-center justify-between gap-3.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FCE8DC] text-[#D47343] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-[#D47343]" />
                </div>
                <p className="text-xs text-[#6B4226] leading-relaxed font-medium">
                  Chỉ còn <strong className="text-[#C25E2E] font-bold">1.150.000đ</strong> nữa (tương đương khoảng 1 bé gấu đan len cỡ lớn) để bạn bước lên ngôi vị Gấu Queen và nhận ngay{' '}
                  <strong className="text-[#52321c]">Hộp Quà Sinh Nhật Hoàng Gia trị giá 500k</strong>!
                </p>
              </div>

              <button
                onClick={onNavigateToCollection}
                className="shrink-0 text-xs font-bold text-[#C25E2E] hover:text-[#9A380A] flex items-center gap-1 group transition cursor-pointer"
              >
                <span>Mua thêm</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Section: So Sánh Đặc Quyền Dành Cho Từng Hội Viên */}
        <div className="mb-16">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-extrabold tracking-widest text-[#D47343] uppercase block mb-1">
              BẬC THƯỢNG HẠNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#52321c] tracking-tight">
              So Sánh Đặc Quyền Dành Cho Từng Hội Viên
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B4226]/75 font-medium leading-relaxed">
              Mỗi bậc thành viên mang theo những chiếc ôm vỗ về và món quà tinh tế nhất từ xưởng may Tiệm Gấu Bông HD.
            </p>
          </div>

          {/* 3 Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Tier 1: Bé Gấu 🧸 */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F8EFE5] flex items-center justify-center text-xl">
                    🧸
                  </div>
                  <span className="text-[11px] font-bold bg-[#F5EBE1] text-[#6B4226]/80 px-2.5 py-0.5 rounded-full border border-[#E8DACB]">
                    Khởi Đầu Ấm Áp
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#52321c] mb-1">Bé Gấu 🧸</h3>
                <div className="text-2xl font-black text-[#52321c] mb-2">0đ</div>
                <p className="text-xs text-[#6B4226]/70 leading-relaxed font-medium mb-6">
                  Dành cho mọi khách hàng vừa đăng ký tài khoản tại Tiệm.
                </p>

                <div className="text-[11px] font-extrabold tracking-wider text-[#6B4226]/60 uppercase mb-3">
                  ĐẶC QUYỀN NỔI BẬT:
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs text-[#52321c]/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Tặng ngay Voucher Vemi Gấu 10.000đ áp dụng đơn đầu tiên</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Đi kèm quay May Gặp Gấu Mùa Thu mỗi tuần</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Miễn phí viết thiệp tag vintage & thắt nơ ruy băng mềm mại</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Nhận ảnh chụp gửi qua chat trước khi giao</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Button */}
              <div className="mt-8 pt-4 border-t border-[#EAE0D5]/60">
                <button
                  disabled
                  className="w-full bg-[#F3EAE1] text-[#6B4226]/70 py-2.5 rounded-xl text-xs font-bold cursor-default"
                >
                  Mặc Định Khi Mua Hàng
                </button>
              </div>
            </div>

            {/* Tier 2: Gấu Xinh 🎀 (ACTIVE / CURRENT USER) */}
            <div className="bg-[#FCFAF7] border-2 border-[#D47343] rounded-3xl p-6 sm:p-7 shadow-lg relative flex flex-col justify-between transform md:-translate-y-2">
              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#6B4226] text-amber-300 text-[10px] font-black tracking-wider uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300/30">
                <Star className="w-3 h-3 fill-amber-300" />
                <span>HẠNG CỦA BẠN (ACTIVE)</span>
              </div>

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 mt-2">
                  <div className="w-11 h-11 rounded-2xl bg-[#FDEEDB] flex items-center justify-center text-xl">
                    🎀
                  </div>
                  <span className="text-[11px] font-bold bg-[#FDEEDB] text-[#C25E2E] px-2.5 py-0.5 rounded-full border border-[#FADCC7]">
                    Tích lũy: 1.000.000đ
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#52321c] mb-1">Gấu Xinh 🎀</h3>
                <div className="text-2xl font-black text-[#52321c] mb-2">Từ 1.000.000đ</div>
                <p className="text-xs text-[#6B4226]/70 leading-relaxed font-medium mb-6">
                  Gói thân thiết nhận ưu đãi giảm giá và dịch vụ spa chăm sóc gấu.
                </p>

                <div className="text-[11px] font-extrabold tracking-wider text-[#D47343] uppercase mb-3">
                  ĐẶC QUYỀN NÂNG CẤP:
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs text-[#52321c]/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span className="font-semibold">Toàn bộ đặc quyền của hạng Bé Gấu</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span>
                      <strong>Giảm trực tiếp 5%</strong> cho tất cả đơn hàng gấu bông & phụ kiện
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span>
                      <strong>Freeship 0đ</strong> toàn quốc cho 2 đơn hàng mỗi tháng
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span>
                      Tặng 1 lần <strong>Spa Khử Khuẩn & Chải Lông Tơ</strong> miễn phí (trị giá 80k)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span>1 túi giặt gấu Mùa Thu/tuần & Gói tinh dầu thơm lá rụng</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D47343] shrink-0 mt-0.5 fill-[#D47343]/20" />
                    <span>
                      Quà sinh nhật: <strong>Voucher 100.000đ</strong> + Thiệp hoa khô nghệ nhân
                    </span>
                  </li>
                </ul>
              </div>

              {/* Bottom Button */}
              <div className="mt-8 pt-4 border-t border-[#EAE0D5]/60">
                <button
                  disabled
                  className="w-full bg-[#FAF0E4] text-[#6B4226] py-2.5 rounded-xl text-xs font-bold border border-[#E8D4C0] flex items-center justify-center gap-1.5 cursor-default"
                >
                  <Check className="w-3.5 h-3.5 text-[#D47343]" />
                  <span>Hạng là nền của bạn hiện tại</span>
                </button>
              </div>
            </div>

            {/* Tier 3: Gấu Queen 👑 (Ultimate Tier) */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:shadow-md transition">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF6E5] flex items-center justify-center text-xl">
                    👑
                  </div>
                  <span className="text-[11px] font-bold bg-[#FFF2D6] text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                    Tích lũy: 3.000.000đ
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#52321c] mb-1">Gấu Queen 👑</h3>
                <div className="text-2xl font-black text-[#52321c] mb-2">Từ 3.000.000đ</div>
                <p className="text-xs text-[#6B4226]/70 leading-relaxed font-medium mb-6">
                  Đỉnh cao chiều chuộng với bảo hành gấu trọn đời & quà tặng đặc biệt.
                </p>

                <div className="text-[11px] font-extrabold tracking-wider text-amber-700 uppercase mb-3">
                  ĐẶC QUYỀN HOÀNG GIA:
                </div>

                {/* Features list */}
                <ul className="space-y-3 text-xs text-[#52321c]/90 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="font-semibold">Mọi đặc quyền cao cấp của hạng Bé Gấu & Gấu Xinh</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      <strong>Giảm trực tiếp 10% trọn đời</strong> cho toàn bộ các đơn tiếp
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      <strong>FREESHIP TRỌN ĐỜI</strong> không giới hạn số lượng đơn
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Hộp Quà Sinh Nhật <strong>Queen Box (500k)</strong> gửi tận nhà
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Pre-order VIP mẫu gấu giới hạn trước toàn bộ khách hàng khác</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>
                      Dịch vụ <strong>Bác Sĩ Gấu Bông</strong>: May vá miễn phí & may bông trọn đời
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>Hotline hỗ trợ riêng dành cho Tiệm, hỗ trợ gói quà bí mật hỏa tốc 24/7</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Button */}
              <div className="mt-8 pt-4 border-t border-[#EAE0D5]/60">
                <button
                  onClick={onNavigateToCollection}
                  className="w-full bg-[#E5A93C] hover:bg-[#D4982B] text-[#52321c] py-2.5 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Tích Thêm 1.150k Lên Hạng</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Section: Tích Lũy Thần Tốc: Làm Sao Để Tích Chi Tiêu & Điểm Lá Vàng? */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-[#D47343] uppercase block mb-1">
                TÍCH LŨY THẦN TỐC
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#52321c] tracking-tight">
                Làm Sao Để Tích Chi Tiêu & Điểm Lá Vàng?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#6B4226]/75 font-medium max-w-xl">
                Mỗi tương tác, ôm ấp tại Tiệm đều được quy đổi thành điểm thưởng giá trị giúp bạn nhanh chóng chạm đến ngôi vị gấu queen.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#6B4226]/70 bg-[#F5EAE0] px-3 py-1.5 rounded-full border border-[#E8DACB]">
                Quy đổi: 10k chi tiêu = 10 Điểm Mua Hàng
              </span>
            </div>
          </div>

          {/* 4 Quest Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Quest 1 */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D47343]/50 transition group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] text-[#D47343] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#52321c] mb-1.5">
                  Mua Gấu & Quà Tặng
                </h3>
                <p className="text-xs text-[#6B4226]/75 leading-relaxed font-medium">
                  Mỗi đơn hàng thành công đều cộng dồn điểm. Cứ <strong>10.000đ = 1 Lá Vàng</strong> tích lũy.
                </p>
              </div>

              <button
                onClick={onNavigateToCollection}
                className="mt-5 text-xs font-bold text-[#D47343] hover:text-[#9A380A] flex items-center gap-1 transition text-left cursor-pointer"
              >
                <span>Tới Cửa Hàng Ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quest 2 */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D47343]/50 transition group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FEF4DB] text-[#C68A1B] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#52321c] mb-1.5">
                  Minigame Gắp Gấu
                </h3>
                <p className="text-xs text-[#6B4226]/75 leading-relaxed font-medium">
                  Điểm danh 1 lần/ngày & tham gia gắp gấu mini nhận thêm <strong>10 - 40 Lá Vàng</strong> may mắn.
                </p>
              </div>

              <button
                onClick={() => setIsGameModalOpen(true)}
                className="mt-5 text-xs font-bold text-[#D47343] hover:text-[#9A380A] flex items-center gap-1 transition text-left cursor-pointer"
              >
                <span>Chơi Ngay Hôm Nay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quest 3 */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D47343]/50 transition group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FDEEDB] text-[#C25E2E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#52321c] mb-1.5">
                  Feedback Kèm Ảnh Bé Gấu
                </h3>
                <p className="text-xs text-[#6B4226]/75 leading-relaxed font-medium">
                  Đăng ảnh unbox chiếc hộp ôm ấp để nhận ngay <strong>50 Lá Vàng & Voucher 20k</strong> cho đơn sau.
                </p>
              </div>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="mt-5 text-xs font-bold text-[#D47343] hover:text-[#9A380A] flex items-center gap-1 transition text-left cursor-pointer"
              >
                <span>Thưởng nóng sau duyệt</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quest 4 */}
            <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D47343]/50 transition group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#F0EBE3] text-[#6B4226] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#52321c] mb-1.5">
                  Rủ Bạn Cùng Mê Gấu
                </h3>
                <p className="text-xs text-[#6B4226]/75 leading-relaxed font-medium">
                  Chia sẻ mã giới thiệu cho bạn bè. Bạn nhận <strong>150 Lá Vàng</strong> khi bạn bè có đơn hàng đầu tiên.
                </p>
              </div>

              <button
                onClick={() => setIsReferralModalOpen(true)}
                className="mt-5 text-xs font-bold text-[#D47343] hover:text-[#9A380A] flex items-center gap-1 transition text-left cursor-pointer"
              >
                <span>Lấy link giới thiệu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Section: Chính Sách & Thời Hạn Duy Trì Hạng (Image Box + FAQ Accordion) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left Side: Photo of teddy bear in craft box with card overlay (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-lg border border-[#EAE0D5] group">
            <img
              src="https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=800&q=80"
              alt="Hộp quà thủ công Tiệm Gấu Bông HD"
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

            {/* Floating handwritten note style inside box (Visual simulation) */}
            <div className="absolute top-6 right-6 bg-[#FCFAF7]/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-md border border-[#EAE0D5] max-w-[210px] transform rotate-2">
              <p className="text-[11px] font-handwriting text-[#6B4226] leading-tight">
                "Chúc bạn luôn an yên và hạnh phúc! Cảm ơn người thương luôn yêu thương tiệm gấu nhỏ!"
              </p>
              <div className="text-[9px] font-bold text-[#D47343] mt-1 text-right">~ Tiệm Gấu HD</div>
            </div>

            {/* Bottom Content on Image */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] font-extrabold tracking-widest uppercase bg-[#C25E2E] text-white px-2.5 py-0.5 rounded-full inline-block mb-2">
                HƯƠNG MAY THỦ CÔNG HD
              </span>
              <h3 className="text-base sm:text-lg font-bold leading-snug mb-1">
                "Gói trọn chân thành trong từng mối chỉ, hạt bông."
              </h3>
              <p className="text-xs text-white/85 leading-relaxed font-medium">
                Mọi hội viên thân yêu luôn luôn nhận được quyền lợi may vá, làm sạch và đóng gói chu đáo như người nhà.
              </p>
            </div>
          </div>

          {/* Right Side: FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7">
            <span className="text-[11px] font-extrabold tracking-widest text-[#D47343] uppercase block mb-1">
              HỎI ĐÁP NHANH
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#52321c] tracking-tight mb-6">
              Chính Sách & Thời Hạn Duy Trì Hạng
            </h2>

            {/* Accordion Items */}
            <div className="space-y-3.5">
              {/* Question 1 */}
              <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-2xl overflow-hidden shadow-2xs transition">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? -1 : 0)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-3 cursor-pointer hover:bg-[#FAF4EB]/60 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#52321c]">
                    Thời gian tính chu kỳ xét hạng là bao lâu?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D47343] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === 0 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === 0 && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#6B4226]/80 leading-relaxed font-medium border-t border-[#EAE0D5]/50 animate-fadeIn">
                    Hạng thành viên của bạn có giá trị trong <strong>12 tháng</strong> kể từ ngày đạt mốc. Mỗi đơn hàng phát sinh trong chu kỳ sẽ tự động cộng dồn doanh số để xét thông hạng hoặc duy trì hạng.
                  </div>
                )}
              </div>

              {/* Question 2 */}
              <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-2xl overflow-hidden shadow-2xs transition">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? -1 : 1)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-3 cursor-pointer hover:bg-[#FAF4EB]/60 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#52321c]">
                    Làm thế nào để duy trì vĩnh viễn hạng Gấu Xinh?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D47343] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === 1 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === 1 && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#6B4226]/80 leading-relaxed font-medium border-t border-[#EAE0D5]/50 animate-fadeIn">
                    Tiệm Gấu Bông HD áp dụng chính sách chăm sóc rất linh hoạt. Bạn chỉ cần phát sinh tối thiểu <strong>1 đơn hàng bất kỳ trong vòng 6 tháng</strong> (không giới hạn giá trị) là hạng sẽ được tự động gia hạn mà không bị hạ bậc.
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-2xl overflow-hidden shadow-2xs transition">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? -1 : 2)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-3 cursor-pointer hover:bg-[#FAF4EB]/60 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#52321c]">
                    Điểm Lá Vàng 🍂 có bị hết hạn sử dụng không?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D47343] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === 2 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === 2 && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#6B4226]/80 leading-relaxed font-medium border-t border-[#EAE0D5]/50 animate-fadeIn">
                    Điểm Lá Vàng được bảo lưu tối đa <strong>2 năm</strong>. Bạn có thể tự do dùng để trừ trực tiếp vào hóa đơn khi thanh toán hoặc quy đổi các voucher quà tặng độc quyền như gối ôm quàng tay, nơ cổ và túi giặt gấu.
                  </div>
                )}
              </div>

              {/* Question 4 */}
              <div className="bg-[#FCFAF7] border border-[#EAE0D5] rounded-2xl overflow-hidden shadow-2xs transition">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? -1 : 3)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left gap-3 cursor-pointer hover:bg-[#FAF4EB]/60 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#52321c]">
                    Đặc quyền "Bác Sĩ Gấu Bông" của Gấu Queen hoạt động ra sao?
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D47343] shrink-0 transition-transform duration-200 ${
                      openFaqIndex === 3 ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === 3 && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#6B4226]/80 leading-relaxed font-medium border-t border-[#EAE0D5]/50 animate-fadeIn">
                    Bất kể khi gấu bạn mua từ bao giờ, nếu bị tuột đường chỉ hoặc bông bị xẹp sau thời gian ôm ấp, hãy gửi về tiệm hoặc mang ghé cửa hàng. Thợ thủ công của tiệm sẽ <strong>thay ruột bông gòn vi sợi 7D mới tinh và khâu lại đường may trọn đời không thu phí</strong>.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA Banner: Sẵn Sàng Rinh Thêm Bé Gấu & Lên Ngôi Gấu Queen? */}
        <div className="bg-gradient-to-r from-[#944721] via-[#853C18] to-[#60270B] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden text-center mb-6">
          {/* Decorative sparkles */}
          <div className="absolute top-4 left-6 text-amber-300/40 text-2xl select-none">✨</div>
          <div className="absolute bottom-4 right-8 text-amber-300/40 text-3xl select-none">🍂</div>

          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-[11px] font-extrabold tracking-widest text-amber-300 uppercase inline-block mb-3 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              BST Mùa Thu Ấm Áp - Hậu Trường Đêm Về
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
              Sẵn Sàng Rinh Thêm Bé Gấu & Lên Ngôi Gấu Queen?
            </h2>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium mb-8">
              Khám phá bộ sưu tập Gấu Teddy Áo Len Hạt Dẻ, Cừu Bông Trắng và Vịt Vàng Mỏ Hồng vừa cập bến tiệm.
              Tích điểm nâng hạng ngay hôm nay để nhận trọn bộ quà sinh nhật đặc biệt!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onNavigateToCollection}
                className="w-full sm:w-auto bg-[#E5A93C] hover:bg-[#D4982B] text-[#52321c] px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <span>Khám Phá BST Gấu Mùa Thu Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsRewardModalOpen(true)}
                className="w-full sm:w-auto bg-black/25 hover:bg-black/35 text-white border border-white/25 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Leaf className="w-4 h-4 text-amber-300 fill-amber-300/30" />
                <span>Đổi Điểm Lá Vàng Lấy Quà ({userPoints.toLocaleString('vi-VN')} 🍂)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL: ĐỔI QUÀ (REWARD REDEEM MODAL) ================= */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-slideIn">
            {/* Header */}
            <div className="p-5 border-b border-[#EAE0D5] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FDEEDB] text-[#C25E2E] flex items-center justify-center font-bold">
                  🎁
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#52321c]">
                    Kho Quà Tặng Quy Đổi Lá Vàng
                  </h3>
                  <p className="text-xs text-[#6B4226]/70 font-medium">
                    Số dư hiện có: <strong className="text-[#D47343]">{userPoints} Lá Vàng</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRewardModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {rewardsList.map((rw) => {
                const canAfford = userPoints >= rw.cost;
                return (
                  <div
                    key={rw.id}
                    className="bg-white border border-[#EAE0D5] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs hover:border-[#D47343]/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{rw.icon}</div>
                      <div>
                        <h4 className="font-bold text-sm text-[#52321c]">{rw.title}</h4>
                        <p className="text-xs text-[#6B4226]/70 font-medium">{rw.description}</p>
                        <span className="inline-block mt-1 text-[11px] font-extrabold text-[#D47343]">
                          {rw.cost} Lá Vàng
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeem(rw)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
                        canAfford
                          ? 'bg-[#6B4226] hover:bg-[#52321c] text-white shadow-xs active:scale-95'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Đổi ngay' : 'Chưa đủ điểm'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#EAE0D5] bg-[#FCFAF7] text-center text-xs text-[#6B4226]/70 font-medium">
              Lá Vàng được bảo lưu 2 năm. Đổi voucher để trừ ngay khi thanh toán đơn hàng.
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: MINIGAME GẮP GẤU ================= */}
      {isGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-slideIn">
            <button
              onClick={() => setIsGameModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#FEF4DB] text-[#C68A1B] flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              🕹️
            </div>

            <h3 className="font-extrabold text-lg text-[#52321c]">Minigame Gắp Gấu Mùa Thu</h3>
            <p className="text-xs text-[#6B4226]/75 mt-1 font-medium mb-6">
              Mỗi ngày bạn được 1 lượt gắp miễn phí để nhận từ <strong>10 - 40 Lá Vàng</strong> may mắn!
            </p>

            {/* Machine stage */}
            <div className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div
                className={`text-5xl transition-transform duration-1000 ${
                  isClawing ? 'translate-y-8 scale-110 rotate-12' : 'hover:scale-105'
                }`}
              >
                {clawResult ? '🎁' : isClawing ? '🤏' : '🧸'}
              </div>

              {isClawing && (
                <p className="text-xs font-bold text-[#D47343] mt-3 animate-pulse">
                  Đang hạ cần gắp bé gấu...
                </p>
              )}

              {clawResult && (
                <div className="mt-3 text-sm font-bold text-[#C25E2E] animate-fadeIn">
                  🎉 Chúc mừng bạn nhận được <strong>+{clawResult} Lá Vàng</strong>!
                </div>
              )}
            </div>

            <button
              onClick={handlePlayClaw}
              disabled={isClawing}
              className={`w-full py-3 rounded-full text-xs sm:text-sm font-bold transition shadow-md cursor-pointer ${
                isClawing
                  ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                  : 'bg-[#6B4226] hover:bg-[#52321c] text-white active:scale-95'
              }`}
            >
              {isClawing ? 'Đang gắp...' : 'Thả Cần Gắp Gấu Ngay! 🎯'}
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: FEEDBACK KÈM ẢNH ================= */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-slideIn">
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FDEEDB] text-[#C25E2E] flex items-center justify-center text-xl">
                📸
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#52321c]">
                  Gửi Feedback Kèm Ảnh Bé Gấu
                </h3>
                <p className="text-xs text-[#6B4226]/75 font-medium">
                  Nhận ngay <strong>+50 Lá Vàng & Voucher 20k</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="text-xs font-bold text-[#52321c] block mb-1">
                  Độ êm ái & hài lòng:
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="cursor-pointer text-xl transition-transform hover:scale-125"
                    >
                      {star <= feedbackRating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div>
                <label className="text-xs font-bold text-[#52321c] block mb-1">
                  Đôi dòng cảm nhận về bé gấu:
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Bé gấu rất thơm, bông gòn êm và đường may tỉ mỉ lắm tiệm ơi..."
                  rows={3}
                  className="w-full bg-white border border-[#EAE0D5] rounded-xl p-3 text-xs focus:outline-none focus:border-[#D47343] font-medium resize-none shadow-2xs"
                  required
                />
              </div>

              {/* Photo Upload Simulation */}
              <div className="border border-dashed border-[#D47343]/50 rounded-xl p-3 text-center bg-white/60">
                <Camera className="w-5 h-5 text-[#D47343] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-[#6B4226]/80 block">
                  Đã đính kèm ảnh unbox hộp quà Teddy
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">✓ unbox_teddy_autumn.jpg</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6B4226] hover:bg-[#52321c] text-white py-2.5 rounded-full text-xs font-bold transition shadow-md cursor-pointer"
              >
                Gửi Feedback Nhận Thưởng Ngay
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RỦ BẠN CÙNG MÊ GẤU ================= */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative animate-slideIn">
            <button
              onClick={() => setIsReferralModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-[#F0EBE3] text-[#6B4226] flex items-center justify-center text-2xl mx-auto mb-3">
              💌
            </div>

            <h3 className="font-extrabold text-lg text-[#52321c]">Rủ Bạn Cùng Mê Gấu</h3>
            <p className="text-xs text-[#6B4226]/75 mt-1 font-medium mb-5">
              Gửi chiếc link ấm áp này cho bạn bè. Bạn nhận <strong>150 Lá Vàng</strong> khi bạn bè hoàn tất đơn hàng đầu tiên, và bạn bè nhận ngay voucher 30k!
            </p>

            <div className="bg-white border border-[#EAE0D5] rounded-2xl p-3 mb-5 flex items-center justify-between gap-2 shadow-2xs">
              <span className="text-xs font-mono font-bold text-[#52321c] truncate">
                https://tiemgaubong.vn/invite?code=THAOMY99
              </span>
              <button
                onClick={handleCopyReferral}
                className="bg-[#6B4226] hover:bg-[#52321c] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition active:scale-95"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép</span>
              </button>
            </div>

            <div className="text-[11px] text-[#6B4226]/60 font-medium">
              Mã giới thiệu của bạn: <strong className="text-[#D47343]">THAOMY99</strong>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ĐỔI AVATAR ================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-slideIn text-center">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#52321c] mb-1">Cập Nhật Ảnh Đại Diện</h3>
            <p className="text-xs text-[#6B4226]/75 mb-4 font-medium">
              Tải ảnh từ máy tính hoặc chọn ảnh đại diện xinh xắn có sẵn
            </p>

            {/* Chọn ảnh từ máy tính */}
            <div className="mb-4">
              <label className="flex items-center justify-center gap-2 bg-white hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold py-2.5 px-4 rounded-2xl border border-[#D47343]/30 cursor-pointer transition text-xs shadow-2xs">
                <Upload className="w-4 h-4 text-[#D47343]" />
                <span>Chọn ảnh từ máy tính</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 8 * 1024 * 1024) {
                        alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        const newAvatar = event.target.result;
                        setAvatarUrl(newAvatar);
                        if (user?.id) {
                          try {
                            await api.updateUser(user.id, { avatar: newAvatar });
                          } catch {
                            // ignore
                          }
                        }
                        if (updateAuthUser) {
                          updateAuthUser({ avatar: newAvatar });
                        }
                        setIsAvatarModalOpen(false);
                        showToast('Đã tải ảnh mới từ máy thành công! ✨');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="text-[11px] font-bold text-[#6B4226]/70 mb-2.5 text-left">
              Hoặc chọn avatar có sẵn:
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="avatar option"
                  onClick={async () => {
                    setAvatarUrl(url);
                    if (user?.id) {
                      try {
                        await api.updateUser(user.id, { avatar: url });
                      } catch {
                        // ignore
                      }
                    }
                    if (updateAuthUser) {
                      updateAuthUser({ avatar: url });
                    }
                    setIsAvatarModalOpen(false);
                    showToast('Đã cập nhật ảnh đại diện thẻ hội viên!');
                  }}
                  className={`w-20 h-20 rounded-full object-cover mx-auto cursor-pointer border-2 transition hover:scale-105 ${
                    avatarUrl === url ? 'border-[#D47343] ring-2 ring-[#E5A93C]' : 'border-transparent'
                  }`}
                />
              ))}
            </div>

            <p className="text-[11px] text-[#6B4226]/60">Ảnh sẽ tự động lưu và đồng bộ toàn hệ thống</p>
          </div>
        </div>
      )}

    </div>
  );
}
