import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import WebFont from "webfontloader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "./features/userSlice";

// 🔥 SCROLL TO TOP COMPONENT
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // हर route change पर TOP पर scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // Instant scroll (no smooth animation)
    });

    // Multiple scroll targets for safety
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]); // pathname change पर trigger

  return null;
};

// Components
import Navbar from "./components/layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import SidebarMenu from "./components/layout/SidebarMenu/SidebarMenu";
import PromotionBar from "./components/layout/PromotionBar/PromotionBar";
import Loader from "./components/Loader/Loader";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";
import ConfirmOrder from "./pages/ConfirmOrder/ConfirmOrder";
import Success from "./pages/Success/Success";
import Wishlist from "./pages/Wishlist/Wishlist";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Profile from "./pages/Account/Profile";
import UpdateProfile from "./pages/Account/UpdateProfile";
import UpdatePassword from "./pages/Account/UpdatePassword";
import MyOrders from "./pages/Account/MyOrders";
import OrderDetails from "./pages/Account/OrderDetails";

// ADMIN
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/ProductList";
import NewProduct from "./pages/Admin/NewProduct";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import OrderList from "./pages/Admin/OrderList";
import ProcessOrder from "./pages/Admin/ProcessOrder";
import UsersList from "./pages/Admin/UsersList";
import UpdateUser from "./pages/Admin/UpdateUser";
import Store from "./pages/Store/Store";
import CategoryPage from "./pages/Category/Category";

// --- PROTECTED ROUTE (NO RELOAD LOOP) ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  // 1. Agar login check chal raha hai aur hume pata hi nahi user kaun hai -> LOADER
  if (loading && isAuthenticated === false) {
    return <Loader />;
  }

  // 2. Loading khatam hui aur user nahi mila -> LOGIN PE JAAO
  if (loading === false && isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  // 3. User mil gaya -> PAGE DIKHAO
  return children;
};

function App() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    WebFont.load({
      google: { families: ["Ubuntu", "Droid Sans", "Chilanka"] },
    });
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Router>
      {/* 🔥 SCROLL TO TOP - हर page change पर TOP */}
      <ScrollToTop />

      <PromotionBar />
      <Navbar
        onBurgerClick={() => setSidebarOpen(true)}
        onCartClick={() => {}}
      />
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/store" element={<Store />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* admin route  */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product/new"
          element={
            <ProtectedRoute isAdmin={true}>
              <NewProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute isAdmin={true}>
              <OrderList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/order/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <ProcessOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAdmin={true}>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user/:id"
          element={
            <ProtectedRoute isAdmin={true}>
              <UpdateUser />
            </ProtectedRoute>
          }
        />

        {/* --- SECURE ROUTES --- */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/me/update"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/password/update"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute>
              <Shipping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/confirm"
          element={
            <ProtectedRoute>
              <ConfirmOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="bottom-center" autoClose={3000} />
      <Footer />
    </Router>
  );
}

export default App;
