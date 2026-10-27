import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import useUserStore from "../store/userStore";
import { toast } from "../store/toastStore";
import useTitle from "../hooks/useTitle";
import { getErrorMessage } from "../util/config";
import {
  validateEmail,
  validatePassword,
  isValidForm,
} from "../util/validation";
import LoginFacebook from "../components/LoginFacebook";

export default function Login() {
  useTitle("Login");
  const userLogin = useUserStore((state) => state.userLogin);
  const loginApi = useUserStore((state) => state.loginApi);
  const location = useLocation();

  const [values, setValues] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (userLogin) {
    return <Navigate to={location.state?.from || "/profile"} replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    const message =
      name === "email" ? validateEmail(value) : validatePassword(value);
    setErrors({ ...errors, [name]: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    };
    setErrors(newErrors);
    if (!isValidForm(newErrors)) return;

    setLoading(true);
    try {
      await loginApi(values);
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-form">
      <h2 className="page-title">Login</h2>
      {location.state?.message && (
        <p
          className={`notice ${location.state.type === "success" ? "success" : ""}`}
        >
          {location.state.message}
        </p>
      )}

      <form className="form-login" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Email</label>
          <input
            className="input"
            name="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
          />
          <p className="text-error">{errors.email}</p>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-password">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              value={values.password}
              onChange={handleChange}
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
          <p className="text-error">{errors.password}</p>
        </div>

        <div className="form-actions">
          <Link to="/register" className="link">
            Register now ?
          </Link>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </div>
      </form>

      <div className="form-login">
        <LoginFacebook />
      </div>
    </div>
  );
}
