import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import {
  Search,
  ShoppingBag,
  User,
  X,
  Menu,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import CartModel from "../../../pages/CartModel/CartModel";

function Navbar({ onBurgerClick }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 PERFECT REDUX SELECTORS
  const userState = useSelector((state) => state.user || {});
  const cartState = useSelector((state) => state.cart || { cartItems: [] });
  const wishlistState = useSelector(
    (state) => state.wishlist || { wishlistItems: [] }
  );

  const { isAuthenticated = false } = userState;
  const { cartItems = [] } = cartState;
  const { wishlistItems = [] } = wishlistState;

  // 🔥 PERFECT COUNTS
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const toggleCart = () => setCartOpen(!cartOpen);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        {/* Burger */}
        <div className="navbar-left">
          <button className="icon-btn burger-btn" onClick={onBurgerClick}>
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Logo */}
        <div className={`navbar-logo ${searchOpen ? "logo-hidden" : ""}`}>
          <Link to="/" className="navbar-logo-link">
            MUSERA
          </Link>
        </div>

        {/* Right Icons */}
        <div className="navbar-right">
          {/* Search */}
          {/* <div className={`search-wrapper ${searchOpen ? "active" : ""}`}>
            <form onSubmit={handleSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  ref={searchInputRef}
                  className="search-bar"
                  type="text"
                  placeholder="Search shirt, jacket..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </form>
            <button
              className="icon-btn search-toggle"
              onClick={toggleSearch}
              type="button"
            >
              {searchOpen ? (
                <X size={22} />
              ) : (
                <Search size={22} strokeWidth={1.5} />
              )}
            </button>

            {showResults && searchQuery.length >= 2 && (
              <div className="search-dropdown">
                <div className="search-suggestion">
                  🔍 Searching for "{searchQuery}"...
                </div>
                <div className="search-see-all" onClick={handleSubmit}>
                  <span>View All Results</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            )}
          </div> */}

          {/* 🔥 FIXED WISHLIST - PERFECT POSITION */}
          <Link
            to="/wishlist"
            className={`icon-btn wishlist-link ${
              searchOpen ? "hide-on-mobile" : ""
            }`}
          >
            <Heart size={22} strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="notification-badge">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* 🔥 FIXED CART - PERFECT POSITION */}
          <button
            className={`icon-btn cart-btn ${
              searchOpen ? "hide-on-mobile" : ""
            }`}
            onClick={toggleCart}
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="notification-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* User */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className={`icon-btn user-link ${
              searchOpen ? "hide-on-mobile" : ""
            }`}
          >
            <User size={22} strokeWidth={1.5} />
          </Link>
        </div>
      </nav>

      <CartModel open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;
