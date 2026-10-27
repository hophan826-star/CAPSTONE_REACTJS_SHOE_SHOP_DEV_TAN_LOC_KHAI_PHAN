import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";
import _ from "lodash";
import useToggleLike from "../../hooks/useToggleLike";
import {
  formatPrice,
  handleImageError,
  getProductImage,
  getShortDescription,
} from "../../util/config";

export default function ProductItem({ item }) {
  const { isLiked, toggleLike } = useToggleLike();
  const liked = isLiked(item.id);
  const userLogin = useUserStore((state) => state.userLogin);
  const detailPath = `/detail/${item.id}`;

  return (
    <article className="product-card">
      <button
        type="button"
        className={`btn-heart ${liked ? "liked" : ""}`}
        onClick={() => toggleLike(item)}
        title={liked ? "Bỏ yêu thích" : "Yêu thích"}
        aria-label={liked ? "Bỏ yêu thích" : "Yêu thích"}
        aria-pressed={liked}
      >
        {liked ? "♥" : "♡"}
      </button>
      <Link to={`/detail/${item.id}`} className="product-img">
        <img
          src={getProductImage(item.image)}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
        />
      </Link>
      <div className="product-body">
        <Link to={`/detail/${item.id}`}>
          <h3 title={item.name}>{item.name}</h3>
        </Link>
        <p title={getShortDescription(item)}>
          {_.truncate(getShortDescription(item), { length: 40 })}
        </p>
      </div>
      <div className="product-footer">
        <Link
          to={userLogin ? detailPath : "/login"}
          state={
            userLogin
              ? undefined
              : {
                  from: detailPath,
                  message: "Vui lòng đăng nhập để tiếp tục mua hàng!",
                }
          }
          className="btn-buy"
        >
          Buy now
        </Link>
        <span className="product-price">
          {item.price != null ? formatPrice(item.price) : "♥"}
        </span>
      </div>
    </article>
  );
}
