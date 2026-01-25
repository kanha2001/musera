import React from "react";
import Sidebar from "./Sidebar";
import "../../pages/Account/Account.css";
import { useLocation, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const AccountLayout = ({ children }) => {
  const location = useLocation();
  const { loading, user } = useSelector((state) => state.user); // User bhi check karo

  const isRootAccountPage = location.pathname === "/account";
  const isMobile = window.innerWidth <= 768;

  // LOOP FIX: Sirf tab Loader dikhao jab user bilkul na ho AUR loading true ho
  // Agar user pehle se hai (LocalStorage se), to Loader mat dikhao, page dikhao
  if (loading && !user) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="account-wrapper">
      <div
        className="account-sidebar-area"
        style={isMobile && !isRootAccountPage ? { display: "none" } : {}}
      >
        <Sidebar />
      </div>

      <div
        className="account-main-area"
        style={isMobile && isRootAccountPage ? { display: "none" } : {}}
      >
        <div className="mobile-header">
          {isMobile && !isRootAccountPage && (
            <Link to="/account" className="mobile-back-btn">
              <ChevronLeft size={24} color="#333" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
