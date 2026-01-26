import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../features/productSlice";
import { addItemToCart } from "../../features/cartSlice";
import { toast } from "react-toastify";
import "./Category.css";
import heroBg from "../Assets/hero8.png";

// ✅ Backend URL (env + fallback)
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const CategoryPage = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);

  const getBackendCategory = (urlCategory) => {
    const mapping = {
      boys: "boy",
      girls: "girl",
      unisex: "unisex",
      "new-arrivals": "New Arrival",
      organic: "Organic",
      playwear: "Playwear",
      seasonal: "Seasonal",
      occasion: "Occasion",
      sleep: "Sleep",
      gifts: "Gifts",
      accessories: "Accessories",
      "t-shirts": "T-Shirts",
      shirts: "Shirts",
      jeans: "Jeans",
      trousers: "Trousers",
      jackets: "Jackets",
      hoodies: "Hoodies",
      sweaters: "Sweaters",
      shorts: "Shorts",
      "track-pants": "Track Pants",
      winter: "Winter",
    };
    return mapping[urlCategory] || urlCategory;
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    const backendCategory = getBackendCategory(category);
    dispatch(
      getProducts({
        category: backendCategory,
        currentPage: 1,
        keyword: "",
        price: [0, 25000],
      }),
    );
  }, [category, dispatch, error]);

  const categoryTitle =
    {
      boys: "Boys Collection",
      girls: "Girls Collection",
      unisex: "Unisex Collection",
    }[category] ||
    category?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const getImageUrl = (product) => {
    const img = product.images?.[0];
    if (!img || !(img.url || img)) {
      return "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image";
    }
    const raw = typeof img === "string" ? img : img.url;
    if (raw?.startsWith("/uploads")) {
      return `${BACKEND_URL}${raw}`;
    }
    return (
      raw ||
      "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image"
    );
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: getImageUrl(product),
      stock: product.stock || 10,
    };

    dispatch(addItemToCart(cartItem));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.product === productId);
  };

  if (loading) {
    return (
      <div className="boy-loading">
        <div className="spinner"></div>
        <h2>Loading {categoryTitle}...</h2>
      </div>
    );
  }

  return (
    <div className="boy-page">
      <header className="boy-hero">
        <div className="boy-hero-overlay"></div>
        <img
          src={heroBg}
          alt={`${categoryTitle} Background`}
          className="boy-hero-bg-img"
        />
        <div className="boy-hero-container">
          <div className="boy-hero-text">
            <h1>{categoryTitle}</h1>
            <p>{products?.length || 0} Cozy styles for the season</p>
          </div>
        </div>
      </header>

      <section className="boy-content">
        {products && products.length > 0 ? (
          <div className="boy-grid">
            {products.slice(0, 12).map((product) => (
              <Link
                to={`/product/${product._id}`}
                className="boy-card-link"
                key={product._id}
              >
                <div className="boy-card">
                  <div className="boy-card-img-wrap">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x400/f0ebe5/999?text=No+Image";
                      }}
                    />
                    <button className="quick-view-btn">Quick View</button>
                  </div>

                  <div className="boy-card-details">
                    <h3 className="boy-card-name">{product.name}</h3>
                    <span className="boy-card-price">
                      €{product.price?.toLocaleString()}
                    </span>
                  </div>

                  <button
                    className={`boy-add-btn ${
                      isInCart(product._id) ? "in-cart" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    {isInCart(product._id) ? "✅ In Cart" : "Add to Cart"}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <div className="empty-illustration">🧸✨</div>
              <h2>{categoryTitle} is Empty!</h2>
              <p>Check back soon for new arrivals</p>
              <Link to="/shop" className="empty-btn">
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
