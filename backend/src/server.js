const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bvaRoutes = require("./routes/bva");
const dtRoutes = require("./routes/dt");
const { initDb } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bva", bvaRoutes);
app.use("/api/dt", dtRoutes);
app.use("/api/decision-table", dtRoutes);

/**
 * 404 Handler - Returns JSON instead of HTML
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

/**
 * Global Error Handler - Returns JSON instead of HTML
 */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
