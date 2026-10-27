import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { toast } from "../store/toastStore";
import useTitle from "../hooks/useTitle";
import { getErrorMessage } from "../util/config";
import { validatePassword } from "../util/validation";
import PasswordStrength from "../components/PasswordStrength";

export default function ChangePassword() {
  useTitle("Change password");
  const changePasswordApi = useUserStore((state) => state.changePasswordApi);
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ newPassword: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newError = {
      newPassword: validatePassword(newPassword),
      confirm: confirm !== newPassword ? "Password confirm không khớp!" : "",
    };
    setError(newError);
    if (newError.newPassword || newError.confirm) return;

    setLoading(true);
    try {
      const result = await changePasswordApi(newPassword);
      toast.success(result.message || "Đổi mật khẩu thành công!");
      navigate("/profile");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-form">
      <h2 className="page-title">Change password</h2>
      <form className="form-login" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>New password</label>
          <div className="input-password">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          <PasswordStrength password={newPassword} />
          <p className="text-error">{error.newPassword}</p>
        </div>
        <div className="form-group">
          <label>Password confirm</label>
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            placeholder="password confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <p className="text-error">{error.confirm}</p>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="link"
            onClick={() => navigate("/profile")}
          >
            ← Back to profile
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "LOADING..." : "CHANGE"}
          </button>
        </div>
      </form>
    </div>
  );
}
