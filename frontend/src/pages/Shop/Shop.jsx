import React, { useState, useEffect, useMemo } from "react";
import "./Shop.css";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../features/productSlice";
import {
  toggleWishlist,
  getMyWishlist,
  clearWishlistErrors,
  clearWishlistMessage,
} from "../../features/wishlistSlice";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const CATEGORY_TABS = [
  "ALL",
  "SHIRTS",
  "T-SHIRTS",
  "JEANS",
  "OVERSHIRT",
  "TROUSERS",
  "CARGO PANTS",
  "SWEATERS",
  "JACKETS",
  "SWEATSHIRTS",
  "LUXE",
];

const NEW_CATEGORIES = [
  "New Arrival",
  "Organic",
  "Playwear",
  "Seasonal",
  "Occasion",
  "Sleep",
  "Gifts",
  "Accessories",
  "T-Shirts",
  "Shirts",
  "Jeans",
  "Trousers",
  "Jackets",
  "Hoodies",
  "Sweaters",
  "Shorts",
  "Track Pants",
  "Winter",
];

const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
];
const COLOR_OPTIONS = [
  "Black",
  "White",
  "Blue",
  "Green",
  "Beige",
  "Red",
  "Yellow",
  "Pink",
  "Grey",
  "Navy",
];
const RATING_OPTIONS = ["5⭐", "4⭐", "3⭐", "2⭐", "1⭐"];

const FILTER_CONFIG = [
  { label: "CATEGORY", type: "category", options: NEW_CATEGORIES },
  { label: "PRICE", type: "range", min: 0, max: 5000 },
  { label: "SIZE", type: "size", options: SIZE_OPTIONS },
  { label: "COLOR", type: "color", options: COLOR_OPTIONS },
  { label: "RATING", type: "rating", options: RATING_OPTIONS },
];

const BACKEND_URL = "http://localhost:4000";

const safeString = (value) => {
  if (value == null) return "";
  return String(value || "")
    .toLowerCase()
    .trim();
};

const safeNumber = (value) => {
  return Number(value) || 0;
};

const ProductImageSlider = ({
  images = [],
  name = "",
  productId = "",
  price = 0,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const { wishlistItems = [] } = useSelector(
    (state) => state.wishlist || { wishlistItems: [] },
  );
  const isInWishlist =
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item?.product === productId);

  useEffect(() => {
    let interval;
    if (isHovered && Array.isArray(images) && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImgIndex((prev) => (prev + 1) % images.length);
      }, 1000);
    } else {
      setCurrentImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images]);

  const getImageUrl = (img) => {
    if (!img)
      return "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image";
    try {
      const finalUrl = typeof img === "string" ? img : img.url || img;
      if (finalUrl?.startsWith("/uploads")) {
        return `${BACKEND_URL}${finalUrl}`;
      }
      return (
        finalUrl ||
        "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image"
      );
    } catch {
      return "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image";
    }
  };

  const currentSrc =
    Array.isArray(images) && images.length > 0
      ? getImageUrl(images[Math.min(currentImgIndex, images.length - 1)])
      : "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image";

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        productId,
        name,
        price,
        image: getImageUrl(images[0]),
      }),
    );
  };

  return (
    <div
      className="shop-card-img-wrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={currentSrc}
        alt={name}
        onError={(e) =>
          (e.target.src =
            "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image")
        }
      />
      <button
        className={`shop-heart ${isInWishlist ? "active" : ""}`}
        onClick={handleWishlistClick}
      >
        <Heart
          size={15}
          strokeWidth={0.7}
          fill={isInWishlist ? "#e74c3c" : "none"}
          color="#111"
        />
      </button>
      {isHovered && Array.isArray(images) && images.length > 1 && (
        <div className="slider-dots">
          {images.slice(0, 5).map((_, idx) => (
            <span
              key={idx}
              className={idx === currentImgIndex ? "dot active" : "dot"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function Shop() {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products || {});
  const wishlistState = useSelector((state) => state.wishlist || {});

  const { loading = false, error, products = [] } = productsState;
  const { error: wishlistError, message: wishlistMessage } = wishlistState;

  const [openFilters, setOpenFilters] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL"); // 🔥 TOP TABS STATE
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    const initFilters = FILTER_CONFIG.reduce(
      (acc, f) => ({ ...acc, [f.label]: false }),
      {},
    );
    setOpenFilters(initFilters);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProducts());
    dispatch(getMyWishlist());
  }, [dispatch, error]);

  useEffect(() => {
    if (wishlistError) {
      toast.error(wishlistError);
      dispatch(clearWishlistErrors());
    }
    if (wishlistMessage) {
      toast.success(wishlistMessage);
      dispatch(clearWishlistMessage());
      dispatch(getMyWishlist());
    }
  }, [dispatch, wishlistError, wishlistMessage]);

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 🔥 TOP TABS HANDLER
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    toast.info(`Showing ${tab} products`);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value) || 5000]);
  };

  // 🔥 FIXED FILTERING - WORKING CATEGORY TABS + SIDE FILTERS
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      try {
        // 🔥 TOP TABS FILTER (PRIORITY 1)
        if (activeTab !== "ALL") {
          const productText =
            safeString(product.category) + " " + safeString(product.name);
          if (!productText.includes(safeString(activeTab))) {
            return false;
          }
        }

        // Side Category filter
        if (selectedCategories.length > 0) {
          const productText =
            safeString(product.category) + " " + safeString(product.name);
          const matchesCategory = selectedCategories.some((cat) =>
            productText.includes(safeString(cat)),
          );
          if (!matchesCategory) return false;
        }

        // Price filter
        const productPrice = safeNumber(product.price);
        if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
          return false;
        }

        // Size filter
        if (selectedSizes.length > 0) {
          const productSizes = Array.isArray(product.availableSizes)
            ? product.availableSizes.map(safeString)
            : safeString(product.size).split(",");
          const matchesSize = selectedSizes.some((size) =>
            productSizes.some((ps) => ps.includes(safeString(size))),
          );
          if (!matchesSize) return false;
        }

        // Color filter
        if (selectedColors.length > 0) {
          const productColors = Array.isArray(product.colors)
            ? product.colors.map(safeString)
            : safeString(product.color).split(",");
          const matchesColor = selectedColors.some((color) =>
            productColors.some((pc) => pc.includes(safeString(color))),
          );
          if (!matchesColor) return false;
        }

        // Rating filter
        if (selectedRatings.length > 0) {
          const productRating = safeNumber(product.ratings || product.rating);
          const matchesRating = selectedRatings.some((rating) => {
            const ratingValue = parseInt(rating.charAt(0));
            return productRating >= ratingValue;
          });
          if (!matchesRating) return false;
        }

        return true;
      } catch (err) {
        console.warn("Filter error for product:", product, err);
        return true;
      }
    });
  }, [
    products,
    activeTab,
    selectedCategories,
    priceRange,
    selectedSizes,
    selectedColors,
    selectedRatings,
  ]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aPrice = safeNumber(a.price);
      const bPrice = safeNumber(b.price);

      if (sort === "low-high") return aPrice - bPrice;
      if (sort === "high-low") return bPrice - aPrice;
      return 0;
    });
  }, [filteredProducts, sort]);

  const applyFilters = () => {
    toast.success(`Filters Applied! Showing ${sortedProducts.length} products`);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedRatings([]);
    setPriceRange([0, 5000]);
    toast.info("Filters Cleared");
  };

  return (
    <div className="shop-page">
      <aside className="shop-filters">
        {FILTER_CONFIG.map((f) => (
          <div key={f.label} className="filter-section">
            <button
              className="filter-header"
              onClick={() => toggleFilter(f.label)}
            >
              <span>{f.label}</span>
              <span className="filter-toggle">
                {openFilters[f.label] ? "−" : "+"}
              </span>
            </button>

            {openFilters[f.label] && (
              <div className="filter-body">
                {f.type === "category" && (
                  <div className="scrollable-category-list">
                    {f.options.map((category) => (
                      <label key={category} className="filter-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                )}

                {f.type === "range" && (
                  <div className="price-range-filter">
                    <div className="range-display">
                      €{priceRange[1].toLocaleString()}
                    </div>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      className="price-slider"
                    />
                    <div className="range-labels">
                      <span>€0</span>
                      <span>€{f.max.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {f.type === "size" && (
                  <>
                    <div className="size-grid">
                      {f.options.slice(0, 9).map((size) => (
                        <button
                          key={size}
                          className={`size-chip ${selectedSizes.includes(size) ? "active" : ""}`}
                          onClick={() => handleSizeToggle(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <button className="size-view-more">View More</button>
                  </>
                )}

                {f.type === "color" && (
                  <div className="color-grid">
                    {f.options.map((color) => (
                      <button
                        key={color}
                        className={`color-chip ${selectedColors.includes(color) ? "active" : ""}`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => handleColorToggle(color)}
                      />
                    ))}
                  </div>
                )}

                {f.type === "rating" && (
                  <div className="rating-grid">
                    {f.options.map((rating) => (
                      <button
                        key={rating}
                        className={`rating-chip ${selectedRatings.includes(rating) ? "active" : ""}`}
                        onClick={() => handleRatingToggle(rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="filter-footer">
          <button className="filter-clear" onClick={clearAllFilters}>
            CLEAR
          </button>
          <button className="filter-apply" onClick={applyFilters}>
            APPLY ({sortedProducts.length})
          </button>
        </div>
      </aside>

      <main className="shop-content">
        <div className="shop-top-row">
          {/* 🔥 WORKING CATEGORY TABS */}
          <div className="shop-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                className={`shop-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="shop-sort">
            <label className="sort-label">
              Sort
              <div className="sort-select-wrap">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">Popular</option>
                  <option value="new">NEW</option>
                  <option value="high-low">Price: High to low</option>
                  <option value="low-high">Price: low to high</option>
                </select>
                <span className="sort-arrow">▾</span>
              </div>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading Products...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters or tabs</p>
          </div>
        ) : (
          <div className="shop-grid">
            {sortedProducts.map((p) => (
              <Link
                key={p._id || p.id || Math.random().toString()}
                to={`/product/${p._id || p.id || "product"}`}
                className="shop-card"
              >
                <ProductImageSlider
                  images={p.images || []}
                  name={p.name || "Product"}
                  price={p.price || 0}
                  productId={p._id || p.id || ""}
                />
                <div className="shop-card-info">
                  <div className="shop-card-name">{p.name || "Product"}</div>
                  <div className="shop-card-price">€{p.price || 0}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Shop;
