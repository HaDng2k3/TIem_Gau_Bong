import React, { useState } from 'react';
import { X, Sparkles, Gift, Trophy, RotateCcw } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function MinigameModal({ isOpen, onClose }) {
  const [clawState, setClawState] = useState('idle'); // 'idle' | 'dropping' | 'grabbing' | 'won'
  const [wonPrize, setWonPrize] = useState(null);
  const { showToast } = useWishlist();

  if (!isOpen) return null;

  const PRIZES = [
    { title: 'Voucher 50.000đ Rước Gấu', desc: 'Mã: AMAP50K áp dụng cho đơn từ 299k', icon: '🎟️' },
    { title: 'Miễn Phí Gói Hộp Quà Kraft Vintage', desc: 'Kèm thiệp viết tay & hoa khô', icon: '🎁' },
    { title: 'Bé Gấu Mini Móc Khóa Len', desc: 'Tặng kèm miễn phí khi đặt gấu mùa thu', icon: '🧸' },
    { title: 'Voucher 15% BST Mùa Thu', desc: 'Mã: AUTUMNLOVE15 giảm ngay 15%', icon: '🍂' }
  ];

  const handlePlay = () => {
    if (clawState !== 'idle') return;
    setClawState('dropping');

    setTimeout(() => {
      setClawState('grabbing');
      setTimeout(() => {
        const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
        setWonPrize(prize);
        setClawState('won');
        showToast(`Chúc mừng bạn đã gắp được: ${prize.title}! 🎉`, '🧸');
      }, 1200);
    }, 1000);
  };

  const handleReset = () => {
    setClawState('idle');
    setWonPrize(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF4EB] border border-[#E0D0C0] rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-500 hover:text-black flex items-center justify-center shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-[#FFE8D6] text-[#C25E2E] text-xs font-bold px-3 py-1 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Máy Gắp Gấu May Mắn Tiệm Gấu Bông HD</span>
        </div>

        <h3 className="text-xl font-bold text-[#4A2E1B] mb-1">
          Minigame Gắp Gấu Mùa Thu 🕹️
        </h3>
        <p className="text-xs text-[#8C5E43] font-medium mb-6">
          Nhấn nút để thả cần gắp rước quà tặng ấm áp và voucher độc quyền!
        </p>

        {/* Claw Arcade Machine Simulation */}
        <div className="bg-[#FFFDF9] border-4 border-[#D9C4B2] rounded-3xl p-6 relative overflow-hidden shadow-inner mb-6 min-h-[220px] flex flex-col items-center justify-center">
          {clawState === 'idle' && (
            <div className="space-y-4">
              <div className="text-5xl animate-bounce">🏗️</div>
              <div className="flex justify-center gap-3 text-3xl">
                <span>🧸</span>
                <span>🎁</span>
                <span>🍂</span>
                <span>🍯</span>
              </div>
              <p className="text-xs font-bold text-[#7A3E1D]">
                Cần gắp sẵn sàng! Nhấn nút bên dưới để thử vận may.
              </p>
            </div>
          )}

          {clawState === 'dropping' && (
            <div className="space-y-3 animate-pulse">
              <div className="text-5xl transform translate-y-6 transition duration-700">👇</div>
              <p className="text-xs font-bold text-[#C25E2E]">Cần gắp đang hạ xuống...</p>
            </div>
          )}

          {clawState === 'grabbing' && (
            <div className="space-y-3">
              <div className="text-5xl animate-spin">✨</div>
              <p className="text-xs font-bold text-[#E5A93C]">Đang ôm chặt phần quà...</p>
            </div>
          )}

          {clawState === 'won' && wonPrize && (
            <div className="space-y-2 animate-fadeIn">
              <div className="text-5xl mb-2">{wonPrize.icon}</div>
              <span className="bg-[#FEF3E2] text-[#C25E2E] text-[11px] font-bold px-3 py-0.5 rounded-full border border-[#FADCC7]">
                🎉 Chúc mừng bạn rước được quà!
              </span>
              <h4 className="text-base font-bold text-[#4A2E1B] mt-2">{wonPrize.title}</h4>
              <p className="text-xs text-[#8C5E43] font-semibold">{wonPrize.desc}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {clawState === 'won' ? (
            <button
              onClick={handleReset}
              className="w-full bg-[#7A3E1D] hover:bg-[#602F13] text-white font-bold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Gắp thêm lượt nữa</span>
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={clawState !== 'idle'}
              className="w-full bg-[#C25E2E] hover:bg-[#A94F25] disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Gắp Gấu Ngay! (Miễn phí) 🕹️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
