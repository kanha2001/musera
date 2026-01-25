import React, { useEffect, useState } from "react";
import "./NewProduct.css"; // Reuse same CSS
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
  Hash,
  Tag,
  Scissors,
  Truck,
  Percent,
} from "lucide-react";

// Server URL for old images
const SERVER_URL = "http://localhost:4000";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL

  const { error, product, loading, isUpdated } = useSelector(
    (state) => state.products
  );

  // --- STATE ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");
  const [sizeFit, setSizeFit] = useState("");
  const [shippingReturns, setShippingReturns] = useState("");

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]); // Server images
  const [imagesPreview, setImagesPreview] = useState([]); // New uploads

  useEffect(() => {
    // 1. Agar Product ID match na kare ya Product load na ho, to Fetch karo
    if (!product || product._id !== id) {
      dispatch(getProductDetails(id));
    } else {
      // 2. Data Load hone par State set karo
      setName(product.name);
      setPrice(product.price);
      setDiscountPrice(product.discountPrice || "");
      setDescription(product.description);
      setStock(product.stock);
      setSizeFit(product.sizeFit || "");
      setShippingReturns(product.shippingReturns || "");

      // Arrays to Comma String conversion
      setCategory(product.category ? product.category.join(", ") : "");
      setSizes(product.sizes ? product.sizes.join(", ") : "");
      setColors(product.colors ? product.colors.join(", ") : "");

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

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("discountPrice", discountPrice);
    myForm.set("description", description);
    myForm.set("stock", stock);
    myForm.set("sizeFit", sizeFit);
    myForm.set("shippingReturns", shippingReturns);

    // Arrays
    myForm.set("category", category);
    myForm.set("sizes", sizes);
    myForm.set("colors", colors);

    // Images (Sirf tab bhejo jab naye select kiye hon)
    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(updateProduct({ id: id, productData: myForm }));
  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]); // Naye select karte hi purane hata do

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
            <div className="inputGroup">
              <SpellCheck />
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                  placeholder="Discount Price"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="inputGroup">
              <FileText />
              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="2"
              ></textarea>
            </div>

            <div className="inputGroup">
              <Scissors />
              <textarea
                placeholder="Size & Fit Details"
                value={sizeFit}
                onChange={(e) => setSizeFit(e.target.value)}
                rows="1"
              ></textarea>
            </div>

            <div className="inputGroup">
              <Truck />
              <textarea
                placeholder="Shipping & Returns Info"
                value={shippingReturns}
                onChange={(e) => setShippingReturns(e.target.value)}
                rows="1"
              ></textarea>
            </div>

            <div className="formRow">
              <div className="inputGroup">
                <Layers />
                <input
                  type="text"
                  placeholder="Category (e.g. Jackets, Winter)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="inputGroup">
                <Hash />
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            <div className="formRow">
              <div className="inputGroup">
                <Tag />
                <input
                  type="text"
                  placeholder="Sizes (e.g. S, M, L)"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                />
              </div>
              <div className="inputGroup">
                <div
                  className="colorIcon"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, red, blue)",
                  }}
                ></div>
                <input
                  type="text"
                  placeholder="Colors (e.g. Red, Blue)"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  style={{ marginLeft: "15px" }}
                />
              </div>
            </div>

            <div className="uploadGroup">
              <label htmlFor="file-upload" className="custom-file-upload">
                <UploadCloud /> Update Images (Overrides Old)
              </label>
              <input
                id="file-upload"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            {/* Old Images Display */}
            <div className="imagePreviewBox">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img
                    key={index}
                    src={
                      image.url.startsWith("http")
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
