import useToastStore from "../store/toastStore";

const ICON = { success: "✔", error: "✖", info: "ℹ" };

export default function Toast() {
  const arrToast = useToastStore((state) => state.arrToast);
  const hideToast = useToastStore((state) => state.hideToast);

  return (
    <div className="toast-container">
      {arrToast.map((item) => (
        <div key={item.id} className={`toast toast-${item.type}`} role="alert">
          <span className="toast-icon">{ICON[item.type]}</span>
          <p>{item.message}</p>
          <button
            onClick={() => hideToast(item.id)}
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
