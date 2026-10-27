import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProductStore from "../store/productStore";
import useTitle from "../hooks/useTitle";
import ProductList from "../components/ShoesStore/ProductList";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 9;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  useTitle(`All products - page ${page}`);

  const paging = useProductStore((state) => state.paging);
  const loading = useProductStore((state) => state.loading);
  const getProductPagingApi = useProductStore(
    (state) => state.getProductPagingApi,
  );

  useEffect(() => {
    getProductPagingApi(page, PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page, getProductPagingApi]);

  const totalPage = Math.ceil(paging.totalRow / PAGE_SIZE);

  return (
    <div className="container">
      <div className="section-head">
        <h2 className="title-gradient">All products</h2>
        {totalPage > 0 && (
          <p className="result-count">
            Trang {page} / {totalPage} · {paging.totalRow} sản phẩm
          </p>
        )}
      </div>
      <ProductList productsData={paging.items} loading={loading} />
      <Pagination
        currentPage={page}
        totalPage={totalPage}
        onChangePage={(newPage) => setSearchParams({ page: newPage })}
      />
    </div>
  );
}
