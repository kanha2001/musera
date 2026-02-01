// src/App.jsx
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

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

// FOOTER
import Newborn from "./pages/Footer/Shop/Newborn";
import Baby from "./pages/Footer/Shop/Baby";
import Toddler from "./pages/Footer/Shop/Toddler";
import Kids from "./pages/Footer/Shop/Kids";
import Sale from "./pages/Footer/Shop/Sale";

import TrackOrder from "./pages/Footer/Support/TrackOrder";
import Returns from "./pages/Footer/Support/Returns";
import ShippingInfo from "./pages/Footer/Support/ShippingInfo";
import SizeGuide from "./pages/Footer/Support/SizeGuide";
import ContactUs from "./pages/Footer/Support/ContactUs";

import OurStory from "./pages/Footer/Company/OurStory";
import Sustainability from "./pages/Footer/Company/Sustainability";
import Careers from "./pages/Footer/Company/Careers";
import Terms from "./pages/Footer/Company/Terms";
import Privacy from "./pages/Footer/Company/Privacy";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading && isAuthenticated === false) {
    return <Loader />;
  }

  if (loading === false && isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user && user.role !== "admin") {
    return <Navigate to="/" />;
  }

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
      <ScrollToTop />

      <PromotionBar />
      <Navbar
        onBurgerClick={() => setSidebarOpen(true)}
        onCartClick={() => {}}
      />
      <SidebarMenu open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/store" element={<Store />} />
        <Route path="/category/:category" element={<CategoryPage />} />

        {/* FOOTER PUBLIC */}
        <Route path="/newborn" element={<Newborn />} />
        <Route path="/baby" element={<Baby />} />
        <Route path="/toddler" element={<Toddler />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/shippinginfo" element={<ShippingInfo />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<OurStory />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* ADMIN */}
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

        {/* SECURE USER ROUTES */}
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

        {/* SUCCESS PUBLIC */}
        <Route path="/success" element={<Success />} />
      </Routes>

      <ToastContainer position="bottom-center" autoClose={3000} />
      <Footer />
    </Router>
  );
}

export default App;
