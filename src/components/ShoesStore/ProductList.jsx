import ProductItem from "./ProductItem";

function SkeletonItem() {
  return (
    <div className="product-card skeleton">
      <div className="sk-img"></div>
      <div className="sk-line"></div>
      <div className="sk-line short"></div>
      <div className="sk-footer"></div>
    </div>
  );
}

export default function ProductList({
  productsData,
  loading = false,
  emptyText = "Không có sản phẩm nào!",
}) {
  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <SkeletonItem key={item} />
        ))}
      </div>
    );
  }

  if (!productsData || productsData.length === 0) {
    return <p className="text-center empty-text">{emptyText}</p>;
  }

  return (
    <div className="product-grid">
      {productsData.map((product) => (
        <ProductItem key={product.id} item={product} />
      ))}
    </div>
  );
}
