// src/components/layout/SidebarMenu/SidebarMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  X,
  ChevronDown,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useSelector } from "react-redux";
import "./SidebarMenu.css";

function SidebarMenu({ open, onClose }) {
  const [openMenu, setOpenMenu] = useState(null);

  // ✅ Redux se user
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const userName = isAuthenticated && user?.name ? user.name : "Guest";

  const toggleMenu = (key) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  if (!open) return null;

  return (
    <div className="ms-side-overlay" onClick={onClose}>
      <aside className="ms-side-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top row: user + close */}
        <div className="ms-side-header">
          <Link to="/account" className="ms-user-pill-link" onClick={onClose}>
            <button className="ms-user-pill">
              <User size={16} />
              <span>{userName}</span>
            </button>
          </Link>
          <button className="ms-close-btn" onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        {/* ...baaki code same rakho (menu, social icons etc.) */}
        {/* ↓ yahan se tumhara original nav/social code without changes */}
        {/* 🔥 SINGLE /store WITH FILTERS */}
        <nav className="ms-side-menu">
          <Link
            to="/store?filter=latest"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">NEW ARRIVALS</button>
          </Link>

          <Link
            to="/store?filter=popular"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">BESTSELLERS</button>
          </Link>

          <Link to="/shop" className="ms-menu-link-wrapper" onClick={onClose}>
            <button className="ms-menu-item">ALL PRODUCTS</button>
          </Link>

          <Link
            to="/store?filter=sale"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">SALE</button>
          </Link>

          <Link
            to="/account"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">MY ACCOUNT</button>
          </Link>

          <Link
            to="/orders"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">ORDERS</button>
          </Link>
        </nav>

        <div className="ms-side-social">
          {/* social links same */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Instagram size={18} />
            </button>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Facebook size={18} />
            </button>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Youtube size={18} />
            </button>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Twitter size={18} />
            </button>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>
              <Linkedin size={18} />
            </button>
          </a>
        </div>
      </aside>
    </div>
  );
}

export default SidebarMenu;
