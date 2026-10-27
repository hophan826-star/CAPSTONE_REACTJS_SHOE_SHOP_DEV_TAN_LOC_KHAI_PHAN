import { useEffect, useState } from "react";
import _ from "lodash";
import useProductStore from "../store/productStore";
import { toast } from "../store/toastStore";
import useTitle from "../hooks/useTitle";
import { handleImageError } from "../util/config";
import Loading from "../components/Loading";

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // bán kính trái đất (km)
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function Stores() {
  useTitle("Stores");
  const arrStore = useProductStore((state) => state.arrStore);
  const loading = useProductStore((state) => state.loading);
  const getAllStoreApi = useProductStore((state) => state.getAllStoreApi);

  const [selectedId, setSelectedId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [myPosition, setMyPosition] = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    getAllStoreApi();
  }, [getAllStoreApi]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedId(null);
    getAllStoreApi(keyword.trim());
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ lấy vị trí!");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMyPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setSelectedId(null);
        setLocating(false);
        toast.success("Đã sắp xếp store gần bạn nhất lên đầu!");
      },
      () => {
        setLocating(false);
        toast.error(
          "Không lấy được vị trí, bạn hãy cho phép trình duyệt truy cập vị trí nhé!",
        );
      },
    );
  };

  let arrRender = arrStore.map((store) => ({
    ...store,
    distance: myPosition
      ? getDistance(
          myPosition.lat,
          myPosition.lng,
          Number(store.latitude),
          Number(store.longtitude),
        )
      : null,
  }));
  if (myPosition) arrRender = _.sortBy(arrRender, ["distance"]);

  const store =
    arrRender.find((item) => item.id === selectedId) || arrRender[0];

  const mapQuery = store
    ? encodeURIComponent(`${store.name}, ${store.description}`)
    : "";

  return (
    <div className="container">
      <h2 className="title-gradient">Stores near you</h2>

      <div className="stores-toolbar">
        <form onSubmit={handleSearch} className="search-row">
          <input
            className="input"
            placeholder="Tìm store theo tên hoặc quận..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              if (e.target.value === "") getAllStoreApi("");
            }}
          />
          <button type="submit" className="btn-primary">
            SEARCH
          </button>
        </form>
        <button
          className="btn-near-me"
          onClick={handleNearMe}
          disabled={locating}
        >
          📍 {locating ? "Đang lấy vị trí..." : "Store gần tôi nhất"}
        </button>
      </div>

      {loading && arrStore.length === 0 ? (
        <Loading />
      ) : !store ? (
        <p className="text-center empty-text">Không tìm thấy store nào!</p>
      ) : (
        <div className="stores">
          <div className="store-list">
            {arrRender.map((item) => (
              <div
                key={item.id}
                className={`store-item ${item.id === store.id ? "active" : ""}`}
                onClick={() => setSelectedId(item.id)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError}
                />
                <div className="store-info">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  {item.distance !== null && (
                    <span className="store-distance">
                      {item.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="store-map-wrap">
            <iframe
              className="store-map"
              title={store.name}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${mapQuery}&hl=vi&z=16&output=embed`}
            ></iframe>
            <a
              className="btn-direction"
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
            >
              🧭 Chỉ đường tới {store.name} ({store.description})
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
