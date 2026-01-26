// backend/app.js

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

// -------- TRUST PROXY (Render / production) --------
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// -------- CORS --------
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://your-frontend.onrender.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// -------- BODY PARSERS --------
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// -------- STATIC FILES --------
// URL: http://backend/uploads/users/xyz.jpg
// Folder: backend/public/uploads/users
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
// Backup option (agar structure alag ho to uncomment kar sakte ho)
// app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// -------- ROUTES --------
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const cart = require("./routes/cartRoute");
const extra = require("./routes/extraRoute");

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/v1", cart);
app.use("/api/v1", extra);

module.exports = app;
