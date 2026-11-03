import React, { useState, useEffect } from 'react';
import { X, Sparkles, PackageOpen, Truck, Heart, CheckCircle2, ArrowRight, Tag, Coins } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useLoyalty } from './context/LoyaltyContext';
import * as api from './services/api';

export default function OrderModal({
  isOpen,
  onClose,
  product,
  checkoutItems = [],
  onOrderSuccess,
  onClearCart,
  onNavigateToTracking
}) {
  const { user, isAuthenticated } = useAuth();
  const { balance = 0, applyCoinsToOrder, awardOrderCoins } = useLoyalty();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [useCoins, setUseCoins] = useState(false);
  const [giftCardMessage, setGiftCardMessage] = useState(
    product?.giftMessage || 'Chúc người thương luôn mỉm cười ấm áp trong những ngày se lạnh này!'
  );
  const [packagingOption, setPackagingOption] = useState(
    'Hộp quà Kraft vintage + Thiệp viết tay'
  );
  const [shippingMethod, setShippingMethod] = useState('Giao hàng tiêu chuẩn');
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản QR');
  const [singleQty, setSingleQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(null);

  const isMultiItem = checkoutItems && checkoutItems.length > 0;

  // Auto fill user details if logged in
  useEffect(() => {
    if (user && isOpen) {
      if (!customerName && user.name) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (user.vouchers && user.vouchers.length > 0 && !appliedVoucher) {
        setAppliedVoucher(user.vouchers[0]);
      }
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (product) {
      // Mở sản phẩm khác thì đặt lại số lượng về 1 (tránh giữ số lượng của sản phẩm trước)
      setSingleQty(1);
      if (product.giftMessage) setGiftCardMessage(product.giftMessage);
      if (product.includeGiftBox !== undefined) {
        setPackagingOption(
          product.includeGiftBox
            ? 'Hộp quà Kraft vintage + Thiệp viết tay'
            : 'Đóng gói bọc màng bảo vệ tiêu chuẩn'
        );
      }
    }
  }, [product]);

  if (!isOpen) return null;

  // Calculate items and pricing
  let activeItems = [];
  let rawItemsTotal = 0;

  if (isMultiItem) {
    activeItems = checkoutItems.map(it => ({
      productId: it.id,
      productName: it.name,
      quantity: it.quantity || 1,
      price: it.price,
      image: it.image || it.img,
      size: it.size || '35cm'
    }));
    rawItemsTotal = activeItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  } else {
    const currentProduct = product || {
      id: 'prod-1',
      name: 'Teddy Mùa Thu Quàng Khăn Len',
      price: 395000,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
    };
    activeItems = [
      {
        productId: currentProduct.id,
        productName: currentProduct.name,
        quantity: singleQty,
        price: currentProduct.price,
        image: currentProduct.image,
        size: '35cm'
      }
    ];
    rawItemsTotal = currentProduct.price * singleQty;
  }

  // Total item count
  const totalCount = activeItems.reduce((acc, it) => acc + it.quantity, 0);

  // Combo Discount
  let comboDiscount = 0;
  let comboLabel = '';
  if (totalCount >= 3) {
    comboDiscount = Math.round(rawItemsTotal * 0.1);
    comboLabel = 'Ưu đãi combo 3+ món (-10%)';
  } else if (totalCount >= 2) {
    comboDiscount = Math.round(rawItemsTotal * 0.05);
    comboLabel = 'Ưu đãi combo 2 món (-5%)';
  }

  // Shipping logic
  const isExpress = shippingMethod.includes('Hỏa tốc');
  const isFreeShipEligible = rawItemsTotal >= 500000;
  const shippingFee = isExpress ? 30000 : (isFreeShipEligible ? 0 : 15000);

  const voucherDiscount = appliedVoucher ? (appliedVoucher.discount || 30000) : 0;
  
  // Coin deduction logic (Up to 50% order value)
  const maxUsableCoins = Math.min(balance || 0, Math.round(rawItemsTotal * 0.5));
  const appliedCoinDiscount = useCoins ? maxUsableCoins : 0;

  const grandTotal = Math.max(0, rawItemsTotal - comboDiscount - voucherDiscount - appliedCoinDiscount + shippingFee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận gấu');
      return;
    }
    const normalizedPhone = customerPhone.replace(/[\s.-]/g, '');
    if (!/^(0|\+84)\d{9,10}$/.test(normalizedPhone)) {
      alert('Số điện thoại chưa đúng định dạng (VD: 0912345678). Bạn kiểm tra lại giúp tiệm nhé!');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: activeItems,
        giftCardMessage: giftCardMessage.trim(),
        packagingOption,
        shippingMethod,
        paymentMethod,
        totalAmount: grandTotal,
        shippingFee,
        comboDiscount,
        voucherDiscount,
        voucherCode: appliedVoucher?.code || '',
        appliedCoins: appliedCoinDiscount
      };

      const created = await api.createOrder(orderPayload);
      setOrderDone(created);

      // Deduct coins if used
      if (appliedCoinDiscount > 0 && applyCoinsToOrder) {
        applyCoinsToOrder(appliedCoinDiscount, created.orderCode || created.id);
      }

      // Award 5% loyalty coins on purchase
      if (awardOrderCoins) {
        awardOrderCoins(grandTotal, created.orderCode || created.id);
      }

      if (isMultiItem && onClearCart) {
        onClearCart();
      }

      if (onOrderSuccess) onOrderSuccess(created);
    } catch (err) {
      alert(err?.message ? `Không thể tạo đơn: ${err.message}` : 'Đã xảy ra lỗi khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setOrderDone(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#FAF4EB] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-cozy-border max-h-[92vh] overflow-y-auto text-cozy-text relative my-auto animate-fadeIn">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-black/5 text-cozy-text/70 transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {orderDone ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-cozy-primary">Đặt Combo Quà Thành Công!</h2>
            <p className="text-sm text-cozy-text/80 max-w-md mx-auto">
              Cảm ơn bạn <strong>{orderDone.customerName}</strong>! Tiệm đã nhận đơn hàng{' '}
              <span className="font-bold text-cozy-primary">#{orderDone.id}</span> và sẽ nắn nót viết thiệp tay ngay cho bạn.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-cozy-border text-xs text-left space-y-3 mt-4 max-w-md mx-auto shadow-2xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-bold text-cozy-primary text-sm">#{orderDone.id}</span>
              </div>

              <div>
                <span className="text-gray-500 font-bold block mb-1.5">Sản phẩm trong combo ({orderDone.items?.length || 1} món):</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {orderDone.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs bg-[#FAF4EB]/60 p-2 rounded-xl">
                      <div className="flex items-center gap-2 truncate">
                        {it.image && (
                          <img src={it.image} alt={it.productName} className="w-7 h-7 rounded-md object-cover" />
                        )}
                        <span className="font-medium text-[#4A3022] truncate">{it.productName}</span>
                      </div>
                      <span className="font-bold shrink-0 text-[#8C5D39]">x{it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t border-stone-100">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="font-black text-[#D47343] text-base">
                  {orderDone.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 mt-4 max-w-md mx-auto">
              📌 Hãy lưu lại mã đơn <strong>#{orderDone.id}</strong> để tra cứu hành trình bé gấu tại mục <strong>"Đơn Hàng"</strong> trên đầu trang nhé!
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetAndClose}
                className="bg-cozy-primary hover:bg-cozy-text text-white font-bold px-6 py-2.5 rounded-full text-xs transition shadow-md cursor-pointer"
              >
                Tiếp Tục Mua Sắm
              </button>
              {onNavigateToTracking && (
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onNavigateToTracking(orderDone.id);
                  }}
                  className="bg-[#6B4226] hover:bg-[#52321c] text-white font-bold px-6 py-2.5 rounded-full text-xs transition shadow-md cursor-pointer"
                >
                  Theo Dõi Đơn Hàng →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold text-cozy-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 fill-current" />
                {isMultiItem ? `Đặt Mua Combo (${totalCount} Món)` : 'Gói Trọn Yêu Thương'}
              </span>
              <h2 className="text-2xl font-bold text-[#4A3022]">
                {isMultiItem ? 'Xác Nhận Giỏ Quà & Viết Thiệp' : 'Đặt Mua & Viết Thiệp Cho Người Thương'}
              </h2>
            </div>

            {/* Selected items preview */}
            {isMultiItem ? (
              <div className="bg-white p-3.5 rounded-2xl border border-cozy-border mb-5 max-h-48 overflow-y-auto space-y-2 shadow-2xs">
                <div className="text-xs font-bold text-[#8C6D58] pb-1 border-b border-stone-100 flex justify-between">
                  <span>Các bạn gấu trong combo quà:</span>
                  <span>{activeItems.length} món</span>
                </div>
                {activeItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs py-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-[#EAE0D5] shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-[#4A3022] truncate">{item.productName}</p>
                        <span className="text-[10px] text-stone-500">{item.size} • Số lượng: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#D47343] shrink-0">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl border border-cozy-border flex items-center gap-4 mb-5 shadow-2xs">
                <img
                  src={activeItems[0].image}
                  alt={activeItems[0].productName}
                  className="w-16 h-16 rounded-xl object-cover border border-cozy-border"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-cozy-text truncate">{activeItems[0].productName}</h3>
                  <p className="text-xs font-bold text-cozy-primary">
                    {activeItems[0].price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className="flex items-center gap-2 border border-cozy-border rounded-lg p-1 bg-cozy-bg">
                  <button
                    type="button"
                    onClick={() => setSingleQty(q => Math.max(1, q - 1))}
                    className="w-6 h-6 rounded bg-white text-xs font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold px-1">{singleQty}</span>
                  <button
                    type="button"
                    onClick={() => setSingleQty(q => q + 1)}
                    className="w-6 h-6 rounded bg-white text-xs font-bold flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cozy-text/80 mb-1">Họ Tên Bạn *</label>
                  <input
                    type="text"
                    placeholder="VD: Thu Trang"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-cozy-border rounded-xl py-2 px-3 focus:outline-none focus:border-cozy-primary text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-cozy-text/80 mb-1">Số Điện Thoại *</label>
                  <input
                    type="tel"
                    placeholder="0912..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-cozy-border rounded-xl py-2 px-3 focus:outline-none focus:border-cozy-primary text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-cozy-text/80 mb-1">Địa Chỉ Nhận Gấu *</label>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-white border border-cozy-border rounded-xl py-2 px-3 focus:outline-none focus:border-cozy-primary text-xs"
                  required
                />
              </div>

              {/* Special Vintage Handwritten Card Section */}
              <div className="bg-[#FFFDF9] border border-[#E8DACB] p-4 rounded-2xl shadow-2xs">
                <label className="block font-bold text-cozy-primary mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current" /> Lời Chúc Viết Tay Lên Thiệp Kraft Vintage
                </label>
                <p className="text-[10px] text-cozy-text/60 mb-2">Tiệm sẽ dùng bút mực nắn nót từng chữ gửi tặng người nhận:</p>
                <textarea
                  rows={2}
                  value={giftCardMessage}
                  onChange={(e) => setGiftCardMessage(e.target.value)}
                  placeholder="Nhập lời chúc bạn muốn nhắn nhủ..."
                  className="w-full bg-white border border-cozy-border rounded-xl p-2.5 font-handwriting text-lg focus:outline-none focus:border-cozy-primary text-cozy-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cozy-text/80 mb-1">Hình Thức Giao Hàng</label>
                  <select
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-full bg-white border border-cozy-border rounded-xl py-2 px-3 focus:outline-none focus:border-cozy-primary text-xs"
                  >
                    <option value="Giao hàng tiêu chuẩn">
                      Tiêu chuẩn ({isFreeShipEligible ? 'Miễn phí Freeship' : '15.000đ'})
                    </option>
                    <option value="Hỏa tốc 2H (Nội thành)">Hỏa tốc 2H (+30.000đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-cozy-text/80 mb-1">Thanh Toán</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-cozy-border rounded-xl py-2 px-3 focus:outline-none focus:border-cozy-primary text-xs"
                  >
                    <option value="Chuyển khoản QR">Chuyển khoản QR</option>
                    <option value="COD (Thanh toán khi nhận)">COD (Khi nhận hàng)</option>
                  </select>
                </div>
              </div>

              {/* Loyalty Coins Option */}
              {balance > 0 && maxUsableCoins > 0 && (
                <div className="bg-[#FFF9F2] p-3 rounded-2xl border border-[#FADCC7] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold text-sm">
                      🪙
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#6B4226]">
                        Dùng Xu Gấu giảm giá
                      </div>
                      <div className="text-[10px] text-cozy-text/60">
                        Ví có: <strong>{balance.toLocaleString('vi-VN')} Xu</strong> (Tối đa giảm {maxUsableCoins.toLocaleString('vi-VN')}đ)
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useCoins}
                      onChange={(e) => setUseCoins(e.target.checked)}
                      className="w-4 h-4 text-[#D47343] accent-[#D47343] rounded cursor-pointer"
                    />
                    <span className="text-xs font-bold text-[#D47343]">
                      -{maxUsableCoins.toLocaleString('vi-VN')}đ
                    </span>
                  </label>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-cozy-border space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8C6D58]">
                  <span>Tạm tính ({totalCount} món):</span>
                  <span>{rawItemsTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                {comboDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{comboLabel}:</span>
                    <span>-{comboDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                {appliedVoucher && (
                  <div className="flex justify-between text-[#96421C] font-bold bg-[#FEEFD9] px-2 py-1 rounded-lg">
                    <span className="flex items-center gap-1">🎟️ Voucher thành viên ({appliedVoucher.code}):</span>
                    <span>-{voucherDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                {useCoins && appliedCoinDiscount > 0 && (
                  <div className="flex justify-between text-[#D47343] font-bold bg-[#FFF4E8] px-2 py-1 rounded-lg border border-[#FADCC7]">
                    <span className="flex items-center gap-1">🪙 Trừ từ ví Xu Gấu:</span>
                    <span>-{appliedCoinDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8C6D58]">
                  <span>Phí vận chuyển:</span>
                  <span className={shippingFee === 0 ? 'text-emerald-700 font-bold' : ''}>
                    {shippingFee === 0 ? 'Miễn phí giao hàng' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-stone-200">
                  <span className="text-[#4A3022]">Tổng thanh toán:</span>
                  <span className="text-xl text-cozy-primary font-black">
                    {grandTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B85C2E] hover:bg-[#9F4820] text-white py-3.5 rounded-full font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                {loading ? 'Đang gửi đơn hàng...' : 'Xác Nhận Đặt Hàng Ngay 🧸'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
