import useToastStore from "../store/toastStore";

export default function ConfirmModal() {
  const confirmBox = useToastStore((state) => state.confirmBox);
  const closeConfirm = useToastStore((state) => state.closeConfirm);

  if (!confirmBox) return null;

  return (
    <div className="modal-overlay" onClick={() => closeConfirm(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Xác nhận</h3>
        <p>{confirmBox.message}</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => closeConfirm(false)}>
            Huỷ
          </button>
          <button
            className="btn-primary"
            onClick={() => closeConfirm(true)}
            autoFocus
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
