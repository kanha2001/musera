const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const fs = require("fs");
const path = require("path");

// 1. CREATE PRODUCT -- Admin & Employee
exports.createProduct = async (req, res) => {
  try {
    req.body.user = req.user.id;

    // Images logic (Multer)
    let images = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: "You can upload max 5 images" });
      }

      req.files.forEach((file) => {
        images.push({
          public_id: file.filename,
          url: `/uploads/products/${file.filename}`,
        });
      });
    } else {
      return res
        .status(400)
        .json({ message: "Please upload at least 1 image" });
    }

    // 🔥 NEW SIZES + STOCK PROCESSING
    let sizesArray = [];
    if (req.body.sizesInput && req.body.stockInput) {
      const sizes = req.body.sizesInput
        .split(",")
        .map((s) => s.trim().toUpperCase());
      const stocks = req.body.stockInput
        .split(",")
        .map((st) => parseInt(st.trim()) || 0);

      sizes.forEach((size, index) => {
        if (size && stocks[index] >= 0) {
          sizesArray.push({
            size: size,
            stock: stocks[index],
          });
        }
      });
    }

    // Convert strings to array
    if (req.body.category && typeof req.body.category === "string") {
      req.body.category = req.body.category.split(",").map((cat) => cat.trim());
    }
    if (req.body.colors && typeof req.body.colors === "string") {
      req.body.colors = req.body.colors.split(",").map((c) => c.trim());
    }
    if (req.body.ageGroups && typeof req.body.ageGroups === "string") {
      req.body.ageGroups = req.body.ageGroups
        .split(",")
        .map((age) => age.trim());
    }

    const productData = {
      name: req.body.name,
      price: Number(req.body.price),
      description: req.body.description,
      category: req.body.category || [],
      sizes: sizesArray, // 🔥 NEW FORMAT: [{size: "S", stock: 10}, ...]
      colors: req.body.colors || [],
      ageGroups: req.body.ageGroups || [],
      sizeFit: req.body.sizeFit || "",
      shippingReturns: req.body.shippingReturns || "",
      discountPrice: req.body.discountPrice
        ? Number(req.body.discountPrice)
        : 0,
      images,
      user: req.user.id,
      stock: sizesArray.reduce((sum, s) => sum + s.stock, 0), // TOTAL STOCK
    };

    const product = await Product.create(productData);

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Products (Public Search & Filter)
exports.getAllProducts = async (req, res, next) => {
  try {
    // 1. Destructure Common Params
    const { keyword, category } = req.query;
    let query = {};

    // 2. SEARCH
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    // 3. CATEGORY
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // --- 4. PRICE FIX ---
    let priceGte = req.query.price?.gte || req.query["price[gte]"];
    let priceLte = req.query.price?.lte || req.query["price[lte]"];

    if (priceGte || priceLte) {
      query.price = {};
      if (priceGte) query.price.$gte = Number(priceGte);
      if (priceLte) query.price.$lte = Number(priceLte);
    }

    // --- 5. RATINGS FIX ---
    let ratingsGte = req.query.ratings?.gte || req.query["ratings[gte]"];

    if (ratingsGte) {
      query.ratings = {};
      query.ratings.$gte = Number(ratingsGte);
    }

    // 6. FETCH
    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      products,
      productsCount: products.length,
      filteredProductsCount: products.length,
      resultPerPage: 50,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET PRODUCT DETAILS (Single)
// 🔥 REPLACE ONLY getProductDetails FUNCTION
exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "name"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 FIXED: Clean data before sending
    const cleanProduct = {
      ...product._doc,
      images: (product.images || []).filter(
        (img) => img?.url && img.url.trim() !== ""
      ),
      sizes: (product.sizes || []).filter(
        (s) => s?.size && typeof s.stock === "number"
      ),
      colors: (product.colors || []).filter((c) => c && c.trim() !== ""),
      stock: product.stock || 0,
    };

    res.status(200).json({
      success: true,
      product: cleanProduct,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID Format" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE PRODUCT -- Admin & Employee
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // --- IMAGES UPDATE LOGIC (MODIFIED) ---
    // Agar nayi files aayi hain, tabhi purani delete karo
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5)
        return res.status(400).json({ message: "Max 5 images allowed" });

      // 1. DELETE OLD IMAGES
      if (product.images && product.images.length > 0) {
        product.images.forEach((img) => {
          // img.url example: "/uploads/products/image-123.jpg"
          const filename = img.url.split("/").pop(); // "image-123.jpg"

          const filePath = path.join(
            __dirname,
            "../public/uploads/products", // Ensure path is correct
            filename
          );

          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err) console.log(`Failed to delete old image: ${filename}`);
            });
          }
        });
      }

      // 2. UPLOAD NEW IMAGES
      let images = [];
      req.files.forEach((file) => {
        images.push({
          public_id: file.filename,
          url: `/uploads/products/${file.filename}`,
        });
      });
      req.body.images = images; // Replace array
    }
    // -------------------------------------

    if (req.body.category && typeof req.body.category === "string") {
      req.body.category = req.body.category.split(",").map((cat) => cat.trim());
    }
    if (req.body.sizes && typeof req.body.sizes === "string") {
      req.body.sizes = req.body.sizes.split(",").map((s) => s.trim());
    }
    if (req.body.colors && typeof req.body.colors === "string") {
      req.body.colors = req.body.colors.split(",").map((c) => c.trim());
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. DELETE PRODUCT -- Admin Only
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // --- IMAGES DELETE LOGIC ---
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const filename = img.url.split("/").pop();
        const filePath = path.join(
          __dirname,
          "../public/uploads/products",
          filename
        );

        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) console.log(`Failed to delete file: ${filename}`);
          });
        }
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. CREATE OR UPDATE REVIEW
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed ? "Review Updated" : "Review Added",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. GET ALL REVIEWS
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      { reviews, ratings, numOfReviews },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res
      .status(200)
      .json({ success: true, message: "Review Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. SEARCH AUTOCOMPLETE API
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(200).json({ suggestions: [] });
    }
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .select("name _id images")
      .limit(5);

    res.status(200).json({ success: true, suggestions: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. GET ALL PRODUCTS (ADMIN)
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
