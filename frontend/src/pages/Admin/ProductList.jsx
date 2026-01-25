import React, { useEffect, useState } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Edit, Trash2, Search, Filter } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../../components/Admin/Sidebar";
import Loader from "../../components/Loader/Loader";
import {
  getAdminProduct,
  deleteProduct,
  clearErrors,
  resetProductState,
} from "../../features/productSlice";

const shortenID = (id) => {
  if (!id) return "";
  return `${id.substring(0, 5)}...${id.substring(id.length - 4)}`;
};

const SERVER_URL = "http://localhost:4000";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, products, loading } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.products
  );

  // --- SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // --- DELETE HANDLER ---
  const deleteProductHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct(id));
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      Swal.fire("Deleted!", "Product has been deleted.", "success");
      dispatch(resetProductState());
      dispatch(getAdminProduct());
    }

    dispatch(getAdminProduct());
  }, [dispatch, error, deleteError, isDeleted, navigate]);

  // --- FILTER LOGIC ---
  useEffect(() => {
    if (products) {
      // Agar search empty hai to sab dikhao
      if (searchTerm === "") {
        setFilteredProducts(products);
      } else {
        // Nahi to filter karo
        const temp = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product._id.includes(searchTerm) ||
            (product.category &&
              product.category.some((cat) =>
                cat.toLowerCase().includes(searchTerm.toLowerCase())
              ))
        );
        setFilteredProducts(temp);
      }
    }
  }, [products, searchTerm]);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="productListContainer">
        {/* HEADER WITH SEARCH */}
        <div className="productListHeader">
          <h1 id="productListHeading">All Products</h1>

          <div className="searchBox">
            <Search size={20} color="#777" />
            <input
              type="text"
              placeholder="Search by Name, ID, Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="productTableContainer">
            <table className="productTable">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts &&
                  filteredProducts.map((item) => (
                    <tr key={item._id}>
                      <td title={item._id} style={{ fontFamily: "monospace" }}>
                        {shortenID(item._id)}
                      </td>
                      <td>
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={
                              item.images[0].url.startsWith("http")
                                ? item.images[0].url
                                : `${SERVER_URL}${item.images[0].url}`
                            }
                            alt={item.name}
                            className="productListImg"
                          />
                        ) : (
                          <div className="noImagePlaceholder">No Img</div>
                        )}
                      </td>
                      <td>{item.name}</td>

                      <td
                        style={{
                          color: item.stock > 0 ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {item.stock}
                      </td>

                      <td>€{item.price}</td>

                      <td>
                        <div className="actionButtons">
                          <Link to={`/admin/product/${item._id}`}>
                            <Edit size={20} color="#3498db" />
                          </Link>
                          <button
                            onClick={() => deleteProductHandler(item._id)}
                            className="deleteBtn"
                          >
                            <Trash2 size={20} color="#e74c3c" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <p className="noProducts">
                No Products Found Matching "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
