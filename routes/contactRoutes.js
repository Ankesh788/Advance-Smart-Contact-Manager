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

// Get all contacts
router.get("/", verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create contact
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      address,
      userId: req.userId,
    });

    await contact.save();
    res.status(201).json({ message: "Contact created", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact || contact.userId.toString() !== req.userId) {
      return res.status(404).json({ message: "Contact not found" });
    }

    Object.assign(contact, req.body);
    await contact.save();
    res.json({ message: "Contact updated", contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact || contact.userId.toString() !== req.userId) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await contact.deleteOne();
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
