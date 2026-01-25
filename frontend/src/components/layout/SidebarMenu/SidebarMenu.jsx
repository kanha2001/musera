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
import "./SidebarMenu.css";

function SidebarMenu({ open, onClose, userName = "John" }) {
  const [openMenu, setOpenMenu] = useState(null);

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

        {/* 🔥 SINGLE /store WITH FILTERS */}
        <nav className="ms-side-menu">
          {/* 🔥 FILTERS */}
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

          {/* 🔥 ALL PRODUCTS - SHOP PAGE */}
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

          {/* <Link
            to="/store?filter=deal"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">DEAL OF THE DAY</button>
          </Link> */}

          {/* 🔥 CATEGORY SUBMENU - SAME AS BEFORE */}
          {/* <div className="ms-menu-group">
            <button
              className="ms-menu-item has-arrow"
              onClick={() => toggleMenu("shop")}
            >
              <span>SHOP</span>
              <span className={openMenu === "shop" ? "arrow up" : "arrow"}>
                <ChevronDown size={20} />
              </span>
            </button>

            {openMenu === "shop" && (
              <div className="ms-submenu">
                <Link
                  to="/store?category=tshirts"
                  className="ms-sub-link-wrapper"
                  onClick={onClose}
                >
                  <button className="ms-sub-item">T‑Shirts</button>
                </Link>
                <Link
                  to="/store?category=shirts"
                  className="ms-sub-link-wrapper"
                  onClick={onClose}
                >
                  <button className="ms-sub-item">Shirts</button>
                </Link>
                <Link
                  to="/store?category=trousers"
                  className="ms-sub-link-wrapper"
                  onClick={onClose}
                >
                  <button className="ms-sub-item">Trousers</button>
                </Link>
                <Link
                  to="/store?category=jeans"
                  className="ms-sub-link-wrapper"
                  onClick={onClose}
                >
                  <button className="ms-sub-item">Jeans</button>
                </Link>
              </div>
            )}
          </div> */}

          {/* MY ACCOUNT  */}
          <Link
            to="/account"
            className="ms-menu-link-wrapper"
            onClick={onClose}
          >
            <button className="ms-menu-item">MY ACCOUNT</button>
          </Link>

          {/* 🔥 ORDERS */}
          <Link to="/orders" className="ms-menu-link-wrapper" onClick={onClose}>
            <button className="ms-menu-item">ORDERS</button>
          </Link>
        </nav>

        {/* SOCIAL ICONS */}
        <div className="ms-side-social">
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
