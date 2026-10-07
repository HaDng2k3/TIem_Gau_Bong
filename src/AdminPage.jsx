import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
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
  X
} from 'lucide-react';
import * as api from './services/api';

export default function AdminPage({ onBackToStore }) {
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

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
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

        const [statsData, prodsData, ordersData, catsData, settingsData] = await Promise.all([
          api.getStats(),
          api.getProducts(),
          api.getOrders(),
          api.getCategories(),
          api.getSettings()
        ]);

        setStats(statsData);
        setProducts(prodsData);
        setOrders(ordersData);
        setCategories(catsData);
        setSettings(settingsData);
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
    e.preventDefault();
    try {
      await api.updateSettings(settings);
      alert('Đã lưu cấu hình cửa hàng thành công!');
      handleRefresh();
    } catch {
      alert('Lỗi khi lưu cấu hình');
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
          <div>
            <h1 className="text-lg font-black text-[#D47343] flex items-center gap-2">
              <span>Tiệm Gấu Bông HD</span>
              <span className="bg-[#6B4226] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Backend Portal
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Server status indicator */}
          <div className="flex items-center gap-2 bg-[#FAF4EB] px-3 py-1.5 rounded-full border border-[#EAE0D5] text-xs font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>
              {serverOnline ? 'Express API (Port 5000)' : 'Chế độ Local DB (Offline)'}
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
            <div className="w-8 h-8 rounded-full bg-[#D47343] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold leading-tight">Admin Quản Trị</p>
              <p className="text-[10px] text-gray-500">Chủ tiệm gấu bông</p>
            </div>
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
              <span>🧸 Tiệm Gấu Bông HD</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">Thủ công với từng đường may mềm mại & thiệp tay ấm áp.</p>
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

          {/* ======================= TAB 5: GIFT CARDS & MESSAGES ======================= */}
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
            <div className="bg-white p-8 rounded-3xl border border-[#EAE0D5] shadow-sm max-w-2xl">
              <h2 className="text-base font-bold text-[#6B4226] mb-1">Cài Đặt Cửa Hàng</h2>
              <p className="text-xs text-gray-500 mb-6">Thông tin này sẽ được cập nhật đồng bộ ra toàn bộ giao diện website</p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Tên Tiệm Gấu Bông</label>
                  <input
                    type="text"
                    value={settings.shopName || ''}
                    onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Khẩu Hiệu / Slogan</label>
                  <input
                    type="text"
                    value={settings.slogan || ''}
                    onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Hotline Hỗ Trợ</label>
                    <input
                      type="text"
                      value={settings.hotline || ''}
                      onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                      className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Địa Chỉ Tiệm</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#D47343]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Dòng Chữ Banner Đầu Trang</label>
                  <textarea
                    rows={2}
                    value={settings.topBanner || ''}
                    onChange={(e) => setSettings({ ...settings, topBanner: e.target.value })}
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

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-[#D47343] hover:bg-[#B85C2E] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Lưu Cài Đặt Tiệm
                  </button>
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
                <label className="block font-bold text-gray-600 mb-1">Đường Dẫn Hình Ảnh (URL)</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-[#FAF4EB] border border-[#EAE0D5] rounded-2xl py-2 px-3 font-semibold focus:outline-none focus:border-[#D47343] mb-2"
                />

                <div className="text-[11px] font-semibold text-gray-500 mb-1.5">Hoặc chọn ảnh mẫu gấu bông đẹp có sẵn:</div>
                <div className="flex flex-wrap gap-2">
                  {plushiePresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setProductForm({ ...productForm, image: preset.url })}
                      className="flex items-center gap-1.5 bg-[#FAF4EB] hover:bg-[#F3E8D8] border border-[#EAE0D5] rounded-xl px-2.5 py-1 text-[10px] font-bold text-[#6B4226] transition"
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
    </div>
  );
}
