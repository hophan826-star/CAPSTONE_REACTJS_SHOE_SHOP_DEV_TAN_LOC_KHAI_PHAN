export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const regexPhone = /^(0|\+84)[0-9]{9,10}$/;
export const regexName = /^[a-zA-ZÀ-ỹ\s]+$/;

export const validateEmail = (value) => {
  if (!value.trim()) return "Email không được bỏ trống!";
  if (!regexEmail.test(value)) return "Email không đúng định dạng!";
  return "";
};

export const validatePassword = (value) => {
  if (!value) return "Password không được bỏ trống!";
  if (value.length < 6 || value.length > 32) return "Password từ 6 - 32 ký tự!";
  return "";
};

export const validateName = (value) => {
  if (!value.trim()) return "Name không được bỏ trống!";
  if (!regexName.test(value)) return "Name chỉ được chứa chữ cái!";
  return "";
};

export const validatePhone = (value) => {
  if (!value.trim()) return "Phone không được bỏ trống!";
  if (!regexPhone.test(value))
    return "Phone không đúng định dạng (VD: 0901234567)!";
  return "";
};

export const isValidForm = (errors) => {
  return Object.values(errors).every((err) => err === "");
};
