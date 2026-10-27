import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function ProtectedRoute() {
  const userLogin = useUserStore((state) => state.userLogin);
  const location = useLocation();

  if (!userLogin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
          message: "Vui lòng đăng nhập để tiếp tục!",
        }}
      />
    );
  }
  return <Outlet />;
}
