const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const db = require("../db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

function deleteOldImage(filePath) {
  if (filePath) {
    // Path lengkap menuju file
    const fullPath = path.join(__dirname, "..", "..", filePath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Error deleting old image:", err);
    });
  }
}

// Create Product - Hanya untuk seller
router.post("/product", upload.single("image"), (req, res) => {
  const { name, price, stock, user_id } = req.body;

  if (!name && !user_id) {
    return res.status(400).send({ message: "Name cannot be empty" });
  }

  let image_url = "";

  if (req.file) {
    const fullPath = req.file.path;
    const filename = path.basename(fullPath);
    image_url = filename;
  }

  // Check if the user is a seller or admin and fetch their username
  db.query(
    "SELECT role, username FROM user WHERE id = ?",
    [user_id],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: "Internal Server Error" });
        return;
      }

      if (
        results.length === 1 &&
        (results[0].role === "seller" || results[0].role === "admin")
      ) {
        const user_name = results[0].username; // Fetch the username

        const sql =
          "INSERT INTO product (name, image_url, price, stock, user_id, user_name) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(
          sql,
          [name, image_url, price, stock, user_id, user_name],
          (err, results) => {
            if (err) {
              res.status(500).send({ message: "Error adding product" });
              return;
            }
            res.status(200).send({ message: "Product added successfully" });
          }
        );
      } else {
        res.status(403).send({ message: "Unauthorized to add products" });
      }
    }
  );
});

// Read Products
router.get("/product", (req, res) => {
  const sql =
    "SELECT id, name, image_url, price, stock, user_name FROM product";
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error fetching products" });
      return;
    }
    res.status(200).send(results);
  });
});

// Update Product - Hanya untuk seller
router.put("/product/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, stock, user_id } = req.body; // Include 'name' in the destructuring

  let newImageUrl = "";

  if (req.file) {
    const fullPath = req.file.path;
    const filename = path.basename(fullPath); // Extracts the filename
    newImageUrl = filename;
  }

  // First, get the old image from the database
  db.query("SELECT * FROM product WHERE id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error fetching product" });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ message: "Product not found" });
      return;
    }

    const oldImageUrl = results[0] ? results[0].image_url : null;

    // Continue with role and user check
    db.query(
      "SELECT role FROM user WHERE id = ?",
      [user_id],
      (err, userResults) => {
        if (err) {
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }
        if (userResults.length === 1) {
          const userRole = userResults[0].role;
          if (userRole === "admin" || userRole === "seller") {
            let sql;
            let queryParams;

            if (newImageUrl) {
              // Jika ada gambar baru, update termasuk image_url
              sql =
                "UPDATE product SET name = ?, image_url = ?, price = ?, stock = ? WHERE id = ?";
              queryParams = [name, newImageUrl, price, stock, id];
            } else {
              // Jika tidak ada gambar baru, tidak update image_url
              sql =
                "UPDATE product SET name = ?, price = ?, stock = ? WHERE id = ?";
              queryParams = [name, price, stock, id];
            }
            db.query(sql, queryParams, (err, updateResults) => {
              if (err) {
                res.status(500).send({ message: "Error updating product" });
                return;
              }

              // If a new image is uploaded, delete the old image
              if (newImageUrl && oldImageUrl) {
                deleteOldImage("public/images/" + oldImageUrl); // Use a function to delete the image
              }

              res.status(200).send({ message: "Product updated successfully" });
            });
          } else {
            // Perform a different action for roles other than "admin" or "seller"
            // For example, you can return a 403 Forbidden status
            res
              .status(403)
              .send({ message: "Unauthorized to update this product" });
          }
        } else {
          res
            .status(403)
            .send({ message: "Unauthorized to update this product" });
        }
      }
    );
  });
});

// Delete Product - Hanya untuk seller
router.delete("/product/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  console.log("User ID from request:", user_id);
  // Cek apakah user adalah seller dan pemilik produk
  db.query(
    "SELECT user_id, role FROM product JOIN user ON product.user_id = user.id WHERE product.id = ?",
    [id],
    (err, results) => {
      console.log("Product and User details from DB:", results[0]);
      if (err) {
        res.status(500).send({ message: "Internal Server Error" });
        return;
      }

      if (
        results.length === 1 &&
        results[0].role === "seller" &&
        results[0].user_id === parseInt(user_id)
      ) {
        const sql = "DELETE FROM product WHERE id = ?";
        db.query(sql, [id], (err, results) => {
          if (err) {
            res.status(500).send({ message: "Error deleting product" });
            return;
          }
          res.status(200).send({ message: "Product deleted successfully" });
        });
      } else {
        res
          .status(403)
          .send({ message: "Unauthorized to delete this product" });
      }
    }
  );
});

module.exports = router;
