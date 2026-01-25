import React, { useState, useEffect } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductDetails,
  getProducts,
  newReview,
  clearErrors,
  resetReviewSuccess,
} from "../../features/productSlice";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Minus,
  Plus,
  Star,
  Truck,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import { addItemToCart } from "../../features/cartSlice";

const BACKEND_URL = "http://localhost:4000";

const getImageUrl = (img) => {
  if (!img || !img.url)
    return "https://via.placeholder.com/500x500?text=No+Image";
  let finalUrl = img.url;
  if (typeof finalUrl === "string" && finalUrl.startsWith("/uploads")) {
    return `${BACKEND_URL}${finalUrl}`;
  }
  return finalUrl;
};

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    product,
    loading,
    error,
    success,
    products: allProducts,
  } = useSelector((state) => state.products);

  const [activeImg, setActiveImg] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [openSection, setOpenSection] = useState("desc");
  const [showFullTitle, setShowFullTitle] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
      dispatch(getProducts());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product._id) {
      if (product.images && product.images.length > 0) {
        const firstValidImg = product.images.find((img) => img?.url);
        if (firstValidImg) {
          setActiveImg(getImageUrl(firstValidImg));
        }
      }
      if (product.colors && product.colors.length > 0) {
        setActiveColor(product.colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success("Review Submitted Successfully!");
      dispatch(resetReviewSuccess());
      dispatch(getProductDetails(id));
      setRating(0);
      setComment("");
    }
  }, [error, success, dispatch, id]);

  // 🔥 AMAZON RATING CALCULATION
  const getAvgRating = () => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (total / product.reviews.length).toFixed(1);
  };

  const avgRating = getAvgRating();

  const changeQty = (delta) => {
    setQty((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      const availableStock =
        (selectedSize &&
          product.sizes?.find((s) => s.size === selectedSize)?.stock) ||
        product.stock;
      if (availableStock && next > availableStock) return availableStock;
      return next;
    });
  };

  const addToCartHandler = () => {
    // 🔥 CHECK SIZE FIRST
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first!");
      return;
    }

    const sizeStock =
      selectedSize && product.sizes?.find((s) => s.size === selectedSize);
    const availableStock = sizeStock ? sizeStock.stock : product.stock;

    // 🔥 OUT OF STOCK CHECK
    if (availableStock < 1) {
      toast.error("This product is out of stock!");
      return;
    }

    const imageUrl = product.images?.[0]?.url
      ? getImageUrl(product.images[0])
      : "https://via.placeholder.com/200";

    const cartData = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      stock: availableStock,
      quantity: qty,
      size: selectedSize || "Standard",
      color: activeColor || "Standard",
    };

    dispatch(addItemToCart(cartData));
    toast.success("Added to Cart Successfully!");
  };

  const submitReviewHandler = () => {
    if (rating === 0 || comment.trim() === "") {
      toast.error("Please select stars and write a comment");
      return;
    }
    dispatch(newReview({ rating, comment, productId: id }));
  };

  const toggleSection = (sec) => {
    setOpenSection(openSection === sec ? "" : sec);
  };

  const relatedProducts = allProducts
    ? allProducts.filter((item) => item._id !== id).slice(0, 4)
    : [];

  // 🔥 SIZE STOCK CHECK (for individual sizes)
  const getSizeStock = (size) => {
    return (
      product.sizes?.find((s) => s.size === size)?.stock || product.stock || 0
    );
  };

  // 🔥 GENERAL OUT OF STOCK CHECK (for banner)
  const isOutOfStock = () => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.every((s) => s.stock === 0);
    }
    return product.stock <= 0;
  };

  // 🔥 BUTTON DISABLED LOGIC
  const isAddToCartDisabled = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return true;
    const sizeStock =
      selectedSize && product.sizes?.find((s) => s.size === selectedSize);
    const availableStock = sizeStock ? sizeStock.stock : product.stock;
    return availableStock < 1;
  };

  if (loading) return <div className="prd-loading">Loading...</div>;
  if (!product || !product._id)
    return <div className="prd-loading">Product Not Found</div>;

  return (
    <div className="prd-shell">
      <div className="prd-main">
        <div className="prd-grid">
          {/* LEFT: Images */}
          <div className="prd-col-left">
            <div className="prd-main-img-wrap">
              <img
                src={activeImg}
                alt={product.name}
                className="prd-main-img"
              />
            </div>
            <div className="prd-thumb-row">
              {product.images
                ?.filter((img) => img?.url && img.url.trim() !== "")
                .slice(0, 4)
                .map((img, i) => {
                  const url = getImageUrl(img);
                  return (
                    <button
                      key={`thumb-${i}`}
                      className={`prd-thumb-btn ${activeImg === url ? "active" : ""}`}
                      onClick={() => setActiveImg(url)}
                    >
                      <img src={url} alt="thumb" />
                    </button>
                  );
                }) || null}
            </div>
          </div>

          {/* RIGHT: Info Card + AMAZON RATING */}
          <div className="prd-col-right">
            <div className="prd-info-card">
              {/* Title */}
              <h1
                className="prd-title"
                onClick={() => setShowFullTitle(!showFullTitle)}
                title={product.name}
              >
                {showFullTitle || product.name.length < 60
                  ? product.name
                  : product.name.slice(0, 60) + "..."}
              </h1>

              {/* 🔥 AMAZON RATING */}
              <div className="prd-rating-main">
                <div className="prd-stars-main">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(avgRating) ? "#1a1a1a" : "none"}
                      stroke="#1a1a1a"
                    />
                  ))}
                </div>
                <span className="prd-rating-score">{avgRating}</span>
                <span className="prd-review-count">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="prd-price">₹{product.price}</div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="prd-block">
                  <div className="prd-block-head">
                    <span className="prd-label">COLOR</span>
                    <span className="prd-value">{activeColor}</span>
                  </div>
                  <div className="prd-options-row">
                    {product.colors.map((c, i) => (
                      <button
                        key={`color-${i}`}
                        className={`prd-swatch ${activeColor === c ? "active" : ""} ${c.toLowerCase()}`}
                        onClick={() => setActiveColor(c)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="prd-block">
                  <div className="prd-block-head">
                    <span className="prd-label">SIZE</span>
                    <span className="prd-link-btn">Size Chart</span>
                  </div>
                  <div className="prd-options-row">
                    {product.sizes.map((sizeObj, i) => (
                      <button
                        key={`size-${sizeObj.size}-${i}`}
                        className={`prd-pill ${selectedSize === sizeObj.size ? "active" : ""} ${sizeObj.stock === 0 ? "out-of-stock" : ""}`}
                        onClick={() => setSelectedSize(sizeObj.size)}
                        disabled={sizeObj.stock === 0}
                      >
                        {sizeObj.size}
                        <span>({sizeObj.stock})</span>
                      </button>
                    ))}
                  </div>
                  {isOutOfStock() && (
                    <div className="prd-out-of-stock">OUT OF STOCK</div>
                  )}
                </div>
              )}

              {/* 🔥 BUTTON ALWAYS VISIBLE - DISABLED WHEN OUT OF STOCK */}
              <div className="prd-action-row">
                <div className="prd-qty-control">
                  <button
                    onClick={() => changeQty(-1)}
                    disabled={qty <= 1 || isAddToCartDisabled()}
                  >
                    <Minus size={18} />
                  </button>
                  <span>{qty}</span>
                  <button
                    onClick={() => changeQty(1)}
                    disabled={isAddToCartDisabled()}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  className={`prd-add-btn ${isAddToCartDisabled() ? "out-of-stock" : ""}`}
                  onClick={addToCartHandler}
                >
                  {isAddToCartDisabled() ? "OUT OF STOCK" : "ADD TO CART"}
                </button>
              </div>

              <div className="prd-delivery-note">
                <Truck size={16} /> Free delivery on orders over ₹999
              </div>

              {/* Accordion */}
              <div className="prd-accordion">
                <div
                  className={`prd-acc-item ${openSection === "desc" ? "open" : ""}`}
                >
                  <button
                    className="prd-acc-head"
                    onClick={() => toggleSection("desc")}
                  >
                    <span>Product Description</span>
                    <ChevronDown size={18} className="prd-acc-icon" />
                  </button>
                  {openSection === "desc" && (
                    <div className="prd-acc-body">
                      {product.description || "No description available."}
                    </div>
                  )}
                </div>
                <div
                  className={`prd-acc-item ${openSection === "fit" ? "open" : ""}`}
                >
                  <button
                    className="prd-acc-head"
                    onClick={() => toggleSection("fit")}
                  >
                    <span>Size & Fit</span>
                    <ChevronDown size={18} className="prd-acc-icon" />
                  </button>
                  {openSection === "fit" && (
                    <div className="prd-acc-body">
                      {product.sizeFit || "Standard fit for all sizes."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="prd-reviews-section">
          <h3 className="prd-sec-title">Customer Reviews</h3>

          <div className="prd-review-write">
            <div className="prd-review-write-header">
              <h4>Write a Review</h4>
              <div className="prd-review-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={22}
                    className={rating >= s ? "filled" : ""}
                    fill={rating >= s ? "#1a1a1a" : "none"}
                    stroke="#1a1a1a"
                    onClick={() => setRating(s)}
                  />
                ))}
              </div>
            </div>
            <textarea
              placeholder="Share your experience with your item. Maximum 150 characters"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={150}
            />
            <button className="prd-submit-review" onClick={submitReviewHandler}>
              SUBMIT REVIEW
            </button>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="prd-reviews-list">
              {product.reviews.map((rev, i) => (
                <div key={`rev-${i}`} className="prd-review-item">
                  <div className="prd-review-header">
                    <span className="prd-review-name">{rev.name}</span>
                    <div className="prd-review-stars">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={16}
                          fill={idx < rev.rating ? "#1a1a1a" : "none"}
                          stroke="#1a1a1a"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="prd-review-text">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="prd-no-reviews">
              <p>Be the first to review this product.</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="prd-related">
            <h3 className="prd-related-title">Related Products</h3>
            <div className="prd-related-grid">
              {relatedProducts.map((item) => (
                <Link
                  to={`/product/${item._id}`}
                  key={item._id}
                  className="prd-related-card"
                >
                  <img
                    src={
                      item.images?.[0]?.url
                        ? getImageUrl(item.images[0])
                        : "https://via.placeholder.com/200"
                    }
                    alt={item.name}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
