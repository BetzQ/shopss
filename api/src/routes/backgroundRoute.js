const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db"); // Pastikan ini sesuai dengan module koneksi database Anda

// Setup for multer (image upload handling)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/background"); // Change directory to public/background
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Function to delete the old image
function deleteOldImage(filePath) {
  if (filePath) {
    const fullPath = path.join(__dirname, "..", "..", filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting old image:", err);
    });
  }
}

// Helper function untuk mengecek role user
function checkAdminRole(userId, callback) {
  db.query("SELECT role FROM user WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0 || results[0].role !== "admin") {
      return callback(null, false);
    }
    return callback(null, true);
  });
}

// GET route for fetching background images
router.get("/background", (req, res) => {
  // Query to select all background images from the database
  const sql = "SELECT * FROM background";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error fetching backgrounds" });
      return;
    }
    res.status(200).send(results);
  });
});

// POST route for creating/updating background - Only for admin
router.post("/background", upload.single("image"), (req, res) => {
  const { user_id } = req.body; // Get user_id from request body

  let imageUrl = "";
  if (req.file) {
    imageUrl = path.basename(req.file.path);
  }

  checkAdminRole(user_id, (err, isAdmin) => {
    if (err) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
    if (!isAdmin) {
      return res
        .status(403)
        .send({ message: "Unauthorized to add/update background" });
    }

    // Check if a background already exists
    db.query("SELECT * FROM background LIMIT 1", (err, results) => {
      if (err) {
        return res.status(500).send({ message: "Error checking background" });
      }

      if (results.length > 0) {
        // Get old image URL
        const oldImageUrl = results[0].imageUrl;

        // Update existing background
        const updateSql = "UPDATE background SET imageUrl = ? WHERE id = ?";
        db.query(updateSql, [imageUrl, results[0].id], (err, updateResults) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "Error updating background" });
          }

          // Delete old image
          if (oldImageUrl) {
            deleteOldImage("public/background/" + oldImageUrl);
          }

          return res
            .status(200)
            .send({ message: "Background updated successfully" });
        });
      } else {
        // Insert new background
        const insertSql = "INSERT INTO background (imageUrl) VALUES (?)";
        db.query(insertSql, [imageUrl], (err, insertResults) => {
          if (err) {
            return res.status(500).send({ message: "Error adding background" });
          }
          return res
            .status(200)
            .send({ message: "Background added successfully" });
        });
      }
    });
  });
});

module.exports = router;
