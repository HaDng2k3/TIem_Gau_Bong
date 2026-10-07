import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to read DB
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { products: [], orders: [], categories: [], settings: {} };
  }
}

// Helper to write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// ======================== API HEALTH ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend Tiệm Gấu Bông HD is running smoothly 🧸',
    timestamp: new Date().toISOString()
  });
});

// ======================== STATS & OVERVIEW ========================
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const products = db.products || [];
  const orders = db.orders || [];

  const completedOrActiveOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = completedOrActiveOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippingOrders = orders.filter(o => o.status === 'shipping').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const lowStockProducts = products.filter(p => (p.stock || 0) <= 5);
  const totalItemsSold = completedOrActiveOrders.reduce((total, order) => {
    return total + (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
  }, 0);

  // Revenue chart by last 7 days mock or calculated
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const revenueChart = days.map((day, idx) => ({
    day,
    revenue: Math.floor(1200000 + (idx * 380000) % 1800000),
    orders: Math.floor(3 + (idx * 2) % 6)
  }));

  // Top selling products
  const topProducts = products.slice(0, 4).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    sold: Math.floor(30 + Math.random() * 50),
    stock: p.stock
  }));

  res.json({
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    processingOrders,
    shippingOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts: products.length,
    lowStockCount: lowStockProducts.length,
    totalItemsSold: 120 + totalItemsSold,
    revenueChart,
    topProducts,
    recentOrders: orders.slice(-5).reverse()
  });
});

// ======================== PRODUCTS CRUD ========================
// List products
app.get('/api/products', (req, res) => {
  const db = readDb();
  let items = db.products || [];
  const { category, search, stockStatus } = req.query;

  if (category && category !== 'all') {
    items = items.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    items = items.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }

  if (stockStatus) {
    if (stockStatus === 'in_stock') items = items.filter(p => p.stock > 5);
    else if (stockStatus === 'low_stock') items = items.filter(p => p.stock > 0 && p.stock <= 5);
    else if (stockStatus === 'out_of_stock') items = items.filter(p => p.stock === 0);
  }

  res.json(items);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const db = readDb();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
  res.json(product);
});

// Create product
app.post('/api/products', (req, res) => {
  const db = readDb();
  const { name, category, price, originalPrice, stock, tag, tagColor, image, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Tên sản phẩm và Giá bán là bắt buộc' });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    category: category || 'Gấu Teddy',
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    stock: stock !== undefined ? Number(stock) : 10,
    rating: 5.0,
    reviews: 0,
    tag: tag || 'Mới Về',
    tagColor: tagColor || 'bg-amber-500',
    image: image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    description: description || 'Bé gấu xinh xắn, đường may thủ công tỉ mỉ, bông mềm mại.',
    createdAt: new Date().toISOString()
  };

  db.products = [newProduct, ...(db.products || [])];
  writeDb(db);
  res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const db = readDb();
  const index = (db.products || []).findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

  const existing = db.products[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existing.originalPrice,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
    updatedAt: new Date().toISOString()
  };

  db.products[index] = updated;
  writeDb(db);
  res.json(updated);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = (db.products || []).filter(p => p.id !== req.params.id);

  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm cần xóa' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
});

// ======================== ORDERS CRUD ========================
// List orders
app.get('/api/orders', (req, res) => {
  const db = readDb();
  let orders = db.orders || [];
  const { status, search } = req.query;

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status === status);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  }

  res.json(orders);
});

// Create order (from storefront or admin)
app.post('/api/orders', (req, res) => {
  const db = readDb();
  const {
    customerName,
    customerPhone,
    customerAddress,
    items = [],
    giftCardMessage = '',
    packagingOption = 'Hộp quà Kraft vintage + Thiệp viết tay',
    shippingMethod = 'Giao tiêu chuẩn',
    paymentMethod = 'COD (Thanh toán khi nhận)',
    note = '',
    shippingFee = 0
  } = req.body;

  if (!customerName || !customerPhone || !customerAddress) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ tên, số điện thoại và địa chỉ' });
  }

  if (items.length === 0) {
    return res.status(400).json({ error: 'Đơn hàng cần có ít nhất 1 sản phẩm' });
  }

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const totalAmount = itemsTotal + Number(shippingFee);

  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: orderId,
    customerName: customerName.trim(),
    customerPhone: customerPhone.trim(),
    customerAddress: customerAddress.trim(),
    items,
    giftCardMessage: giftCardMessage.trim(),
    packagingOption,
    shippingMethod,
    paymentMethod,
    totalAmount,
    shippingFee: Number(shippingFee),
    status: 'pending',
    note: note.trim(),
    createdAt: new Date().toISOString()
  };

  // Auto reduce stock
  items.forEach(it => {
    const prod = (db.products || []).find(p => p.id === it.productId);
    if (prod && prod.stock >= (it.quantity || 1)) {
      prod.stock -= (it.quantity || 1);
    }
  });

  db.orders = [newOrder, ...(db.orders || [])];
  writeDb(db);
  res.status(201).json(newOrder);
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const db = readDb();
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái đơn hàng không hợp lệ' });
  }

  const order = (db.orders || []).find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Đơn hàng không tồn tại' });

  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeDb(db);
  res.json(order);
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  const db = readDb();
  const initialLength = db.orders.length;
  db.orders = (db.orders || []).filter(o => o.id !== req.params.id);

  if (db.orders.length === initialLength) {
    return res.status(404).json({ error: 'Không tìm thấy đơn hàng cần xóa' });
  }

  writeDb(db);
  res.json({ success: true, message: 'Đã xóa đơn hàng' });
});

// ======================== CATEGORIES CRUD ========================
app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories || []);
});

app.post('/api/categories', (req, res) => {
  const db = readDb();
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });

  const newCat = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    description: description || ''
  };
  db.categories = [...(db.categories || []), newCat];
  writeDb(db);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = readDb();
  db.categories = (db.categories || []).filter(c => c.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

// ======================== SETTINGS ========================
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings || {});
});

app.put('/api/settings', (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json(db.settings);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend Server Tiệm Gấu Bông HD đang chạy tại http://localhost:${PORT}`);
  console.log(`✨ API Docs & Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/stats`);
  console.log(`   - GET  /api/products`);
  console.log(`   - POST /api/products`);
  console.log(`   - GET  /api/orders`);
  console.log(`   - POST /api/orders`);
  console.log(`   - PUT  /api/orders/:id/status`);
});
