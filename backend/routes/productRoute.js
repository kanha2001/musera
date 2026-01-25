const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts, // <--- IMPORT ADDED
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// --- Multer Config for Products ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/public/uploads/products");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// --- Routes ---

// Public Routes
router.route("/products").get(getAllProducts);
// Single Product Route
router.route("/product/:id").get(getProductDetails);

// --- ADMIN ROUTES ---

// 1. Get Admin Products (LIST) - NEW
router
  .route("/admin/products")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    getAdminProducts
  );

// 2. Create Product
router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    upload.array("images", 5),
    createProduct
  );

// 3. Update & Delete Product
router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin", "employee"),
    upload.array("images", 5),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Review Create/Update Route
router.route("/review").put(isAuthenticatedUser, createProductReview);

// Review Get & Delete Route
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;
