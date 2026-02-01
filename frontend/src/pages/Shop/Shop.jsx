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

// BACKEND URL env se lo (local + live dono ke liye)
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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
    (state) => state.wishlist || { wishlistItems: [] }
  );
  const isInWishlist =
    Array.isArray(wishlistItems) &&
    wishlistItems.some((item) => item?.product === productId);

  useEffect(() => {
    if (!(isHovered && Array.isArray(images) && images.length > 1)) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % images.length);
    }, 1000);
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
      })
    );
  };

  return (
    <div
      className="new-shop-card-img-wrap"
      onMouseEnter={() => {
        setIsHovered(true);
        setCurrentImgIndex(0);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImgIndex(0);
      }}
    >
      <img
        src={currentSrc}
        alt={name}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/320x420/f0ebe5/999?text=No+Image";
        }}
      />
      <button
        className={`new-shop-heart ${isInWishlist ? "active" : ""}`}
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
        <div className="new-slider-dots">
          {images.slice(0, 5).map((_, idx) => (
            <span
              key={idx}
              className={idx === currentImgIndex ? "new-dot active" : "new-dot"}
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
  const [activeTab, setActiveTab] = useState("ALL");
  const [sort, setSort] = useState("popular");

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const initFilters = FILTER_CONFIG.reduce(
      (acc, f) => ({ ...acc, [f.label]: false }),
      {}
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    toast.info(`Showing ${tab} products`);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value) || 5000]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      try {
        if (activeTab !== "ALL") {
          const productText =
            safeString(product.category) + " " + safeString(product.name);
          if (!productText.includes(safeString(activeTab))) {
            return false;
          }
        }

        if (selectedCategories.length > 0) {
          const productText =
            safeString(product.category) + " " + safeString(product.name);
          const matchesCategory = selectedCategories.some((cat) =>
            productText.includes(safeString(cat))
          );
          if (!matchesCategory) return false;
        }

        const productPrice = safeNumber(product.price);
        if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
          return false;
        }

        if (selectedSizes.length > 0) {
          const productSizes = Array.isArray(product.availableSizes)
            ? product.availableSizes.map(safeString)
            : safeString(product.size).split(",");
          const matchesSize = selectedSizes.some((size) =>
            productSizes.some((ps) => ps.includes(safeString(size)))
          );
          if (!matchesSize) return false;
        }

        if (selectedColors.length > 0) {
          const productColors = Array.isArray(product.colors)
            ? product.colors.map(safeString)
            : safeString(product.color).split(",");
          const matchesColor = selectedColors.some((color) =>
            productColors.some((pc) => pc.includes(safeString(color)))
          );
          if (!matchesColor) return false;
        }

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
    <div className="new-shop-page">
      {/* SIDEBAR / DRAWER */}
      <aside
        className={`new-shop-filters ${
          isMobileFiltersOpen ? "new-open" : ""
        }`}
      >
        <div className="new-shop-filters-header-mobile">
          <span>Filters</span>
          <button
            className="new-shop-filters-close-btn"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            ✕
          </button>
        </div>

        {FILTER_CONFIG.map((f) => (
          <div key={f.label} className="new-filter-section">
            <button
              className="new-filter-header"
              onClick={() => toggleFilter(f.label)}
            >
              <span>{f.label}</span>
              <span className="new-filter-toggle">
                {openFilters[f.label] ? "−" : "+"}
              </span>
            </button>

            {openFilters[f.label] && (
              <div className="new-filter-body">
                {f.type === "category" && (
                  <div className="new-scrollable-category-list">
                    {f.options.map((category) => (
                      <label
                        key={category}
                        className="new-filter-checkbox"
                      >
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
                  <div className="new-price-range-filter">
                    <div className="new-range-display">
                      €{priceRange[1].toLocaleString()}
                    </div>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                      className="new-price-slider"
                    />
                    <div className="new-range-labels">
                      <span>€0</span>
                      <span>€{f.max.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {f.type === "size" && (
                  <>
                    <div className="new-size-grid">
                      {f.options.slice(0, 9).map((size) => (
                        <button
                          key={size}
                          className={`new-size-chip ${
                            selectedSizes.includes(size) ? "new-active" : ""
                          }`}
                          onClick={() => handleSizeToggle(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <button className="new-size-view-more">
                      View More
                    </button>
                  </>
                )}

                {f.type === "color" && (
                  <div className="new-color-grid">
                    {f.options.map((color) => (
                      <button
                        key={color}
                        className={`new-color-chip ${
                          selectedColors.includes(color) ? "new-active" : ""
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => handleColorToggle(color)}
                      />
                    ))}
                  </div>
                )}

                {f.type === "rating" && (
                  <div className="new-rating-grid">
                    {f.options.map((rating) => (
                      <button
                        key={rating}
                        className={`new-rating-chip ${
                          selectedRatings.includes(rating) ? "new-active" : ""
                        }`}
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

        <div className="new-filter-footer">
          <button className="new-filter-clear" onClick={clearAllFilters}>
            CLEAR
          </button>
          <button
            className="new-filter-apply"
            onClick={() => {
              applyFilters();
              setIsMobileFiltersOpen(false);
            }}
          >
            APPLY ({sortedProducts.length})
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="new-shop-content">
        {/* TOP BAR: FILTER + SORT */}
        <div className="new-shop-topbar-row">
          <div className="new-shop-mobile-topbar">
            <button
              className="new-shop-mobile-filter-btn"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              FILTERS
            </button>
          </div>

          <div className="new-shop-sort">
            <label className="new-sort-label">
              Sort
              <div className="new-sort-select-wrap">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="popular">Popular</option>
                  <option value="new">NEW</option>
                  <option value="high-low">Price: High to low</option>
                  <option value="low-high">Price: low to high</option>
                </select>
                <span className="new-sort-arrow">▾</span>
              </div>
            </label>
          </div>
        </div>

        {/* DESKTOP TABS */}
        <div className="new-shop-top-row">
          <div className="new-shop-tabs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                className={`new-shop-tab-btn ${
                  activeTab === tab ? "new-active" : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="new-loading">Loading Products...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="new-no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters or tabs</p>
          </div>
        ) : (
          <div className="new-shop-grid">
            {sortedProducts.map((p, index) => (
              <Link
                key={p._id || p.id || `product-${index}`}
                to={`/product/${p._id || p.id || "product"}`}
                className="new-shop-card"
              >
                <ProductImageSlider
                  images={p.images || []}
                  name={p.name || "Product"}
                  price={p.price || 0}
                  productId={p._id || p.id || ""}
                />
                <div className="new-shop-card-info">
                  <div className="new-shop-card-name">
                    {p.name || "Product"}
                  </div>
                  <div className="new-shop-card-price">
                    €{p.price || 0}
                  </div>
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
