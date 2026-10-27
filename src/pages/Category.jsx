import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import useProductStore from "../store/productStore";
import useTitle from "../hooks/useTitle";
import ProductList from "../components/ShoesStore/ProductList";

export default function Category() {
  const { categoryId } = useParams();
  const title = categoryId.replace("_", " ");
  useTitle(title);

  const arrProductCategory = useProductStore(
    (state) => state.arrProductCategory,
  );
  const loading = useProductStore((state) => state.loading);
  const getProductByCategoryApi = useProductStore(
    (state) => state.getProductByCategoryApi,
  );
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    getProductByCategoryApi(categoryId);
  }, [categoryId, getProductByCategoryApi]);

  const arrRender =
    sortType === ""
      ? arrProductCategory
      : _.orderBy(arrProductCategory, ["price"], [sortType]);

  return (
    <div className="container">
      <div className="section-head">
        <h2 className="title-gradient">{title}</h2>
        <select
          className="input sort-select"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sắp xếp theo giá</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>
      <ProductList
        productsData={arrRender}
        loading={loading}
        emptyText="Danh mục này chưa có sản phẩm."
      />
    </div>
  );
}
