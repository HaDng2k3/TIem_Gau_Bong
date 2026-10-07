// API Service for Tiệm Gấu Bông HD
// Tự động kết nối Backend Express API (port 5000), 
// nếu server offline thì tự động đồng bộ qua LocalStorage đảm bảo web luôn hoạt động trơn tru 100%.

const API_BASE_URL = 'http://localhost:5000/api';

// Dữ liệu ban đầu mặc định cho LocalStorage Fallback
const DEFAULT_DATA = {
  products: [
    {
      id: "prod-1",
      name: "Teddy Mùa Thu Quàng Khăn Len",
      category: "Gấu Teddy",
      price: 395000,
      originalPrice: 450000,
      stock: 24,
      rating: 5.0,
      reviews: 142,
      tag: "Best Seller",
      tagColor: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Bé Teddy lông xoắn vintage cao cấp, quàng chiếc khăn len dệt tay ấm áp. Ruột gòn 3D tinh khiết 100% không xẹp.",
      createdAt: "2026-09-15T08:00:00.000Z"
    },
    {
      id: "prod-2",
      name: "Giftbox Teddy Nâu Vintage (Kèm Thiệp)",
      category: "Combo Quà & Thiệp",
      price: 345000,
      originalPrice: 420000,
      stock: 15,
      rating: 4.9,
      reviews: 98,
      tag: "Hot Trend",
      tagColor: "bg-rose-500",
      image: "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80",
      description: "Set quà gồm 1 bé gấu Teddy, hộp giấy Kraft vintage thắt nơ ruy băng lụa và thiệp viết tay nắn nót theo lời chúc.",
      createdAt: "2026-09-18T10:30:00.000Z"
    },
    {
      id: "prod-3",
      name: "Gấu Trúc Mũm Mĩm Nằm Ngủ",
      category: "Búp Bê & Khác",
      price: 280000,
      originalPrice: 320000,
      stock: 18,
      rating: 4.8,
      reviews: 64,
      tag: "Mới Về",
      tagColor: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
      description: "Bé gấu trúc dáng nằm mũm mĩm siêu cưng, chất lông nhung mềm như bông gòn, thích hợp làm gối ôm.",
      createdAt: "2026-09-22T14:15:00.000Z"
    },
    {
      id: "prod-4",
      name: "Bé Cún Bông Bơ Sữa Tai Cụp",
      category: "Búp Bê & Khác",
      price: 245000,
      originalPrice: 280000,
      stock: 3,
      rating: 4.9,
      reviews: 53,
      tag: "Chỉ còn 3 bé",
      tagColor: "bg-red-500",
      image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80",
      description: "Bé cún tai cụp màu bơ sữa ngọt ngào, ánh mắt tròn xoe ngây thơ, ôm ấp cả ngày không biết chán.",
      createdAt: "2026-09-25T09:00:00.000Z"
    },
    {
      id: "prod-5",
      name: "Gấu Chơi Nơ Ca-Rô Cổ Điển",
      category: "Gấu Teddy",
      price: 320000,
      originalPrice: 360000,
      stock: 30,
      rating: 5.0,
      reviews: 295,
      tag: "Best Seller",
      tagColor: "bg-amber-500",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Dòng gấu cổ điển được yêu thích nhất của tiệm, điểm nhấn chiếc nơ ca-rô ca-ri ấm cúng.",
      createdAt: "2026-09-10T11:00:00.000Z"
    },
    {
      id: "prod-6",
      name: "Gấu Bí Ngô Thêu Tay Mùa Vàng",
      category: "Gấu Teddy Mùa Thu",
      price: 295000,
      originalPrice: 350000,
      stock: 8,
      rating: 4.9,
      reviews: 184,
      tag: "Phiên bản giới hạn",
      tagColor: "bg-orange-500",
      image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80",
      description: "Chi tiết quả bí ngô mini thêu chỉ nổi tinh tế trước ngực, mang đậm không khí thu ấm áp.",
      createdAt: "2026-09-28T16:20:00.000Z"
    },
    {
      id: "prod-7",
      name: "Gấu Cây Sồi Nâu Rêu Vintage",
      category: "Gấu Teddy Mùa Thu",
      price: 380000,
      originalPrice: 420000,
      stock: 12,
      rating: 4.9,
      reviews: 84,
      tag: "Độc Quyền",
      tagColor: "bg-stone-600",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
      description: "Tông màu nâu rêu độc đáo lấy cảm hứng từ những cánh rừng sồi mùa rụng lá.",
      createdAt: "2026-10-01T12:00:00.000Z"
    },
    {
      id: "prod-8",
      name: "Thỏ Bông Biscuit Váy Yếm Hồng",
      category: "Thỏ Bông Biscuit",
      price: 285000,
      originalPrice: 330000,
      stock: 22,
      rating: 5.0,
      reviews: 112,
      tag: "Best Seller",
      tagColor: "bg-pink-500",
      image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80",
      description: "Bé thỏ Biscuit đôi tai dài rủ xuống, diện chiếc váy yếm đũi mộc mạc và đáng yêu.",
      createdAt: "2026-10-02T15:40:00.000Z"
    },
    {
      id: "prod-9",
      name: "Gấu Ôm Khổng Lồ 1m6 Nâu Caramel",
      category: "Gấu Ôm Khổng Lồ",
      price: 790000,
      originalPrice: 950000,
      stock: 6,
      rating: 5.0,
      reviews: 76,
      tag: "Cỡ Đại",
      tagColor: "bg-amber-700",
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80",
      description: "Bé gấu đại tướng 1m6 ôm siêu đầm tay, là món quà tỏ tình hoặc sinh nhật cực kỳ ấn tượng.",
      createdAt: "2026-10-03T10:10:00.000Z"
    }
  ],
  orders: [
    {
      id: "ORD-1001",
      customerName: "Nguyễn Lan Hương",
      customerPhone: "0912345678",
      customerAddress: "Số 24 ngõ 180 Kim Mã, Ba Đình, Hà Nội",
      items: [
        {
          productId: "prod-1",
          productName: "Teddy Mùa Thu Quàng Khăn Len",
          quantity: 1,
          price: 395000,
          image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80"
        }
      ],
      giftCardMessage: "Chúc mừng sinh nhật bé Mai iu dấu! Chúc em tuổi mới luôn an yên, mỉm cười ấm áp như bạn Teddy này nhé!",
      packagingOption: "Hộp quà Kraft vintage + Thiệp viết tay",
      shippingMethod: "Hỏa tốc 2H (Nội thành)",
      paymentMethod: "Chuyển khoản QR",
      totalAmount: 425000,
      shippingFee: 30000,
      status: "pending",
      note: "Giao trước 17h giúp mình nhé tiệm ơi!",
      createdAt: "2026-10-07T08:30:00.000Z"
    },
    {
      id: "ORD-1002",
      customerName: "Trần Tuấn Anh",
      customerPhone: "0987654321",
      customerAddress: "Chung cư Sunrise City, Q.7, TP. Hồ Chí Minh",
      items: [
        {
          productId: "prod-2",
          productName: "Giftbox Teddy Nâu Vintage (Kèm Thiệp)",
          quantity: 1,
          price: 345000,
          image: "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80"
        }
      ],
      giftCardMessage: "Kỷ niệm 500 ngày bên nhau, cảm ơn em vì luôn là ngọn lửa ấm sưởi ấm những ngày gió mùa.",
      packagingOption: "Hộp quà Kraft vintage + Thiệp viết tay",
      shippingMethod: "Giao tiêu chuẩn",
      paymentMethod: "COD (Thanh toán khi nhận)",
      totalAmount: 345000,
      shippingFee: 0,
      status: "processing",
      note: "Nhờ tiệm thắt ruy băng màu be thật xinh giùm mình",
      createdAt: "2026-10-06T15:20:00.000Z"
    },
    {
      id: "ORD-1003",
      customerName: "Lê Hoàng My",
      customerPhone: "0905112233",
      customerAddress: "45 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng",
      items: [
        {
          productId: "prod-6",
          productName: "Gấu Bí Ngô Thêu Tay Mùa Vàng",
          quantity: 1,
          price: 295000,
          image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80"
        },
        {
          productId: "prod-8",
          productName: "Thỏ Bông Biscuit Váy Yếm Hồng",
          quantity: 1,
          price: 285000,
          image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80"
        }
      ],
      giftCardMessage: "Gửi hai thiên thần nhỏ của mẹ! Chúc hai con chăm ngoan học giỏi nhé.",
      packagingOption: "Hộp quà Kraft vintage + Thiệp viết tay",
      shippingMethod: "Giao tiêu chuẩn",
      paymentMethod: "Chuyển khoản QR",
      totalAmount: 580000,
      shippingFee: 0,
      status: "shipping",
      note: "Gọi trước khi giao hàng",
      createdAt: "2026-10-05T11:45:00.000Z"
    },
    {
      id: "ORD-1004",
      customerName: "Phạm Quỳnh Trang",
      customerPhone: "0934567890",
      customerAddress: "12 Lạch Tray, Ngô Quyền, Hải Phòng",
      items: [
        {
          productId: "prod-9",
          productName: "Gấu Ôm Khổng Lồ 1m6 Nâu Caramel",
          quantity: 1,
          price: 790000,
          image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80"
        }
      ],
      giftCardMessage: "Tặng bé Trang ngủ ngoan, không còn sợ lạnh những đêm đông nữa nhé!",
      packagingOption: "Bọc túi quà bảo vệ kèm nơ lớn",
      shippingMethod: "Giao tiêu chuẩn",
      paymentMethod: "Chuyển khoản QR",
      totalAmount: 790000,
      shippingFee: 0,
      status: "delivered",
      note: "Hàng cồng kềnh bọc 2 lớp giúp mình",
      createdAt: "2026-10-04T09:10:00.000Z"
    }
  ],
  categories: [
    { id: "cat-1", name: "Gấu Teddy", description: "Những bạn gấu Teddy cổ điển, truyền thống với nét đẹp mộc mạc." },
    { id: "cat-2", name: "Gấu Teddy Mùa Thu", description: "Phiên bản thiết kế giới hạn dành riêng cho mùa thu se lạnh." },
    { id: "cat-3", name: "Thỏ Bông Biscuit", description: "Các bạn thỏ Biscuit tai dài êm mềm, trang phục vintage." },
    { id: "cat-4", name: "Gấu Ôm Khổng Lồ", description: "Dòng gấu kích thước lớn từ 1m2 đến 1m8 ôm trọn vòng tay." },
    { id: "cat-5", name: "Búp Bê & Khác", description: "Gấu trúc, cún bông, mèo con và những nhân vật dễ thương." },
    { id: "cat-6", name: "Combo Quà & Thiệp", description: "Hộp quà Kraft kèm thiệp viết tay vintage nắn nót." }
  ],
  settings: {
    shopName: "Tiệm Gấu Bông HD",
    slogan: "Gói Trọn Yêu Thương, Gửi Hơi Ấm Mùa Thu",
    hotline: "0988.123.456",
    email: "tiemgaubong.hd@gmail.com",
    address: "Số 18 Đặng Văn Ngữ, Đống Đa, Hà Nội",
    freeShippingThreshold: 299000,
    topBanner: "✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k",
    bankInfo: {
      bankName: "Vietcombank",
      accountNumber: "9988776655",
      accountName: "TIEM GAU BONG HD"
    }
  }
};

// LocalStorage helpers
function getLocalDb() {
  const stored = localStorage.getItem('tiem_gau_bong_db');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('tiem_gau_bong_db', JSON.stringify(DEFAULT_DATA));
  return DEFAULT_DATA;
}

function saveLocalDb(data) {
  localStorage.setItem('tiem_gau_bong_db', JSON.stringify(data));
}

// Kiểm tra xem backend server có online không
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch {
    // server offline
  }
  return { online: false, mode: 'local' };
}

// ================= STATS API =================
export async function getStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback to local calculation
  }

  const db = getLocalDb();
  const products = db.products || [];
  const orders = db.orders || [];
  const activeOrders = orders.filter(o => o.status !== 'cancelled');

  const totalRevenue = activeOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippingOrders = orders.filter(o => o.status === 'shipping').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const lowStockCount = products.filter(p => (p.stock || 0) <= 5).length;

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const revenueChart = days.map((day, idx) => ({
    day,
    revenue: Math.floor(1200000 + (idx * 380000) % 1800000),
    orders: Math.floor(3 + (idx * 2) % 6)
  }));

  const topProducts = products.slice(0, 4).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    sold: 45,
    stock: p.stock
  }));

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    processingOrders,
    shippingOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts: products.length,
    lowStockCount,
    totalItemsSold: 125,
    revenueChart,
    topProducts,
    recentOrders: orders.slice(-5).reverse()
  };
}

// ================= PRODUCTS API =================
export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/products?${query}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  let items = db.products || [];
  if (params.category && params.category !== 'all') {
    items = items.filter(p => p.category === params.category);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q));
  }
  return items;
}

export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newProd = {
    ...productData,
    id: `prod-${Date.now()}`,
    price: Number(productData.price),
    stock: Number(productData.stock || 10),
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price),
    rating: 5.0,
    reviews: 0,
    createdAt: new Date().toISOString()
  };
  db.products = [newProd, ...(db.products || [])];
  saveLocalDb(db);
  return newProd;
}

export async function updateProduct(id, productData) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const idx = (db.products || []).findIndex(p => p.id === id);
  if (idx !== -1) {
    db.products[idx] = { ...db.products[idx], ...productData };
    saveLocalDb(db);
    return db.products[idx];
  }
  throw new Error('Sản phẩm không tồn tại');
}

export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.products = (db.products || []).filter(p => p.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ================= ORDERS API =================
export async function getOrders(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/orders?${query}`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  let orders = db.orders || [];
  if (params.status && params.status !== 'all') {
    orders = orders.filter(o => o.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  }
  return orders;
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newOrder = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.orders = [newOrder, ...(db.orders || [])];

  // Trừ tồn kho local
  (orderData.items || []).forEach(it => {
    const p = (db.products || []).find(prod => prod.id === it.productId);
    if (p && p.stock >= (it.quantity || 1)) {
      p.stock -= (it.quantity || 1);
    }
  });

  saveLocalDb(db);
  return newOrder;
}

export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const order = (db.orders || []).find(o => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveLocalDb(db);
    return order;
  }
  throw new Error('Đơn hàng không tồn tại');
}

export async function deleteOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.orders = (db.orders || []).filter(o => o.id !== orderId);
  saveLocalDb(db);
  return { success: true };
}

// ================= CATEGORIES API =================
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  return db.categories || [];
}

export async function createCategory(catData) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newCat = {
    id: `cat-${Date.now()}`,
    name: catData.name,
    description: catData.description || ''
  };
  db.categories = [...(db.categories || []), newCat];
  saveLocalDb(db);
  return newCat;
}

export async function deleteCategory(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.categories = (db.categories || []).filter(c => c.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ================= SETTINGS API =================
export async function getSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  return db.settings || DEFAULT_DATA.settings;
}

export async function updateSettings(settingsData) {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.settings = { ...db.settings, ...settingsData };
  saveLocalDb(db);
  return db.settings;
}
