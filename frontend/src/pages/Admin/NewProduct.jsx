import React, { useEffect, useState } from "react";
import "./NewProduct.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  createProduct,
  resetProductState,
} from "../../features/productSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  UploadCloud,
  SpellCheck,
  IndianRupee,
  Layers,
  FileText,
  Hash,
  Tag,
  Scissors,
  Truck,
  Percent,
  Plus,
} from "lucide-react";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.products);

  // --- STATE MANAGEMENT ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizeFit, setSizeFit] = useState("");
  const [shippingReturns, setShippingReturns] = useState("");

  // 🔥 NEW SIZE-STOCK STATES
  const [sizesInput, setSizesInput] = useState(""); // "S,M,L,XL"
  const [stockInput, setStockInput] = useState(""); // "10,20,5,15"

  // 🔥 HYBRID CATEGORY STATE
  const [categories, setCategories] = useState([]);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  // 🔥 AGE GROUPS STATE
  const [ageGroups, setAgeGroups] = useState([]);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // 🔥 PREDEFINED OPTIONS
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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Product Created Successfully");
      navigate("/admin/dashboard");
      dispatch(resetProductState());
    }
  }, [dispatch, error, success, navigate]);

  // 🔥 CATEGORY HANDLERS
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

  // 🔥 AGE GROUP HANDLER
  const handleAgeChange = (age) => {
    setAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((item) => item !== age) : [...prev, age]
    );
  };

  // 🔥 FIXED CREATE PRODUCT SUBMIT
  const createProductSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    // Basic Fields
    if (name) myForm.set("name", name);
    if (price) myForm.set("price", price);
    if (discountPrice) myForm.set("discountPrice", discountPrice);
    if (description) myForm.set("description", description);
    if (sizeFit) myForm.set("sizeFit", sizeFit);
    if (shippingReturns) myForm.set("shippingReturns", shippingReturns);

    // 🔥 CATEGORIES & AGE GROUPS
    if (categories.length > 0) {
      myForm.set("category", categories.join(","));
    }
    if (ageGroups.length > 0) {
      myForm.set("ageGroups", ageGroups.join(","));
    }
    if (colors) myForm.set("colors", colors);

    // 🔥 NEW SIZES + STOCK PROCESSING
    if (sizesInput && stockInput) {
      myForm.set("sizesInput", sizesInput);
      myForm.set("stockInput", stockInput);
    }

    // Images
    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

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
        <h1 className="formHeading">Create New Product</h1>

        {loading ? (
          <Loader />
        ) : (
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
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

            {/* Size Fit & Shipping */}
            <div className="inputGroup">
              <Scissors />
              <textarea
                placeholder="Size & Fit Details"
                value={sizeFit}
                onChange={(e) => setSizeFit(e.target.value)}
                rows="1"
              />
            </div>

            <div className="inputGroup">
              <Truck />
              <textarea
                placeholder="Shipping & Returns Info"
                value={shippingReturns}
                onChange={(e) => setShippingReturns(e.target.value)}
                rows="1"
              />
            </div>

            {/* 🔥 CATEGORIES - FULL WIDTH (100%) */}
            <div className="fullWidthSection">
              <div className="inputGroup categoryHybridContainer">
                <Layers />
                <div className="hybridSelectWrapper">
                  <label>Categories</label>

                  {/* Selected Categories */}
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

                  {/* Chips + Custom Input */}
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
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
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

            {/* 🔥 NEW SIZES + STOCK INPUTS */}
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

            {/* Sizes & Age Groups */}
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
                <UploadCloud /> Upload Images (Max 5)
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div className="imagePreviewBox">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Preview" />
              ))}
            </div>

            <button id="createProductBtn" type="submit" disabled={loading}>
              Create Product
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewProduct;
