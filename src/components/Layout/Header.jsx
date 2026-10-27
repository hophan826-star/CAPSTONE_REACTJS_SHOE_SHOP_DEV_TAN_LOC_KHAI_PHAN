import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import useCartStore from "../../store/cartStore";
import { confirmDialog, toast } from "../../store/toastStore";
import { NO_AVATAR, handleAvatarError } from "../../util/config";
import SearchBox from "./SearchBox";
import CartDropdown from "./CartDropdown";

const menu = [
  { title: "Home", path: "/" },
  { title: "Men", path: "/category/MEN" },
  { title: "Woman", path: "/category/WOMEN" },
  { title: "Nike", path: "/category/NIKE" },
  { title: "Adidas", path: "/category/ADIDAS" },
  { title: "Vans Converse", path: "/category/VANS_CONVERSE" },
  { title: "All products", path: "/products" },
  { title: "Stores", path: "/stores" },
];

export default function Header() {
  const userLogin = useUserStore((state) => state.userLogin);
  const userProfile = useUserStore((state) => state.userProfile);
  const arrFavorite = useUserStore((state) => state.arrFavorite);
  const logout = useUserStore((state) => state.logout);
  const cartData = useCartStore((state) => state.cartData);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalQuantity = cartData.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleLogout = async () => {
    const ok = await confirmDialog("Bạn có chắc muốn đăng xuất?");
    if (!ok) return;
    logout();
    toast.success("Đã đăng xuất!");
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-top">
        <button
          className="btn-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <Link to="/" className="logo">
          <span className="logo-icon">👟</span>
          <span className="logo-text">
            SHOES<b>SHOP KP&LOC DC</b>
          </span>
        </Link>

        <SearchBox />

        <div className="header-right">
          <NavLink
            to="/search"
            className="header-search-mobile"
            aria-label="Tìm kiếm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </NavLink>

          {userLogin && (
            <Link
              to="/profile?tab=favourite"
              className="header-fav"
              title="Sản phẩm yêu thích"
            >
              ♥ <span>({arrFavorite.length})</span>
            </Link>
          )}

          <div className="header-cart-wrap">
            <NavLink to="/carts" className="header-cart" aria-label="Giỏ hàng">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
                <circle cx="10" cy="20" r="1.4" />
                <circle cx="17" cy="20" r="1.4" />
              </svg>

              <span key={totalQuantity} className="cart-count">
                ({totalQuantity})
              </span>
            </NavLink>
            <CartDropdown />
          </div>

          {userLogin ? (
            <>
              <NavLink to="/profile" className="header-user">
                <img
                  src={userProfile?.avatar || NO_AVATAR}
                  alt=""
                  onError={handleAvatarError}
                />
                <span>{userProfile?.name || userLogin.email}</span>
              </NavLink>
              <button className="header-link btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="header-link">
                Login
              </NavLink>
              <NavLink to="/register" className="header-link">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      <nav className={`header-menu ${menuOpen ? "open" : ""}`}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={() => setMenuOpen(false)}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
