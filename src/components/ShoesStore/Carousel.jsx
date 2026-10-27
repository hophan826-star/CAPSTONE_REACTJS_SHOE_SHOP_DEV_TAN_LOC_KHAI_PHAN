import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/userStore";
import {
  handleImageError,
  getProductImage,
  getLongDescription,
} from "../../util/config";

export default function Carousel({ productsData = [], loading = false }) {
  const userLogin = useUserStore((state) => state.userLogin);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = productsData.length;

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, total]);

  if (loading && total === 0) {
    return <div className="carousel-skeleton" aria-label="Đang tải sản phẩm" />;
  }
  if (total === 0) return null;

  const current = index % total;
  const product = productsData[current];
  const prev = () => setIndex((current - 1 + total) % total);
  const next = () => setIndex((current + 1) % total);

  return (
    <section
      className="carousel"
      aria-label="Giày nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <button
        type="button"
        className="carousel-arrow left"
        onClick={prev}
        aria-label="Sản phẩm trước"
      >
        <svg viewBox="0 0 24 42" aria-hidden="true">
          <path d="M21 2 3 21l18 19" />
        </svg>
      </button>

      <div key={product.id} className="carousel-item fade-in">
        <Link to={`/detail/${product.id}`} className="carousel-img">
          <img
            src={getProductImage(product.image)}
            alt={product.name}
            onError={handleImageError}
          />
        </Link>
        <div className="carousel-info">
          <h2 style={{ textTransform: "capitalize" }}>{product.name}</h2>
          <p>{getLongDescription(product)}</p>
          <Link
            to={userLogin ? `/detail/${product.id}` : "/login"}
            state={
              userLogin
                ? undefined
                : {
                    from: `/detail/${product.id}`,
                    message: "Vui lòng đăng nhập để tiếp tục mua hàng!",
                  }
            }
            className="btn-carousel"
          >
            Buy now
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="carousel-arrow right"
        onClick={next}
        aria-label="Sản phẩm tiếp theo"
      >
        <svg viewBox="0 0 24 42" aria-hidden="true">
          <path d="m3 2 18 19L3 40" />
        </svg>
      </button>

      <div className="carousel-dots" role="group" aria-label="Chọn sản phẩm">
        {productsData.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={i === current ? "active" : ""}
            aria-label={`Chuyển đến sản phẩm ${i + 1}`}
            aria-pressed={i === current}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
