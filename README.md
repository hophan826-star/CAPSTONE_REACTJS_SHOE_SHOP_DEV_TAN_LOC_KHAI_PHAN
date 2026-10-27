# Shoes Shop – Capstone ReactJS

PHẦN PHÂN CHIA CÔNG VIỆC:
PHAN TẤN LỘC: Register, Login, Profile, Search
HỒ KHẢI PHAN: Index, Detail, Cart, Tính năng ẩn

## Cấu trúc thư mục

Đặt tên file / thư mục: layout nằm trong `components/Layout`,
component sản phẩm gom vào `components/ShoesStore` (`ProductItem`, `ProductList`), trang chủ là `pages/Home.jsx`,
routes viết bằng `<BrowserRouter>` + `<Routes>`.

```
src/
├─ main.jsx                    # createRoot + <BrowserRouter>
├─ App.jsx                     # khai báo <Routes>: MainLayout + các trang (lazy load)
├─ index.css                   # toàn bộ css (màu lấy theo figma) + responsive
├─ components/
│  ├─ Layout/
│  │  ├─ MainLayout.jsx        # Header + <Outlet /> + Footer + Toast + ConfirmModal
│  │  ├─ Header.jsx            # logo, ô search, giỏ hàng, login/logout, menu
│  │  ├─ SearchBox.jsx         # ô search trên header có gợi ý (lodash debounce)
│  │  ├─ CartDropdown.jsx      # giỏ hàng mini khi rê chuột
│  │  └─ Footer.jsx
│  ├─ ShoesStore/
│  │  ├─ ProductItem.jsx       # 1 sản phẩm (card)
│  │  ├─ ProductList.jsx       # danh sách sản phẩm + skeleton loading
│  │  └─ Carousel.jsx          # carousel trang chủ
│  ├─ LoginFacebook.jsx        # nút đăng nhập Facebook
│  ├─ ProtectedRoute.jsx       # chặn trang cần đăng nhập
│  ├─ ScrollToTop.jsx          # chuyển trang thì cuộn lên đầu
│  ├─ Toast.jsx, ConfirmModal.jsx, Loading.jsx, Pagination.jsx, BackToTop.jsx, PasswordStrength.jsx
├─ pages/                      # Home, Search, Detail, Login, Register, Profile, Carts,
│                              # Category, Products, ChangePassword, Stores, NotFound
├─ store/                      # zustand
│  ├─ productStore.js          # api sản phẩm, danh mục, phân trang, store
│  ├─ userStore.js             # đăng nhập, đăng ký, profile, avatar, huỷ đơn, like/unlike
│  ├─ cartStore.js             # giỏ hàng cartData (persist localStorage) + tồn kho + api order
│  ├─ recentStore.js           # sản phẩm đã xem gần đây (persist)
│  └─ toastStore.js            # thông báo toast + hộp thoại xác nhận
├─ hooks/
│  ├─ useTitle.js              # đổi tiêu đề tab theo từng trang
│  └─ useToggleLike.js         # logic nút ♥ dùng chung
└─ util/
   ├─ config.js                # DOMAIN, axios + interceptor gắn token, localStorage, format giá/ngày, ảnh lỗi
   └─ validation.js # hàm validate form
   description.js
   orderReceipts.js
```
