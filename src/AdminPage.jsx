import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  ShoppingBag,
  FolderTree,
  HeartHandshake,
  Settings,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  DollarSign,
  TrendingUp,
  Box,
  Users,
  Sparkles,
  Save,
  X,
  Ticket,
  Star,
  Award,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  LogIn,
  LogOut,
  KeyRound,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import * as api from './services/api';
import { useAuth } from './context/AuthContext';

export default function AdminPage({ onBackToStore, onNavigateToAuth }) {
  const { user, login, logout, isAuthenticated, updateUser: updateAuthUser } = useAuth();

  // Kiểm tra tài khoản Quản Trị Viên
  const isUserAdmin = Boolean(
    isAuthenticated && 
    user && 
    (user.role === 'admin' || user.account === 'admin' || user.email === 'admin@tiembong.vn')
  );

  // States cho form đăng nhập Admin trực tiếp nếu chưa phải admin
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  const handleAdminDirectLogin = async (e) => {
    if (e) e.preventDefault();
    setAdminAuthError('');
    setAdminAuthLoading(true);
    try {
      const res = await login(adminUsername.trim(), adminPassword);
      if (!res.user || (res.user.role !== 'admin' && res.user.account !== 'admin' && res.user.email !== 'admin@tiembong.vn')) {
        setAdminAuthError('Tài khoản này không có quyền Quản trị viên (Admin). Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      setAdminAuthError(err.message || 'Đăng nhập Quản trị viên thất bại.');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'orders' | 'categories' | 'giftcards' | 'settings'
  const [serverOnline, setServerOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');
  const [usersList, setUsersList] = useState([]);
  const [vouchersList, setVouchersList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [voucherSearch, setVoucherSearch] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Mẹo Chăm Sóc',
    author: 'Tiệm Trưởng HD',
    readTime: '4 phút đọc',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    summary: '',
    content: '',
    tags: 'Chăm sóc gấu, Tiệm Gấu Bông',
    featured: false
  });
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Gấu Teddy',
    price: '',
    originalPrice: '',
    stock: 15,
    tag: 'Best Seller',
    tagColor: 'bg-amber-500',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    description: ''
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Voucher Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount: '',
    minOrder: '',
    description: '',
    maxUsage: 50,
    expiresAt: '2026-12-31'
  });

  // User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    memberTier: 'Thành viên Mùa Thu 🍂',
    loyaltyCoins: 10000,
    avatar: ''
  });

  // Modal đổi ảnh đại diện cá nhân tài khoản đang đăng nhập
  const [isMyAvatarModalOpen, setIsMyAvatarModalOpen] = useState(false);
  const [myAvatarUrl, setMyAvatarUrl] = useState('');

  // Sample image presets for plushies
  const plushiePresets = [
    { label: 'Teddy Mùa Thu', url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80' },
    { label: 'Hộp Quà Kraft', url: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Gấu Trúc Đáng Yêu', url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cún Bông Bơ Sữa', url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80' },
    { label: 'Bí Ngô Len Vàng', url: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80' },
    { label: 'Thỏ Bông Biscuit', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80' }
  ];

  // Load all data
  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const health = await api.checkServerHealth();
        setServerOnline(health.online);

        const [statsData, prodsData, ordersData, catsData, settingsData, usersData, vouchersData, reviewsData, articlesData] = await Promise.all([
          api.getStats(),
          api.getProducts(),
          api.getOrders(),
          api.getCategories(),
          api.getSettings(),
          api.getUsers(),
          api.getVouchers(),
          api.getReviews(),
          api.getArticles()
        ]);

        setStats(statsData);
        setProducts(prodsData);
        setOrders(ordersData);
        setCategories(catsData);
        setSettings(settingsData);
        setUsersList(usersData || []);
        setVouchersList(vouchersData || []);
        setReviewsList(reviewsData || []);
        setArticlesList(articlesData || []);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang quản trị:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Currency Formatter
  const formatMoney = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // Status mapping
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ xác nhận</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Đang chuẩn bị & viết thiệp</span>;
      case 'shipping':
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Truck className="w-3 h-3" /> Đang giao hỏa tốc</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Đã giao thành công</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Đã hủy</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      handleRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch {
      alert('Không thể cập nhật trạng thái đơn hàng');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng ${orderId} này?`)) {
      try {
        await api.deleteOrder(orderId);
        handleRefresh();
        setIsOrderModalOpen(false);
      } catch {
        alert('Lỗi khi xóa đơn hàng');
      }
    }
  };

  // Open Product Modal
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Gấu Teddy',
      price: '',
      originalPrice: '',
      stock: 15,
      tag: 'Best Seller',
      tagColor: 'bg-amber-500',
      image: plushiePresets[0].url,
      description: 'Bé gấu xinh xắn lông mềm mại, đường may tỉ mỉ, ruột bông gòn tinh khiết 100%.'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock,
      tag: prod.tag || '',
      tagColor: prod.tagColor || 'bg-amber-500',
      image: prod.image,
      description: prod.description || ''
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create / Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('Vui lòng nhập tên và giá bán của bé gấu');
      return;
    }

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
      } else {
        await api.createProduct(productForm);
      }
      setIsProductModalOpen(false);
      handleRefresh();
    } catch {
      alert('Lỗi khi lưu sản phẩm');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`Bạn có chắc muốn xóa bé gấu "${prodName}" khỏi danh sách?`)) {
      try {
        await api.deleteProduct(prodId);
        handleRefresh();
      } catch {
        alert('Không thể xóa sản phẩm');
      }
    }
  };

  // Create Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({ name: newCatName.trim(), description: newCatDesc.trim() });
      setNewCatName('');
      setNewCatDesc('');
      handleRefresh();
    } catch {
      alert('Lỗi khi thêm danh mục');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await api.deleteCategory(catId);
        handleRefresh();
      } catch {
        alert('Lỗi khi xóa danh mục');
      }
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const updated = await api.updateSettings(settings);
      if (updated) setSettings(updated);
      window.dispatchEvent(new CustomEvent('shop-settings-updated', { detail: updated || settings }));
      setSettingsSuccessMsg('Đã lưu và đồng bộ cài đặt tiệm thành công! ✨');
      setTimeout(() => setSettingsSuccessMsg(''), 4000);
      handleRefresh();
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu cấu hình');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Generate Sample Order for Testing
  const handleGenerateSampleOrder = async () => {
    const sampleCustomer = {
      customerName: 'Hoàng Minh Thảo',
      customerPhone: '0977889900',
      customerAddress: 'Số 15 Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
      items: [
        {
          productId: products[0]?.id || 'prod-1',
          productName: products[0]?.name || 'Teddy Mùa Thu Quàng Khăn Len',
          quantity: 1,
          price: products[0]?.price || 395000,
          image: products[0]?.image || plushiePresets[0].url
        }
      ],
      giftCardMessage: 'Gửi người yêu thương một cái ôm thật mềm mại nhân ngày gió lạnh đầu mùa!',
      packagingOption: 'Hộp quà Kraft vintage + Thiệp viết tay',
      shippingMethod: 'Hỏa tốc 2H (Nội thành)',
      paymentMethod: 'Chuyển khoản QR',
      note: 'Giao nhanh trước 18h nhé tiệm ơi',
      shippingFee: 30000
    };

    try {
      const newOrder = await api.createOrder(sampleCustomer);
      alert(`Đã tạo đơn hàng test thành công: ${newOrder.id}`);
      handleRefresh();
      setActiveTab('orders');
    } catch {
      alert('Lỗi khi tạo đơn test');
    }
  };

  // Handlers for Vouchers
  const handleSaveVoucher = async (e) => {
    e.preventDefault();
    if (!voucherForm.code || !voucherForm.discount) {
      alert('Vui lòng nhập mã voucher và số tiền giảm');
      return;
    }
    try {
      await api.createVoucher(voucherForm);
      alert(`Đã tạo mã giảm giá ${voucherForm.code.toUpperCase()} thành công!`);
      setIsVoucherModalOpen(false);
      setVoucherForm({ code: '', discount: '', minOrder: '', description: '', maxUsage: 50, expiresAt: '2026-12-31' });
      handleRefresh();
    } catch {
      alert('Lỗi khi tạo voucher');
    }
  };

  const handleToggleVoucher = async (vouchId, currentStatus) => {
    try {
      await api.updateVoucher(vouchId, { status: currentStatus === 'active' ? 'inactive' : 'active' });
      handleRefresh();
    } catch {
      alert('Lỗi khi đổi trạng thái voucher');
    }
  };

  const handleDeleteVoucher = async (vouchId, code) => {
    if (window.confirm(`Bạn có chắc muốn xóa voucher ${code}?`)) {
      try {
        await api.deleteVoucher(vouchId);
        handleRefresh();
      } catch {
        alert('Lỗi khi xóa voucher');
      }
    }
  };

  // Handlers for Users / Customers
  const openCreateUserModal = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      phone: '',
      memberTier: 'Thành viên Mùa Thu 🍂',
      loyaltyCoins: 10000,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      memberTier: u.memberTier || 'Thành viên Mùa Thu 🍂',
      loyaltyCoins: u.loyaltyCoins ?? 10000,
      avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.name || (!userForm.email && !userForm.phone)) {
      alert('Vui lòng nhập tên và số điện thoại hoặc email');
      return;
    }
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, userForm);
        // Nếu đang sửa chính tài khoản đang đăng nhập, đồng bộ lại Auth
        if (user && user.id === editingUser.id) {
          updateAuthUser(userForm);
        }
        alert('Đã cập nhật thông tin tài khoản thành công!');
      } else {
        await api.createUser(userForm);
        alert('Đã thêm khách hàng thành công!');
      }
      setIsUserModalOpen(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', phone: '', memberTier: 'Thành viên Mùa Thu 🍂', loyaltyCoins: 10000, avatar: '' });
      handleRefresh();
    } catch {
      alert(editingUser ? 'Lỗi khi cập nhật khách hàng' : 'Lỗi khi thêm khách hàng');
    }
  };

  // Cập nhật ảnh đại diện của tài khoản cá nhân đang đăng nhập
  const handleSaveMyAvatar = async (newUrl) => {
    if (!newUrl) return;
    try {
      if (user?.id) {
        await api.updateUser(user.id, { avatar: newUrl });
      }
      updateAuthUser({ avatar: newUrl });
      setIsMyAvatarModalOpen(false);
      alert('Đã cập nhật ảnh đại diện tài khoản thành công! ✨');
      handleRefresh();
    } catch {
      alert('Lỗi khi cập nhật ảnh đại diện');
    }
  };

  const handleAwardCoins = async (u, amount) => {
    const current = u.loyaltyCoins || 0;
    const newCoins = Math.max(0, current + amount);
    try {
      await api.updateUser(u.id, { loyaltyCoins: newCoins });
      alert(`Đã cập nhật: ${amount > 0 ? '+' : ''}${amount.toLocaleString('vi-VN')} Xu cho ${u.name}!`);
      handleRefresh();
    } catch {
      alert('Lỗi khi cập nhật xu');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản khách hàng "${userName}"?`)) {
      try {
        await api.deleteUser(userId);
        handleRefresh();
      } catch {
        alert('Lỗi khi xóa khách hàng');
      }
    }
  };

  // Handlers for Reviews
  const handleToggleReview = async (reviewId, currentStatus) => {
    try {
      await api.updateReviewStatus(reviewId, currentStatus === 'approved' ? 'pending' : 'approved');
      handleRefresh();
    } catch {
      alert('Lỗi khi duyệt đánh giá');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await api.deleteReview(reviewId);
        handleRefresh();
      } catch {
        alert('Lỗi khi xóa đánh giá');
      }
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    let matchStock = true;
    if (productStockFilter === 'in_stock') matchStock = p.stock > 5;
    else if (productStockFilter === 'low_stock') matchStock = p.stock > 0 && p.stock <= 5;
    else if (productStockFilter === 'out_of_stock') matchStock = p.stock === 0;

    return matchName && matchCat && matchStock;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const q = userSearch.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) ||
           (u.email || '').toLowerCase().includes(q) ||
           (u.phone || '').includes(q);
  });

  // Filtered Vouchers
  const filteredVouchers = vouchersList.filter(v => {
    const q = voucherSearch.toLowerCase();
    return (v.code || '').toLowerCase().includes(q) ||
           (v.description || '').toLowerCase().includes(q);
  });

  // Filtered Reviews
  const filteredReviews = reviewsList.filter(r => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  // Handlers for Articles
  const openCreateArticleModal = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Mẹo Chăm Sóc',
      author: 'Tiệm Trưởng HD',
      readTime: '4 phút đọc',
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      summary: '',
      content: '',
      tags: 'Chăm sóc gấu, Tiệm Gấu Bông',
      featured: false
    });
    setIsArticleModalOpen(true);
  };

  const openEditArticleModal = (art) => {
    setEditingArticle(art);
    const contentText = Array.isArray(art.content)
      ? art.content.map(c => c.text).join('\n\n')
      : (art.content || art.summary || '');
    setArticleForm({
      title: art.title || '',
      category: art.category || 'Mẹo Chăm Sóc',
      author: art.author || 'Tiệm Trưởng HD',
      readTime: art.readTime || '4 phút đọc',
      image: art.image || '',
      summary: art.summary || '',
      content: contentText,
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || ''),
      featured: Boolean(art.featured)
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }

    const paragraphs = (articleForm.content || articleForm.summary || '')
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => ({ type: 'paragraph', text: p }));

    const payload = {
      title: articleForm.title.trim(),
      category: articleForm.category,
      author: articleForm.author.trim() || 'Tiệm Trưởng HD',
      readTime: articleForm.readTime.trim() || '4 phút đọc',
      image: articleForm.image.trim() || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
      summary: articleForm.summary.trim(),
      content: paragraphs.length > 0 ? paragraphs : [{ type: 'paragraph', text: articleForm.summary }],
      tags: articleForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: articleForm.featured
    };

    try {
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, payload);
      } else {
        await api.createArticle(payload);
      }
      setIsArticleModalOpen(false);
      handleRefresh();
    } catch {
      alert('Lỗi khi lưu bài viết');
    }
  };

  const handleDeleteArticle = async (artId) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này khỏi trang chủ?')) {
      try {
        await api.deleteArticle(artId);
        handleRefresh();
      } catch {
        alert('Lỗi khi xóa bài viết');
      }
    }
  };

  // Filtered Articles for Admin
  const filteredAdminArticles = articlesList.filter(art => {
    const q = articleSearch.toLowerCase().trim();
    const matchSearch = !q ||
      art.title.toLowerCase().includes(q) ||
      (art.summary && art.summary.toLowerCase().includes(q));
    const matchCat = articleCategoryFilter === 'all' || art.category === articleCategoryFilter;
    return matchSearch && matchCat;
  });

  // ================= BẢO VỆ BACKEND: CHỈ TÀI KHOẢN ADMIN MỚI MỞ ĐƯỢC =================
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF4EB] font-sans flex flex-col justify-between">
        {/* Header cổng bảo mật */}
        <header className="bg-white border-b border-[#EAE0D5] px-6 lg:px-10 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onBackToStore}>
            <div className="w-10 h-10 rounded-full border border-[#D9C8BA] bg-white flex items-center justify-center text-lg shadow-xs">
              🧸
            </div>
            <div>
              <span className="text-xl font-black text-[#4A2E1B] tracking-tight block leading-tight">Tiệm Gấu Bông HD</span>
              <span className="text-[10px] font-bold tracking-widest text-[#8C5E43] uppercase block">
                ADMIN ACCESS CONTROL
              </span>
            </div>
          </div>
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] px-4 py-2 rounded-xl text-xs font-bold transition border border-[#EAE0D5] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Quay về Cửa Hàng
          </button>
        </header>

        {/* Khung trung tâm cảnh báo và đăng nhập Admin */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-xl border border-[#EAE0D5] p-8 max-w-md w-full text-center relative overflow-hidden animate-in fade-in zoom-in-95">
            {/* Vệt màu trên đỉnh */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-[#7A3E1D] to-[#4A2E1B]" />

            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-[#7A3E1D] flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-xs">
              <ShieldAlert className="w-8 h-8 text-[#C25E2E]" />
            </div>

            <h2 className="text-xl font-black text-[#4A2E1B] mb-2">
              Trang Quản Trị
            </h2>
            <p className="text-xs text-[#8C6D53] leading-relaxed mb-5">
              Chức năng đã được chuyển sang phân quyền tài khoản. <br />
              <strong className="text-[#C25E2E] font-bold">Chỉ tài khoản Quản Trị Viên (Admin)</strong> mới có quyền mở Trang Quản Trị.
            </p>

            {/* Thông báo nếu đã đăng nhập nhưng bằng tài khoản khách hàng */}
            {isAuthenticated && user && (
              <div className="bg-[#FFF4E5] border border-[#FADCC7] rounded-2xl p-3.5 mb-5 text-left text-xs">
                <div className="flex items-center gap-2 font-bold text-[#8C4318] mb-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Tài khoản hiện tại không có quyền Admin:</span>
                </div>
                <div className="space-y-1 text-[#5C3A21] bg-white/60 p-2.5 rounded-xl border border-[#F5DAC2]">
                  <p>• Họ tên: <strong>{user.name}</strong></p>
                  <p>• Tài khoản: {user.email || user.phone || user.account}</p>
                  <p>• Quyền hiện tại: <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold text-[10px]">Khách hàng / Thành viên</span></p>
                </div>
                <button
                  onClick={() => logout()}
                  className="mt-3 w-full bg-[#8C4318] hover:bg-[#6E3210] text-white py-2 px-3 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" /> Đăng xuất để đăng nhập tài khoản Admin
                </button>
              </div>
            )}

            {/* Form đăng nhập Admin */}
            <form onSubmit={handleAdminDirectLogin} className="space-y-3 text-left mb-4">
              {adminAuthError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {adminAuthError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-[#6B4226] mb-1">
                  Tài khoản Quản Trị (Username / Email):
                </label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin hoặc admin@tiembong.vn"
                  className="w-full bg-[#FAF4EB] border border-[#E0D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#4A2E1B] font-semibold focus:outline-none focus:border-[#7A3E1D] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B4226] mb-1">
                  Mật khẩu Quản Trị:
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Mật khẩu admin"
                  className="w-full bg-[#FAF4EB] border border-[#E0D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#4A2E1B] font-semibold focus:outline-none focus:border-[#7A3E1D] transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={adminAuthLoading}
                className="w-full bg-[#7A3E1D] hover:bg-[#5E2E14] text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 mt-1"
              >
                {adminAuthLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Đăng Nhập Vào Trang Quản Trị</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#4A3222] font-sans flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-white border-b border-[#EAE0D5] px-8 py-3.5 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] px-4 py-2 rounded-xl text-xs font-bold transition border border-[#EAE0D5]"
          >
            <ArrowLeft className="w-4 h-4" /> Quay về Cửa Hàng
          </button>
          <div className="h-5 w-[1px] bg-[#EAE0D5]"></div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-[#D9C8BA] bg-white flex items-center justify-center text-sm shadow-2xs overflow-hidden shrink-0">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo Tiệm" className="w-full h-full object-cover" />
              ) : (
                <span>🧸</span>
              )}
            </div>
            <h1 className="text-lg font-black text-[#D47343] flex items-center gap-2">
              <span>{settings.shopName || 'Tiệm Gấu Bông HD'}</span>
              <span className="bg-[#6B4226] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Trang Quản Trị
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Server status indicator */}
          <div className="flex items-center gap-2 bg-[#FAF4EB] px-3 py-1.5 rounded-full border border-[#EAE0D5] text-xs font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>
              {serverOnline ? '⚡ SQLite 3 Database (Port 5000)' : 'Chế độ Local DB (Offline)'}
            </span>
          </div>

          <button
            onClick={handleGenerateSampleOrder}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Tạo Đơn Test
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-[#FAF4EB] rounded-xl text-[#6B4226] transition border border-transparent hover:border-[#EAE0D5]"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-[#EAE0D5]">
            <div className="relative group cursor-pointer" onClick={() => {
              setMyAvatarUrl(user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
              setIsMyAvatarModalOpen(true);
            }}>
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#D47343] shadow-xs group-hover:opacity-80 transition"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="text-left hidden md:block cursor-pointer" onClick={() => {
              setMyAvatarUrl(user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
              setIsMyAvatarModalOpen(true);
            }}>
              <p className="text-xs font-bold leading-tight flex items-center gap-1.5 text-[#4A2E1B] hover:text-[#D47343] transition">
                <span>{user?.name || 'Admin Quản Trị'}</span>
                <span className="bg-[#7A3E1D] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">ADMIN 🛡️</span>
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{user?.email || user?.account || 'admin@tiembong.vn'}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl transition ml-1 cursor-pointer border border-transparent hover:border-rose-200"
              title="Đăng xuất quyền Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-6 py-6 gap-6">
        {/* Sidebar Menu */}
        <aside className="w-64 bg-white rounded-3xl p-4 border border-[#EAE0D5] shadow-sm flex flex-col justify-between shrink-0 h-fit sticky top-24">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Menu Quản Trị
            </div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Tổng Quan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'products'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Quản Lý Sản Phẩm</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'products' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'orders'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Quản Lý Đơn Hàng</span>
              </div>
              {orders.filter(o => o.status === 'pending').length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {orders.filter(o => o.status === 'pending').length} mới
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'categories'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Danh Mục Sản Phẩm</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'categories' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'users'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Khách Hàng & Hội Viên</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'users' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'vouchers'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4" />
                <span>Mã Giảm Giá & Voucher</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'vouchers' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {vouchersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'reviews'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4" />
                <span>Đánh Giá & Phản Hồi</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'reviews' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {reviewsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'articles'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Quản Lý Bài Viết</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'articles' ? 'bg-white/30 text-white' : 'bg-[#FAF4EB] text-[#6B4226]'
              }`}>
                {articlesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('giftcards')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'giftcards'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-4 h-4" />
                <span>Lời Chúc & Thiệp Viết Tay</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                activeTab === 'settings'
                  ? 'bg-[#D47343] text-white shadow-md'
                  : 'hover:bg-[#FAF4EB] text-[#6B4226]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Cài Đặt Cửa Hàng</span>
              </div>
            </button>
          </div>

          {/* Shop Quick Info in Sidebar */}
          <div className="mt-8 pt-4 border-t border-[#EAE0D5] bg-[#FAF4EB] p-4 rounded-2xl text-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-[#6B4226]">
              <div className="w-6 h-6 rounded-full border border-[#D9C8BA] bg-white flex items-center justify-center text-xs overflow-hidden shrink-0">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span>🧸</span>
                )}
              </div>
              <span className="truncate">{settings.shopName || 'Tiệm Gấu Bông HD'}</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">{settings.slogan || 'Thủ công với từng đường may mềm mại & thiệp tay ấm áp.'}</p>
            <div className="text-[10px] text-[#D47343] font-bold">
              Hotline: {settings.hotline || '0988.123.456'}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* ======================= TAB 1: DASHBOARD ======================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">Tổng Doanh Thu</span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#6B4226]">
                    {formatMoney(stats?.totalRevenue || 0)}
                  </div>
                  <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% so với tuần trước
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">Tổng Đơn Hàng</span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#6B4226]">
                    {orders.length} đơn
                  </div>
                  <div className="mt-2 text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {orders.filter(o => o.status === 'pending').length} đơn đang chờ duyệt
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">Bé Gấu Trong Kho</span>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#6B4226]">
                    {products.reduce((acc, p) => acc + (p.stock || 0), 0)} bé
                  </div>
                  <div className="mt-2 text-xs font-semibold text-gray-500">
                    Phân bố trong {products.length} mẫu thiết kế
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500">Gấu Sắp Hết Hàng</span>
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-rose-600">
                    {products.filter(p => p.stock <= 5).length} bé
                  </div>
                  <div className="mt-2 text-xs font-semibold text-rose-500">
                    Cần nhập thêm bông và vải may
                  </div>
                </div>
              </div>

              {/* Revenue Chart & Top Products */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart Visualizer */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-bold text-[#6B4226]">Doanh Thu 7 Ngày Gần Nhất</h2>
                      <p className="text-xs text-gray-500">Biểu đồ ước tính đơn hàng và doanh số mùa thu</p>
                    </div>
                    <span className="text-xs font-bold text-[#D47343] bg-[#FAF4EB] px-3 py-1.5 rounded-full border border-[#EAE0D5]">
                      Mùa Thu 2024
                    </span>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2 border-b border-[#EAE0D5]">
                    {(stats?.revenueChart || [
                      { day: 'T2', revenue: 1450000 },
                      { day: 'T3', revenue: 1800000 },
                      { day: 'T4', revenue: 2100000 },
                      { day: 'T5', revenue: 1650000 },
                      { day: 'T6', revenue: 2800000 },
                      { day: 'T7', revenue: 3200000 },
                      { day: 'CN', revenue: 2950000 }
                    ]).map((item, idx) => {
                      const max = 3500000;
                      const heightPercent = Math.min(100, Math.round((item.revenue / max) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition bg-[#6B4226] text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            {formatMoney(item.revenue)}
                          </div>
                          <div className="w-full bg-[#FAF4EB] rounded-2xl h-44 flex items-end p-1">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full bg-gradient-to-t from-[#D47343] to-[#E5A93C] rounded-xl transition-all duration-500 group-hover:brightness-110"
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{item.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>Thống kê bán chạy cao điểm cuối tuần</span>
                    <span className="font-bold text-[#D47343]">Doanh số trung bình: 2.2tr/ngày</span>
                  </div>
                </div>

                {/* Top Best Sellers */}
                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col justify-between">
                  <div>
                    <h2 className="text-base font-bold text-[#6B4226] mb-1">Bé Gấu Bán Chạy Nhất</h2>
                    <p className="text-xs text-gray-500 mb-5">Được các bạn trẻ yêu thích nhất</p>

                    <div className="space-y-4">
                      {products.slice(0, 4).map((p, idx) => (
                        <div key={idx} className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#FAF4EB] transition">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-[#EAE0D5]" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-bold truncate text-[#6B4226]">{p.name}</h3>
                            <p className="text-[11px] text-[#D47343] font-bold">{formatMoney(p.price)}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold bg-[#FAF4EB] text-gray-600 px-2.5 py-1 rounded-full border border-[#EAE0D5]">
                              Kho: {p.stock}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('products')}
                    className="mt-6 w-full py-2.5 rounded-xl border border-[#EAE0D5] text-xs font-bold text-[#6B4226] hover:bg-[#FAF4EB] transition flex items-center justify-center gap-1.5"
                  >
                    Xem tất cả sản phẩm <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-bold text-[#6B4226]">Đơn Hàng Cần Xử Lý Gần Đây</h2>
                    <p className="text-xs text-gray-500">Các bạn khách đang chờ gửi gấu và viết thiệp</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-[#D47343] hover:underline flex items-center gap-1"
                  >
                    Xem tất cả ({orders.length}) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE0D5] text-gray-400 uppercase text-[10px]">
                        <th className="pb-3 font-bold">Mã Đơn</th>
                        <th className="pb-3 font-bold">Khách Hàng</th>
                        <th className="pb-3 font-bold">Sản Phẩm</th>
                        <th className="pb-3 font-bold">Tổng Tiền</th>
                        <th className="pb-3 font-bold">Trạng Thái</th>
                        <th className="pb-3 font-bold text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE0D5]">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF4EB]/50 transition">
                          <td className="py-3.5 font-bold text-[#D47343]">{o.id}</td>
                          <td className="py-3.5">
                            <p className="font-bold text-[#6B4226]">{o.customerName}</p>
                            <p className="text-[10px] text-gray-500">{o.customerPhone}</p>
                          </td>
                          <td className="py-3.5">
                            <p className="truncate max-w-xs text-gray-600">
                              {o.items?.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                            </p>
                          </td>
                          <td className="py-3.5 font-bold text-[#6B4226]">{formatMoney(o.totalAmount)}</td>
                          <td className="py-3.5">{getStatusBadge(o.status)}</td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setIsOrderModalOpen(true);
                              }}
                              className="bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] font-bold px-3 py-1.5 rounded-lg border border-[#EAE0D5] text-[11px] transition"
                            >
                              Xem Chi Tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: PRODUCTS CRUD ======================= */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Product Header & Filters */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex flex-wrap gap-3 w-full">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bé gấu theo tên..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl px-3.5 py-2 text-xs font-bold text-[#6B4226] focus:outline-none focus:border-[#D47343]"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl px-3.5 py-2 text-xs font-bold text-[#6B4226] focus:outline-none focus:border-[#D47343]"
                  >
                    <option value="all">Tất cả tồn kho</option>
                    <option value="in_stock">Còn nhiều ({'>'}5)</option>
                    <option value="low_stock">Sắp hết (≤5)</option>
                    <option value="out_of_stock">Hết hàng (0)</option>
                  </select>
                </div>

                <button
                  onClick={openCreateProductModal}
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Thêm Bé Gấu Mới
                </button>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-3xl border border-[#EAE0D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF4EB]/60 border-b border-[#EAE0D5] text-gray-500 uppercase text-[10px]">
                        <th className="py-4 px-6 font-bold">Hình Ảnh & Tên Gấu</th>
                        <th className="py-4 px-4 font-bold">Danh Mục</th>
                        <th className="py-4 px-4 font-bold">Giá Bán</th>
                        <th className="py-4 px-4 font-bold">Tồn Kho</th>
                        <th className="py-4 px-4 font-bold">Thẻ Tag</th>
                        <th className="py-4 px-6 font-bold text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE0D5]">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#FAF4EB]/40 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3.5">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-2xl object-cover border border-[#EAE0D5] shrink-0"
                              />
                              <div>
                                <h3 className="font-bold text-[#6B4226] text-xs">{prod.name}</h3>
                                <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">{prod.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-gray-600">{prod.category}</td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#D47343]">{formatMoney(prod.price)}</div>
                            {prod.originalPrice > prod.price && (
                              <div className="text-[10px] text-gray-400 line-through">{formatMoney(prod.originalPrice)}</div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              prod.stock > 5
                                ? 'bg-emerald-50 text-emerald-700'
                                : prod.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {prod.stock} bé
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {prod.tag ? (
                              <span className="bg-[#FAF4EB] border border-[#EAE0D5] text-[#6B4226] text-[10px] font-bold px-2.5 py-1 rounded-full">
                                {prod.tag}
                              </span>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditProductModal(prod)}
                                className="p-2 hover:bg-[#FAF4EB] text-blue-600 rounded-xl transition border border-transparent hover:border-[#EAE0D5]"
                                title="Chỉnh sửa bé gấu"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition border border-transparent hover:border-rose-200"
                                title="Xóa khỏi tiệm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400">
                            Không tìm thấy bé gấu nào phù hợp bộ lọc.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: ORDERS MANAGEMENT ======================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Filters */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 flex flex-wrap gap-3 w-full">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo Mã đơn, Tên khách hoặc Số điện thoại..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl px-3.5 py-2 text-xs font-bold text-[#6B4226] focus:outline-none focus:border-[#D47343]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="processing">Đang chuẩn bị & viết thiệp</option>
                    <option value="shipping">Đang giao hỏa tốc</option>
                    <option value="delivered">Đã giao thành công</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div className="text-xs font-bold text-gray-500">
                  Tổng cộng: <span className="text-[#D47343]">{filteredOrders.length}</span> đơn hàng
                </div>
              </div>

              {/* Order Table */}
              <div className="bg-white rounded-3xl border border-[#EAE0D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF4EB]/60 border-b border-[#EAE0D5] text-gray-500 uppercase text-[10px]">
                        <th className="py-4 px-6 font-bold">Mã Đơn & Ngày Đặt</th>
                        <th className="py-4 px-4 font-bold">Khách Hàng & SĐT</th>
                        <th className="py-4 px-4 font-bold">Sản Phẩm Đặt</th>
                        <th className="py-4 px-4 font-bold">Tổng Tiền</th>
                        <th className="py-4 px-4 font-bold">Trạng Thái</th>
                        <th className="py-4 px-6 font-bold text-right">Chi Tiết & Xử Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE0D5]">
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-[#FAF4EB]/40 transition">
                          <td className="py-4 px-6">
                            <span className="font-black text-[#D47343] text-xs">{order.id}</span>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <h3 className="font-bold text-[#6B4226] text-xs">{order.customerName}</h3>
                            <p className="text-[11px] text-gray-500">{order.customerPhone}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[180px]">{order.customerAddress}</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              {order.items?.map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="font-bold text-[#D47343]">{it.quantity}x</span>
                                  <span className="text-gray-700 truncate max-w-[200px]">{it.productName}</span>
                                </div>
                              ))}
                              {order.giftCardMessage && (
                                <span className="inline-block bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-200 mt-1">
                                  💌 Kèm thiệp viết tay
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-[#6B4226] text-xs">{formatMoney(order.totalAmount)}</div>
                            <div className="text-[10px] text-gray-400">{order.paymentMethod}</div>
                          </td>
                          <td className="py-4 px-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-xl text-[10px] transition shadow-sm"
                                  title="Xác nhận đơn & chuẩn bị viết thiệp"
                                >
                                  Duyệt Đơn
                                </button>
                              )}
                              {order.status === 'processing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-2.5 py-1.5 rounded-xl text-[10px] transition shadow-sm"
                                  title="Giao cho shipper"
                                >
                                  Giao Hàng
                                </button>
                              )}
                              {order.status === 'shipping' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-2.5 py-1.5 rounded-xl text-[10px] transition shadow-sm"
                                  title="Hoàn thành đơn"
                                >
                                  Đã Giao
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                                className="bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] font-bold px-3 py-1.5 rounded-xl border border-[#EAE0D5] text-[11px] transition flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> Xem
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400">
                            Chưa có đơn hàng nào phù hợp bộ lọc.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 4: CATEGORIES ======================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add Category Form */}
                <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm h-fit">
                  <h2 className="text-base font-bold text-[#6B4226] mb-1">Thêm Danh Mục Mới</h2>
                  <p className="text-xs text-gray-500 mb-5">Phân loại gấu bông cho khách dễ tìm kiếm</p>

                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Tên Danh Mục *</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Gấu Bông Anime, Móc Khóa..."
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Mô Tả Ngắn</label>
                      <textarea
                        rows={3}
                        placeholder="Mô tả về đặc điểm nhóm gấu này..."
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#D47343] hover:bg-[#B85C2E] text-white py-2.5 rounded-2xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Tạo Danh Mục
                    </button>
                  </form>
                </div>

                {/* Categories List */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm">
                    <h2 className="text-base font-bold text-[#6B4226] mb-1">Danh Sách Nhóm Gấu Bông</h2>
                    <p className="text-xs text-gray-500 mb-5">Hiện có {categories.length} danh mục đang hoạt động</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map(cat => {
                        const count = products.filter(p => p.category === cat.name).length;
                        return (
                          <div key={cat.id} className="bg-[#FAF4EB]/60 border border-[#EAE0D5] p-4 rounded-2xl flex flex-col justify-between hover:border-[#D47343] transition">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xs text-[#6B4226]">{cat.name}</h3>
                                <span className="bg-white text-[#D47343] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#EAE0D5]">
                                  {count} bé gấu
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500">{cat.description || 'Chưa có mô tả chi tiết.'}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex justify-end">
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="text-rose-500 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Xóa nhóm
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: USERS & CUSTOMERS ======================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Users Header & Filters */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[260px] w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, số điện thoại hoặc email khách hàng..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <div className="text-xs font-bold text-gray-500 hidden sm:block">
                    Tổng: <span className="text-[#D47343]">{filteredUsers.length}</span> khách hàng
                  </div>
                  <button
                    onClick={openCreateUserModal}
                    className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Thêm Khách Hàng
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-[#EAE0D5] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF4EB]/60 border-b border-[#EAE0D5] text-gray-500 uppercase text-[10px]">
                        <th className="py-4 px-6 font-bold">Khách Hàng</th>
                        <th className="py-4 px-4 font-bold">Liên Hệ</th>
                        <th className="py-4 px-4 font-bold">Hạng Thành Viên</th>
                        <th className="py-4 px-4 font-bold">Đơn Hàng & Chi Tiêu</th>
                        <th className="py-4 px-4 font-bold">Số Dư Xu / Minigame</th>
                        <th className="py-4 px-6 font-bold text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE0D5]">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-[#FAF4EB]/40 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                                alt={u.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#EAE0D5] shrink-0"
                              />
                              <div>
                                <h3 className="font-bold text-[#6B4226] text-xs">{u.name}</h3>
                                <p className="text-[10px] text-gray-400">ID: {u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-semibold text-gray-700">{u.phone || 'Chưa cập nhật SĐT'}</p>
                            <p className="text-[11px] text-gray-400">{u.email || 'Chưa có email'}</p>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              {u.memberTier || 'Thành viên Mùa Thu 🍂'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-bold text-[#D47343]">{formatMoney(u.totalSpent || 0)}</p>
                            <p className="text-[10px] text-gray-500">{u.ordersCount || 0} đơn đã giao</p>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-amber-700">
                              <span>🪙 {(u.loyaltyCoins || 0).toLocaleString('vi-VN')} Xu</span>
                            </div>
                            <p className="text-[10px] text-gray-400">🕹️ {u.clawGameTurns || 3} lượt gắp gấu</p>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditUserModal(u)}
                                className="p-1.5 hover:bg-[#FAF4EB] text-[#6B4226] rounded-lg transition border border-[#EAE0D5]"
                                title="Sửa thông tin & ảnh đại diện tài khoản"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleAwardCoins(u, 5000)}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-lg text-[10px] border border-amber-200 transition"
                                title="Tặng thưởng 5.000 Xu"
                              >
                                +5k Xu
                              </button>
                              <button
                                onClick={() => handleAwardCoins(u, 10000)}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-lg text-[10px] border border-emerald-200 transition"
                                title="Tặng thưởng 10.000 Xu"
                              >
                                +10k Xu
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                                title="Xóa khách hàng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-400">
                            Không tìm thấy tài khoản khách hàng nào.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB: VOUCHERS & PROMOTIONS ======================= */}
          {activeTab === 'vouchers' && (
            <div className="space-y-6">
              {/* Vouchers Header */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[240px] w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã voucher hoặc mô tả..."
                    value={voucherSearch}
                    onChange={(e) => setVoucherSearch(e.target.value)}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVoucherModalOpen(true)}
                    className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tạo Voucher Mới
                  </button>
                </div>
              </div>

              {/* Vouchers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVouchers.map(v => (
                  <div
                    key={v.id}
                    className="bg-white border-2 border-[#EAE0D5] rounded-3xl p-5 shadow-sm hover:border-[#D47343] transition relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-sm tracking-wider bg-[#FFF5EB] text-[#D47343] border border-dashed border-[#D47343] px-3 py-1 rounded-xl">
                          🎟️ {v.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          v.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {v.status === 'active' ? 'Đang áp dụng' : 'Tạm dừng'}
                        </span>
                      </div>

                      <div className="text-xl font-black text-[#6B4226] mb-1">
                        Giảm {formatMoney(v.discount)}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{v.description || 'Ưu đãi cho đơn hàng tại Tiệm'}</p>

                      <div className="bg-[#FAF4EB] p-3 rounded-xl text-[11px] text-gray-600 space-y-1 mb-4">
                        <p>Đơn tối thiểu: <strong>{formatMoney(v.minOrder || 0)}</strong></p>
                        <p>Đã sử dụng: <strong>{v.usageCount || 0} / {v.maxUsage || 50} lượt</strong></p>
                        <p>Hết hạn: <strong>{v.expiresAt || 'Không giới hạn'}</strong></p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-xs">
                      <button
                        onClick={() => handleToggleVoucher(v.id, v.status)}
                        className={`font-bold text-[11px] px-3 py-1 rounded-lg transition ${
                          v.status === 'active'
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {v.status === 'active' ? 'Tạm Dừng' : 'Kích Hoạt'}
                      </button>
                      <button
                        onClick={() => handleDeleteVoucher(v.id, v.code)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </div>
                  </div>
                ))}

                {filteredVouchers.length === 0 && (
                  <div className="col-span-3 bg-white p-12 rounded-3xl border border-[#EAE0D5] text-center text-gray-400">
                    Chưa có mã giảm giá nào. Hãy bấm "Tạo Voucher Mới" để thêm mã ưu đãi!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB: REVIEWS & FEEDBACK ======================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Reviews Header */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#6B4226]">Đánh Giá Từ Khách Hàng</h2>
                  <p className="text-xs text-gray-500">Xem và kiểm duyệt phản hồi từ người mua bé gấu bông</p>
                </div>

                <div className="flex gap-2">
                  {['all', 'approved', 'pending'].map(st => (
                    <button
                      key={st}
                      onClick={() => setReviewFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        reviewFilter === st
                          ? 'bg-[#D47343] text-white shadow-sm'
                          : 'bg-[#FAF4EB] text-[#6B4226] border border-[#EAE0D5]'
                      }`}
                    >
                      {st === 'all' ? 'Tất cả' : st === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReviews.map(r => (
                  <div key={r.id} className="bg-white p-5 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#6B4226]">{r.customerName}</span>
                          {r.customerPhone && <span className="text-[10px] text-gray-400">({r.customerPhone})</span>}
                        </div>
                        <div className="flex text-amber-500 text-xs">
                          {Array.from({ length: r.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>

                      <p className="text-[11px] font-bold text-[#D47343] mb-2">Bé gấu: {r.productName}</p>
                      <p className="text-xs text-gray-700 leading-relaxed bg-[#FAF4EB]/60 p-3 rounded-2xl mb-3">
                        "{r.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-xs">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status === 'approved' ? 'Hiển thị công khai' : 'Đang ẩn'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReview(r.id, r.status)}
                          className="text-[#6B4226] hover:text-[#D47343] font-bold text-[11px] underline"
                        >
                          {r.status === 'approved' ? 'Ẩn đánh giá' : 'Duyệt hiển thị'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="text-rose-500 hover:text-rose-700 font-bold text-[11px]"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReviews.length === 0 && (
                  <div className="col-span-2 bg-white p-12 rounded-3xl border border-[#EAE0D5] text-center text-gray-400">
                    Chưa có đánh giá nào phù hợp bộ lọc.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= TAB: ARTICLES ======================= */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-[#6B4226] flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D47343]" /> Quản Lý Bài Viết & Cẩm Nang
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Thêm mới, sửa đổi và quản lý các bài viết hiển thị ở mục bài viết ngoài trang chủ
                  </p>
                </div>
                <button
                  onClick={openCreateArticleModal}
                  className="bg-[#D47343] hover:bg-[#B3592B] text-white px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Viết Bài Mới</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Tìm theo tiêu đề hoặc tóm tắt bài viết..."
                    className="w-full bg-white border border-[#EAE0D5] rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#D47343]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={articleCategoryFilter}
                  onChange={(e) => setArticleCategoryFilter(e.target.value)}
                  className="bg-white border border-[#EAE0D5] rounded-full px-4 py-2 text-xs font-semibold focus:outline-none focus:border-[#D47343]"
                >
                  <option value="all">Tất cả danh mục ({articlesList.length})</option>
                  <option value="Mẹo Chăm Sóc">Mẹo Chăm Sóc</option>
                  <option value="Gợi Ý Quà Tặng">Gợi Ý Quà Tặng</option>
                  <option value="Hậu Trường Tiệm">Hậu Trường Tiệm</option>
                  <option value="Cẩm Nang Mua Sắm">Cẩm Nang Mua Sắm</option>
                  <option value="Bộ Sưu Tập Mới">Bộ Sưu Tập Mới</option>
                </select>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdminArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white border border-[#EAE0D5] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      {/* Thumbnail */}
                      <div className="h-44 relative bg-[#EAE0D5] overflow-hidden">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-[#6B4226] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {art.category}
                        </span>
                        {art.featured && (
                          <span className="absolute top-3 right-3 bg-amber-400 text-[#4A2E1B] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Nổi bật
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {art.readTime}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2 font-medium">
                          <span>{art.date}</span>
                          <div className="flex items-center gap-2">
                            <span>👁 {(art.views || 1).toLocaleString('vi-VN')}</span>
                            <span>❤️ {art.likes || 0}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm text-[#4A2E1B] line-clamp-2 leading-snug mb-2">
                          {art.title}
                        </h3>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                          {art.summary}
                        </p>

                        <div className="text-[11px] text-[#6B4226] font-semibold flex items-center gap-1">
                          <span>{art.authorAvatar || '🧸'}</span>
                          <span>Tác giả: {art.author}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="p-4 bg-[#FAF4EB]/60 border-t border-[#EAE0D5] flex items-center justify-between">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(art.tags || []).slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] bg-white border border-[#E0D2C4] px-2 py-0.5 rounded-full text-gray-600">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditArticleModal(art)}
                          className="p-1.5 bg-white border border-[#E0D2C4] text-[#6B4226] hover:bg-[#FAF4EB] rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Sửa bài viết"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="p-1.5 bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-lg transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredAdminArticles.length === 0 && (
                  <div className="col-span-3 bg-white p-12 rounded-3xl border border-[#EAE0D5] text-center text-gray-400">
                    Không tìm thấy bài viết nào phù hợp bộ lọc.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'giftcards' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-[#EAE0D5] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-base font-bold text-[#6B4226] flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-[#D47343]" /> Góc Thiệp Viết Tay & Lời Chúc Yêu Thương
                    </h2>
                    <p className="text-xs text-gray-500">
                      Tập hợp những dòng nhắn gửi của khách gửi gắm để Tiệm nắn nót viết tay bằng bút mực lên thiệp Kraft vintage
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders.filter(o => o.giftCardMessage).map(order => (
                  <div
                    key={order.id}
                    className="bg-[#FFFDF9] border-2 border-[#E8DACB] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
                    style={{ backgroundImage: 'radial-gradient(#E8DACB 0.75px, transparent 0.75px)', backgroundSize: '16px 16px' }}
                  >
                    <div>
                      {/* Stamp Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#D47343] tracking-wider uppercase">
                            Đơn hàng: {order.id}
                          </span>
                          <p className="text-xs font-bold text-[#6B4226] mt-0.5">Khách: {order.customerName}</p>
                        </div>
                        <div className="border border-dashed border-[#D47343] px-2 py-1 rounded text-[9px] font-bold text-[#D47343] rotate-3 bg-[#FAF4EB]">
                          ✉ VINTAGE CARD
                        </div>
                      </div>

                      {/* Handwritten card body */}
                      <div className="bg-[#FAF4EB]/80 p-4 rounded-2xl border border-[#EAE0D5] mb-4">
                        <p className="font-handwriting text-xl text-[#6B4226] leading-relaxed italic">
                          "{order.giftCardMessage}"
                        </p>
                      </div>

                      <div className="text-[11px] text-gray-500 space-y-1">
                        <p><strong>Bé gấu tặng kèm:</strong> {order.items?.map(it => it.productName).join(', ')}</p>
                        <p><strong>Gói quà:</strong> {order.packagingOption}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex items-center justify-between text-xs">
                      {getStatusBadge(order.status)}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsOrderModalOpen(true);
                        }}
                        className="text-[#D47343] font-bold hover:underline text-[11px]"
                      >
                        Xem chi tiết đơn →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 6: SETTINGS ======================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl pb-12">
              {/* Header Tab Settings */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-[#6B4226] mb-1 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#D47343]" />
                    <span>Cài Đặt Cửa Hàng & Nhận Diện Thương Hiệu</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Chỉnh sửa Logo, Banner trang chủ, khẩu hiệu và các thông tin vận hành tiệm. Dữ liệu sẽ đồng bộ tức thì ra toàn bộ giao diện!
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={onBackToStore}
                    className="bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] border border-[#EAE0D5] px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Xem Trang Chủ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                    className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingSettings ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSavingSettings ? 'Đang lưu...' : 'Lưu Tất Cả Cài Đặt'}</span>
                  </button>
                </div>
              </div>

              {/* Thông báo thành công nếu có */}
              {settingsSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* KHỐI 1: LOGO & TÊN TIỆM */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE0D5] shadow-sm">
                  <div className="border-b border-[#EAE0D5] pb-3 mb-6">
                    <h3 className="text-sm font-extrabold text-[#6B4226] uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#D47343]" />
                      <span>1. Logo Nhận Diện Tiệm Gấu Bông</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Logo hiển thị ở Thanh điều hướng (Header), Chân trang (Footer) và Bảng quản trị
                    </p>
                  </div>

                  {/* Logo Preview & Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Previews */}
                    <div className="bg-[#FAF4EB] p-5 rounded-2xl border border-[#EAE0D5] flex flex-col items-center text-center">
                      <p className="text-[11px] font-bold text-[#6B4226] mb-3">Xem trước Logo</p>
                      
                      <div className="flex items-center justify-center gap-4 mb-3">
                        {/* Round Preview */}
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full border-2 border-[#D47343] bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
                            {settings.logo ? (
                              <img
                                src={settings.logo}
                                alt="Logo Preview Tròn"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-2xl">🧸</span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold mt-1">Dạng Tròn (Header)</span>
                        </div>

                        {/* Square Rounded Preview */}
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl border-2 border-[#D9C8BA] bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
                            {settings.logo ? (
                              <img
                                src={settings.logo}
                                alt="Logo Preview Vuông"
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-2xl">🧸</span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 font-semibold mt-1">Dạng Vuông (Icon)</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-500 leading-tight">
                        {settings.logo ? 'Đang dùng Logo tải lên tùy chỉnh' : 'Đang dùng biểu tượng gấu 🧸 mặc định'}
                      </p>

                      {settings.logo && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, logo: '' })}
                          className="mt-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 border border-rose-200"
                        >
                          <Trash2 className="w-3 h-3" /> Gỡ Logo / Dùng Icon Gấu
                        </button>
                      )}
                    </div>

                    {/* Logo Inputs */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Tải ảnh Logo từ máy tính hoặc dán đường dẫn (URL)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Dán link ảnh (https://... hoặc tải từ máy bên cạnh)"
                            value={settings.logo || ''}
                            onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                            className="flex-1 bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2.5 px-3.5 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                          />

                          <label className="flex items-center justify-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold px-4 py-2.5 rounded-2xl border border-[#EAE0D5] cursor-pointer transition shrink-0 text-xs">
                            <Upload className="w-4 h-4 text-[#D47343]" />
                            <span>Chọn file từ máy</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 8 * 1024 * 1024) {
                                    alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    setSettings(prev => ({ ...prev, logo: event.target.result }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                          💡 Khuyến nghị: Ảnh tỉ lệ vuông 1:1, kích thước 400x400px trở lên, định dạng PNG nền trong suốt hoặc JPG sắc nét.
                        </p>
                      </div>

                      {/* Logo Presets */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                          Hoặc chọn nhanh mẫu logo phong cách tiệm:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: 'Gấu Bông Vintage', url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=300&q=80' },
                            { label: 'Gấu Nâu Biscuit', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80' },
                            { label: 'Hộp Quà Thắt Nơ', url: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=300&q=80' },
                            { label: 'Cún Bơ Sữa', url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=300&q=80' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSettings({ ...settings, logo: preset.url })}
                              className="px-2.5 py-1 bg-[#FAF4EB] hover:bg-[#F3E8D8] border border-[#EAE0D5] rounded-xl text-[11px] font-semibold text-[#6B4226] transition flex items-center gap-1"
                            >
                              <span>🧸</span>
                              <span>{preset.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shop Name & Slogan */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Tên Tiệm Gấu Bông</label>
                          <input
                            type="text"
                            value={settings.shopName || ''}
                            onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                            className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                            placeholder="Tiệm Gấu Bông HD"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Khẩu Hiệu / Slogan</label>
                          <input
                            type="text"
                            value={settings.slogan || ''}
                            onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                            className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                            placeholder="Gói Trọn Yêu Thương, Gửi Hơi Ấm Mùa Thu"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KHỐI 2: BANNER CHÍNH TRANG CHỦ (HERO BANNER) */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE0D5] shadow-sm">
                  <div className="border-b border-[#EAE0D5] pb-3 mb-6">
                    <h3 className="text-sm font-extrabold text-[#6B4226] uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#D47343]" />
                      <span>2. Banner Bìa Trang Chủ (Hero Banner)</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Ảnh bìa lớn chào đón khách hàng ngay đầu Trang Chủ khi truy cập website
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Banner Preview */}
                    <div className="relative rounded-3xl overflow-hidden border-2 border-[#EAE0D5] bg-[#FAF4EB] shadow-md group">
                      <div className="aspect-[16/9] sm:aspect-[21/9] max-h-64 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={settings.heroBanner || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80'}
                          alt="Banner Hero Preview"
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                      </div>

                      {/* Mock Overlay Badge */}
                      <div className="absolute top-3 right-3 bg-[#D47343] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 pointer-events-none">
                        <span>🔥</span>
                        <span>Xem trước vị trí Banner Trang Chủ</span>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-xl text-[10px] font-medium pointer-events-none">
                        Tỉ lệ khuyến nghị: 16:9 hoặc ảnh ngang độ phân giải cao
                      </div>
                    </div>

                    {/* Inputs */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Tải ảnh Banner từ máy tính hoặc dán link ảnh
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Dán link ảnh Banner (https://...)"
                          value={settings.heroBanner || ''}
                          onChange={(e) => setSettings({ ...settings, heroBanner: e.target.value })}
                          className="flex-1 bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2.5 px-3.5 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                        />

                        <label className="flex items-center justify-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold px-4 py-2.5 rounded-2xl border border-[#EAE0D5] cursor-pointer transition shrink-0 text-xs">
                          <Upload className="w-4 h-4 text-[#D47343]" />
                          <span>Tải Banner từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 15 * 1024 * 1024) {
                                  alert('Ảnh quá lớn (vui lòng chọn ảnh < 15MB)');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setSettings(prev => ({ ...prev, heroBanner: event.target.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Presets & Reset */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="text-[11px] font-bold text-gray-600 block mb-1.5">
                          Chọn nhanh mẫu banner mùa thu chất lượng cao:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: '🍂 BST Mùa Thu Ấm Áp', url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1200&q=80' },
                            { label: '🎁 Hộp Quà Kraft & Thiệp Tay', url: 'https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=1200&q=80' },
                            { label: '🧸 Căn Phòng Gấu Êm Ái', url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=1200&q=80' },
                            { label: '🎃 Bí Ngô Len & Gấu Nâu', url: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=1200&q=80' }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSettings({ ...settings, heroBanner: preset.url })}
                              className="px-2.5 py-1 bg-[#FAF4EB] hover:bg-[#F3E8D8] border border-[#EAE0D5] rounded-xl text-[11px] font-semibold text-[#6B4226] transition"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          heroBanner: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80'
                        })}
                        className="text-xs font-bold text-gray-600 hover:text-[#D47343] underline transition self-start sm:self-auto"
                      >
                        Khôi phục ảnh gốc ban đầu
                      </button>
                    </div>
                  </div>
                </div>

                {/* KHỐI 3: DÒNG CHỮ BANNER ĐẦU TRANG & BANNER PHỤ */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE0D5] shadow-sm">
                  <div className="border-b border-[#EAE0D5] pb-3 mb-6">
                    <h3 className="text-sm font-extrabold text-[#6B4226] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D47343]" />
                      <span>3. Thanh Banner Thông Báo & Banner Đăng Nhập</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Dải thông báo khuyến mãi chạy ở đầu trang web và banner minh hoạ ở khung đăng nhập
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Top Banner Text */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          Dòng Chữ Banner Đầu Trang (Top Announcement Bar)
                        </label>
                        <span className="text-[10px] text-gray-400">Hiển thị ở dải cam trên cùng</span>
                      </div>
                      <textarea
                        rows={2}
                        value={settings.topBanner ?? ''}
                        onChange={(e) => setSettings({ ...settings, topBanner: e.target.value })}
                        placeholder="✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k"
                        className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                      />
                      <div className="mt-1.5 p-2 bg-[#C25E2E] text-white rounded-xl text-center text-xs font-semibold shadow-xs">
                        {settings.topBanner || '✨ BST Mùa Thu 2024: Tặng miễn phí thiệp viết tay vintage & Hộp quà Kraft cho đơn từ 299k'}
                      </div>
                    </div>

                    {/* Auth Banner */}
                    <div className="pt-2 border-t border-[#EAE0D5]">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Banner Khung Đăng Nhập / Đăng Ký (Auth Banner)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Link ảnh minh hoạ đăng nhập (để trống để dùng ảnh mặc định)"
                          value={settings.authBanner || ''}
                          onChange={(e) => setSettings({ ...settings, authBanner: e.target.value })}
                          className="flex-1 bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                        />
                        <label className="flex items-center justify-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold px-3.5 py-2 rounded-2xl border border-[#EAE0D5] cursor-pointer transition shrink-0 text-xs">
                          <Upload className="w-3.5 h-3.5 text-[#D47343]" />
                          <span>Tải từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setSettings(prev => ({ ...prev, authBanner: event.target.result }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {settings.authBanner && (
                        <div className="flex items-center gap-3 p-2 bg-[#FAF4EB] rounded-2xl border border-[#EAE0D5]">
                          <img
                            src={settings.authBanner}
                            alt="Auth banner preview"
                            className="w-16 h-10 rounded-lg object-cover border border-[#EAE0D5]"
                          />
                          <p className="text-[11px] text-gray-600 truncate flex-1">Ảnh banner đăng nhập tùy chỉnh</p>
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, authBanner: '' })}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* KHỐI 4: THÔNG TIN LIÊN HỆ & VẬN CHUYỂN */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE0D5] shadow-sm">
                  <div className="border-b border-[#EAE0D5] pb-3 mb-6">
                    <h3 className="text-sm font-extrabold text-[#6B4226] uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#D47343]" />
                      <span>4. Thông Tin Liên Hệ & Miễn Phí Vận Chuyển</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Hotline, email, địa chỉ tiệm và ngưỡng được tặng phí ship
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Hotline Hỗ Trợ Khách Hàng</label>
                        <input
                          type="text"
                          value={settings.hotline || ''}
                          onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                          className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Email Liên Hệ</label>
                        <input
                          type="email"
                          value={settings.email || ''}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Địa Chỉ Tiệm Cửa Hàng</label>
                      <input
                        type="text"
                        value={settings.address || ''}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Mức Tiền Đạt Miễn Phí Vận Chuyển (VNĐ)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold || 299000}
                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                      />
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="bg-white p-5 rounded-3xl border border-[#EAE0D5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Mọi thay đổi sẽ được lưu an toàn vào cơ sở dữ liệu SQLite 3</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onBackToStore}
                      className="flex-1 sm:flex-none bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] px-5 py-2.5 rounded-2xl text-xs font-bold transition border border-[#EAE0D5]"
                    >
                      Quay Về Cửa Hàng
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="flex-1 sm:flex-none bg-[#D47343] hover:bg-[#B85C2E] text-white px-7 py-2.5 rounded-2xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSavingSettings ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>Lưu Cài Đặt Tiệm</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ======================= MODAL: CREATE / EDIT PRODUCT ======================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#EAE0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D5] mb-5">
              <h2 className="text-base font-bold text-[#6B4226]">
                {editingProduct ? 'Chỉnh Sửa Bé Gấu' : 'Thêm Bé Gấu Mới Vào Tiệm'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Tên Bé Gấu Bông *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gấu Teddy Mùa Thu Áo Len..."
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Danh Mục</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Số Lượng Tồn Kho</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Giá Bán (VNĐ) *</label>
                  <input
                    type="number"
                    placeholder="320000"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Giá Gốc / Giá Cũ (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="380000"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Nhãn Tag (Best Seller, Hot Trend, Mới Về...)</label>
                <div className="flex gap-2">
                  {['Best Seller', 'Hot Trend', 'Mới Về', 'Phiên bản giới hạn'].map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setProductForm({ ...productForm, tag: t })}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition ${
                        productForm.tag === t
                          ? 'bg-[#D47343] text-white border-[#D47343]'
                          : 'bg-[#FAF4EB] text-gray-600 border-[#EAE0D5]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Hình Ảnh Sản Phẩm Bé Gấu *</label>
                
                {/* Upload từ máy hoặc nhập URL */}
                <div className="space-y-2 mb-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Dán link ảnh hoặc chọn tệp từ máy tính..."
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="flex-1 bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                    />
                    <label className="flex items-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold px-3.5 py-2 rounded-2xl border border-[#EAE0D5] cursor-pointer transition shrink-0">
                      <Upload className="w-4 h-4 text-[#D47343]" />
                      <span>Chọn ảnh từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 8 * 1024 * 1024) {
                              alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setProductForm(prev => ({ ...prev, image: event.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  {productForm.image && (
                    <div className="flex items-center gap-3 p-2 bg-[#FAF4EB] rounded-2xl border border-[#EAE0D5]">
                      <img
                        src={productForm.image}
                        alt="Preview bé gấu"
                        className="w-14 h-14 rounded-xl object-cover border border-[#EAE0D5] shadow-xs shrink-0"
                      />
                      <div className="overflow-hidden flex-1">
                        <p className="text-[11px] font-bold text-[#6B4226]">Ảnh xem trước</p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {productForm.image.startsWith('data:') ? 'Ảnh đã tải từ máy tính của bạn' : productForm.image}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                        className="text-rose-500 hover:text-rose-700 text-[11px] font-bold px-2 py-1"
                      >
                        Gỡ ảnh
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">Hoặc chọn nhanh ảnh mẫu có sẵn:</div>
                <div className="flex flex-wrap gap-2">
                  {plushiePresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="flex items-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] border border-[#EAE0D5] rounded-xl px-2.5 py-1 text-[10px] font-bold text-[#6B4226] transition cursor-pointer"
                    >
                      <img src={preset.url} className="w-4 h-4 rounded-full object-cover" alt="" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Mô Tả Bé Gấu</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-medium focus:outline-none focus:border-[#D47343]"
                />
              </div>

              <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE0D5] font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl font-bold shadow-md transition"
                >
                  {editingProduct ? 'Cập Nhật Bé Gấu' : 'Thêm Vào Tiệm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: VIEW ORDER DETAIL ======================= */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#EAE0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D5] mb-5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Chi Tiết Đơn Hàng</span>
                <h2 className="text-lg font-black text-[#D47343] flex items-center gap-2">
                  <span>{selectedOrder.id}</span>
                  {getStatusBadge(selectedOrder.status)}
                </h2>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              {/* Customer Info Card */}
              <div className="bg-[#FAF4EB] p-4 rounded-2xl border border-[#EAE0D5] grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Khách Hàng</p>
                  <p className="font-bold text-sm text-[#6B4226] mt-0.5">{selectedOrder.customerName}</p>
                  <p className="text-gray-600 font-medium">{selectedOrder.customerPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Địa Chỉ Giao</p>
                  <p className="font-medium text-gray-700 mt-0.5">{selectedOrder.customerAddress}</p>
                  <p className="text-[11px] text-[#D47343] font-bold mt-1">🚚 {selectedOrder.shippingMethod}</p>
                </div>
              </div>

              {/* Special Handwritten Card Message */}
              {selectedOrder.giftCardMessage && (
                <div
                  className="bg-[#FFFDF9] border-2 border-[#E8DACB] rounded-2xl p-5 relative"
                  style={{ backgroundImage: 'radial-gradient(#E8DACB 0.75px, transparent 0.75px)', backgroundSize: '16px 16px' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#D47343] uppercase tracking-wider flex items-center gap-1">
                      💌 Lời chúc viết tay trên thiệp Kraft:
                    </span>
                    <span className="text-[10px] text-gray-400 italic">Phong cách Vintage</span>
                  </div>
                  <p className="font-handwriting text-2xl text-[#6B4226] leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-[#EAE0D5]">
                    "{selectedOrder.giftCardMessage}"
                  </p>
                  <div className="mt-2 text-[11px] text-gray-500 font-medium">
                    Đóng gói: <strong>{selectedOrder.packagingOption}</strong>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div>
                <h3 className="font-bold text-gray-500 uppercase text-[10px] mb-3">Sản Phẩm Trong Đơn</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF4EB]/60 border border-[#EAE0D5]">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-xl object-cover border border-[#EAE0D5]" />
                        <div>
                          <p className="font-bold text-[#6B4226] text-xs">{it.productName}</p>
                          <p className="text-[11px] text-gray-500">{formatMoney(it.price)} x {it.quantity}</p>
                        </div>
                      </div>
                      <div className="font-bold text-[#D47343]">
                        {formatMoney(it.price * (it.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE0D5] flex justify-between items-center text-sm font-bold">
                  <span>Tổng Thanh Toán:</span>
                  <span className="text-lg text-[#D47343]">{formatMoney(selectedOrder.totalAmount)}</span>
                </div>
                <div className="text-right text-[11px] text-gray-400 mt-0.5">
                  Phương thức: {selectedOrder.paymentMethod}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="pt-4 border-t border-[#EAE0D5]">
                <p className="font-bold text-gray-600 mb-2">Chuyển Trạng Thái Đơn Hàng:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'pending')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedOrder.status === 'pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Chờ xác nhận
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedOrder.status === 'processing'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                    }`}
                  >
                    Đang chuẩn bị & viết thiệp
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipping')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedOrder.status === 'shipping'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                    }`}
                  >
                    Đang giao hàng
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Đã hoàn thành
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#EAE0D5] flex items-center justify-between">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Xóa Đơn Hàng Này
                </button>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#6B4226] font-bold px-5 py-2 rounded-xl border border-[#EAE0D5]"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================= MODAL: CREATE VOUCHER ======================= */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE0D5]">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D5] mb-5">
              <h2 className="text-base font-bold text-[#6B4226] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#D47343]" /> Tạo Mã Giảm Giá Mới
              </h2>
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoucher} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Mã Voucher (Code) *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: MUATHU50K"
                  value={voucherForm.code}
                  onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-black text-[#D47343] focus:outline-none focus:border-[#D47343] uppercase tracking-wider"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Mức Giảm Giá (VNĐ) *</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={voucherForm.discount}
                    onChange={(e) => setVoucherForm({ ...voucherForm, discount: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Đơn Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="250000"
                    value={voucherForm.minOrder}
                    onChange={(e) => setVoucherForm({ ...voucherForm, minOrder: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Số Lượng Giới Hạn</label>
                  <input
                    type="number"
                    value={voucherForm.maxUsage}
                    onChange={(e) => setVoucherForm({ ...voucherForm, maxUsage: Number(e.target.value) })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Hạn Sử Dụng</label>
                  <input
                    type="date"
                    value={voucherForm.expiresAt}
                    onChange={(e) => setVoucherForm({ ...voucherForm, expiresAt: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Mô Tả Ưu Đãi</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giảm 50k cho đơn từ 250k dịp se lạnh"
                  value={voucherForm.description}
                  onChange={(e) => setVoucherForm({ ...voucherForm, description: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-medium focus:outline-none focus:border-[#D47343]"
                />
              </div>

              <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE0D5] font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl font-bold shadow-md transition"
                >
                  Tạo Mã Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: CREATE / EDIT USER ======================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#EAE0D5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE0D5] mb-5">
              <h2 className="text-base font-bold text-[#6B4226] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#D47343]" />
                <span>{editingUser ? 'Sửa Tài Khoản Khách Hàng' : 'Thêm Tài Khoản Khách Hàng'}</span>
              </h2>
              <button
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              {/* Ảnh đại diện User */}
              <div>
                <label className="block font-bold text-gray-600 mb-1">Ảnh Đại Diện Tài Khoản</label>
                <div className="flex items-center gap-3">
                  <img
                    src={userForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt="User preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D47343] shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="Nhập URL ảnh đại diện..."
                      value={userForm.avatar}
                      onChange={(e) => setUserForm({ ...userForm, avatar: e.target.value })}
                      className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-xl py-1.5 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                    />
                    <label className="inline-flex items-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold px-3 py-1.5 rounded-xl border border-[#EAE0D5] cursor-pointer transition text-[11px]">
                      <Upload className="w-3.5 h-3.5 text-[#D47343]" />
                      <span>Chọn ảnh từ máy tính</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 8 * 1024 * 1024) {
                              alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setUserForm(prev => ({ ...prev, avatar: event.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Họ Tên Khách Hàng *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Lê Thảo Nhi"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Số Điện Thoại</label>
                  <input
                    type="tel"
                    placeholder="0912345678"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="thaonhi@gmail.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Hạng Thành Viên</label>
                  <select
                    value={userForm.memberTier}
                    onChange={(e) => setUserForm({ ...userForm, memberTier: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  >
                    <option value="Thành viên Mùa Thu 🍂">Thành viên Mùa Thu 🍂</option>
                    <option value="Khách Thân Thiết 🧸">Khách Thân Thiết 🧸</option>
                    <option value="Thành viên Vàng 🌟">Thành viên Vàng 🌟</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Số Xu Thưởng</label>
                  <input
                    type="number"
                    value={userForm.loyaltyCoins}
                    onChange={(e) => setUserForm({ ...userForm, loyaltyCoins: Number(e.target.value) })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#EAE0D5] font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl font-bold shadow-md transition cursor-pointer"
                >
                  {editingUser ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT ARTICLE ================= */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full border border-[#EAE0D5] shadow-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EAE0D5]">
              <h3 className="font-bold text-base text-[#6B4226] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D47343]" />
                <span>{editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</span>
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-600 mb-1">Tiêu Đề Bài Viết *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bí quyết giặt & chăm sóc gấu bông luôn thơm mềm"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2.5 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Danh Mục</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  >
                    <option value="Mẹo Chăm Sóc">Mẹo Chăm Sóc</option>
                    <option value="Gợi Ý Quà Tặng">Gợi Ý Quà Tặng</option>
                    <option value="Hậu Trường Tiệm">Hậu Trường Tiệm</option>
                    <option value="Cẩm Nang Mua Sắm">Cẩm Nang Mua Sắm</option>
                    <option value="Bộ Sưu Tập Mới">Bộ Sưu Tập Mới</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Tác Giả</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="Tiệm Trưởng HD"
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Thời Gian Đọc</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="4 phút đọc"
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Ảnh Bìa Bài Viết (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={articleForm.image}
                  onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                />
                {articleForm.image && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-[#EAE0D5]">
                    <img src={articleForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Đoạn Tóm Tắt Ngắn *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Tóm tắt ngắn gọn 1-2 câu để thu hút người đọc..."
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl p-3 font-semibold focus:outline-none focus:border-[#D47343]"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-gray-600 mb-1">Nội Dung Chi Tiết (Cách nhau bằng dòng trống)</label>
                <textarea
                  rows="6"
                  placeholder="Nhập nội dung các đoạn của bài viết..."
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl p-3 font-semibold focus:outline-none focus:border-[#D47343]"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-bold text-gray-600 mb-1">Thẻ / Tags (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Chăm sóc gấu, Vệ sinh, Mẹo hay"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343]"
                  />
                </div>
                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={articleForm.featured}
                      onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                      className="rounded border-[#EAE0D5] text-[#D47343] focus:ring-[#D47343] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-[#6B4226]">Đặt làm bài viết Nổi bật trên đầu trang</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE0D5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#EAE0D5] font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl font-bold shadow-md transition cursor-pointer"
                >
                  {editingArticle ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ĐỔI ẢNH ĐẠI DIỆN ADMIN / TÀI KHOẢN ĐANG ĐĂNG NHẬP ================= */}
      {isMyAvatarModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE0D5] text-center relative">
            <button
              onClick={() => setIsMyAvatarModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-base text-[#6B4226] mb-1">Cập Nhật Ảnh Đại Diện</h3>
            <p className="text-xs text-[#6B4226]/70 mb-5">
              Đổi ảnh đại diện cho tài khoản quản trị của bạn
            </p>

            <div className="flex justify-center mb-4">
              <img
                src={myAvatarUrl || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt="My Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border-3 border-[#D47343] shadow-md"
              />
            </div>

            <div className="space-y-3 mb-5 text-left">
              <label className="flex items-center justify-center gap-2 bg-[#FAF4EB] hover:bg-[#F3E8D8] text-[#7A3E1D] font-bold py-2.5 px-4 rounded-2xl border border-[#EAE0D5] cursor-pointer transition text-xs">
                <Upload className="w-4 h-4 text-[#D47343]" />
                <span>Chọn ảnh từ máy tính</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 8 * 1024 * 1024) {
                        alert('Ảnh quá lớn (vui lòng chọn ảnh < 8MB)');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setMyAvatarUrl(event.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <div>
                <span className="block text-[11px] font-bold text-gray-500 mb-1">Hoặc dán URL ảnh:</span>
                <input
                  type="text"
                  placeholder="https://..."
                  value={myAvatarUrl}
                  onChange={(e) => setMyAvatarUrl(e.target.value)}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-[#D47343]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE0D5]">
              <button
                type="button"
                onClick={() => setIsMyAvatarModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#EAE0D5] text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleSaveMyAvatar(myAvatarUrl)}
                className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
