import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getMyWishlist,
  toggleWishlist,
  clearWishlistErrors,
  clearWishlistMessage,
} from "../../features/wishlistSlice";
import { addItemToCart } from "../../features/cartSlice";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../Assets/hero6.png";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems, loading, error, message } = useSelector(
    (state) => state.wishlist,
  );

  useEffect(() => {
    dispatch(getMyWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearWishlistErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(clearWishlistMessage());
      dispatch(getMyWishlist());
    }
  }, [dispatch, error, message]);

  const deleteHandler = (productId) => {
    dispatch(toggleWishlist({ productId }));
  };

  const addToCartHandler = (item) => {
    if (item.stock < 1) return;

    dispatch(
      addItemToCart({
        product: item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        stock: item.stock,
      }),
    );
    toast.success("Moved to Cart 🛒");
  };

  const navigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="boy-loading">
        <div className="spinner"></div>
        <h2>Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="boy-page">
      {/* 🔥 HERO SECTION */}
      <header className="boy-hero">
        <div className="boy-hero-overlay"></div>
        <img src={heroBg} alt="Wishlist" className="boy-hero-bg-img" />
        <div className="boy-hero-container">
          <div className="boy-hero-text">
            <h1>My Wishlist</h1>
            <p>{wishlistItems?.length || 0} items you love</p>
          </div>
        </div>
      </header>

      {/* 🔥 PRODUCTS GRID */}
      <section className="boy-content">
        {wishlistItems && wishlistItems.length > 0 ? (
          <div className="boy-grid">
            {wishlistItems.map((item) => (
              <div className="boy-card" key={item.product}>
                <div
                  className="boy-card-img-wrap"
                  onClick={() => navigateToProduct(item.product)}
                >
                  <img
                    src={
                      item.image?.startsWith("/uploads")
                        ? `http://localhost:4000${item.image}`
                        : item.image ||
                          "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image"
                    }
                    alt={item.name}
                  />
                  {/* 🔥 REMOVED HEART ICON */}
                  {item.stock < 1 && (
                    <div className="out-of-stock-overlay">
                      <span>Out of Stock</span>
                    </div>
                  )}
                  <button className="quick-view-btn">Quick View</button>
                </div>

                <div className="boy-card-details">
                  <h3
                    className="boy-card-name"
                    onClick={() => navigateToProduct(item.product)}
                  >
                    {item.name}
                  </h3>
                  <span className="boy-card-price">
                    €{item.price?.toLocaleString()}
                  </span>

                  <div className="wishlist-actions">
                    <button
                      className={`boy-add-btn ${item.stock < 1 ? "disabled" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCartHandler(item);
                      }}
                      disabled={item.stock < 1}
                    >
                      {item.stock < 1 ? "Sold Out" : "Move to Cart"}
                    </button>

                    {/* 🔥 SIMPLE DELETE ICON BUTTON */}
                    <button
                      className="wishlist-delete-icon"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteHandler(item.product);
                      }}
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-illustration">💖</div>
              <h2>Your Wishlist is Empty</h2>
              <p>Add some favorites to save them for later</p>
              <Link to="/shop" className="empty-btn">
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Wishlist;
