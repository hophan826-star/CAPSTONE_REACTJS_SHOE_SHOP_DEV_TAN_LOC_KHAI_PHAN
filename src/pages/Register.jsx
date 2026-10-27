import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import { toast } from "../store/toastStore";
import useTitle from "../hooks/useTitle";
import { getErrorMessage } from "../util/config";
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  isValidForm,
} from "../util/validation";
import PasswordStrength from "../components/PasswordStrength";

export default function Register() {
  useTitle("Register");
  const userLogin = useUserStore((state) => state.userLogin);
  const registerApi = useUserStore((state) => state.registerApi);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
    gender: true,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  if (userLogin) return <Navigate to="/profile" replace />;

  const validateField = (name, value, allValues) => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "passwordConfirm":
        if (!value) return "Password confirm không được bỏ trống!";
        if (value !== allValues.password) return "Password confirm không khớp!";
        return "";
      case "name":
        return validateName(value);
      case "phone":
        return validatePhone(value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    setErrors({ ...errors, [name]: validateField(name, value, newValues) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    for (let key in errors) {
      newErrors[key] = validateField(key, values[key], values);
    }
    setErrors(newErrors);
    if (!isValidForm(newErrors)) return;

    setLoading(true);
    try {
      const userRegister = {
        email: values.email,
        password: values.password,
        name: values.name,
        gender: values.gender,
        phone: values.phone,
      };
      const result = await registerApi(userRegister);
      toast.success(result.message || "Đăng ký tài khoản thành công!");

      navigate("/login", {
        state: {
          email: values.email,
          message: "Đăng ký thành công! Mời bạn đăng nhập.",
          type: "success",
        },
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-form">
      <h2 className="page-title">Register</h2>
      <form className="form-register" onSubmit={handleSubmit} noValidate>
        <div className="form-col">
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
            <PasswordStrength password={values.password} />
            <p className="text-error">{errors.password}</p>
          </div>
          <div className="form-group">
            <label>Password confirm</label>
            <div className="input-password">
              <input
                className="input"
                type={showConfirm ? "text" : "password"}
                name="passwordConfirm"
                placeholder="password confirm"
                value={values.passwordConfirm}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label="Hiện/ẩn mật khẩu"
              >
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            <p className="text-error">{errors.passwordConfirm}</p>
          </div>
        </div>

        <div className="form-col">
          <div className="form-group">
            <label>Name</label>
            <input
              className="input"
              name="name"
              placeholder="name"
              value={values.name}
              onChange={handleChange}
            />
            <p className="text-error">{errors.name}</p>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              className="input"
              name="phone"
              placeholder="phone"
              value={values.phone}
              onChange={handleChange}
            />
            <p className="text-error">{errors.phone}</p>
          </div>
          <div className="form-group gender">
            <label>Gender</label>
            <label className="radio">
              <input
                type="radio"
                name="gender"
                checked={values.gender === true}
                onChange={() => setValues({ ...values, gender: true })}
              />
              <span>Male</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                name="gender"
                checked={values.gender === false}
                onChange={() => setValues({ ...values, gender: false })}
              />
              <span>Female</span>
            </label>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "LOADING..." : "SUBMIT"}
          </button>
        </div>
      </form>
    </div>
  );
}
