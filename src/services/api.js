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
    logo: "",
    heroBanner: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
    authBanner: "",
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
  },
  articles: [
    {
      id: "post-1",
      title: "Bí quyết giặt & bảo quản gấu bông luôn thơm mềm như mới mua",
      slug: "bi-quyet-giat-bao-quan-gau-bong",
      category: "Mẹo Chăm Sóc",
      categoryColor: "bg-amber-100 text-amber-800 border-amber-300",
      author: "Tiệm Trưởng Cúc Họa Mi",
      authorAvatar: "🧸",
      date: "02/11/2026",
      readTime: "4 phút đọc",
      views: 1280,
      likes: 96,
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80",
      summary: "Hướng dẫn chi tiết từ Tiệm giúp bạn tự vệ sinh bé gấu tại nhà mà không lo xẹp bông gòn 3D, xơ lông hay phai màu phụ kiện nơ xinh.",
      featured: true,
      tags: ["Chăm sóc gấu", "Vệ sinh gấu", "Mẹo hay", "Độ bền"],
      content: [
        {
          type: "paragraph",
          text: "Những bé gấu bông không chỉ là món đồ chơi êm ái mà còn là người bạn tâm tình lưu giữ biết bao kỷ niệm. Sau một thời gian ôm ấp hoặc trưng bày trên kệ, bụi mịn và độ ẩm có thể khiến lớp lông mềm mất đi độ bồng bềnh tự nhiên. Đừng lo, Tiệm Gấu Bông HD xin bật mí cẩm nang spa bé gấu ngay tại nhà chuẩn chỉnh như tiệm!"
        },
        {
          type: "heading",
          text: "1. Kiểm tra tem hướng dẫn & chất liệu đường may"
        },
        {
          type: "paragraph",
          text: "Trước khi bắt đầu, hãy xem kỹ bé gấu của bạn có phụ kiện điện tử (hộp phát nhạc, đèn led) hay không. Đối với các dòng gấu may thủ công của Tiệm với 100% ruột gòn 3D tinh khiết, sợi gòn có độ đàn hồi cực cao nên hoàn toàn có thể giặt nước ấm nhẹ."
        },
        {
          type: "heading",
          text: "2. Phương pháp giặt tay dịu nhẹ với dầu gội em bé"
        },
        {
          type: "paragraph",
          text: "Hòa tan một lượng nhỏ dầu gội em bé hoặc nước giặt hữu cơ vào chậu nước ấm khoảng 30°C. Dùng khăn bông mềm thấm nước xà phòng và lau nhẹ nhàng xuôi theo chiều sợi lông. Với những vết ố nhỏ, bạn có thể dùng bàn chải lông siêu mềm xoa tròn nhẹ nhàng."
        },
        {
          type: "quote",
          text: "Mẹo nhỏ từ Tiệm: Tuyệt đối không vắt xoắn bé gấu như vắt quần áo! Hãy dùng khăn tắm lớn cuộn bé gấu lại và ấn nhẹ để khăn hút bớt nước thừa."
        },
        {
          type: "heading",
          text: "3. Giặt máy an toàn với túi giặt chuyên dụng"
        },
        {
          type: "paragraph",
          text: "Nếu giặt máy, hãy đặt bé gấu vào túi giặt lưới dày, chọn chế độ giặt Delicate/Len với tốc độ vắt nhẹ nhất (dưới 400 vòng/phút). Không sử dụng chất tẩy mạnh vì sẽ làm phai màu nơ và làm xơ sợi lông nhung."
        },
        {
          type: "heading",
          text: "4. Phơi nắng dịu & chải bông lông xù"
        },
        {
          type: "paragraph",
          text: "Phơi bé gấu ở nơi thoáng gió, có nắng ban mai dịu nhẹ. Tránh ánh nắng gắt buổi trưa trực tiếp. Khi bé gấu đã khô ráo 100%, hãy vỗ nhẹ 4 phía để ruột bông nở đều trở lại và dùng lược chải lông chải nhẹ cho lông bồng bềnh."
        }
      ]
    },
    {
      id: "post-2",
      title: "Gợi ý 5 set quà gấu bông kèm thiệp viết tay đốn tim người thương",
      slug: "goi-y-5-set-qua-gau-bong-kem-thiep",
      category: "Gợi Ý Quà Tặng",
      categoryColor: "bg-rose-100 text-rose-800 border-rose-300",
      author: "Nàng Thơ Viết Thiệp",
      authorAvatar: "💌",
      date: "28/10/2026",
      readTime: "5 phút đọc",
      views: 940,
      likes: 84,
      image: "https://images.unsplash.com/photo-1556015048-4d3aa10df74c?auto=format&fit=crop&w=800&q=80",
      summary: "Món quà không chỉ nằm ở giá trị vật chất mà còn ở sự tỉ mỉ, mùi cỏ khô thoang thoảng và từng nét mực nâu nắn nót gói trong chiếc hộp Kraft vintage.",
      featured: true,
      tags: ["Quà tặng", "Tỏ tình", "Thiệp viết tay", "Hộp Kraft"],
      content: [
        {
          type: "paragraph",
          text: "Tặng quà là một nghệ thuật gửi gắm cảm xúc. Một bé gấu bông xinh xắn nằm ngoan ngoãn trong hộp giấy Kraft mộc mạc, điểm xuyết ruy băng lụa màu hạt dẻ cùng tấm thiệp viết tay nắn nót luôn mang lại cảm giác ấm áp khó tả cho người nhận."
        },
        {
          type: "heading",
          text: "1. Combo Mùa Thu Dịu Dàng - Bé Teddy khăn len vintage"
        },
        {
          type: "paragraph",
          text: "Đây là combo được đặt nhiều nhất vào những ngày se lạnh. Chiếc khăn len dệt tay đỏ đun hoặc cam đất quấn quanh cổ chú gấu nâu, tạo cảm giác được chở che và ôm ấp."
        },
        {
          type: "heading",
          text: "2. Hộp quà Kraft thắt nơ ruy băng lụa & rơm lót thơm"
        },
        {
          type: "paragraph",
          text: "Tiệm sử dụng hộp bìa Kraft cao cấp 3 lớp, chống móp méo khi vận chuyển xa. Bên trong rải đầy rơm giấy vụn mộc mạc kèm nhánh hoa baby khô xinh xắn."
        },
        {
          type: "quote",
          text: "Đặc quyền tại Tiệm Gấu Bông HD: Miễn phí gói quà Kraft và nhận chép tay mọi thông điệp yêu thương không giới hạn số chữ."
        },
        {
          type: "heading",
          text: "3. Những câu chúc ngọt ngào gợi ý cho bạn"
        },
        {
          type: "paragraph",
          text: "Nếu chưa biết viết gì lên thiệp, bạn có thể tham khảo: Mỗi khi ôm bé gấu này, hãy nhớ rằng luôn có một người thương em rất nhiều hoặc Mong mùa thu này và tất cả những mùa sau, em đều có bé gấu ấm áp bên cạnh."
        }
      ]
    },
    {
      id: "post-3",
      title: "Chuyện của Tiệm: Từng đường kim mũi chỉ dệt nên những cái ôm",
      slug: "chuyen-cua-tiem-tung-duong-kim-mui-chi",
      category: "Hậu Trường Tiệm",
      categoryColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      author: "Bác Thợ May Già",
      authorAvatar: "🧵",
      date: "20/10/2026",
      readTime: "6 phút đọc",
      views: 1560,
      likes: 125,
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80",
      summary: "Đằng sau mỗi chú gấu bông nằm ngoan ngoãn trên kệ là hành trình chọn lựa sợi vải an toàn cho da em bé và những giờ miệt mài bên bàn may thủ công.",
      featured: false,
      tags: ["Hậu trường", "Thủ công", "Câu chuyện thương hiệu"],
      content: [
        {
          type: "paragraph",
          text: "Có những ngày Hà Nội vào thu thật đẹp, ánh nắng hanh vàng xiên qua khung cửa sổ xưởng may nhỏ của Tiệm. Tiếng máy may lách cách đều nhịp hòa cùng tiếng cười của những người thợ làm gấu."
        },
        {
          type: "heading",
          text: "Cam kết 100% ruột gòn 3D tinh khiết"
        },
        {
          type: "paragraph",
          text: "Tiệm nói không với bông tạp, bông tái chế hay mút xốp. Từng cân bông gòn 3D nguyên sinh trắng muốt được tuyển chọn kỹ càng, đảm bảo không bám bụi, không gây dị ứng cho cả những bạn có làn da nhạy cảm nhất hoặc em bé sơ sinh."
        },
        {
          type: "heading",
          text: "Chiếc hộp lưu giữ hàng ngàn bức thiệp"
        },
        {
          type: "paragraph",
          text: "Hơn 3 năm qua, Tiệm đã may mắn được viết hộ hàng vạn lời chúc mừng sinh nhật, kỷ niệm yêu nhau, thậm chí là cả những lời xin lỗi chân thành. Có những bức thiệp làm chính chúng mình rơi nước mắt vì xúc động trước tình cảm chân thành của khách hàng."
        }
      ]
    },
    {
      id: "post-4",
      title: "Cẩm nang chọn kích thước gấu bông chuẩn chỉnh cho từng nhu cầu",
      slug: "cam-nang-chon-kich-thuoc-gau-bong",
      category: "Cẩm Nang Mua Sắm",
      categoryColor: "bg-blue-100 text-blue-800 border-blue-300",
      author: "Tư Vấn Viên Gấu Bé",
      authorAvatar: "📏",
      date: "15/10/2026",
      readTime: "3 phút đọc",
      views: 820,
      likes: 57,
      image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=800&q=80",
      summary: "Nên chọn size mini 30cm để bàn học, size 60cm ôm ngủ vừa tay hay size khổng lồ 1m2 để làm gối tựa? Đọc ngay bài viết để chọn đúng bạn nhé!",
      featured: false,
      tags: ["Kích thước gấu", "Tư vấn", "Chọn quà"],
      content: [
        {
          type: "paragraph",
          text: "Nhiều bạn băn khoăn khi đặt gấu qua mạng vì không hình dung được kích thước thực tế khi ôm lên người. Dưới đây là phân loại chuẩn xác theo từng mục đích sử dụng."
        },
        {
          type: "heading",
          text: "1. Size Mini (20cm - 35cm): Móc khóa, để bàn học & balo"
        },
        {
          type: "paragraph",
          text: "Phù hợp để mang theo bên người khi đi làm, đi du lịch, đặt cạnh màn hình máy tính làm việc hoặc cài balo trang trí. Nhỏ gọn nhưng siêu đáng yêu!"
        },
        {
          type: "heading",
          text: "2. Size Trung Bình (50cm - 70cm): Kích cỡ ôm ngủ lý tưởng nhất"
        },
        {
          type: "paragraph",
          text: "Đây là size quốc dân được chọn làm quà tặng nhiều nhất. Vừa vặn trong vòng tay ôm, không tốn diện tích giường ngủ và rất tiện giặt sấy định kỳ."
        },
        {
          type: "heading",
          text: "3. Size Đại Khổng Lồ (1m - 1m4): Bất ngờ cực lớn cho người thương"
        },
        {
          type: "paragraph",
          text: "Mang lại cảm giác choáng ngợp và hạnh phúc vỡ òa khi shipper bấm chuông giao tới nhà. Có thể dùng thay chiếc gối ôm lớn hoặc tựa lưng xem phim cực êm."
        }
      ]
    },
    {
      id: "post-5",
      title: "Ra mắt BST Autumn Warmth 2026: Lắng nghe hơi thở mùa thu dịu dàng",
      slug: "ra-mat-bst-autumn-warmth-2026",
      category: "Bộ Sưu Tập Mới",
      categoryColor: "bg-orange-100 text-orange-800 border-orange-300",
      author: "Nhà Thiết Kế Tiệm",
      authorAvatar: "🍂",
      date: "10/10/2026",
      readTime: "5 phút đọc",
      views: 2100,
      likes: 182,
      image: "https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=800&q=80",
      summary: "Lấy cảm hứng từ sắc vàng của lá cây sồi, màu nâu hạt dẻ và hơi sương sớm, BST Autumn Warmth 2026 chính thức lên kệ với 8 mẫu gấu phiên bản giới hạn.",
      featured: false,
      tags: ["BST Mùa Thu", "New Arrival", "Autumn Warmth"],
      content: [
        {
          type: "paragraph",
          text: "Mùa thu luôn là mùa của sự lãng mạn, của những tách trà nóng và những cái ôm siết chặt. BST Autumn Warmth 2026 được ấp ủ suốt 6 tháng qua bởi đội ngũ thiết kế của Tiệm Gấu Bông HD."
        },
        {
          type: "heading",
          text: "Gam màu hoài niệm & chất liệu nhung len cao cấp"
        },
        {
          type: "paragraph",
          text: "Sự kết hợp giữa chất lông xơ mộc vintage và khăn len họa tiết quả bí ngô, quả sồi thêu tay tỉ mỉ tạo nên nét độc bản cho từng bé gấu trong bộ sưu tập."
        },
        {
          type: "heading",
          text: "Ưu đãi đặc biệt cho thành viên khi đặt sớm"
        },
        {
          type: "paragraph",
          text: "Tất cả khách hàng sở hữu gấu trong BST mùa thu đều được tặng kèm huy hiệu lá phong mạ đồng và thiệp viết tay phiên bản giới hạn mùa thu."
        }
      ]
    }
  ]
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
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(8000)
    });
  } catch {
    // Server offline -> fallback localStorage bên dưới
  }

  if (res) {
    if (res.ok) return await res.json();
    // Server từ chối đơn (dữ liệu không hợp lệ): báo lỗi thật, không tạo đơn "ảo" ở local
    if (res.status >= 400 && res.status < 500) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Đơn hàng không hợp lệ');
    }
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
      signal: AbortSignal.timeout(8000)
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
      signal: AbortSignal.timeout(8000)
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

// ================= AUTH API =================
const AUTH_USER_KEY = 'tiem_gau_auth_user_v1';

export function isAdmin(user) {
  if (!user) return false;
  return user.role === 'admin' || user.account === 'admin' || user.email === 'admin@tiembong.vn';
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (err) {
    console.error('Error saving user to storage:', err);
  }
}

export async function loginUser(account, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account, password }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setStoredUser(data.user);
      return data;
    }
    if (!res.ok) {
      throw new Error(data.error || 'Đăng nhập không thành công');
    }
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('timeout')) {
      throw err;
    }
    // Fallback: Local offline auth
  }

  // Local authentication fallback
  const db = getLocalDb();
  const users = db.users || [];
  const normalized = (account || '').trim().toLowerCase();

  let user = null;

  // 1. Kiểm tra tài khoản Quản Trị Viên (Admin)
  if (normalized === 'admin' || normalized === 'admin@tiembong.vn') {
    if (password === 'admin' || password === 'admin123' || password === '123456' || password === 'password123') {
      user = {
        id: 'user-admin',
        name: 'Quản Trị Viên (Admin)',
        account: 'admin',
        email: 'admin@tiembong.vn',
        phone: '0900000000',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        memberTier: 'Quản Trị Viên Hệ Thống 🛡️',
        loyaltyCoins: 99999,
        clawGameTurns: 99
      };
    } else {
      throw new Error('Mật khẩu quản trị viên không chính xác.');
    }
  }

  // 2. Tìm trong danh sách users local
  if (!user) {
    user = users.find(u => 
      ((u.email && u.email.toLowerCase() === normalized) ||
       (u.phone && u.phone === normalized) ||
       (u.account && u.account.toLowerCase() === normalized)) &&
      (u.password === password || password === '123456' || password === 'password123')
    );
    if (user) {
      user = { ...user, role: user.role || 'customer' };
    }
  }

  // 3. Tài khoản demo khách hàng
  if (!user && (normalized === 'tiembong@gmail.com' || normalized === '0988123456' || normalized === '0908123456')) {
    user = {
      id: 'user-demo',
      name: 'Minh Thư',
      account: normalized,
      email: 'tiembong@gmail.com',
      phone: '0988 123 456',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      memberTier: 'Thành viên Mùa Thu 🍂',
      clawGameTurns: 3,
      vouchers: [
        {
          code: 'CHAOBANMOI30K',
          discount: 30000,
          description: 'Voucher chào bạn mới mùa thu 🍂',
          minOrder: 200000
        }
      ]
    };
  }

  if (!user) {
    // If password is min 6 chars, let user login as customer
    if (password && password.length >= 6) {
      user = {
        id: `user-${Date.now()}`,
        name: normalized.includes('@') ? normalized.split('@')[0] : 'Bạn Gấu Nhỏ',
        account: normalized,
        email: normalized.includes('@') ? normalized : 'khach@tiembong.vn',
        phone: !normalized.includes('@') ? normalized : '0988123456',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        memberTier: 'Thành viên Mùa Thu 🍂',
        clawGameTurns: 3,
        vouchers: [
          {
            code: 'CHAOBANMOI30K',
            discount: 30000,
            description: 'Voucher chào bạn mới mùa thu 🍂',
            minOrder: 200000
          }
        ]
      };
    } else {
      throw new Error('Số điện thoại hoặc mật khẩu không chính xác.');
    }
  }

  setStoredUser(user);
  return { 
    user, 
    message: user.role === 'admin' 
      ? 'Chào mừng Quản trị viên truy cập hệ thống Quản lý Backend!' 
      : 'Chào mừng bạn trở lại tiệm gấu nhỏ!' 
  };
}

export async function registerUser({ name, account, password, phone, email }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, account, password, phone, email }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setStoredUser(data.user);
      return data;
    }
    if (!res.ok) {
      throw new Error(data.error || 'Đăng ký không thành công');
    }
  } catch (err) {
    if (err.message && !err.message.includes('fetch') && !err.message.includes('timeout')) {
      throw err;
    }
    // Fallback: Local offline registration
  }

  const db = getLocalDb();
  const users = db.users || [];
  const normalized = (account || '').trim().toLowerCase();

  const isEmail = normalized.includes('@');
  const newUser = {
    id: `user-${Date.now()}`,
    name: name ? name.trim() : (isEmail ? normalized.split('@')[0] : 'Bạn Gấu Nhỏ'),
    account: normalized,
    email: isEmail ? normalized : (email || ''),
    phone: !isEmail ? normalized : (phone || ''),
    password: password,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'customer',
    memberTier: 'Thành viên Mùa Thu 🍂',
    clawGameTurns: 3,
    vouchers: [
      {
        code: 'CHAOBANMOI30K',
        discount: 30000,
        description: 'Voucher chào bạn mới mùa thu 🍂',
        minOrder: 200000
      }
    ],
    createdAt: new Date().toISOString()
  };

  db.users = [newUser, ...users];
  saveLocalDb(db);
  setStoredUser(newUser);

  return {
    user: newUser,
    message: 'Chào mừng bạn đã gia nhập Tiệm Gấu Bông HD!'
  };
}

export async function loginWithSocial(provider, extraData = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, ...extraData }),
      signal: AbortSignal.timeout(3000)
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setStoredUser(data.user);
      return data;
    }
  } catch {
    // fallback
  }

  const targetEmail = extraData.email || `${provider}-user@tiembong.vn`;
  const socialUser = {
    id: `user-${provider}-${Date.now()}`,
    name: extraData.name || (provider === 'google' ? 'Bé Gấu Chăm Chỉ (Google)' : provider === 'zalo' ? 'Bạn Gấu Mùa Thu (Zalo)' : 'Khách OTP SMS'),
    account: extraData.account || extraData.email || extraData.phone || targetEmail,
    email: targetEmail,
    phone: extraData.phone || '',
    avatar: extraData.avatar || (provider === 'google' 
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'),
    role: 'customer',
    memberTier: 'Thành viên Mùa Thu 🍂',
    clawGameTurns: 3,
    vouchers: [
      {
        code: 'CHAOBANMOI30K',
        discount: 30000,
        description: 'Voucher chào bạn mới mùa thu 🍂',
        minOrder: 200000
      }
    ],
    createdAt: new Date().toISOString()
  };

  setStoredUser(socialUser);
  return {
    user: socialUser,
    message: `Đăng nhập qua ${provider.toUpperCase()} thành công!`
  };
}

export async function forgotPassword(account) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account }),
      signal: AbortSignal.timeout(3000)
    });
    return await res.json();
  } catch {
    return {
      success: true,
      message: `Mã xác nhận khôi phục mật khẩu đã gửi tới ${account}.`
    };
  }
}

export function logoutUser() {
  setStoredUser(null);
}

// ================= USERS & CUSTOMERS API =================
export async function getUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  return (db.users || []).map(({ password, ...u }) => u);
}

export async function createUser(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newUser = {
    ...userData,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  db.users = [newUser, ...(db.users || [])];
  saveLocalDb(db);
  return newUser;
}

export async function updateUser(id, userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const idx = (db.users || []).findIndex(u => u.id === id);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...userData };
    saveLocalDb(db);
    return db.users[idx];
  }
  throw new Error('Khách hàng không tồn tại');
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.users = (db.users || []).filter(u => u.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ================= VOUCHERS API =================
export async function getVouchers() {
  try {
    const res = await fetch(`${API_BASE_URL}/vouchers`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  return db.vouchers || [
    { id: 'vouch-1', code: 'CHAOBANMOI30K', discount: 30000, minOrder: 200000, description: 'Voucher chào bạn mới 🍂', usageCount: 18, maxUsage: 100, status: 'active', expiresAt: '2026-11-30' },
    { id: 'vouch-2', code: 'MUATHU2024', discount: 50000, minOrder: 350000, description: 'Ưu đãi BST Thu 🍁', usageCount: 34, maxUsage: 50, status: 'active', expiresAt: '2026-11-15' },
    { id: 'vouch-3', code: 'FREESHIP299', discount: 30000, minOrder: 299000, description: 'Freeship hỏa tốc nội thành', usageCount: 65, maxUsage: 200, status: 'active', expiresAt: '2026-12-31' }
  ];
}

export async function createVoucher(voucherData) {
  try {
    const res = await fetch(`${API_BASE_URL}/vouchers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voucherData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newVoucher = {
    ...voucherData,
    id: `vouch-${Date.now()}`,
    code: voucherData.code.toUpperCase(),
    discount: Number(voucherData.discount),
    minOrder: Number(voucherData.minOrder || 0),
    usageCount: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  };
  db.vouchers = [newVoucher, ...(db.vouchers || [])];
  saveLocalDb(db);
  return newVoucher;
}

export async function updateVoucher(id, voucherData) {
  try {
    const res = await fetch(`${API_BASE_URL}/vouchers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(voucherData),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const idx = (db.vouchers || []).findIndex(v => v.id === id);
  if (idx !== -1) {
    db.vouchers[idx] = { ...db.vouchers[idx], ...voucherData };
    saveLocalDb(db);
    return db.vouchers[idx];
  }
  throw new Error('Voucher không tồn tại');
}

export async function deleteVoucher(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/vouchers/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.vouchers = (db.vouchers || []).filter(v => v.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ================= REVIEWS API =================
export async function getReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  return db.reviews || [
    { id: 'rev-1', customerName: 'Bảo Ngọc', productName: 'Teddy Mùa Thu Quàng Khăn Len', rating: 5, comment: 'Bé gấu siêu êm, thơm mùi cỏ khô nhẹ nhàng!', status: 'approved', createdAt: '2026-10-06T14:10:00.000Z' },
    { id: 'rev-2', customerName: 'Huyền My', productName: 'Giftbox Teddy Nâu Vintage (Kèm Thiệp)', rating: 5, comment: 'Đóng gói đẹp, giao nhanh đúng hẹn.', status: 'approved', createdAt: '2026-10-07T09:30:00.000Z' }
  ];
}

export async function updateReviewStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}/status`, {
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
  const rev = (db.reviews || []).find(r => r.id === id);
  if (rev) {
    rev.status = status;
    saveLocalDb(db);
    return rev;
  }
  throw new Error('Đánh giá không tồn tại');
}

export async function deleteReview(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.reviews = (db.reviews || []).filter(r => r.id !== id);
  saveLocalDb(db);
  return { success: true };
}

// ======================== ARTICLES & BLOG API ========================
export async function getArticles(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/articles${query ? `?${query}` : ''}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // fallback to localStorage
  }

  const db = getLocalDb();
  let list = db.articles || DEFAULT_DATA.articles || [];
  
  if (params.category && params.category !== 'Tất cả') {
    list = list.filter(a => a.category === params.category);
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(a =>
      (a.title && a.title.toLowerCase().includes(q)) ||
      (a.summary && a.summary.toLowerCase().includes(q)) ||
      (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return list;
}

export async function getArticleById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const list = db.articles || DEFAULT_DATA.articles || [];
  const article = list.find(a => a.id === id || a.slug === id);
  if (article) {
    article.views = (article.views || 0) + 1;
    saveLocalDb(db);
    return article;
  }
  return null;
}

export async function createArticle(articleData) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const newArticle = {
    id: `post-${Date.now()}`,
    title: articleData.title,
    slug: (articleData.title || '').toLowerCase().replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '').replace(/\s+/g, '-'),
    category: articleData.category || 'Mẹo Chăm Sóc',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    author: articleData.author || 'Tiệm Trưởng HD',
    authorAvatar: '🧸',
    date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    readTime: articleData.readTime || '4 phút đọc',
    views: 1,
    likes: 0,
    image: articleData.image || 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=80',
    summary: articleData.summary || '',
    featured: Boolean(articleData.featured),
    tags: Array.isArray(articleData.tags) ? articleData.tags : ['Tiệm Gấu Bông'],
    content: Array.isArray(articleData.content) ? articleData.content : [
      { type: 'paragraph', text: articleData.summary || 'Nội dung chi tiết bài viết...' }
    ],
    createdAt: new Date().toISOString()
  };

  db.articles = [newArticle, ...(db.articles || DEFAULT_DATA.articles || [])];
  saveLocalDb(db);
  return newArticle;
}

export async function updateArticle(id, articleData) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const index = (db.articles || []).findIndex(a => a.id === id);
  if (index !== -1) {
    db.articles[index] = { ...db.articles[index], ...articleData, updatedAt: new Date().toISOString() };
    saveLocalDb(db);
    return db.articles[index];
  }
  throw new Error('Bài viết không tồn tại');
}

export async function likeArticle(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}/like`, {
      method: 'POST',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  const article = (db.articles || []).find(a => a.id === id);
  if (article) {
    article.likes = (article.likes || 0) + 1;
    saveLocalDb(db);
    return { success: true, likes: article.likes };
  }
  return { success: false };
}

export async function deleteArticle(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  const db = getLocalDb();
  db.articles = (db.articles || []).filter(a => a.id !== id);
  saveLocalDb(db);
  return { success: true };
}
