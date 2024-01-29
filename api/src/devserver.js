const express = require("express");
const cors = require("cors");
const loginRoute = require("./routes/loginRoute");
const productRoute = require("./routes/productRoute");
const transactionRoute = require("./routes/transactionRoute");
const backgroundRoute = require("./routes/backgroundRoute");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(loginRoute);
app.use(productRoute);
app.use(transactionRoute);
app.use(backgroundRoute);

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
