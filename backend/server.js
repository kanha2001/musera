// dotenv ko FIRST load karo
require("dotenv").config({ path: "backend/config/config.env" });

const app = require("./app");
const connectDatabase = require("./config/database");

// Port Render pe dynamic hoga
const PORT = process.env.PORT || 4000;

connectDatabase();

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
