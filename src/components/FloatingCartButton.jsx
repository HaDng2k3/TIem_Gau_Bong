import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function FloatingCartButton() {
  const { totalItems, grandTotal, openCart, isCartOpen } = useCart();

  if (isCartOpen || totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-40 bg-[#B85C2E] hover:bg-[#9F4820] text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-1 flex items-center gap-3 border-2 border-white cursor-pointer group"
      title="Xem giỏ quà và combo"
    >
      <div className="relative">
        <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="absolute -top-2 -right-2 bg-white text-[#B85C2E] font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
          {totalItems}
        </span>
      </div>

      <div className="text-left text-xs font-bold leading-tight">
        <div className="flex items-center gap-1 text-[11px] text-amber-200 uppercase tracking-wide">
          <Sparkles className="w-3 h-3 fill-current" /> Combo Quà
        </div>
        <div className="text-white text-sm font-black">
          {grandTotal.toLocaleString('vi-VN')}đ
        </div>
      </div>
    </button>
  );
}
