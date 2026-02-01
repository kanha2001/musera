// src/pages/Admin/UpdateProduct.jsx
import React, { useEffect, useState } from "react";
import "./NewProduct.css"; // same CSS as NewProduct
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateProduct,
  getProductDetails,
  resetProductState,
} from "../../features/productSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  UploadCloud,
  SpellCheck,
  IndianRupee,
  Layers,
  FileText,
  Tag,
  Scissors,
  Truck,
  Percent,
  Plus,
} from "lucide-react";

const SERVER_URL = "http://localhost:4000";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { error, product, loading, isUpdated } = useSelector(
    (state) => state.products
  );

  // --- STATE (same pattern as NewProduct) ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizeFit, setSizeFit] = useState("");
  const [shippingReturns, setShippingReturns] = useState("");

  // sizes + stock (comma separated text)
  const [sizesInput, setSizesInput] = useState(""); // "S,M,L,XL"
  const [stockInput, setStockInput] = useState(""); // "10,20,5,15"

  // categories (chips + custom)
  const [categories, setCategories] = useState([]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  // age groups
  const [ageGroups, setAgeGroups] = useState([]);

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categoryOptions = [
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

  const ageOptions = ["0-3m", "3-6m", "6-9m", "9-12m", "12-16m", "16-24m"];

  // ----- HELPERS FOR SAFE STRING -----
  const toCommaString = (val) => {
    if (!val) return "";

    // Case 1: already string
    if (typeof val === "string") return val;

    // Case 2: array of primitive (["S","M"])
    if (Array.isArray(val) && typeof val[0] !== "object") {
      return val.join(",");
    }

    // Case 3: array of objects ([{size:"S",stock:10}...])
    if (Array.isArray(val) && typeof val[0] === "object") {
      // for sizes -> "S,M,L"
      if ("size" in val[0]) {
        return val.map((x) => x.size).join(",");
      }
      // for stocks -> "10,20,5"
      if ("stock" in val[0]) {
        return val.map((x) => x.stock).join(",");
      }
    }

    // Case 4: plain object ({S:10,M:20})
    if (typeof val === "object") {
      return Object.keys(val).join(",");
    }

    return String(val);
  };

  const toCommaStringValues = (val) => {
    if (!val) return "";

    if (typeof val === "string") return val;

    if (Array.isArray(val) && typeof val[0] !== "object") {
      return val.join(",");
    }

    if (Array.isArray(val) && typeof val[0] === "object") {
      if ("stock" in val[0]) {
        return val.map((x) => x.stock).join(",");
      }
      if ("value" in val[0]) {
        return val.map((x) => x.value).join(",");
      }
    }

    if (typeof val === "object") {
      return Object.values(val).join(",");
    }

    return String(val);
  };

  // ---------- LOAD PRODUCT ----------
  useEffect(() => {
    if (!product || product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      setName(product.name || "");
      setPrice(product.price || "");
      setDiscountPrice(product.discountPrice || "");
      setDescription(product.description || "");
      setSizeFit(product.sizeFit || "");
      setShippingReturns(product.shippingReturns || "");

      // CATEGORY
      if (Array.isArray(product.category)) {
        setCategories(product.category);
      } else if (typeof product.category === "string") {
        setCategories(
          product.category
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        );
      }

      // AGE GROUPS
      if (Array.isArray(product.ageGroups)) {
        setAgeGroups(product.ageGroups);
      } else if (typeof product.ageGroups === "string") {
        setAgeGroups(
          product.ageGroups
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        );
      }

      // 🔥 SIZES & STOCK (handle every possible structure)
      // sizesInput (left text field)
      if (product.sizesInput) {
        setSizesInput(toCommaString(product.sizesInput));
      } else if (product.availableSizes) {
        setSizesInput(toCommaString(product.availableSizes));
      } else if (product.sizes) {
        setSizesInput(toCommaString(product.sizes));
      } else {
        setSizesInput("");
      }

      // stockInput (right text field)
      if (product.stockInput) {
        setStockInput(toCommaStringValues(product.stockInput));
      } else if (product.stockPerSize) {
        setStockInput(toCommaStringValues(product.stockPerSize));
      } else if (product.sizesInput && Array.isArray(product.sizesInput)) {
        // if array of {size, stock}
        setStockInput(toCommaStringValues(product.sizesInput));
      } else if (typeof product.stock === "number") {
        setStockInput(String(product.stock));
      } else {
        setStockInput("");
      }

      // COLORS
      if (Array.isArray(product.colors)) {
        setColors(product.colors.join(", "));
      } else if (typeof product.colors === "string") {
        setColors(product.colors);
      } else if (product.color) {
        setColors(product.color);
      }

      setOldImages(product.images || []);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Product Updated Successfully");
      dispatch(resetProductState());
      navigate("/admin/products");
    }
  }, [dispatch, error, isUpdated, navigate, product, id]);

  // ---------- CATEGORY HANDLERS ----------
  const handleCategoryChipClick = (category) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleCustomCategoryAdd = (e) => {
    if (e) e.preventDefault();
    const trimmedValue = customCategoryInput.trim();
    if (trimmedValue && !categories.includes(trimmedValue)) {
      setCategories((prev) => [...prev, trimmedValue]);
      setCustomCategoryInput("");
    }
  };

  const handleCustomCategoryKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleCustomCategoryAdd();
    }
  };

  const handleAgeChange = (age) => {
    setAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((item) => item !== age) : [...prev, age]
    );
  };

  // ---------- SUBMIT ----------
  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("discountPrice", discountPrice);
    myForm.set("description", description);
    myForm.set("sizeFit", sizeFit);
    myForm.set("shippingReturns", shippingReturns);

    if (categories.length > 0) {
      myForm.set("category", categories.join(","));
    } else {
      myForm.set("category", "");
    }

    if (ageGroups.length > 0) {
      myForm.set("ageGroups", ageGroups.join(","));
    } else {
      myForm.set("ageGroups", "");
    }

    if (sizesInput) myForm.set("sizesInput", sizesInput);
    if (stockInput) myForm.set("stockInput", stockInput);
    if (colors) myForm.set("colors", colors);

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(updateProduct({ id: id, productData: myForm }));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="newProductContainer">
        <h1 className="formHeading">Update Product</h1>

        {loading ? (
          <Loader />
        ) : (
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            {/* Product Name */}
            <div className="inputGroup">
              <SpellCheck />
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Price & Discount */}
            <div className="formRow">
              <div className="inputGroup">
                <IndianRupee />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="inputGroup">
                <Percent />
                <input
                  type="number"
                  placeholder="Discount Price (Optional)"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="inputGroup">
              <FileText />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="2"
              />
            </div>

            {/* Size & Fit */}
            <div className="inputGroup">
              <Scissors />
              <textarea
                placeholder="Size & Fit Details"
                value={sizeFit}
                onChange={(e) => setSizeFit(e.target.value)}
                rows="1"
              />
            </div>

            {/* Shipping & Returns */}
            <div className="inputGroup">
              <Truck />
              <textarea
                placeholder="Shipping & Returns Info"
                value={shippingReturns}
                onChange={(e) => setShippingReturns(e.target.value)}
                rows="1"
              />
            </div>

            {/* Categories hybrid */}
            <div className="fullWidthSection">
              <div className="inputGroup categoryHybridContainer">
                <Layers />
                <div className="hybridSelectWrapper">
                  <label>Categories</label>

                  {categories.length > 0 && (
                    <div className="selectedChips">
                      {categories.map((cat, index) => (
                        <span key={index} className="selectedChip">
                          {cat}
                          <button
                            type="button"
                            onClick={() =>
                              setCategories((prev) =>
                                prev.filter((c) => c !== cat)
                              )
                            }
                            className="removeChip"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="chipsAndInput">
                    <div className="chipsContainer">
                      {categoryOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          className={`chip ${
                            categories.includes(category) ? "active" : ""
                          }`}
                          onClick={() => handleCategoryChipClick(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <div className="customInputWrapper">
                      <input
                        type="text"
                        placeholder="Type custom category..."
                        value={customCategoryInput}
                        onChange={(e) =>
                          setCustomCategoryInput(e.target.value)
                        }
                        onKeyPress={handleCustomCategoryKeyPress}
                        className="customCategoryInput"
                      />
                      <button
                        type="button"
                        onClick={handleCustomCategoryAdd}
                        className="addCustomBtn"
                        disabled={!customCategoryInput.trim()}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes + Stock */}
            <div className="inputGroup">
              <Tag />
              <div className="sizeStockContainer">
                <div className="sizeStockRow">
                  <input
                    type="text"
                    placeholder="Sizes (S,M,L,XL)"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    className="sizeInputField"
                  />
                <span className="sizeStockSeparator">|</span>
                  <input
                    type="text"
                    placeholder="Stock per size (10,20,5,15)"
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="stockInputField"
                  />
                </div>
                <small className="sizeStockHelper">
                  Enter sizes and stock separated by commas (S,M,L → 10,20,5)
                </small>
              </div>
            </div>

            {/* Age groups */}
            <div className="formRo">
              <div className="inputGroup ageGroupContainer">
                <Layers />
                <div className="ageSelectWrapper">
                  <label>Age Groups</label>
                  <div className="ageChips">
                    {ageOptions.map((age) => (
                      <button
                        key={age}
                        type="button"
                        className={`ageChip ${
                          ageGroups.includes(age) ? "active" : ""
                        }`}
                        onClick={() => handleAgeChange(age)}
                      >
                        {age}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="inputGroup">
              <div
                className="colorIcon"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, red, blue)",
                  marginRight: "12px",
                }}
              />
              <input
                type="text"
                placeholder="Colors (Red, Blue, Black)"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
              />
            </div>

            {/* Images */}
            <div className="uploadGroup">
              <label htmlFor="file-upload" className="custom-file-upload">
                <UploadCloud /> Update Images (Overrides Old)
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            {/* Old Images */}
            <div className="imagePreviewBox">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img
                    key={index}
                    src={
                      image.url?.startsWith("http")
                        ? image.url
                        : `${SERVER_URL}${image.url}`
                    }
                    alt="Old Product Preview"
                  />
                ))}
            </div>

            {/* New Images Preview */}
            <div className="imagePreviewBox">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="New Product Preview" />
              ))}
            </div>

            <button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProduct;
