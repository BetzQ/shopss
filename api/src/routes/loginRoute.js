const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
  const values = [username, password];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send({
        message: "Internal Server Error",
        userDetails: null,
      });
      return;
    }

    if (results.length === 1) {
      const user = results[0];
      let userDetails = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      if (user.role === "seller") {
        userDetails.company = user.company;
        userDetails.bio = user.bio;
        userDetails.location = user.location;
      } else if (user.role === "admin") {
        userDetails.department = user.department;
        userDetails.since = user.since;
      }

      res.status(200).send({
        message: "Login successful!",
        userDetails: userDetails,
      });
    } else {
      res.status(401).send({
        message: "Invalid credentials",
        userDetails: null,
      });
    }
  });
});

router.post("/changePassword", (req, res) => {
  const { userId, newPassword, pin } = req.body;

  // Validasi input
  if (!userId || !newPassword || !pin) {
    return res.status(400).send({
      message: "Missing required fields: userId, newPassword, or pin",
    });
  }

  // Validasi pin (harus 3 angka)
  if (!/^\d{3}$/.test(pin)) {
    return res.status(400).send({
      message: "Pin must be exactly 3 digits",
    });
  }

  // Mencari user berdasarkan userId dan pin
  const findUserSql = "SELECT * FROM user WHERE id = ? AND pin = ?";
  const findUserValues = [userId, pin];

  db.query(findUserSql, findUserValues, (findErr, findResults) => {
    if (findErr) {
      console.error("Error executing find user query:", findErr);
      return res.status(500).send({
        message: "Internal Server Error",
      });
    }

    // Jika user tidak ditemukan atau pin salah
    if (findResults.length !== 1) {
      return res.status(401).send({
        message: "Invalid user ID or pin",
      });
    }

    // Update password user
    const updateSql = "UPDATE user SET password = ? WHERE id = ?";
    const updateValues = [newPassword, userId];

    db.query(updateSql, updateValues, (updateErr, updateResults) => {
      if (updateErr) {
        console.error("Error executing update query:", updateErr);
        return res.status(500).send({
          message: "Failed to update password",
        });
      }

      res.status(200).send({
        message: "Password successfully updated",
      });
    });
  });
});

module.exports = router;
