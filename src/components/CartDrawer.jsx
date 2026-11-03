import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, Gift, Truck, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useCart, COMBO_SUGGESTIONS } from '../context/CartContext';

export default function CartDrawer({ onProceedToCheckout }) {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotal,
    comboDiscount,
    comboDiscountText,
    baseShippingFee,
    isFreeShipping,
    amountToFreeShip,
    freeShipProgress,
    grandTotal
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    if (onProceedToCheckout) {
      onProceedToCheckout(cartItems, grandTotal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF4EB] shadow-2xl flex flex-col border-l border-[#EAE0D5] relative animate-slideIn">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#FFFDF9] border-b border-[#EAE0D5] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FAF0E6] border border-[#E0D0C0] flex items-center justify-center text-lg shadow-2xs">
                🧸
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#4A3022]">Giỏ Quà Của Bạn</h2>
                {totalItems > 0 && (
                  <span className="bg-[#FEF3E2] text-[#C25E2E] border border-[#FADCC7] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-current" /> Combo ({totalItems} món)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition"
              title="Đóng giỏ quà"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping & Combo Progress Bar */}
          <div className="bg-[#FFF8F0] px-5 py-3 border-b border-[#F0E4D7]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#8C5D39]">
                <Truck className="w-4 h-4 text-[#D47343]" />
                {isFreeShipping ? (
                  <span className="text-emerald-700">🎉 Đã đủ điều kiện <strong>Miễn phí giao hàng toàn quốc!</strong></span>
                ) : (
                  <span>
                    Thêm <strong className="text-[#D47343]">{amountToFreeShip.toLocaleString('vi-VN')}đ</strong> để được <strong>Freeship</strong>
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#A0704E]">{freeShipProgress}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-[#EAE0D5] rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-r from-[#E5A93C] to-[#D47343]'
                }`}
                style={{ width: `${freeShipProgress}%` }}
              />
            </div>

            {/* Combo Perks Tag */}
            {totalItems >= 2 ? (
              <div className="mt-2 text-[11px] font-semibold text-[#8C5D39] bg-[#FFF0E0] border border-[#FADCC7] px-2.5 py-1 rounded-lg flex items-center justify-between">
                <span>🎁 Đã tặng: Hộp Kraft vintage + Thiệp tay (0đ)</span>
                <span className="text-[#C25E2E] font-bold">{comboDiscountText || 'Combo tiết kiệm'}</span>
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-[#8C5D39]/80 flex items-center gap-1">
                <span>💡 Nhặt từ 2 bạn gấu để nhận combo giảm thêm 5% - 10%!</span>
              </div>
            )}
          </div>

          {/* Cart Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-20 h-20 bg-white rounded-full border border-[#EAE0D5] flex items-center justify-center mx-auto text-3xl shadow-sm">
                  🛍️
                </div>
                <h3 className="font-bold text-base text-[#4A3022]">Giỏ quà chưa có bạn gấu nào</h3>
                <p className="text-xs text-[#8C6D58] max-w-xs mx-auto leading-relaxed">
                  Hãy ghé thăm các bạn gấu thủ công ấm áp và nhặt combo yêu thích về nhà nhé!
                </p>
                <button
                  onClick={closeCart}
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-md"
                >
                  Khám Phá BST Ngay
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const itemSubtotal = item.price * (item.quantity || 1);
                    return (
                      <div
                        key={item.id}
                        className="bg-white p-3.5 rounded-2xl border border-[#EAE0D5] shadow-2xs hover:shadow-xs transition flex gap-3 relative group"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF4EB] border border-[#EAE0D5] shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-2 pr-6">
                              <h4 className="font-bold text-xs sm:text-sm text-[#4A3022] line-clamp-1 leading-snug">
                                {item.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] font-bold text-[#8C6D58] bg-[#FAF4EB] border border-[#EAE0D5] px-2 py-0.5 rounded-md">
                                {item.size || '35cm'} • {item.tag || 'Mùa Thu'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-[#EAE0D5] rounded-lg bg-[#FAF4EB] p-0.5 shadow-2xs">
                              <button
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                className="w-5 h-5 rounded bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-xs transition"
                                title="Giảm số lượng"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-2 text-[#4A3022]">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                className="w-5 h-5 rounded bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center font-bold text-xs transition"
                                title="Tăng số lượng"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="font-bold text-sm text-[#D47343]">
                                {itemSubtotal.toLocaleString('vi-VN')}đ
                              </span>
                              {item.quantity > 1 && (
                                <div className="text-[10px] text-stone-400">
                                  {item.price.toLocaleString('vi-VN')}đ / bé
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-3 right-3 text-stone-400 hover:text-rose-500 p-1 rounded-md transition"
                          title="Bỏ bé gấu khỏi giỏ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Add Combo Recommendations (Nhặt combo nhiều món) */}
                <div className="mt-5 pt-4 border-t border-[#EAE0D5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#4A3022] flex items-center gap-1.5 uppercase tracking-wide">
                      <Gift className="w-3.5 h-3.5 text-[#D47343]" /> Nhặt Thêm Vào Combo Quà Tặng
                    </span>
                    <span className="text-[10px] text-[#8C6D58] font-semibold">Ưu đãi giảm thêm</span>
                  </div>

                  <div className="space-y-2">
                    {COMBO_SUGGESTIONS.map((sug) => (
                      <div
                        key={sug.id}
                        className="bg-white/80 p-2.5 rounded-xl border border-[#EAE0D5] flex items-center justify-between gap-3 hover:bg-white transition shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={sug.image}
                            alt={sug.name}
                            className="w-11 h-11 rounded-lg object-cover border border-[#EAE0D5] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#4A3022] truncate">{sug.name}</p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#D47343]">
                                {sug.price.toLocaleString('vi-VN')}đ
                              </span>
                              <span className="text-[10px] text-stone-400 line-through">
                                {sug.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(sug, 1)}
                          className="bg-[#FEF3E2] hover:bg-[#FADCC7] text-[#C25E2E] border border-[#FADCC7] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-2xs"
                        >
                          <Plus className="w-3 h-3" /> Nhặt
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Order Summary and Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-[#FFFDF9] border-t border-[#EAE0D5] shadow-lg space-y-3">
              {/* Summary details */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8C6D58]">
                  <span>Tạm tính ({totalItems} món):</span>
                  <span className="font-bold text-[#4A3022]">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between text-[#8C6D58]">
                  <span>Phí vận chuyển:</span>
                  <span className={`font-bold ${isFreeShipping ? 'text-emerald-700' : 'text-[#4A3022]'}`}>
                    {isFreeShipping ? 'Miễn phí giao hàng' : `${baseShippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>

                {comboDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{comboDiscountText}:</span>
                    <span>-{comboDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="flex justify-between text-amber-800 text-[11px] font-semibold pt-1 border-t border-stone-100">
                  <span>Hộp Kraft vintage & Thiệp viết tay:</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">Tặng miễn phí 0đ</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-2 border-t border-[#EAE0D5] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#4A3022]">Tổng thanh toán:</span>
                  <p className="text-[10px] text-stone-400 font-medium">(Đã bao gồm VAT & ưu đãi combo)</p>
                </div>
                <span className="text-2xl font-black text-[#C25E2E]">
                  {grandTotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#B85C2E] hover:bg-[#9F4820] text-white py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <span>TIẾN HÀNH ĐẶT HÀNG NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 text-[10px] text-stone-500 font-medium pt-1">
                <span>✓ Đóng gói riêng tư</span>
                <span>•</span>
                <span>✓ Đổi trả 7 ngày</span>
                <span>•</span>
                <span>✓ Kiểm tra khi nhận</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
