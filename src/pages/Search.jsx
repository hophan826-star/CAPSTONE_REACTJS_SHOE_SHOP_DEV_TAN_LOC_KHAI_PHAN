import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import useProductStore from "../store/productStore";
import useTitle from "../hooks/useTitle";
import ProductList from "../components/ShoesStore/ProductList";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordParam = searchParams.get("k") || "";
  useTitle(keywordParam ? `Search "${keywordParam}"` : "Search");

  const [keyword, setKeyword] = useState(keywordParam);
  const [prevKeywordParam, setPrevKeywordParam] = useState(keywordParam);
  const [categoryId, setCategoryId] = useState("");
  const [sortType, setSortType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  if (keywordParam !== prevKeywordParam) {
    setPrevKeywordParam(keywordParam);
    setKeyword(keywordParam);
    setCategoryId("");
  }

  const arrSearch = useProductStore((state) => state.arrSearch);
  const arrCategory = useProductStore((state) => state.arrCategory);
  const loading = useProductStore((state) => state.loading);
  const searchProductApi = useProductStore((state) => state.searchProductApi);
  const getAllCategoryApi = useProductStore((state) => state.getAllCategoryApi);
  const getProductByCategoryApi = useProductStore(
    (state) => state.getProductByCategoryApi,
  );

  useEffect(() => {
    getAllCategoryApi();
  }, [getAllCategoryApi]);

  useEffect(() => {
    searchProductApi(keywordParam);
  }, [keywordParam, searchProductApi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCategoryId("");
    if (keyword.trim() === keywordParam) {
      searchProductApi(keywordParam);
    } else {
      setSearchParams({ k: keyword.trim() });
    }
  };

  const handleChangeCategory = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    if (value === "") {
      searchProductApi(keywordParam);
    } else {
      getProductByCategoryApi(value, true);
    }
  };

  const resetFilter = () => {
    setSortType("");
    setMinPrice("");
    setMaxPrice("");
    if (categoryId !== "") {
      setCategoryId("");
      searchProductApi(keywordParam);
    }
  };

  let arrRender = arrSearch;
  if (minPrice !== "") {
    arrRender = _.filter(
      arrRender,
      (product) => product.price >= Number(minPrice),
    );
  }
  if (maxPrice !== "") {
    arrRender = _.filter(
      arrRender,
      (product) => product.price <= Number(maxPrice),
    );
  }
  if (sortType !== "") {
    const [field, order] = sortType.split("-");
    arrRender = _.orderBy(arrRender, [field], [order]);
  }

  const hasFilter =
    sortType !== "" || minPrice !== "" || maxPrice !== "" || categoryId !== "";

  return (
    <div className="container">
      <form className="search-form" onSubmit={handleSubmit}>
        <label htmlFor="keyword">Search</label>
        <div className="search-row">
          <input
            id="keyword"
            className="input"
            placeholder="product name ..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            SEARCH
          </button>
        </div>
      </form>

      <h2 className="title-gradient full">Search result</h2>

      <div className="search-filter">
        <div className="filter-item">
          <label>Price</label>
          <select
            className="input"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">-- sort --</option>
            <option value="price-desc">Price: decrease</option>
            <option value="price-asc">Price: ascending</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Category</label>
          <select
            className="input"
            value={categoryId}
            onChange={handleChangeCategory}
          >
            <option value="">-- all category --</option>
            {arrCategory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Price range ($)</label>
          <div className="price-range">
            <input
              className="input"
              type="number"
              min="0"
              placeholder="from"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input
              className="input"
              type="number"
              min="0"
              placeholder="to"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        {hasFilter && (
          <button className="btn-reset" onClick={resetFilter}>
            ✕ Xoá bộ lọc
          </button>
        )}
      </div>

      {!loading && (
        <p className="result-count">
          Tìm thấy <b>{arrRender.length}</b> sản phẩm
          {keywordParam && (
            <>
              {" "}
              cho "<b>{keywordParam}</b>"
            </>
          )}
        </p>
      )}
      <ProductList
        productsData={arrRender}
        loading={loading}
        emptyText="Không tìm thấy sản phẩm nào!"
      />
    </div>
  );
}
