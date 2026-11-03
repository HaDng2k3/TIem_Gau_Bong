import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const SQLITE_FILE = path.join(DATA_DIR, 'tiem_gau_bong.sqlite');
const DB_JSON_FILE = path.join(DATA_DIR, 'db.json');

// Mở kết nối SQLite
export const db = new sqlite3.Database(SQLITE_FILE);

// Helpers dùng Promise để code async/await sạch đẹp
export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

export function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// 1. Tạo bảng cơ sở dữ liệu quan hệ (Relational Schema)
export async function initSchema() {
  await exec(`
    PRAGMA foreign_keys = ON;

    -- Bảng Tài Khoản Người Dùng (Admin & Khách Hàng)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      account TEXT UNIQUE NOT NULL,
      email TEXT,
      phone TEXT,
      password TEXT DEFAULT '123456',
      role TEXT DEFAULT 'customer',
      avatar TEXT,
      memberTier TEXT DEFAULT 'Thành viên Mùa Thu 🍂',
      loyaltyCoins INTEGER DEFAULT 0,
      totalSpent REAL DEFAULT 0,
      ordersCount INTEGER DEFAULT 0,
      clawGameTurns INTEGER DEFAULT 3,
      vouchers TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL
    );

    -- Bảng Danh Mục Sản Phẩm
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT,
      icon TEXT,
      count INTEGER DEFAULT 0
    );

    -- Bảng Sản Phẩm Gấu Bông & Quà Tặng
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      price REAL NOT NULL,
      originalPrice REAL,
      stock INTEGER DEFAULT 0,
      rating REAL DEFAULT 5,
      reviews INTEGER DEFAULT 0,
      tag TEXT,
      tagColor TEXT,
      image TEXT,
      description TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );

    -- Bảng Đơn Hàng
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      orderCode TEXT UNIQUE,
      userId TEXT,
      customerName TEXT NOT NULL,
      customerPhone TEXT NOT NULL,
      shippingAddress TEXT,
      items TEXT NOT NULL,
      subtotal REAL DEFAULT 0,
      shippingFee REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      paymentMethod TEXT DEFAULT 'cod',
      notes TEXT,
      handwrittenCard TEXT,
      packagingOption TEXT,
      shippingMethod TEXT,
      voucherCode TEXT,
      comboDiscount REAL DEFAULT 0,
      voucherDiscount REAL DEFAULT 0,
      appliedCoins REAL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );

    -- Bảng Mã Giảm Giá (Vouchers)
    CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount REAL NOT NULL,
      description TEXT,
      minOrder REAL DEFAULT 0,
      expiryDate TEXT,
      status TEXT DEFAULT 'active'
    );

    -- Bảng Đánh Giá & Nhận Xét
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      productId TEXT,
      userName TEXT NOT NULL,
      userAvatar TEXT,
      rating INTEGER DEFAULT 5,
      content TEXT NOT NULL,
      status TEXT DEFAULT 'approved',
      createdAt TEXT NOT NULL
    );

    -- Bảng Tin Tức & Blog
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      author TEXT,
      category TEXT,
      image TEXT,
      date TEXT,
      likes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      readTime TEXT,
      createdAt TEXT NOT NULL
    );

    -- Bảng Cấu Hình Tiệm (Settings)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Tự động nâng cấp các cột bảng orders nếu đã tồn tại từ trước
  try {
    const orderCols = await all(`PRAGMA table_info(orders)`);
    const existing = new Set(orderCols.map(c => c.name));
    const extraCols = [
      { name: 'packagingOption', type: 'TEXT' },
      { name: 'shippingMethod', type: 'TEXT' },
      { name: 'voucherCode', type: 'TEXT' },
      { name: 'comboDiscount', type: 'REAL DEFAULT 0' },
      { name: 'voucherDiscount', type: 'REAL DEFAULT 0' },
      { name: 'appliedCoins', type: 'REAL DEFAULT 0' },
      { name: 'updatedAt', type: 'TEXT' }
    ];
    for (const col of extraCols) {
      if (!existing.has(col.name)) {
        try {
          await exec(`ALTER TABLE orders ADD COLUMN ${col.name} ${col.type}`);
        } catch {
          // Bỏ qua nếu cột đã tồn tại
        }
      }
    }
  } catch (err) {
    console.error('Lỗi khi nâng cấp schema bảng orders:', err);
  }
}

// 2. Tự động nạp dữ liệu ban đầu từ db.json vào SQLite
export async function seedFromDbJson() {
  try {
    const userRow = await get('SELECT COUNT(*) as count FROM users');
    const prodRow = await get('SELECT COUNT(*) as count FROM products');

    if (userRow && userRow.count > 0 && prodRow && prodRow.count > 0) {
      return; // Đã có dữ liệu
    }

    if (!fs.existsSync(DB_JSON_FILE)) {
      return;
    }

    const raw = fs.readFileSync(DB_JSON_FILE, 'utf-8');
    const data = JSON.parse(raw);

    // Chèn users
    if (Array.isArray(data.users)) {
      for (const u of data.users) {
        await run(`
          INSERT OR REPLACE INTO users (id, name, account, email, phone, password, role, avatar, memberTier, loyaltyCoins, totalSpent, ordersCount, clawGameTurns, vouchers, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          u.id || `user-${Date.now()}`,
          u.name || 'Người dùng',
          (u.account || u.email || u.phone || '').toLowerCase(),
          u.email || '',
          u.phone || '',
          u.password || '123456',
          u.role || 'customer',
          u.avatar || '',
          u.memberTier || 'Thành viên Mùa Thu 🍂',
          u.loyaltyCoins || 0,
          u.totalSpent || 0,
          u.ordersCount || 0,
          u.clawGameTurns || 3,
          typeof u.vouchers === 'object' ? JSON.stringify(u.vouchers) : (u.vouchers || '[]'),
          u.createdAt || new Date().toISOString()
        ]);
      }
    }

    // Đảm bảo có tài khoản Admin
    const admin = await get("SELECT id FROM users WHERE role = 'admin' OR account = 'admin'");
    if (!admin) {
      await run(`
        INSERT OR REPLACE INTO users (id, name, account, email, phone, password, role, avatar, memberTier, loyaltyCoins, totalSpent, ordersCount, clawGameTurns, vouchers, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'user-admin',
        'Quản Trị Viên (Admin)',
        'admin',
        'admin@tiembong.vn',
        '0900000000',
        'admin123',
        'admin',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'Quản Trị Viên Hệ Thống 🛡️',
        99999,
        5000000,
        10,
        99,
        '[]',
        new Date().toISOString()
      ]);
    }

    // Chèn categories
    if (Array.isArray(data.categories)) {
      for (const c of data.categories) {
        await run(`INSERT OR REPLACE INTO categories (id, name, slug, icon, count) VALUES (?, ?, ?, ?, ?)`,
          [c.id, c.name, c.slug || '', c.icon || '', c.count || 0]
        );
      }
    }

    // Chèn products
    if (Array.isArray(data.products)) {
      for (const p of data.products) {
        await run(`
          INSERT OR REPLACE INTO products (id, name, category, price, originalPrice, stock, rating, reviews, tag, tagColor, image, description, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.id,
          p.name,
          p.category || 'Gấu Teddy',
          p.price || 0,
          p.originalPrice || 0,
          p.stock ?? 10,
          p.rating || 5,
          p.reviews || 0,
          p.tag || '',
          p.tagColor || '',
          p.image || '',
          p.description || '',
          p.createdAt || new Date().toISOString(),
          p.updatedAt || ''
        ]);
      }
    }

    // Chèn orders
    if (Array.isArray(data.orders)) {
      for (const o of data.orders) {
        await run(`
          INSERT OR REPLACE INTO orders (id, orderCode, userId, customerName, customerPhone, shippingAddress, items, subtotal, shippingFee, discount, totalAmount, status, paymentMethod, notes, handwrittenCard, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          o.id,
          o.orderCode || o.id,
          o.userId || '',
          o.customerName || '',
          o.customerPhone || '',
          o.shippingAddress || '',
          typeof o.items === 'object' ? JSON.stringify(o.items) : (o.items || '[]'),
          o.subtotal || 0,
          o.shippingFee || 0,
          o.discount || 0,
          o.totalAmount || 0,
          o.status || 'pending',
          o.paymentMethod || 'cod',
          o.notes || '',
          typeof o.handwrittenCard === 'object' ? JSON.stringify(o.handwrittenCard) : (o.handwrittenCard || ''),
          o.createdAt || new Date().toISOString()
        ]);
      }
    }

    // Chèn vouchers
    if (Array.isArray(data.vouchers)) {
      for (const v of data.vouchers) {
        await run(`INSERT OR REPLACE INTO vouchers (id, code, discount, description, minOrder, expiryDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [v.id, v.code, v.discount || 0, v.description || '', v.minOrder || 0, v.expiryDate || '', v.status || 'active']
        );
      }
    }

    // Chèn reviews
    if (Array.isArray(data.reviews)) {
      for (const r of data.reviews) {
        await run(`INSERT OR REPLACE INTO reviews (id, productId, userName, userAvatar, rating, content, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [r.id, r.productId || '', r.userName || '', r.userAvatar || '', r.rating || 5, r.content || '', r.status || 'approved', r.createdAt || new Date().toISOString()]
        );
      }
    }

    // Chèn articles
    if (Array.isArray(data.articles)) {
      for (const a of data.articles) {
        await run(`INSERT OR REPLACE INTO articles (id, title, excerpt, content, author, category, image, date, likes, views, readTime, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [a.id, a.title || '', a.excerpt || '', a.content || '', a.author || '', a.category || '', a.image || '', a.date || '', a.likes || 0, a.views || 0, a.readTime || '', a.createdAt || new Date().toISOString()]
        );
      }
    }

    // Chèn settings
    if (data.settings && typeof data.settings === 'object') {
      for (const [key, val] of Object.entries(data.settings)) {
        await run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
          [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
        );
      }
    }

    console.log('🧸 [SQLite] Đã nạp thành công dữ liệu khởi tạo vào cơ sở dữ liệu SQLite: tiem_gau_bong.sqlite');
  } catch (err) {
    console.error('Lỗi khi seed dữ liệu vào SQLite:', err);
  }
}

// Helper định dạng dữ liệu đơn hàng từ SQLite ra đối tượng đầy đủ
export function formatOrderFromRow(o) {
  if (!o) return null;
  const items = parseJsonSafe(o.items, []);
  return {
    ...o,
    id: o.id,
    orderCode: o.orderCode || o.id,
    customerName: o.customerName || '',
    customerPhone: o.customerPhone || '',
    customerAddress: o.shippingAddress || o.customerAddress || '',
    shippingAddress: o.shippingAddress || o.customerAddress || '',
    items,
    itemsTotal: o.subtotal ?? 0,
    subtotal: o.subtotal ?? 0,
    note: o.notes || '',
    notes: o.notes || '',
    giftCardMessage: o.handwrittenCard || '',
    handwrittenCard: o.handwrittenCard || '',
    packagingOption: o.packagingOption || 'Hộp quà Kraft vintage + Thiệp viết tay',
    shippingMethod: o.shippingMethod || 'Giao tiêu chuẩn',
    paymentMethod: o.paymentMethod || 'COD (Thanh toán khi nhận)',
    totalAmount: o.totalAmount || 0,
    shippingFee: o.shippingFee || 0,
    discount: o.discount || 0,
    comboDiscount: o.comboDiscount || 0,
    voucherDiscount: o.voucherDiscount || 0,
    voucherCode: o.voucherCode || '',
    appliedCoins: o.appliedCoins || 0,
    status: o.status || 'pending',
    createdAt: o.createdAt || new Date().toISOString(),
    updatedAt: o.updatedAt || ''
  };
}

// 3. Đọc toàn bộ CSDL từ SQLite theo cấu trúc tương thích
export async function readAllFromSqlite() {
  const usersRows = await all('SELECT * FROM users ORDER BY createdAt DESC');
  const users = usersRows.map(u => ({
    ...u,
    vouchers: parseJsonSafe(u.vouchers, [])
  }));

  const products = await all('SELECT * FROM products ORDER BY createdAt DESC');
  
  const ordersRows = await all('SELECT * FROM orders ORDER BY createdAt DESC');
  const orders = ordersRows.map(formatOrderFromRow);

  const categories = await all('SELECT * FROM categories');
  const vouchers = await all('SELECT * FROM vouchers');
  const reviews = await all('SELECT * FROM reviews ORDER BY createdAt DESC');
  const articles = await all('SELECT * FROM articles ORDER BY createdAt DESC');

  const settingsRows = await all('SELECT * FROM settings');
  const settings = {};
  for (const s of settingsRows) {
    settings[s.key] = parseJsonSafe(s.value, s.value);
  }

  return {
    products,
    orders,
    categories,
    settings,
    users,
    vouchers,
    reviews,
    articles
  };
}

// 4. Các phương thức thao tác Người Dùng (Users)
export const userModel = {
  async findByAccount(account) {
    const acc = (account || '').trim().toLowerCase();
    const row = await get(`
      SELECT * FROM users 
      WHERE LOWER(account) = ? OR LOWER(email) = ? OR phone = ?
    `, [acc, acc, acc]);
    if (!row) return null;
    return {
      ...row,
      vouchers: parseJsonSafe(row.vouchers, [])
    };
  },

  async findById(id) {
    const row = await get('SELECT * FROM users WHERE id = ?', [id]);
    if (!row) return null;
    return {
      ...row,
      vouchers: parseJsonSafe(row.vouchers, [])
    };
  },

  async create(userData) {
    const id = userData.id || `user-${Date.now()}`;
    const account = (userData.account || userData.email || userData.phone || '').trim().toLowerCase();
    const now = userData.createdAt || new Date().toISOString();

    await run(`
      INSERT INTO users (id, name, account, email, phone, password, role, avatar, memberTier, loyaltyCoins, totalSpent, ordersCount, clawGameTurns, vouchers, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      userData.name || 'Bạn Gấu Nhỏ',
      account,
      userData.email || '',
      userData.phone || '',
      userData.password || '123456',
      userData.role || 'customer',
      userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      userData.memberTier || 'Thành viên Mùa Thu 🍂',
      userData.loyaltyCoins || 0,
      userData.totalSpent || 0,
      userData.ordersCount || 0,
      userData.clawGameTurns ?? 3,
      typeof userData.vouchers === 'object' ? JSON.stringify(userData.vouchers) : (userData.vouchers || '[]'),
      now
    ]);

    return await this.findById(id);
  },

  async update(id, updates) {
    const current = await this.findById(id);
    if (!current) return null;

    const merged = { ...current, ...updates };
    const safePassword = merged.password || current.password || '123456';
    await run(`
      UPDATE users SET
        name = ?,
        email = ?,
        phone = ?,
        password = ?,
        role = ?,
        avatar = ?,
        memberTier = ?,
        loyaltyCoins = ?,
        totalSpent = ?,
        ordersCount = ?,
        clawGameTurns = ?,
        vouchers = ?
      WHERE id = ?
    `, [
      merged.name,
      merged.email || '',
      merged.phone || '',
      safePassword,
      merged.role || 'customer',
      merged.avatar || '',
      merged.memberTier || '',
      merged.loyaltyCoins || 0,
      merged.totalSpent || 0,
      merged.ordersCount || 0,
      merged.clawGameTurns || 0,
      typeof merged.vouchers === 'object' ? JSON.stringify(merged.vouchers) : String(merged.vouchers || '[]'),
      id
    ]);

    return await this.findById(id);
  },

  async delete(id) {
    const res = await run('DELETE FROM users WHERE id = ?', [id]);
    return res.changes > 0;
  }
};

// 5. Các phương thức thao tác Đơn Hàng (Orders) trong SQLite
export const orderModel = {
  async getAll(params = {}) {
    let sql = 'SELECT * FROM orders ORDER BY createdAt DESC';
    const rows = await all(sql);
    let orders = rows.map(formatOrderFromRow);
    if (params.status && params.status !== 'all') {
      orders = orders.filter(o => o.status === params.status);
    }
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      orders = orders.filter(o =>
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.includes(q))
      );
    }
    return orders;
  },

  async findById(id) {
    const row = await get('SELECT * FROM orders WHERE id = ? OR orderCode = ?', [id, id]);
    if (!row) return null;
    return formatOrderFromRow(row);
  },

  async create(o) {
    const address = o.customerAddress || o.shippingAddress || '';
    const note = o.note || o.notes || '';
    const card = typeof o.giftCardMessage === 'string' ? o.giftCardMessage : (typeof o.handwrittenCard === 'string' ? o.handwrittenCard : '');
    const itemsJson = typeof o.items === 'object' ? JSON.stringify(o.items) : (o.items || '[]');
    const itemsTotal = o.itemsTotal ?? o.subtotal ?? 0;
    const discount = o.discount ?? ((o.comboDiscount || 0) + (o.voucherDiscount || 0) + (o.appliedCoins || 0));

    await run(`
      INSERT OR REPLACE INTO orders (
        id, orderCode, userId, customerName, customerPhone, shippingAddress,
        items, subtotal, shippingFee, discount, totalAmount, status,
        paymentMethod, notes, handwrittenCard, packagingOption, shippingMethod,
        voucherCode, comboDiscount, voucherDiscount, appliedCoins, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      o.id,
      o.orderCode || o.id,
      o.userId || '',
      o.customerName || '',
      o.customerPhone || '',
      address,
      itemsJson,
      itemsTotal,
      o.shippingFee || 0,
      discount,
      o.totalAmount || 0,
      o.status || 'pending',
      o.paymentMethod || 'COD (Thanh toán khi nhận)',
      note,
      card,
      o.packagingOption || 'Hộp quà Kraft vintage + Thiệp viết tay',
      o.shippingMethod || 'Giao tiêu chuẩn',
      o.voucherCode || '',
      o.comboDiscount || 0,
      o.voucherDiscount || 0,
      o.appliedCoins || 0,
      o.createdAt || new Date().toISOString(),
      o.updatedAt || ''
    ]);

    return await this.findById(o.id);
  },

  async updateStatus(id, status) {
    const now = new Date().toISOString();
    await run('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ? OR orderCode = ?', [status, now, id, id]);
    return await this.findById(id);
  },

  async delete(id) {
    const res = await run('DELETE FROM orders WHERE id = ? OR orderCode = ?', [id, id]);
    return res.changes > 0;
  }
};

// 6. Đồng bộ an toàn từ Object vào SQLite và giữ file backup db.json
export async function syncEntireDbToSqlite(data) {
  if (!data) return;

  // Sync Users
  if (Array.isArray(data.users)) {
    try {
      for (const u of data.users) {
        await run(`
          INSERT OR REPLACE INTO users (id, name, account, email, phone, password, role, avatar, memberTier, loyaltyCoins, totalSpent, ordersCount, clawGameTurns, vouchers, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          u.id,
          u.name || 'Người dùng',
          (u.account || u.email || u.phone || `user_${Date.now()}`).toLowerCase(),
          u.email || '',
          u.phone || '',
          u.password || 'social_auth_user',
          u.role || 'customer',
          u.avatar || '',
          u.memberTier || '',
          u.loyaltyCoins || 0,
          u.totalSpent || 0,
          u.ordersCount || 0,
          u.clawGameTurns || 0,
          typeof u.vouchers === 'object' ? JSON.stringify(u.vouchers) : (u.vouchers || '[]'),
          u.createdAt || new Date().toISOString()
        ]);
      }
    } catch (err) {
      console.error('Lỗi khi đồng bộ users vào SQLite:', err);
    }
  }

  // Sync Products
  if (Array.isArray(data.products)) {
    try {
      for (const p of data.products) {
        await run(`
          INSERT OR REPLACE INTO products (id, name, category, price, originalPrice, stock, rating, reviews, tag, tagColor, image, description, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          p.id,
          p.name,
          p.category || '',
          p.price || 0,
          p.originalPrice || 0,
          p.stock ?? 0,
          p.rating || 5,
          p.reviews || 0,
          p.tag || '',
          p.tagColor || '',
          p.image || '',
          p.description || '',
          p.createdAt || new Date().toISOString(),
          p.updatedAt || ''
        ]);
      }
    } catch (err) {
      console.error('Lỗi khi đồng bộ products vào SQLite:', err);
    }
  }

  // Sync Orders
  if (Array.isArray(data.orders)) {
    try {
      for (const o of data.orders) {
        await orderModel.create(o);
      }
    } catch (err) {
      console.error('Lỗi khi đồng bộ orders vào SQLite:', err);
    }
  }

  // Cập nhật file db.json làm bản backup tự động
  try {
    fs.writeFileSync(DB_JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // ignore backup error
  }
}

function parseJsonSafe(val, fallback) {
  if (typeof val !== 'string') return val ?? fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// Tự động khởi tạo schema và seed dữ liệu khi tải module
(async () => {
  try {
    await initSchema();
    await seedFromDbJson();
  } catch (err) {
    console.error('Lỗi khởi tạo database SQLite:', err);
  }
})();
