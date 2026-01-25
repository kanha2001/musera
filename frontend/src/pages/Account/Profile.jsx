import React, { useEffect } from "react";
import AccountLayout from "../../components/Account/AccountLayout";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { myOrders } from "../../features/userSlice";
import "./Account.css";
import { Package, CheckCircle, Clock } from "lucide-react";

const SERVER_URL = "http://localhost:4000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Profile = () => {
  const { user, loading, isAuthenticated, orders } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    } else {
      dispatch(myOrders());
    }
  }, [isAuthenticated, navigate, dispatch]);

  if (loading) return <Loader />;

  // --- FINAL CORRECT IMAGE LOGIC ---
  let avatarUrl = DEFAULT_AVATAR;

  if (user?.avatar) {
    if (user.avatar.url) {
      avatarUrl = user.avatar.url;
    } else if (typeof user.avatar === "string") {
      if (user.avatar.startsWith("http")) {
        avatarUrl = user.avatar;
      } else {
        // SMART FIX: Filename clean karo
        const filenameOnly = user.avatar.split(/[/\\]/).pop();
        avatarUrl = `${SERVER_URL}/uploads/users/${filenameOnly}`;
      }
    }
  }

  // Stats Logic
  const totalOrders = orders ? orders.length : 0;
  const deliveredOrders = orders
    ? orders.filter((o) => o.orderStatus === "Delivered").length
    : 0;
  const processingOrders = totalOrders - deliveredOrders;

  return (
    <AccountLayout>
      <h2 className="account-heading">Overview</h2>

      <div className="profile-header-card">
        <div className="profile-img-container">
          <img
            src={avatarUrl}
            alt="Profile"
            className="main-profile-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
        </div>
        <div className="profile-text-info">
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <span className="join-date">
            Member since {String(user?.createdAt).substring(0, 10)}
          </span>
        </div>
        <button
          onClick={() => navigate("/me/update")}
          className="edit-profile-btn"
        >
          Edit Profile
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-bg purple">
            <Package size={24} color="#6d28d9" />
          </div>
          <div>
            <h4>{totalOrders}</h4>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg green">
            <CheckCircle size={24} color="#15803d" />
          </div>
          <div>
            <h4>{deliveredOrders}</h4>
            <p>Delivered</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg orange">
            <Clock size={24} color="#c2410c" />
          </div>
          <div>
            <h4>{processingOrders}</h4>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Account Details</h3>
        <div className="info-row">
          <span className="label">Full Name:</span>
          <span className="value">{user?.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Email:</span>
          <span className="value">{user?.email}</span>
        </div>
        <div className="info-row">
          <span className="label">Role:</span>
          <span className="value" style={{ textTransform: "capitalize" }}>
            {user?.role}
          </span>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Profile;
