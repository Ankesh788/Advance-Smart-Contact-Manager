const express = require("express");
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get analytics
router.get("/", verifyToken, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments({ userId: req.userId });
    res.json({
      totalContacts,
      message: `You have ${totalContacts} contacts`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
