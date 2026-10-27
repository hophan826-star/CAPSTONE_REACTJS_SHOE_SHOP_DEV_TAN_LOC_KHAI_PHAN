import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import useProductStore from "../../store/productStore";
import {
  formatPrice,
  handleImageError,
  getProductImage,
} from "../../util/config";

export default function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [arrSuggest, setArrSuggest] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const getSuggestApi = useProductStore((state) => state.getSuggestApi);
  const navigate = useNavigate();

  const debounceSuggest = useMemo(
    () =>
      _.debounce(async (value) => {
        const data = await getSuggestApi(value);
        setArrSuggest(data.slice(0, 5));
        setSearching(false);
      }, 400),
    [getSuggestApi],
  );

  useEffect(() => {
    return () => debounceSuggest.cancel();
  }, [debounceSuggest]);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setShowSuggest(true);
    if (value.trim() !== "") {
      setSearching(true);
      debounceSuggest(value.trim());
    } else {
      debounceSuggest.cancel();
      setArrSuggest([]);
      setSearching(false);
    }
  };

  const goSearch = () => {
    setShowSuggest(false);
    navigate(`/search?k=${encodeURIComponent(keyword.trim())}`);
  };

  const goDetail = (id) => {
    setShowSuggest(false);
    setKeyword("");
    navigate(`/detail/${id}`);
  };

  return (
    <form
      className="search-box"
      onSubmit={(e) => {
        e.preventDefault();
        goSearch();
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        placeholder="Search"
        value={keyword}
        onChange={handleChange}
        onFocus={() => setShowSuggest(true)}
        onBlur={() => setShowSuggest(false)}
        aria-label="Tìm sản phẩm"
      />

      {showSuggest && keyword.trim() !== "" && (
        <ul className="suggest-list">
          {searching && <li className="suggest-empty">Đang tìm...</li>}
          {!searching && arrSuggest.length === 0 && (
            <li className="suggest-empty">Không có sản phẩm phù hợp</li>
          )}
          {!searching &&
            arrSuggest.map((item) => (
              <li
                key={item.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goDetail(item.id);
                }}
              >
                <img
                  src={getProductImage(item.image)}
                  alt=""
                  onError={handleImageError}
                />
                <span>{item.name}</span>
                <b>{formatPrice(item.price)}</b>
              </li>
            ))}
          <li
            className="suggest-all"
            onMouseDown={(e) => {
              e.preventDefault();
              goSearch();
            }}
          >
            Xem tất cả kết quả cho "{keyword.trim()}"
          </li>
        </ul>
      )}
    </form>
  );
}
