import { Link } from "react-router-dom";
import useCartStore from "../../store/cartStore";
import {
  formatPrice,
  handleImageError,
  getProductImage,
} from "../../util/config";

export default function CartDropdown() {
  const cartData = useCartStore((state) => state.cartData);
  const totalMoney = cartData.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <div className="cart-dropdown">
      {cartData.length === 0 ? (
        <p className="cart-dropdown-empty">Giỏ hàng đang trống</p>
      ) : (
        <>
          {cartData.slice(0, 3).map((item) => (
            <div key={item.id + "-" + item.size} className="cart-dropdown-item">
              <img
                src={getProductImage(item.image)}
                alt={item.name}
                onError={handleImageError}
              />
              <div>
                <p>{item.name}</p>
                <span>
                  Size {item.size} · {item.quantity} x {formatPrice(item.price)}
                </span>
              </div>
            </div>
          ))}
          {cartData.length > 3 && (
            <p className="cart-dropdown-more">
              + {cartData.length - 3} sản phẩm khác
            </p>
          )}
          <div className="cart-dropdown-total">
            Tổng: <b>{formatPrice(totalMoney)}</b>
          </div>
          <Link to="/carts" className="btn-primary block">
            Xem giỏ hàng
          </Link>
        </>
      )}
    </div>
  );
}
