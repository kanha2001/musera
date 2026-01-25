const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  getUserDetails,
  updateProfile,
  getAllUsers,
  deleteUser,
  getSingleUser, // Imported
  updateUserRole, // Imported
  addAddress,
  deleteAddress,
  getAllAddresses,
  updateAddress,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/public/uploads/users");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${uuidv4()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// --- Routes ---
router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

// Protected User Routes
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router
  .route("/me/update")
  .put(isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.route("/logout").get(logout);

// Address Routes
router.route("/me/address/new").post(isAuthenticatedUser, addAddress);
router.route("/me/addresses").get(isAuthenticatedUser, getAllAddresses);
router
  .route("/me/address/:id")
  .delete(isAuthenticatedUser, deleteAddress)
  .put(isAuthenticatedUser, updateAddress);

// Admin Routes
router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

// Single User Admin Route (Get, Update, Delete)
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser) // Added GET
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole) // Added PUT
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser); // Existing DELETE

module.exports = router;
