import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, User, ExternalLink, HelpCircle } from 'lucide-react';

export default function GoogleAuthModal({
  isOpen,
  onClose,
  clientId,
  onSelectAccount,
  onSaveClientId
}) {
  const [showConfig, setShowConfig] = useState(!clientId);
  const [newClientId, setNewClientId] = useState(clientId || '');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const mockAccounts = [
    {
      name: 'Nguyễn Minh Thư',
      email: 'minhthu.bear@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Trần Hoàng Long',
      email: 'hoanglong.teddy@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Bé Gấu Chăm Chỉ',
      email: 'tiembong.khachhang@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const emailName = customName.trim() || customEmail.split('@')[0];
    onSelectAccount({
      name: emailName,
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`
    });
  };

  const handleSaveId = (e) => {
    e.preventDefault();
    if (newClientId.trim()) {
      onSaveClientId(newClientId.trim());
      setShowConfig(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#EDE2D5] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Đăng nhập bằng Google</h3>
              <p className="text-[11px] text-gray-500">tiembong.vn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice for Google Client ID */}
        {!clientId && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex items-center justify-between text-[11px] text-amber-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Chế độ kiểm thử nhanh (Demo Identity)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[#96421C] font-bold hover:underline cursor-pointer"
            >
              {showConfig ? 'Ẩn cài đặt' : 'Cấu hình Client ID'}
            </button>
          </div>
        )}

        {/* Config Form (if toggled) */}
        {showConfig && !clientId && (
          <form onSubmit={handleSaveId} className="p-5 bg-[#FAF7F2] border-b border-[#EDE2D5] text-xs">
            <p className="text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#96421C]" />
              Nhập Google Client ID (để dùng popup Google thật):
            </p>
            <input
              type="text"
              placeholder="VD: 123456789-xxx.apps.googleusercontent.com"
              value={newClientId}
              onChange={(e) => setNewClientId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#96421C]/20"
            />
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">Hoặc lưu vào file <code className="text-[#96421C]">.env</code></span>
              <button
                type="submit"
                className="bg-[#96421C] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#7D3414] transition cursor-pointer"
              >
                Kích hoạt Client ID
              </button>
            </div>
          </form>
        )}

        {/* Content: Account list */}
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-700 mb-3">
            Chọn một tài khoản Google để tiếp tục với Tiệm Gấu Bông:
          </p>

          <div className="space-y-2 mb-5">
            {mockAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectAccount(acc)}
                className="w-full flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200 hover:border-[#4285F4] hover:bg-blue-50/40 transition text-left cursor-pointer group"
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-[#4285F4]">
                    {acc.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">{acc.email}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Or enter custom Google account */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-600 mb-2">Hoặc đăng nhập bằng Gmail của bạn:</p>
            <form onSubmit={handleCustomSubmit} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ email (@gmail.com)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30"
              />
              <input
                type="text"
                placeholder="Tên hiển thị của bạn (tùy chọn)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Tiếp tục với Gmail này
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Bảo mật theo tiêu chuẩn Google Identity</span>
          <span className="text-[#4285F4] hover:underline cursor-pointer">Chính sách bảo mật</span>
        </div>
      </div>
    </div>
  );
}
