export default function Loading({ text = 'Đang tải...' }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}
