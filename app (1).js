const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ===== DATABASE CONNECTION =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ===== ROUTES =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// ===== SERVER START (IMPORTANT FIX) =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
