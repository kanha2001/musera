const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");

const cors = require("cors");
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://your-frontend.onrender.com",
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// --- STATIC FILES SERVING (CRITICAL FIX) ---
// Frontend request karega: http://localhost:4000/uploads/users/avatar.jpg
// Backend dhoondega: backend/public/uploads/users/avatar.jpg

// Option 1: Agar "public" folder "backend" folder ke andar hai
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Option 2 (Backup): Kabhi kabhi structure alag hota hai, to root public bhi serve karo
// app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// --- ROUTES ---
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
