import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useCartStore from "../store/cartStore";
import useUserStore from "../store/userStore";

import { toast, confirmDialog } from "../store/toastStore";

import useTitle from "../hooks/useTitle";

import { rememberPurchase } from "../util/orderReceipts";

import {
  getErrorMessage,
  formatPrice,
  handleImageError,
  getProductImage,
} from "../util/config";

export default function Carts() {
  useTitle("Carts");

  const cartData = useCartStore((state) => state.cartData);

  const changeQuantity = useCartStore((state) => state.changeQuantity);

  const deleteItem = useCartStore((state) => state.deleteItem);

  const deleteChecked = useCartStore((state) => state.deleteChecked);

  const clearCart = useCartStore((state) => state.clearCart);

  const toggleChecked = useCartStore((state) => state.toggleChecked);

  const toggleCheckAll = useCartStore((state) => state.toggleCheckAll);

  const submitOrderApi = useCartStore((state) => state.submitOrderApi);

  const userLogin = useUserStore((state) => state.userLogin);

  const getProfileApi = useUserStore((state) => state.getProfileApi);

  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const arrChecked = cartData.filter((item) => item.checked);

  const isCheckAll =
    cartData.length > 0 && arrChecked.length === cartData.length;

  const totalMoney = arrChecked.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalQuantity = arrChecked.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const quantityOfProduct = (id) => {
    return cartData
      .filter((item) => String(item.id) === String(id))
      .reduce((total, item) => total + item.quantity, 0);
  };

  const handleDelete = async (item) => {
    const ok = await confirmDialog(
      `Xoá "${item.name}" (size ${item.size}) khỏi giỏ hàng?`,
    );

    if (!ok) return;

    deleteItem(item.id, item.size);

    toast.info(`Đã xoá "${item.name}" khỏi giỏ hàng`);
  };

  const handleDeleteChecked = async () => {
    if (arrChecked.length === 0) {
      toast.info("Bạn chưa chọn sản phẩm nào!");
      return;
    }

    const ok = await confirmDialog(
      `Xoá ${arrChecked.length} sản phẩm đã chọn khỏi giỏ hàng?`,
    );

    if (!ok) return;

    deleteChecked();

    toast.info("Đã xoá các sản phẩm đã chọn");
  };

  const handleClearCart = async () => {
    const ok = await confirmDialog("Xoá toàn bộ giỏ hàng?");

    if (!ok) return;

    clearCart();

    toast.info("Đã xoá toàn bộ giỏ hàng");
  };

  const handleSubmitOrder = async () => {
    if (arrChecked.length === 0) {
      toast.error("Vui lòng chọn sản phẩm để đặt hàng!");
      return;
    }

    const ok = await confirmDialog(
      `Đặt ${totalQuantity} sản phẩm với tổng tiền ${formatPrice(totalMoney)}?`,
    );

    if (!ok) return;

    setSubmitting(true);

    try {
      if (!userLogin?.email) {
        throw new Error("Vui lòng đăng nhập trước khi mua.");
      }

      const before = await getProfileApi();

      const previousOrders = before.ordersHistory ?? before.orderHistory ?? [];

      const previousIds = previousOrders.map((order) => order.id);

      const selectedItems = arrChecked.map((item) => ({ ...item }));

      const result = await submitOrderApi(userLogin.email);

      rememberPurchase(userLogin.email, selectedItems, previousIds);

      toast.success(result.message || "Đặt hàng thành công!");

      try {
        await getProfileApi();
      } catch {
        toast.info(
          "Đơn đã đặt thành công. Hãy tải lại lịch sử khi kết nối ổn định.",
        );
      }

      navigate("/profile?tab=history");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (cartData.length === 0) {
    return (
      <div className="container">
        <h2 className="page-title">Carts</h2>

        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <p>Giỏ hàng của bạn đang trống</p>

          <Link to="/" className="btn-primary">
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="page-title">Carts</h2>

      <div className="table-responsive">
        <table className="table table-cart">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isCheckAll}
                  onChange={(e) => toggleCheckAll(e.target.checked)}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th>id</th>
              <th>img</th>
              <th>name</th>
              <th>size</th>
              <th>price</th>
              <th>quantity</th>
              <th>total</th>
              <th>action</th>
            </tr>
          </thead>

          <tbody>
            {cartData.map((item) => {
              const isMax =
                item.stock && quantityOfProduct(item.id) >= item.stock;

              return (
                <tr
                  key={`${item.id}-${item.size}`}
                  className={item.checked ? "" : "unchecked"}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecked(item.id, item.size)}
                      aria-label={`Chọn ${item.name}`}
                    />
                  </td>

                  <td>{item.id}</td>

                  <td>
                    <Link to={`/detail/${item.id}`}>
                      <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </Link>
                  </td>

                  <td>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.price}</td>

                  <td>
                    <div className="quantity small">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.size, 1)}
                        disabled={isMax}
                      >
                        +
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.size, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                    </div>
                  </td>

                  <td>{(item.price * item.quantity).toLocaleString()}</td>

                  <td>
                    <button
                      type="button"
                      className="btn-edit"
                      onClick={() => navigate(`/detail/${item.id}`)}
                    >
                      EDIT
                    </button>

                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleDelete(item)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="cart-footer">
        <div className="cart-actions">
          <Link to="/" className="btn-text">
            ← Tiếp tục mua sắm
          </Link>

          <button
            type="button"
            className="btn-text"
            onClick={handleDeleteChecked}
          >
            Xoá đã chọn
          </button>

          <button
            type="button"
            className="btn-text danger"
            onClick={handleClearCart}
          >
            Xoá tất cả
          </button>
        </div>

        <div className="cart-total">
          <p>
            Đã chọn {totalQuantity} sản phẩm
            {" · "}Total: <b>{formatPrice(totalMoney)}</b>
          </p>

          <button
            type="button"
            className="btn-order"
            onClick={handleSubmitOrder}
            disabled={submitting}
          >
            {submitting ? "ĐANG ĐẶT HÀNG..." : "SUBMIT ORDER"}
          </button>
        </div>
      </div>
    </div>
  );
}
