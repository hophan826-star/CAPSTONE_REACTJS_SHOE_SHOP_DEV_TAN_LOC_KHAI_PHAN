export default function Pagination({ currentPage, totalPage, onChangePage }) {
  if (totalPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPage; i++) {
    if (i === 1 || i === totalPage || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        &lt;
      </button>
      {pages.map((page, index) =>
        page === "..." ? (
          <span key={"dot" + index} className="dots">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => onChangePage(page)}
          >
            {page}
          </button>
        ),
      )}
      <button
        disabled={currentPage === totalPage}
        onClick={() => onChangePage(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
}
