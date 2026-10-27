import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Loading from "../Loading";
import Toast from "../Toast";
import ConfirmModal from "../ConfirmModal";
import BackToTop from "../BackToTop";
import ScrollToTop from "../ScrollToTop";
import useUserStore from "../../store/userStore";

export default function MainLayout() {
  const location = useLocation();
  const userLogin = useUserStore((state) => state.userLogin);
  const getProfileApi = useUserStore((state) => state.getProfileApi);
  const getFavoriteApi = useUserStore((state) => state.getFavoriteApi);

  useEffect(() => {
    if (userLogin) {
      getProfileApi();
      getFavoriteApi();
    }
  }, [userLogin, getProfileApi, getFavoriteApi]);

  return (
    <div className="wrapper">
      <ScrollToTop />
      <Header />
      <main
        className={`main-content ${location.pathname === "/" ? "main-content--home" : ""}`}
      >
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />

      <Toast />
      <ConfirmModal />
      <BackToTop />
    </div>
  );
}
