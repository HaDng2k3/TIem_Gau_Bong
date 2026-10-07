# 🧸 Tiệm Gấu Bông HD - Hệ Thống Fullstack & Trang Quản Trị Backend

Hệ thống website thương mại điện tử chuyên bán gấu bông thủ công, quà tặng vintage và thiệp viết tay kèm **Trang Quản Trị (Admin Dashboard)** và **Server REST API Backend (Node.js & Express)**.

---

## 🌟 1. Cấu Trúc Hệ Thống

Dự án gồm 2 phần được kết nối chặt chẽ và hoạt động mượt mà:
1. **Frontend Client & Trang Quản Trị (React 19 + Tailwind CSS + Lucide Icons)**:
   - Giao diện người mua hàng (Storefront: Trang chủ, BST Mùa Thu, Giỏ hàng, Đặt gấu kèm thiệp viết tay).
   - **Trang Quản Trị Backend Portal (Admin Dashboard)**: Quản lý toàn diện cửa hàng (sản phẩm, đơn hàng, danh mục, lời chúc thiệp tay, cài đặt tiệm).
   - Tự động fallback dữ liệu mượt mà qua LocalStorage nếu chạy ở chế độ offline.
2. **Server Backend API (Node.js + Express + JSON DB)**:
   - Chạy tại port `5000`.
   - Cung cấp đầy đủ REST API CRUD (Sản phẩm, Đơn hàng, Thống kê doanh thu, Cài đặt).
   - Cơ sở dữ liệu nhẹ, bền vững tại `server/data/db.json`.

---

## 🚀 2. Hướng Dẫn Khởi Chạy

Mở terminal tại thư mục `tiem-gau-bong`:

### Bước 1: Khởi động Server Backend API (Terminal 1)
```bash
npm run server
```
> Server sẽ chạy tại: `http://localhost:5000`

### Bước 2: Khởi động Frontend Website (Terminal 2)
```bash
npm run dev
```
> Mở trình duyệt tại đường dẫn hiển thị (mặc định: `http://localhost:5173`)

---

## ⚙️ 3. Các Tính Năng Của Trang Quản Trị (Backend Admin Portal)

Để mở trang quản trị:
- Nhấp vào nút **`⚙️ Quản Trị Backend`** trên thanh Header của website.
- Hoặc bấm vào biểu tượng **Tài khoản (User)** / liên kết ở phần Footer.

Các chức năng chính trong Trang Quản Trị:
1. **📊 Tổng Quan (Dashboard Overview)**:
   - 4 thẻ KPI: Doanh thu thực tế, Tổng đơn hàng & đơn chờ duyệt, Tồn kho, Cảnh báo gấu sắp hết hàng (<= 5 bé).
   - Biểu đồ trực quan doanh thu 7 ngày trong tuần.
   - Bảng đơn hàng mới nhất cần xác nhận ngay.
   - Top 4 bé gấu bán chạy nhất của tiệm.
2. **🧸 Quản Lý Sản Phẩm (Products CRUD)**:
   - Xem danh sách gấu bông với ảnh thumbnail, giá bán, giá cũ, tồn kho, nhãn tag.
   - Bộ lọc theo danh mục, trạng thái tồn kho và thanh tìm kiếm nhanh.
   - **Thêm bé gấu mới**: Form nhập chi tiết kèm danh sách ảnh mẫu gấu bông đẹp có sẵn.
   - **Chỉnh sửa** và **Xóa** bé gấu khỏi cửa hàng.
3. **📦 Quản Lý Đơn Hàng (Orders Management)**:
   - Lọc đơn theo trạng thái: *Chờ xác nhận*, *Đang chuẩn bị & viết thiệp*, *Đang giao hỏa tốc*, *Đã giao thành công*, *Đã hủy*.
   - Chuyển trạng thái đơn hàng 1-click (Duyệt đơn, Giao hàng, Hoàn thành).
   - **Chi Tiết Đơn Hàng**: Xem thông tin khách, địa chỉ, số điện thoại, phương thức thanh toán.
   - **ĐẶC BIỆT - Khung Thiệp Viết Tay Vintage**: Xem lời nhắn nhủ viết tay nét chữ cổ điển của khách hàng gửi cho người thương.
4. **🏷️ Danh Mục (Categories)**:
   - Thêm nhóm gấu mới, quản lý số lượng bé gấu thuộc từng nhóm.
5. **💌 Góc Thiệp Viết Tay & Lời Chúc (Gift Cards)**:
   - Nơi tập hợp tất cả lời chúc gửi gắm của khách hàng để tiệm nắn nót viết tay bằng mực nâu.
6. **⚙️ Cài Đặt Cửa Hàng (Settings)**:
   - Tên tiệm, slogan, hotline, địa chỉ, mức freeship, banner thông báo đầu trang.

---

## 📡 4. Danh Sách REST API Endpoints

| Phương thức | Endpoint | Mô tả |
|------------|---------|-------|
| `GET` | `/api/health` | Kiểm tra tình trạng server |
| `GET` | `/api/stats` | Lấy dữ liệu thống kê, doanh thu, biểu đồ |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ filter category, search, stockStatus) |
| `GET` | `/api/products/:id` | Lấy chi tiết 1 sản phẩm |
| `POST` | `/api/products` | Thêm sản phẩm mới |
| `PUT` | `/api/products/:id` | Cập nhật thông tin sản phẩm |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm |
| `GET` | `/api/orders` | Lấy danh sách đơn hàng (hỗ trợ filter status, search) |
| `POST` | `/api/orders` | Đặt đơn hàng mới (tự động trừ tồn kho) |
| `PUT` | `/api/orders/:id/status` | Cập nhật trạng thái đơn hàng |
| `DELETE` | `/api/orders/:id` | Xóa đơn hàng |
| `GET` | `/api/categories` | Lấy danh sách danh mục |
| `POST` | `/api/categories` | Thêm danh mục mới |
| `DELETE` | `/api/categories/:id` | Xóa danh mục |
| `GET` | `/api/settings` | Lấy cấu hình tiệm |
| `PUT` | `/api/settings` | Cập nhật cấu hình tiệm |
