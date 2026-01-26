import React, { useEffect } from "react";
import { useSearchParams, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../features/productSlice";
import { addItemToCart } from "../../features/cartSlice";
import heroBg from "../Assets/hero6.png";
import "./Store.css";
import { toast } from "react-toastify";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

function Store() {
  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const filter = searchParams.get("filter") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const params = {
      filter: filter || "latest",
      category: category || "",
      page: 1,
      limit: 20,
    };
    dispatch(getProducts(params));
  }, [dispatch, location.search, filter, category]);

  const filteredProducts =
    products
      ?.filter((product) => {
        if (category && product.category !== category) return false;
        return true;
      })
      ?.slice()
      ?.sort((a, b) => {
        if (filter === "latest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (filter === "popular") {
          return (b.ratings || 0) - (a.ratings || 0);
        } else if (filter === "sale") {
          return (b.discount || 0) - (a.discount || 0);
        }
        return 0;
      }) || [];

  const getPageTitle = () => {
    if (category) return `${category.toUpperCase()} Collection`;
    if (filter === "latest") return "✨ New Arrivals";
    if (filter === "popular") return "⭐ Best Sellers";
    if (filter === "sale") return "🔥 Sale";
    return "🛒 Our Store";
  };

  const getProductImage = (images) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image";
    }

    const first = images[0];

    if (typeof first === "string" && first.startsWith("http")) {
      return first;
    }

    if (typeof first === "string") {
      if (first.startsWith("/uploads")) {
        return `${BACKEND_URL}${first}`;
      }
      return first;
    }

    if (first?.url) {
      if (first.url.startsWith("/uploads")) {
        return `${BACKEND_URL}${first.url}`;
      }
      return first.url;
    }

    return "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image";
  };

  const isInCart = (productId) =>
    cartItems.some((item) => item.product === productId);

  const handleAddToCart = (product) => {
    const image = getProductImage(product.images);
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image,
      stock: product.stock || 10,
    };
    dispatch(addItemToCart(cartItem));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  if (loading) {
    return (
      <div className="boy-loading">
        <div className="spinner"></div>
        <h2>Loading Store...</h2>
      </div>
    );
  }

  return (
    <div className="boy-page">
      {/* HERO */}
      <header className="boy-hero">
        <div className="boy-hero-overlay"></div>
        <img src={heroBg} alt="Store" className="boy-hero-bg-img" />
        <div className="boy-hero-container">
          <div className="boy-hero-text">
            <h1>{getPageTitle()}</h1>
            <p>{filteredProducts.length} products found</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="boy-content">
        {/* FILTER BUTTONS */}
        <div className="store-filters">
          <Link
            to="/store?filter=latest"
            className={`filter-btn ${filter === "latest" ? "active" : ""}`}
          >
            ✨ Latest
          </Link>
          <Link
            to="/store?filter=popular"
            className={`filter-btn ${filter === "popular" ? "active" : ""}`}
          >
            ⭐ Popular
          </Link>
          <Link
            to="/store?filter=sale"
            className={`filter-btn ${filter === "sale" ? "active" : ""}`}
          >
            🔥 Sale
          </Link>
          <Link
            to="/store"
            className={`filter-btn ${!filter && !category ? "active" : ""}`}
          >
            🛒 All
          </Link>
        </div>

        {/* GRID */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-illustration">🛒</div>
              <h2>No Products Found</h2>
              <p>Try different filters or categories</p>
              <Link to="/store" className="empty-btn">
                Back to Store
              </Link>
            </div>
          </div>
        ) : (
          <div className="boy-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="boy-card-wrapper">
                <Link
                  to={`/product/${product._id}`}
                  className="boy-card-link"
                >
                  <div className="boy-card">
                    <div className="boy-card-img-wrap">
                      <img
                        src={getProductImage(product.images)}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image";
                        }}
                      />
                      {product.discount && product.discount > 0 && (
                        <div className="discount-badge">
                          -{Math.round(product.discount)}%
                        </div>
                      )}
                      <button className="quick-view-btn">Quick View</button>
                    </div>

                    <div className="boy-card-details">
                      <h3 className="boy-card-name">{product.name}</h3>

                      <div className="product-price">
                        {product.discount && product.discount > 0 ? (
                          <>
                            <span className="original-price">
                              €{product.price.toLocaleString()}
                            </span>
                            <span className="discounted-price">
                              €
                              {(
                                product.price *
                                (1 - product.discount / 100)
                              ).toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="boy-card-price">
                            €{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {filter === "popular" && product.ratings && (
                        <div className="product-rating">
                          ★ {product.ratings.toFixed(1)}
                          <span className="reviews-count">
                            ({product.numOfReviews || 0})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* ADD TO CART BUTTON like screenshot */}
                <button
                  className={`store-add-btn ${
                    isInCart(product._id) ? "in-cart" : ""
                  }`}
                  onClick={() => handleAddToCart(product)}
                >
                  {isInCart(product._id) ? "✅ IN CART" : "ADD TO CART"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Store;
