import { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import useUserStore from "../store/userStore";

import { toast, confirmDialog } from "../store/toastStore";

import useTitle from "../hooks/useTitle";

import {
  getErrorMessage,
  formatDate,
  formatPrice,
  handleImageError,
  handleAvatarError,
  getProductImage,
  NO_AVATAR,
} from "../util/config";

import { validateName, validatePhone, isValidForm } from "../util/validation";

import Pagination from "../components/Pagination";
import ProductList from "../components/ShoesStore/ProductList";
import Loading from "../components/Loading";

import { readOrderReceipt } from "../util/orderReceipts";

const ORDERS_PER_PAGE = 3;

const getDisplayItems = (order, email) => {
  const receipt = readOrderReceipt(email, order.id);

  return receipt?.items || order.orderDetail || [];
};

const getOrderTotal = (order, email) => {
  return getDisplayItems(order, email).reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
};

export default function Profile() {
  useTitle("Profile");

  const userProfile = useUserStore((state) => state.userProfile);

  const arrFavorite = useUserStore((state) => state.arrFavorite);

  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") === "favourite" ? "favourite" : "history";

  const changeTab = (newTab) => {
    setSearchParams({ tab: newTab }, { replace: true });
  };

  if (!userProfile) {
    return <Loading text="Đang tải thông tin..." />;
  }

  return (
    <div className="container">
      <h2 className="title-gradient">Profile</h2>

      <ProfileForm
        key={userProfile.email + userProfile.name + userProfile.phone}
        userProfile={userProfile}
      />

      <div className="tabs">
        <button
          type="button"
          className={tab === "history" ? "active" : ""}
          onClick={() => changeTab("history")}
        >
          Order history ({userProfile.ordersHistory?.length || 0})
        </button>

        <button
          type="button"
          className={tab === "favourite" ? "active" : ""}
          onClick={() => changeTab("favourite")}
        >
          Favourite ({arrFavorite.length})
        </button>
      </div>

      {tab === "history" ? (
        <OrderHistory
          ordersHistory={userProfile.ordersHistory || []}
          email={userProfile.email}
        />
      ) : (
        <ProductList
          productsData={arrFavorite}
          emptyText="Chưa có sản phẩm yêu thích, bấm ♡ ở sản phẩm để thêm nhé!"
        />
      )}
    </div>
  );
}

function ProfileForm({ userProfile }) {
  const updateProfileApi = useUserStore((state) => state.updateProfileApi);

  const uploadAvatarApi = useUserStore((state) => state.uploadAvatarApi);

  const fileRef = useRef(null);

  const [values, setValues] = useState({
    email: userProfile.email,
    name: userProfile.name || "",
    phone: userProfile.phone || "",
    password: "",
    gender: userProfile.gender ?? true,
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });

    if (name === "name") {
      setErrors({
        ...errors,
        name: validateName(value),
      });
    }

    if (name === "phone") {
      setErrors({
        ...errors,
        phone: validatePhone(value),
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(values.name),
      phone: validatePhone(values.phone),
    };

    setErrors(newErrors);

    if (!isValidForm(newErrors)) {
      return;
    }

    const userUpdate = { ...values };

    if (!userUpdate.password) {
      delete userUpdate.password;
    }

    setLoading(true);

    try {
      const result = await updateProfileApi(userUpdate);

      toast.success(result.message || "Cập nhật thành công!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = async (e) => {
    const file = e.target.files[0];

    e.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh tối đa 2MB!");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
    setUploading(true);

    try {
      await uploadAvatarApi(file);

      toast.success("Đổi avatar thành công!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      setPreview(null);
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <form className="profile" onSubmit={handleUpdate} noValidate>
      <div className="profile-avatar">
        <div
          className="avatar-wrap"
          onClick={() => fileRef.current.click()}
          title="Bấm để đổi avatar"
        >
          <img
            src={preview || userProfile.avatar || NO_AVATAR}
            alt="avatar"
            onError={handleAvatarError}
          />

          {uploading && <div className="avatar-uploading">Đang tải...</div>}
        </div>

        <button
          type="button"
          className="link"
          onClick={() => fileRef.current.click()}
          disabled={uploading}
        >
          📷 Đổi avatar
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChangeAvatar}
        />
      </div>

      <div className="form-col">
        <div className="form-group">
          <label>Email</label>

          <input className="input" name="email" value={values.email} disabled />
        </div>

        <div className="form-group">
          <label>Phone</label>

          <input
            className="input"
            name="phone"
            placeholder="phone"
            value={values.phone}
            onChange={handleChange}
          />

          <p className="text-error">{errors.phone}</p>
        </div>
      </div>

      <div className="form-col">
        <div className="form-group">
          <label>Name</label>

          <input
            className="input"
            name="name"
            placeholder="name"
            value={values.name}
            onChange={handleChange}
          />

          <p className="text-error">{errors.name}</p>
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            className="input"
            type="password"
            name="password"
            placeholder="để trống nếu không đổi"
            value={values.password}
            onChange={handleChange}
          />

          <Link to="/change-password" className="link small">
            Đổi mật khẩu ở trang riêng →
          </Link>
        </div>

        <div className="profile-bottom">
          <div className="form-group gender">
            <label>Gender</label>

            <label className="radio">
              <input
                type="radio"
                checked={values.gender === true}
                onChange={() =>
                  setValues({
                    ...values,
                    gender: true,
                  })
                }
              />
              <span>Male</span>
            </label>

            <label className="radio">
              <input
                type="radio"
                checked={values.gender === false}
                onChange={() =>
                  setValues({
                    ...values,
                    gender: false,
                  })
                }
              />
              <span>Female</span>
            </label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </form>
  );
}

function OrderHistory({ ordersHistory, email }) {
  const deleteOrderApi = useUserStore((state) => state.deleteOrderApi);

  const [page, setPage] = useState(1);

  const handleCancel = async (order) => {
    const ok = await confirmDialog(
      `Bạn có chắc muốn huỷ đơn hàng #${order.id}?`,
    );

    if (!ok) {
      return;
    }

    try {
      await deleteOrderApi(order.id);

      toast.success(`Đã huỷ đơn hàng #${order.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (ordersHistory.length === 0) {
    return (
      <p className="text-center empty-text">
        Bạn chưa có đơn hàng nào.{" "}
        <Link to="/" className="link">
          Mua sắm ngay
        </Link>
      </p>
    );
  }

  const arrOrder = [...ordersHistory].reverse();

  const totalPage = Math.ceil(arrOrder.length / ORDERS_PER_PAGE);

  const currentPage = page > totalPage ? totalPage : page;

  const arrRender = arrOrder.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const totalSpent = ordersHistory.reduce(
    (total, order) => total + getOrderTotal(order, email),
    0,
  );

  return (
    <div className="order-history">
      <p className="order-summary">
        Bạn đã đặt <b>{ordersHistory.length}</b> đơn hàng · Tổng theo lịch sử
        hiển thị: <b>{formatPrice(totalSpent)}</b>
      </p>

      {arrRender.map((order) => (
        <div key={order.id} className="order">
          <div className="order-head">
            <p className="order-date">
              + Orders have been placed on {formatDate(order.date)}
              {order.status && (
                <span className="order-status">{order.status}</span>
              )}
            </p>

            <button
              type="button"
              className="btn-cancel-order"
              onClick={() => handleCancel(order)}
            >
              Huỷ đơn
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>img</th>
                  <th>name</th>
                  <th>price</th>
                  <th>quantity</th>
                  <th>total</th>
                </tr>
              </thead>

              <tbody>
                {getDisplayItems(order, email).map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <img
                        src={getProductImage(item.image)}
                        alt={item.name}
                        onError={handleImageError}
                      />
                    </td>

                    <td>{item.name}</td>

                    <td>{formatPrice(item.price)}</td>

                    <td>
                      <span className="qty-box">{item.quantity}</span>
                    </td>

                    <td>
                      {formatPrice(
                        Number(item.price || 0) * Number(item.quantity || 0),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="order-total">
            Tổng đơn #{order.id}:{" "}
            <b>{formatPrice(getOrderTotal(order, email))}</b>
          </p>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPage={totalPage}
        onChangePage={setPage}
      />
    </div>
  );
}
