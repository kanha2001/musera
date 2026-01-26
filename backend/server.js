// backend/server.js

// dotenv ko sabse pehle load karo
require("dotenv").config({ path: "backend/config/config.env" });

const app = require("./app");
const connectDatabase = require("./config/database");

// Port Render pe dynamic hoga
const PORT = process.env.PORT || 4000;

// Database connect
connectDatabase();

// Server start
const server = app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
