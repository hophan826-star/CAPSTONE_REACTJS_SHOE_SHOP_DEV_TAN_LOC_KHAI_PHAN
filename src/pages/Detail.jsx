import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useProductStore from "../store/productStore";
import useCartStore from "../store/cartStore";
import useUserStore from "../store/userStore";
import useRecentStore from "../store/recentStore";
import { toast } from "../store/toastStore";
import useTitle from "../hooks/useTitle";
import useToggleLike from "../hooks/useToggleLike";
import {
  formatPrice,
  handleImageError,
  getProductImage,
  getLongDescription,
} from "../util/config";
import ProductList from "../components/ShoesStore/ProductList";
import Loading from "../components/Loading";

export default function Detail() {
  const { id } = useParams();
  const productDetail = useProductStore((state) => state.productDetail);
  const detailErrorId = useProductStore((state) => state.detailErrorId);
  const getProductByIdApi = useProductStore((state) => state.getProductByIdApi);
  const addRecent = useRecentStore((state) => state.addRecent);

  const isCurrent = productDetail && String(productDetail.id) === String(id);
  useTitle(isCurrent ? productDetail.name : "Detail");

  useEffect(() => {
    getProductByIdApi(id);
  }, [id, getProductByIdApi]);

  useEffect(() => {
    if (productDetail && String(productDetail.id) === String(id)) {
      addRecent(productDetail);
    }
  }, [productDetail, id, addRecent]);

  if (detailErrorId === String(id)) {
    return (
      <div className="container text-center not-found">
        <h1>404</h1>
        <p>Không tìm thấy sản phẩm!</p>
        <Link to="/" className="btn-primary">
          Về trang chủ
        </Link>
      </div>
    );
  }

  if (!isCurrent) return <Loading />;

  const arrRelated = (productDetail.relatedProducts || []).filter(
    (item) => item.id !== productDetail.id,
  );

  return (
    <div className="container">
      <ProductInfo key={productDetail.id} product={productDetail} />

      <h2 className="title-center">-Realate Product -</h2>
      <ProductList
        productsData={arrRelated}
        emptyText="Chưa có sản phẩm liên quan"
      />
    </div>
  );
}

function ProductInfo({ product }) {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const cartData = useCartStore((state) => state.cartData);
  const addToCart = useCartStore((state) => state.addToCart);
  const userLogin = useUserStore((state) => state.userLogin);
  const { isLiked, toggleLike } = useToggleLike();
  const navigate = useNavigate();

  const liked = isLiked(product.id);
  const category = product.categories?.[0];

  const inCart = cartData
    .filter((item) => item.id === product.id)
    .reduce((total, item) => total + item.quantity, 0);
  const remain = product.quantity - inCart;

  const handleAddToCart = (goToCart) => {
    if (!userLogin) {
      toast.error("Vui lòng đăng nhập trước khi mua hàng!");
      navigate("/login", {
        state: {
          from: `/detail/${product.id}`,
          message: "Vui lòng đăng nhập để tiếp tục mua hàng!",
        },
      });
      return;
    }
    if (size === "") {
      toast.error("Vui lòng chọn size!");
      return;
    }
    const added = addToCart(product, size, quantity);
    if (added === 0) {
      toast.error("Bạn đã thêm hết số lượng còn trong kho!");
      return;
    }
    toast.success(
      `Đã thêm ${added} "${product.name}" (size ${size}) vào giỏ hàng`,
    );
    setQuantity(1);
    if (goToCart) navigate("/carts");
  };

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        {category && (
          <>
            <Link to={`/category/${category.id}`}>{category.category}</Link>
            <span>/</span>
          </>
        )}
        <b>{product.name}</b>
      </div>

      <div className="detail">
        <div className="detail-img">
          <img
            src={getProductImage(product.image)}
            alt={product.name}
            onError={handleImageError}
          />
        </div>
        <div className="detail-info">
          <div className="detail-head">
            <h2>{product.name}</h2>
            <button
              className={`btn-heart-detail ${liked ? "liked" : ""}`}
              onClick={() => toggleLike(product)}
              aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}
            >
              {liked ? "♥" : "♡"}
            </button>
          </div>
          <p className="detail-desc">{getLongDescription(product)}</p>

          <h4 className="text-green">Available size</h4>
          <div className="size-list">
            {product.size?.map((item) => (
              <button
                key={item}
                className={size === item ? "active" : ""}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-stock">
            Còn {product.quantity} sản phẩm
            {inCart > 0 && <span> · Trong giỏ: {inCart}</span>}
          </p>

          <div className="quantity">
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= remain}
            >
              +
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
          </div>

          <div className="detail-actions">
            <button
              className="btn-add-cart"
              onClick={() => handleAddToCart(false)}
              disabled={remain <= 0}
            >
              Add to cart
            </button>
            <button
              className="btn-buy-now"
              onClick={() => handleAddToCart(true)}
              disabled={remain <= 0}
            >
              Buy now
            </button>
          </div>
          {remain <= 0 && (
            <p className="text-error">
              Bạn đã thêm hết số lượng còn trong kho vào giỏ.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
