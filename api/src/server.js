const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./initDB");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Variabel global untuk menandai inisialisasi database
let databaseInitialized = false;

// Inisialisasi database
initializeDatabase()
  .then(() => {
    databaseInitialized = true; // Setel menjadi true setelah inisialisasi selesai

    // Setelah inisialisasi database selesai, tambahkan route
    const productRoute = require("./routes/productRoute");
    const transactionRoute = require("./routes/transactionRoute");
    const loginRoute = require("./routes/loginRoute");
    const backgroundRoute = require("./routes/backgroundRoute");
    app.use(loginRoute);
    app.use(productRoute);
    app.use(transactionRoute);
    app.use(backgroundRoute);

    app.use("/public", express.static(path.join(__dirname, "../public")));
    // Mulai server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
  });
