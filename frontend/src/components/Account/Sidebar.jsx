import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Package,
  Heart,
  Key,
  LogOut,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { logoutUser } from "../../features/userSlice";
import { toast } from "react-toastify";
import "./Sidebar.css";

// CHANGE: Port 4000 rakha hai jaisa aapne bataya
const SERVER_URL = "http://localhost:4000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { name: "Overview", path: "/account", icon: <LayoutDashboard size={20} /> },
    { name: "My Orders", path: "/orders", icon: <Package size={20} /> },
    { name: "My Wishlist", path: "/wishlist", icon: <Heart size={20} /> },
    { name: "Update Profile", path: "/me/update", icon: <User size={20} /> },
    {
      name: "Change Password",
      path: "/password/update",
      icon: <Key size={20} />,
    },
  ];

  // --- FINAL CORRECT IMAGE LOGIC ---
  let avatarUrl = DEFAULT_AVATAR;

  if (user?.avatar) {
    if (user.avatar.url) {
      avatarUrl = user.avatar.url;
    } else if (typeof user.avatar === "string") {
      if (user.avatar.startsWith("http")) {
        avatarUrl = user.avatar;
      } else {
        // SMART FIX: Filename ko clean karo
        // Agar DB mein "uploads/image.png" hai, to sirf "image.png" nikaalo
        const filenameOnly = user.avatar.split(/[/\\]/).pop();

        // Ab sahi URL banao
        avatarUrl = `${SERVER_URL}/uploads/users/${filenameOnly}`;
      }
    }
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="sidebar-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />
        <div className="sidebar-user-details">
          <h4>{user?.name || "User Name"}</h4>
          <p>{user?.email || "user@example.com"}</p>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link
            to={item.path}
            key={index}
            className={`sidebar-link ${isActive(item.path)}`}
          >
            <div className="link-content">
              {item.icon}
              <span>{item.name}</span>
            </div>
            <ChevronRight className="mobile-arrow" size={18} />
          </Link>
        ))}
      </div>

      <div className="sidebar-menu logout-section">
        <div onClick={handleLogout} className="sidebar-link logout-btn">
          <div className="link-content">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
