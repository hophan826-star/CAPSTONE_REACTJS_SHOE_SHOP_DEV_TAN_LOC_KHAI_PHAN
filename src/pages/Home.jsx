import { useEffect } from "react";
import useProductStore from "../store/productStore";
import useRecentStore from "../store/recentStore";
import useTitle from "../hooks/useTitle";
import Carousel from "../components/ShoesStore/Carousel";
import ProductList from "../components/ShoesStore/ProductList";

export default function Home() {
  useTitle("Home");
  const arrFeature = useProductStore((state) => state.arrFeature);
  const loading = useProductStore((state) => state.loading);
  const getFeatureProductApi = useProductStore(
    (state) => state.getFeatureProductApi,
  );
  const arrRecent = useRecentStore((state) => state.arrRecent);
  const clearRecent = useRecentStore((state) => state.clearRecent);

  useEffect(() => {
    getFeatureProductApi();
  }, [getFeatureProductApi]);

  return (
    <div className="home-page">
      <div className="home-carousel-shell">
        <Carousel productsData={arrFeature.slice(0, 4)} loading={loading} />
      </div>

      <section className="home-feature" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="title-gradient">
          Product Feature
        </h2>
        <ProductList productsData={arrFeature.slice(0, 6)} loading={loading} />
      </section>

      {arrRecent.length > 0 && (
        <section className="home-recent" aria-labelledby="recent-heading">
          <div className="section-head">
            <h2 id="recent-heading" className="title-gradient">
              Recently viewed
            </h2>
            <button className="link" onClick={clearRecent}>
              Xóa lịch sử xem
            </button>
          </div>
          <ProductList productsData={arrRecent.slice(0, 3)} />
        </section>
      )}
    </div>
  );
}
