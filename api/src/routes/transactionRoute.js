const express = require("express");
const router = express.Router();
const db = require("../db");

// Purchase Product - Hanya untuk buyer
router.post("/purchase", (req, res) => {
  const { product_id, buyer_id, quantity } = req.body;
  // Dapatkan detail produk
  db.query(
    "SELECT * FROM product WHERE id = ?",
    [product_id],
    (err, product) => {
      if (err) {
        console.error("Purchase error:", err);
        return res.status(500).send({ message: "Internal Server Error" });
      }

      if (!product || product.length === 0) {
        console.log("Product not found");
        return res.status(404).send({ message: "Product not found" });
      }

      const { price, stock } = product[0];

      // Cek apakah stok cukup
      if (stock < quantity) {
        return res.status(400).send({ message: "Insufficient stock" });
      }

      // Check if the buyer has the role "buyer" in the user table
      db.query(
        "SELECT role FROM user WHERE id = ?",
        [buyer_id],
        (err, user) => {
          if (err) {
            console.error("Purchase error:", err);
            return res.status(500).send({ message: "Internal Server Error" });
          }

          if (!user || user.length === 0) {
            console.log("User not found");
            return res.status(404).send({ message: "User not found" });
          }

          const buyerRole = user[0].role;

          if (buyerRole !== "buyer") {
            return res.status(403).send({ message: "Unauthorized" });
          }

          // Update stok produk
          const newStock = stock - quantity;
          db.query(
            "UPDATE product SET stock = ? WHERE id = ?",
            [newStock, product_id],
            (err) => {
              if (err) {
                console.error("Purchase error:", err);
                return res
                  .status(500)
                  .send({ message: "Error updating product stock" });
              }

              // Simpan transaksi ke transaction_history
              const transaction = {
                product_id,
                buyer_id,
                quantity,
                price_at_purchase: price,
                image_url: product[0].image_url,
              };
              db.query(
                "INSERT INTO transaction_history SET ?",
                transaction,
                (err) => {
                  if (err) {
                    console.error("Purchase error:", err);
                    return res
                      .status(500)
                      .send({ message: "Error saving transaction" });
                  }
                  res.status(200).send({ message: "Purchase successful" });
                }
              );
            }
          );
        }
      );
    }
  );
});

// Read Transaction History
router.get("/transaction", (req, res) => {
  db.query("SELECT * FROM transaction_history", (err, results) => {
    if (err) {
      res.status(500).send({ message: "Error fetching transaction history" });
      return;
    }
    res.status(200).send(results);
  });
});

// Read Transaction History by Buyer ID
router.get("/transaction/:buyer_id", (req, res) => {
  const { buyer_id } = req.params;

  db.query(
    "SELECT * FROM transaction_history WHERE buyer_id = ?",
    [buyer_id],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: "Error fetching transaction history" });
        return;
      }
      res.status(200).send(results);
    }
  );
});

// Update Transaction - Opsi ini mungkin tidak selalu dibutuhkan
router.put("/transaction/:id", (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  db.query(
    "UPDATE transaction_history SET quantity = ? WHERE id = ?",
    [quantity, id],
    (err) => {
      if (err) {
        res.status(500).send({ message: "Error updating transaction" });
        return;
      }
      res.status(200).send({ message: "Transaction updated successfully" });
    }
  );
});

// Delete Transaction
router.delete("/transaction/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM transaction_history WHERE id = ?", [id], (err) => {
    if (err) {
      res.status(500).send({ message: "Error deleting transaction" });
      return;
    }
    res.status(200).send({ message: "Transaction deleted successfully" });
  });
});

module.exports = router;
