import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  KeyRound, 
  Gift, 
  Headphones, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  User as UserIcon, 
  Check, 
  Coffee, 
  Camera, 
  Sparkles, 
  HeartHandshake, 
  Car, 
  MessageSquare, 
  X,
  CheckCircle2,
  AlertCircle,
  QrCode,
  RotateCw,
  Smartphone
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import authBannerImg from './assets/auth-banner.png';
import GoogleAuthModal from './components/GoogleAuthModal';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage({ onBackToHome, onLoginSuccess, settings = {} }) {
  const { login, register, socialLogin, user, logout } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [account, setAccount] = useState('tiembong@gmail.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Interactive Modals
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('0988 123 456');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotDone, setForgotDone] = useState(false);

  const [showCardModal, setShowCardModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showClawModal, setShowClawModal] = useState(false);

  // Zalo QR Modal state
  const [showZaloQrModal, setShowZaloQrModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(120);
  const [qrScanStatus, setQrScanStatus] = useState('waiting'); // 'waiting' | 'scanned' | 'confirmed'
  const [qrSeed, setQrSeed] = useState(Date.now());

  // Google Identity Services State
  const [googleClientId, setGoogleClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('TIEM_GAU_GOOGLE_CLIENT_ID') || ''
  );
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Handle QR countdown timer
  useEffect(() => {
    let timer;
    if (showZaloQrModal && qrCountdown > 0 && qrScanStatus === 'waiting') {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showZaloQrModal, qrCountdown, qrScanStatus]);

  // Reset QR state
  const handleOpenZaloQr = () => {
    setQrCountdown(120);
    setQrScanStatus('waiting');
    setQrSeed(Date.now());
    setShowZaloQrModal(true);
  };

  const handleRefreshQr = () => {
    setQrCountdown(120);
    setQrScanStatus('waiting');
    setQrSeed(Date.now());
  };

  // Simulate scanning QR code
  const handleSimulateScan = async () => {
    setQrScanStatus('scanned');
    setTimeout(async () => {
      setQrScanStatus('confirmed');
      try {
        const res = await socialLogin('zalo', {
          name: 'Bạn Gấu Zalo (VIP)',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          phone: '0988 668 899'
        });
        setTimeout(() => {
          setShowZaloQrModal(false);
          setSuccessToast(`💙 ${res?.message || 'Quét mã QR Zalo thành công! Chào mừng bạn ghé tiệm.'}`);
          setTimeout(() => {
            if (onLoginSuccess) onLoginSuccess();
            else if (onBackToHome) onBackToHome();
          }, 800);
        }, 800);
      } catch (err) {
        setQrScanStatus('waiting');
        setErrorMsg(err.message || 'Lỗi quét mã Zalo, vui lòng thử lại.');
      }
    }, 1200);
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!account.trim()) {
        throw new Error('Vui lòng nhập số điện thoại hoặc email của bạn.');
      }
      if (!password || password.length < 6) {
        throw new Error('Mật khẩu cần có tối thiểu 6 ký tự để bảo vệ tài khoản.');
      }

      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Vui lòng điền họ và tên người rước gấu nhé!');
        }
        if (password !== confirmPassword) {
          throw new Error('Xác nhận mật khẩu chưa trùng khớp, bạn kiểm tra lại nhé.');
        }

        const res = await register({
          name: name.trim(),
          account: account.trim(),
          password,
          phone: !account.includes('@') ? account.trim() : '',
          email: account.includes('@') ? account.trim() : ''
        });

        setSuccessToast(`🎉 ${res.message || 'Tạo tài khoản thành viên thành công!'}`);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          else if (onBackToHome) onBackToHome();
        }, 1200);
      } else {
        // Login mode
        const res = await login(account.trim(), password);
        setSuccessToast(`🧸 ${res.message || 'Mừng bạn quay trở lại tiệm gấu nhỏ!'}`);
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess();
          else if (onBackToHome) onBackToHome();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Google Identity Services Login Callback
  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const decoded = jwtDecode(response.credential);
      const res = await socialLogin('google', {
        name: decoded.name || decoded.given_name || 'Khách Google',
        email: decoded.email,
        avatar: decoded.picture,
        googleId: decoded.sub
      });
      setSuccessToast(`🎉 ${res?.message || 'Đăng nhập Google thành công!'}`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        else if (onBackToHome) onBackToHome();
      }, 1000);
    } catch (err) {
      setErrorMsg('Đăng nhập Google thất bại: ' + (err.message || 'Lỗi xác thực'));
    } finally {
      setLoading(false);
    }
  };

  // Google Login click handler
  const handleGoogleClick = () => {
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowGoogleModal(true);
          }
        });
        return;
      } catch {
        setShowGoogleModal(true);
      }
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleSelectGoogleAccount = async (acc) => {
    setShowGoogleModal(false);
    setLoading(true);
    try {
      const res = await socialLogin('google', {
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar,
        googleId: `mock-${Date.now()}`
      });
      setSuccessToast(`🎉 ${res?.message || 'Đăng nhập Google thành công!'}`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        else if (onBackToHome) onBackToHome();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoogleClientId = (newId) => {
    setGoogleClientId(newId);
    localStorage.setItem('TIEM_GAU_GOOGLE_CLIENT_ID', newId);
    setSuccessToast('Đã lưu Google Client ID thành công!');
  };
  const handleSocial = async (provider) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await socialLogin(provider);
      setSuccessToast(`✨ ${res.message}`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        else if (onBackToHome) onBackToHome();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify SMS OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      setErrorMsg('Vui lòng nhập mã OTP gồm 6 chữ số gửi về điện thoại.');
      return;
    }
    setLoading(true);
    try {
      const res = await socialLogin('sms', { phone: otpPhone, name: 'Khách Rước Gấu SMS' });
      setShowOtpModal(false);
      setSuccessToast(`📱 Đăng nhập OTP thành công! Mừng bạn ghé tiệm.`);
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess();
        else if (onBackToHome) onBackToHome();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Mã OTP không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1300px] mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#3B2213] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#F2DFC9]/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Breadcrumb / Top Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBackToHome}
          className="text-xs sm:text-sm font-semibold text-[#6B4226]/80 hover:text-[#96421C] transition flex items-center gap-2 cursor-pointer group"
          title="Trở về trang chủ hoặc danh mục gấu"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay lại góc ngắm gấu bông</span>
        </button>

        <div className="inline-flex items-center gap-2 bg-[#FBF1E8] border border-[#F3DFC9] rounded-full px-4 py-1.5 text-[11px] sm:text-xs font-medium text-[#7D492A] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#96421C] animate-pulse"></span>
          <span>Mùa Thu Ấm Áp • 1.420 bạn gấu đã được trao gửi tuần này</span>
        </div>
      </div>

      {/* Main Auth Split Card */}
      <div className="bg-[#FAF2EB] rounded-[28px] border border-[#EDE2D5] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Column: Privileges & Warm Story (5 cols on lg) */}
        <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between bg-gradient-to-b from-[#FDF5EE] to-[#FBF0E5]">
          <div>
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#FEEFD9] text-[#96421C] border border-[#FADCC7] text-xs font-bold px-3 py-1 rounded-full mb-4">
              <span>Đặc quyền thành viên mới mùa thu 🍂</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3B2213] tracking-tight mb-2.5">
              Chào bạn ghé <span className="text-[#9E4624]">Tiệm Gấu HD</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-[13px] font-medium text-[#6B4226]/85 leading-relaxed mb-6">
              Đăng nhập để mỗi món quà bạn gửi trao đều được nắn nót tỉ mỉ, thơm mùi hoa cúc khô & đượm vị ngọt ngào.
            </p>

            {/* Image Card with Floating Badge */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#EBD9CA] mb-6 aspect-[16/9] group cursor-pointer" onClick={() => setShowCardModal(true)}>
              <img
                src={settings.authBanner || authBannerImg}
                alt="Hộp Kraft thủ công kèm thiệp viết tay miễn phí"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to high-res rustic teddy picture if needed
                  e.target.src = 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div className="bg-black/65 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Hộp Kraft thủ công kèm thiệp viết tay miễn phí</span>
                </div>
              </div>
            </div>

            {/* 4 Benefit Items */}
            <div className="space-y-3.5">
              {/* Item 1: Voucher */}
              <div className="flex items-start gap-3.5 bg-white/70 hover:bg-white p-2.5 rounded-2xl transition border border-[#F0E4D8]/60 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#FCE5D4] flex items-center justify-center text-[#9E4624] shrink-0 mt-0.5">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3B2213]">Tặng ngay Voucher 30.000đ</h4>
                  <p className="text-[11px] text-[#6B4226]/80 leading-snug">Áp dụng trực tiếp cho đơn rước gấu đầu tiên của bạn.</p>
                </div>
              </div>

              {/* Item 2: Mini Game */}
              <div 
                className="flex items-start gap-3.5 bg-white/70 hover:bg-white p-2.5 rounded-2xl transition border border-[#F0E4D8]/60 shadow-2xs cursor-pointer"
                onClick={() => setShowClawModal(true)}
              >
                <div className="w-9 h-9 rounded-xl bg-[#FCE5D4] flex items-center justify-center text-[#9E4624] shrink-0 mt-0.5">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#3B2213]">+3 Lượt Gắp Gấu Mùa Thu</h4>
                    <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">Chơi thử</span>
                  </div>
                  <p className="text-[11px] text-[#6B4226]/80 leading-snug">Mini game săn gấu bông thật & phụ kiện áo len mini.</p>
                </div>
              </div>

              {/* Item 3: Secret Gift */}
              <div className="flex items-start gap-3.5 bg-white/70 hover:bg-white p-2.5 rounded-2xl transition border border-[#F0E4D8]/60 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#FCE5D4] flex items-center justify-center text-[#9E4624] shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3B2213]">Số gửi quà bí mật cho người thương</h4>
                  <p className="text-[11px] text-[#6B4226]/80 leading-snug">Tự động giấu giá tiền, chọn giờ shipper gõ cửa bất ngờ.</p>
                </div>
              </div>

              {/* Item 4: Photo Proof */}
              <div className="flex items-start gap-3.5 bg-white/70 hover:bg-white p-2.5 rounded-2xl transition border border-[#F0E4D8]/60 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-[#FCE5D4] flex items-center justify-center text-[#9E4624] shrink-0 mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#3B2213]">Chụp ảnh hộp quà trước khi giao</h4>
                  <p className="text-[11px] text-[#6B4226]/80 leading-snug">Xem ảnh hộp gói hoàn chỉnh & chữ ký thiệp viết tay qua app.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="mt-6 pt-5 border-t border-[#EFE2D4] flex items-center gap-2.5 text-xs text-[#6B4226]/85 italic font-medium">
            <Coffee className="w-4 h-4 text-[#9E4624] shrink-0 not-italic" />
            <span>"Từng cái ôm gửi đi đều mang theo lời thì thầm ấm áp."</span>
          </div>
        </div>

        {/* Right Column: Authentication Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Top Row: Switcher Tabs & Hotline */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              {/* Tab Switcher Pills */}
              <div className="inline-flex p-1 bg-[#FAF2EB] border border-[#ECD9C8] rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#96421C] text-white shadow-xs'
                      : 'text-[#6B4226] hover:text-[#96421C]'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-[#96421C] text-white shadow-xs'
                      : 'text-[#6B4226] hover:text-[#96421C]'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Tạo Tài Khoản Mới</span>
                </button>
              </div>

              {/* Hotline link */}
              <a
                href="tel:0908123456"
                className="text-xs font-semibold text-[#6B4226]/80 hover:text-[#96421C] flex items-center gap-1.5 transition"
                title="Gọi trực tiếp tiệm gấu để được tư vấn gói quà"
              >
                <Headphones className="w-3.5 h-3.5 text-[#96421C]" />
                <span>Hotline 0908 123 456</span>
              </a>
            </div>

            {/* Mode Heading */}
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-[#3B2213] tracking-tight">
                {mode === 'login'
                  ? 'Mừng bạn trở lại tiệm gấu nhỏ!'
                  : 'Gia nhập đại gia đình Tiệm Gấu!'}
              </h2>
              <p className="text-xs sm:text-[13px] font-medium text-[#6B4226]/75 mt-1">
                {mode === 'login'
                  ? 'Đăng nhập để xem danh sách bé gấu yêu thích và theo dõi quà tặng.'
                  : 'Đăng ký thành viên nhận ngay voucher 30.000đ & hộp quà kraft miễn phí.'}
              </p>
            </div>

            {/* Quick Social Buttons */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E8DCCF] bg-[#FAF5EE]/70 hover:bg-[#FAF5EE] text-xs font-bold text-[#4A2F1B] transition shadow-2xs cursor-pointer active:scale-98 relative group"
                title="Đăng nhập bảo mật với Google Identity Services"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* Zalo QR Button */}
              <button
                type="button"
                onClick={handleOpenZaloQr}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#BBD5FA] bg-[#EBF3FF] hover:bg-[#D9E9FF] text-xs font-bold text-[#0068FF] transition shadow-2xs cursor-pointer active:scale-98 relative group"
                title="Quét mã QR bằng ứng dụng Zalo trên điện thoại"
              >
                <div className="w-4 h-4 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  Z
                </div>
                <div className="flex items-center gap-1">
                  <span>Zalo QR</span>
                  <QrCode className="w-3.5 h-3.5 text-[#0068FF] group-hover:scale-110 transition-transform" />
                </div>
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                  Mới
                </span>
              </button>

              {/* OTP SMS Button */}
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(true);
                  setOtpSent(false);
                }}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#F6DBC6] bg-[#FFF5EE] hover:bg-[#FEEFE4] text-xs font-bold text-[#96421C] transition shadow-2xs cursor-pointer active:scale-98"
                title="Đăng nhập bảo mật qua mã xác thực SMS OTP"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#96421C]" />
                <span>Mã OTP SMS</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EFE4DA]"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-bold text-[#8C6D53] uppercase tracking-wider">
                HOẶC DÙNG TÀI KHOẢN TIỆM
              </span>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* If Register Mode: Name Input */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#4A2F1B] mb-1.5">
                    Họ và tên người rước gấu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Minh Thư hoặc Bạn Gấu Nhỏ"
                      className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#4A2F1B] focus:outline-none focus:border-[#96421C] focus:ring-1 focus:ring-[#96421C] transition shadow-2xs placeholder:text-[#B39E8F]"
                      required
                    />
                    <UserIcon className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              {/* Field 1: Phone or Email */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#4A2F1B]">
                    Số điện thoại hoặc Email <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-medium text-[#8C6D53]">
                    Dùng để tra đơn & ảnh hộp
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="VD: 0988 123 456 hoặc tiembong@gmail.com"
                    className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#4A2F1B] focus:outline-none focus:border-[#96421C] focus:ring-1 focus:ring-[#96421C] transition shadow-2xs placeholder:text-[#B39E8F]"
                    required
                  />
                  <div className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3 flex items-center justify-center">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Field 2: Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#4A2F1B]">
                    Mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotInput(account);
                        setShowForgotModal(true);
                        setForgotDone(false);
                      }}
                      className="text-[11px] font-semibold text-[#8C6D53] hover:text-[#96421C] underline transition cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự ấm áp..."
                    className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-[#4A2F1B] focus:outline-none focus:border-[#96421C] focus:ring-1 focus:ring-[#96421C] transition shadow-2xs placeholder:text-[#B39E8F]"
                    required
                  />
                  <Lock className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#8C6D53] hover:text-[#96421C] transition cursor-pointer"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* If Register Mode: Confirm Password */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#4A2F1B] mb-1.5">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu..."
                      className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#4A2F1B] focus:outline-none focus:border-[#96421C] focus:ring-1 focus:ring-[#96421C] transition shadow-2xs placeholder:text-[#B39E8F]"
                      required
                    />
                    <Lock className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3" />
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D9C8BA] text-[#96421C] focus:ring-[#96421C] accent-[#96421C] cursor-pointer"
                  />
                  <span className="text-xs font-medium text-[#6B4226]">
                    Ghi nhớ tôi trên thiết bị này để vào ngắm gấu mỗi ngày
                  </span>
                </label>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#96421C] hover:bg-[#803514] active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Đang kết nối tiệm gấu...</span>
                  </span>
                ) : mode === 'login' ? (
                  <span>VÀO TIỆM GẤU NGAY 🐰</span>
                ) : (
                  <span>TẠO TÀI KHOẢN THÀNH VIÊN 🐰</span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Security Banner */}
          <div className="mt-6 bg-[#FAF2EB] border border-[#F1E0D1] rounded-xl p-3 text-[11px] text-[#6B4226]/80 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-semibold">
              <span className="flex items-center gap-1.5 text-[#4A2F1B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#96421C]" />
                <span>Bảo mật thông tin người tặng quà 100%</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#4A2F1B]">
                <Lock className="w-3.5 h-3.5 text-[#96421C]" />
                <span>Mã hoá SSL 256-bit an tâm</span>
              </span>
            </div>
            <p className="leading-relaxed">
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="underline font-bold text-[#8C6D53] hover:text-[#96421C] cursor-pointer"
              >
                Quy định tiệm
              </button>{' '}
              &{' '}
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="underline font-bold text-[#8C6D53] hover:text-[#96421C] cursor-pointer"
              >
                Chính sách bảo mật người nhận
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Banner below the main card */}
      <div className="mt-6 bg-[#FEEFD9]/95 border border-[#FADCC7] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <span className="text-2xl shrink-0 mt-0.5 sm:mt-0">🍂</span>
          <p className="text-xs sm:text-sm font-semibold text-[#4A2F1B] leading-relaxed">
            Bạn đặt quà gửi tặng một người ở xa? Chọn dịch vụ{' '}
            <span className="font-extrabold text-[#96421C]">"Gói Hộp Giấy Kraft & Viết Thiệp Mộc"</span>{' '}
            ngay tại bước thanh toán để Tiệm chuẩn bị nhé!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCardModal(true)}
          className="bg-white hover:bg-[#FAF4EB] text-[#96421C] border border-[#E6CEBC] text-xs font-bold px-4 py-2.5 rounded-full shadow-xs transition shrink-0 cursor-pointer text-center"
        >
          Xem mẫu thiệp hoa khô
        </button>
      </div>

      {/* ================= MODAL: SMS OTP Verification ================= */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EDE2D5] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#FFF5EE] text-[#96421C] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base text-[#3B2213]">Đăng nhập bằng mã OTP SMS</h3>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2EB] hover:bg-[#F3E2D0] text-[#6B4226] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6B4226]/80 leading-relaxed mb-4">
              Hệ thống sẽ gửi một mã OTP gồm 6 chữ số qua tin nhắn SMS để bạn đăng nhập nhanh chóng mà không cần nhớ mật khẩu.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2F1B] mb-1.5">Số điện thoại nhận mã</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={otpPhone}
                    onChange={(e) => setOtpPhone(e.target.value)}
                    placeholder="VD: 0988 123 456"
                    className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#4A2F1B] focus:outline-none focus:border-[#96421C]"
                  />
                  <Phone className="w-4 h-4 text-[#8C6D53] absolute left-3.5 top-3" />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full bg-[#96421C] hover:bg-[#803514] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
                >
                  Gửi mã xác nhận ngay
                </button>
              ) : (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-xl flex items-center justify-between">
                    <span>Mã OTP mô phỏng: <strong className="font-mono text-sm text-emerald-900">889966</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode('889966')}
                      className="text-[11px] underline font-bold"
                    >
                      Tự điền
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4A2F1B] mb-1.5">Nhập mã OTP 6 số</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="889966"
                      className="w-full text-center tracking-[0.5em] font-mono font-bold text-lg bg-[#FAF2EB] border border-[#D9C8BA] rounded-xl py-2.5 text-[#96421C] focus:outline-none focus:border-[#96421C]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full bg-[#96421C] hover:bg-[#803514] text-white py-3 rounded-xl font-bold text-xs shadow-md transition"
                  >
                    Xác nhận & Vào Tiệm Gấu
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Forgot Password ================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EDE2D5] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#3B2213]">Khôi phục mật khẩu tài khoản</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2EB] hover:bg-[#F3E2D0] text-[#6B4226] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotDone ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#3B2213]">Đã gửi liên kết khôi phục!</h4>
                <p className="text-xs text-[#6B4226]/80 leading-relaxed">
                  Một đường link đổi mật khẩu ấm áp đã được gửi tới <strong>{forgotInput}</strong>. Hãy kiểm tra hộp thư hoặc tin nhắn nhé!
                </p>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="bg-[#96421C] text-white text-xs font-bold px-6 py-2.5 rounded-full mt-2"
                >
                  Đã hiểu, quay lại đăng nhập
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#6B4226]/80 leading-relaxed">
                  Đừng lo lắng, hãy nhập số điện thoại hoặc email bạn đã đăng ký để tiệm gấu gửi mã lấy lại mật khẩu tức thì.
                </p>
                <div>
                  <label className="block text-xs font-bold text-[#4A2F1B] mb-1.5">Số điện thoại hoặc Email</label>
                  <input
                    type="text"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="VD: 0988 123 456 hoặc tiembong@gmail.com"
                    className="w-full bg-white border border-[#D9C8BA] rounded-xl py-2.5 px-3.5 text-xs text-[#4A2F1B] focus:outline-none focus:border-[#96421C]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (forgotInput) setForgotDone(true);
                  }}
                  className="w-full bg-[#96421C] hover:bg-[#803514] text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition"
                >
                  Gửi mã xác nhận khôi phục
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: Dried Flower Card & Kraft Box Preview ================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EDE2D5] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#3B2213]">Bộ Sưu Tập Thiệp Mộc & Hộp Giấy Kraft 🍂</h3>
                <p className="text-xs text-[#6B4226]/75">Miễn phí cho mọi đơn hàng từ thành viên tiệm gấu</p>
              </div>
              <button
                onClick={() => setShowCardModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2EB] hover:bg-[#F3E2D0] text-[#6B4226] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="rounded-2xl border border-[#EAE0D5] p-3 bg-[#FAF4EB]">
                <img
                  src="https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=500&q=80"
                  alt="Hộp Kraft mộc & ruy băng"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h4 className="font-bold text-xs text-[#3B2213]">Hộp Giấy Kraft Mộc & Ruy Băng Vải</h4>
                <p className="text-[11px] text-[#6B4226]/80 mt-1 leading-relaxed">
                  Giấy bìa tái sinh thân thiện môi trường, lót rơm gỗ thơm tự nhiên giữ dáng bạn gấu luôn êm ái.
                </p>
              </div>

              <div className="rounded-2xl border border-[#EAE0D5] p-3 bg-[#FAF4EB]">
                <img
                  src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80"
                  alt="Thiệp đính hoa cúc khô"
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h4 className="font-bold text-xs text-[#3B2213]">Thiệp Viết Tay Kèm Nhành Hoa Baby Khô</h4>
                <p className="text-[11px] text-[#6B4226]/80 mt-1 leading-relaxed">
                  Mỗi cành hoa được ép khô tỉ mỉ, đính sáp niêm phong cổ điển kèm nét bút nắn nót theo từng lời nhắn của bạn.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF0E6] p-4 rounded-2xl border border-[#E6CEBC] text-xs space-y-2">
              <div className="font-bold text-[#96421C] flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Lời chúc mẫu được yêu thích nhất mùa thu:
              </div>
              <p className="italic text-[#6B4226]/90 pl-6">
                "Mong bạn nhỏ này sẽ thay mình ôm lấy bạn những khi mỏi mệt, giữ cho trái tim bạn luôn ấm áp như ánh nắng mùa thu."
              </p>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowCardModal(false)}
                className="bg-[#96421C] hover:bg-[#803514] text-white px-8 py-2.5 rounded-full text-xs font-bold transition shadow-sm"
              >
                Đóng & Tiếp tục rước gấu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Mini Game Preview ================= */}
      {showClawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EDE2D5] text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 bg-[#FCE5D4] text-[#9E4624] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-[#3B2213]">Mini Game Gắp Gấu Mùa Thu 🕹️</h3>
            <p className="text-xs text-[#6B4226]/80 mt-2 mb-4 leading-relaxed">
              Mỗi tài khoản đăng nhập mới đều được tặng ngay <strong>3 Lượt Gắp Miễn Phí</strong> với cơ hội trúng gấu bông mini thật, móc khóa nơ len handmade và voucher lên đến 50.000đ!
            </p>
            <div className="bg-[#FAF2EB] rounded-2xl p-4 border border-[#ECD9C8] text-xs font-medium text-[#7D492A] space-y-1 mb-5">
              <p>🧸 Giải Đặc Biệt: Gấu Teddy Mùa Thu 35cm</p>
              <p>🧣 Giải Nhì: Khăn len & Áo len mini cho gấu</p>
              <p>🎟️ Giải Khuyến Khích: Voucher 30k & 20k đơn hàng</p>
            </div>
            <button
              onClick={() => setShowClawModal(false)}
              className="w-full bg-[#96421C] hover:bg-[#803514] text-white py-3 rounded-xl font-bold text-xs shadow-md transition"
            >
              Đăng nhập ngay để nhận 3 lượt gắp
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: Zalo QR Code Login ================= */}
      {showZaloQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-[#D5E3FA] relative animate-in fade-in zoom-in-95 text-center">
            {/* Close Button */}
            <button
              onClick={() => setShowZaloQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0F5FF] hover:bg-[#E0EDFF] text-[#0068FF] flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0068FF] flex items-center justify-center text-white text-xl font-black shadow-md mb-2">
                Zalo
              </div>
              <h3 className="font-extrabold text-lg text-[#1E293B]">Đăng nhập bằng Zalo</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Quét mã QR bằng ứng dụng <span className="font-bold text-[#0068FF]">Zalo</span> trên điện thoại
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-52 h-52 bg-white rounded-2xl p-3 border-2 border-dashed border-[#BBD5FA] flex flex-col items-center justify-center shadow-inner group">
              {qrCountdown > 0 ? (
                <>
                  {/* QR Image Graphic */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://tiemgaubong.vn/auth/zalo-qr?session=${qrSeed}`}
                      alt="Zalo Login QR Code"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />

                    {/* Zalo Logo overlay in QR center */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md flex items-center justify-center border border-blue-100">
                        <div className="w-full h-full rounded-lg bg-[#0068FF] text-white flex items-center justify-center text-xs font-black">
                          Z
                        </div>
                      </div>
                    </div>

                    {/* Scanning Animation Line */}
                    {qrScanStatus === 'waiting' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#0068FF] to-transparent animate-pulse shadow-[0_0_8px_#0068FF]"></div>
                    )}

                    {/* Scanned/Confirmed Status Overlay */}
                    {qrScanStatus === 'scanned' && (
                      <div className="absolute inset-0 bg-[#0068FF]/85 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 animate-in fade-in">
                        <Smartphone className="w-8 h-8 mb-2 animate-bounce" />
                        <span className="text-xs font-bold">Đã nhận diện QR!</span>
                        <span className="text-[11px] opacity-90">Vui lòng bấm Xác nhận trên điện thoại...</span>
                      </div>
                    )}

                    {qrScanStatus === 'confirmed' && (
                      <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 animate-in zoom-in-90">
                        <CheckCircle2 className="w-9 h-9 mb-1 text-white animate-pulse" />
                        <span className="text-xs font-bold">Xác nhận thành công!</span>
                        <span className="text-[11px] opacity-90">Đang đưa bạn vào Tiệm Gấu...</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Expired QR overlay */
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Mã QR đã hết hạn</span>
                  <p className="text-[11px] text-gray-500 mt-1 mb-3">Vui lòng tải lại mã mới để tiếp tục đăng nhập</p>
                  <button
                    onClick={handleRefreshQr}
                    className="flex items-center gap-1.5 bg-[#0068FF] text-white px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-[#0055D4] transition cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Lấy mã mới</span>
                  </button>
                </div>
              )}
            </div>

            {/* Countdown timer & Refresh */}
            {qrCountdown > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                <span>Mã có hiệu lực trong:</span>
                <span className="font-bold text-[#0068FF] font-mono bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  {Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={handleRefreshQr}
                  title="Làm mới mã"
                  className="p-1 hover:text-[#0068FF] transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-[11px] text-[#475569] space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0068FF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Mở ứng dụng <strong>Zalo</strong> trên điện thoại</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0068FF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Nhấn vào biểu tượng <strong>Quét mã QR</strong> [ <QrCode className="w-3 h-3 inline text-[#0068FF]" /> ] ở góc trên màn hình</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0068FF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Hướng camera vào mã trên và nhấn <strong>Đăng nhập</strong></span>
              </div>
            </div>

            {/* Simulation Quick Button for Instant Testing */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={qrScanStatus !== 'waiting' || qrCountdown === 0}
                className="w-full bg-[#0068FF] hover:bg-[#0055D4] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Smartphone className="w-4 h-4" />
                <span>{qrScanStatus === 'waiting' ? '⚡ Thử nghiệm: Giả lập đã quét QR trên Zalo' : 'Đang xử lý đăng nhập...'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowZaloQrModal(false);
                  handleSocial('zalo');
                }}
                className="text-[11px] text-gray-500 hover:text-[#0068FF] underline font-medium transition cursor-pointer"
              >
                Không có điện thoại ở đây? Đăng nhập Zalo 1-Chạm nhanh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Policy & Privacy ================= */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EDE2D5] max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-[#3B2213]">Cam Kết Bảo Mật & Quy Định Tiệm Gấu</h3>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF2EB] hover:bg-[#F3E2D0] text-[#6B4226] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#6B4226]/85 space-y-3 leading-relaxed">
              <div className="p-3 bg-[#FAF2EB] rounded-xl border border-[#ECD9C8]">
                <strong className="text-[#96421C] block mb-1">1. Tuyệt đối giấu giá tiền cho đơn gửi tặng</strong>
                Mọi đơn hàng đánh dấu gửi tặng người thương đều được xé tem giá, hóa đơn điện tử chỉ gửi về tài khoản người đặt.
              </div>
              <div className="p-3 bg-[#FAF2EB] rounded-xl border border-[#ECD9C8]">
                <strong className="text-[#96421C] block mb-1">2. Bảo vệ thông tin người nhận</strong>
                Số điện thoại và địa chỉ người nhận chỉ dùng duy nhất cho mục đích shipper giao quà, không phục vụ mục đích quảng cáo bên thứ ba.
              </div>
              <div className="p-3 bg-[#FAF2EB] rounded-xl border border-[#ECD9C8]">
                <strong className="text-[#96421C] block mb-1">3. Cam kết gấu bông sạch 100%</strong>
                100% ruột gòn trắng tinh khiết tiệt trùng kháng khuẩn, vải lông nhung êm ái đạt chuẩn an toàn cho cả trẻ nhỏ.
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="bg-[#96421C] text-white px-6 py-2 rounded-full text-xs font-bold"
              >
                Đã hiểu rõ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Google Identity Services ================= */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        clientId={googleClientId}
        onSelectAccount={handleSelectGoogleAccount}
        onSaveClientId={handleSaveGoogleClientId}
      />
    </div>
  );
}
