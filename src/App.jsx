import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

const Search = lazy(() => import("./pages/Search"));
const Detail = lazy(() => import("./pages/Detail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Carts = lazy(() => import("./pages/Carts"));
const Category = lazy(() => import("./pages/Category"));
const Products = lazy(() => import("./pages/Products"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Stores = lazy(() => import("./pages/Stores"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="index" element={<Navigate to="/" replace />} />
        <Route path="search" element={<Search />} />
        <Route path="detail/:id" element={<Detail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="category/:categoryId" element={<Category />} />
        <Route path="products" element={<Products />} />
        <Route path="stores" element={<Stores />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="carts" element={<Carts />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
