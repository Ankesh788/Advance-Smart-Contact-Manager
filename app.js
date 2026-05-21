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
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/contact_manager")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Server will continue without database - UI will work but data won't be saved");
  });

// ===== ROUTES =====
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// ===== HOME ROUTE =====
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Open this URL in Chrome: http://localhost:${PORT}`);
});
