import React, { useState } from 'react';
import { X, Sparkles, PackageOpen, Truck, Heart, CheckCircle2 } from 'lucide-react';
import * as api from './services/api';

export default function OrderModal({ isOpen, onClose, product, onOrderSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [giftCardMessage, setGiftCardMessage] = useState('Chúc người thương luôn mỉm cười ấm áp trong những ngày se lạnh này!');
  const [packagingOption, setPackagingOption] = useState('Hộp quà Kraft vintage + Thiệp viết tay');
  const [shippingMethod, setShippingMethod] = useState('Hỏa tốc 2H (Nội thành)');
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản QR');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(null);

  if (!isOpen) return null;

  const currentProduct = product || {
    id: 'prod-1',
    name: 'Teddy Mùa Thu Quàng Khăn Len',
    price: 395000,
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
  };

  const shippingFee = shippingMethod.includes('Hỏa tốc') ? 30000 : 0;
  const itemsTotal = currentProduct.price * quantity;
  const grandTotal = itemsTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận gấu');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        customerAddress,
        items: [
          {
            productId: currentProduct.id,
            productName: currentProduct.name,
            quantity,
            price: currentProduct.price,
            image: currentProduct.image
          }
        ],
        giftCardMessage,
        packagingOption,
        shippingMethod,
        paymentMethod,
        totalAmount: grandTotal,
        shippingFee
      };

      const created = await api.createOrder(orderPayload);
      setOrderDone(created);
      if (onOrderSuccess) onOrderSuccess(created);
    } catch {
      alert('Đã xảy ra lỗi khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setOrderDone(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FAF4EB] rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-cozy-border max-h-[92vh] overflow-y-auto text-cozy-text relative">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1 rounded-full hover:bg-black/5 text-cozy-text/70 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {orderDone ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-cozy-primary">Đặt Bé Gấu Thành Công!</h2>
            <p className="text-sm text-cozy-text/80 max-w-md mx-auto">
              Cảm ơn bạn <strong>{orderDone.customerName}</strong>! Tiệm đã nhận đơn hàng{' '}
              <span className="font-bold text-cozy-primary">#{orderDone.id}</span> và sẽ nắn nót viết thiệp tay ngay cho bạn.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-cozy-border text-xs text-left space-y-2 mt-4 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã đơn hàng:</span>
                <span className="font-bold text-cozy-primary">{orderDone.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sản phẩm:</span>
                <span className="font-bold">{orderDone.items?.[0]?.productName} x{orderDone.items?.[0]?.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="font-bold text-cozy-primary">{orderDone.totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 mt-4 max-w-md mx-auto">
              ✨ <strong>Trải nghiệm Backend:</strong> Bạn hãy bấm vào nút <strong>"⚙️ Trang Quản Trị"</strong> trên đầu trang để thấy đơn hàng <strong>{orderDone.id}</strong> vừa xuất hiện ngay trong hệ thống!
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-4 bg-cozy-primary hover:bg-cozy-text text-white font-bold px-8 py-3 rounded-full text-xs transition shadow-md"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-cozy-primary uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" /> Gói Trọn Yêu Thương
              </span>
              <h2 className="text-2xl font-bold text-cozy-text">Đặt Mua & Viết Thiệp Cho Người Thương</h2>
            </div>

            {/* Selected plushie preview */}
            <div className="bg-white p-4 rounded-2xl border border-cozy-border flex items-center gap-4 mb-6">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-16 h-16 rounded-xl object-cover border border-cozy-border"
              />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-cozy-text">{currentProduct.name}</h3>
                <p className="text-xs font-bold text-cozy-primary">
                  {currentProduct.price.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="flex items-center gap-2 border border-cozy-border rounded-lg p-1 bg-cozy-bg">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-6 h-6 rounded bg-white text-xs font-bold flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="text-xs font-bold px-1">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-6 h-6 rounded bg-white text-xs font-bold flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

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
              <div className="bg-[#FFFDF9] border border-[#E8DACB] p-4 rounded-2xl">
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
                    <option value="Hỏa tốc 2H (Nội thành)">Hỏa tốc 2H (+30.000đ)</option>
                    <option value="Giao hàng tiêu chuẩn">Giao tiêu chuẩn (Miễn phí)</option>
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

              {/* Grand Total */}
              <div className="pt-3 border-t border-cozy-border flex justify-between items-center text-sm font-bold">
                <span>Tổng cộng:</span>
                <span className="text-xl text-cozy-primary">{grandTotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cozy-primary hover:bg-cozy-text text-white py-3.5 rounded-full font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
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
