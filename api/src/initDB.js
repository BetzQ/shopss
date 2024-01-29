const mysql = require("mysql2/promise");

const initializeDatabase = async () => {
  try {
    // Create a connection to MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root", // Replace with your MySQL username
      password: "", // Replace with your MySQL password
      multipleStatements: true,
    });

    // Create the 'shops' database
    await connection.query("CREATE DATABASE IF NOT EXISTS shops");
    console.log("Database created");

    // Use the 'shops' database
    await connection.query("USE shops");

    // Create the 'user' table
    const createUserTable = `
    CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50),
        email VARCHAR(255),
        name VARCHAR(255),
        department VARCHAR(255),
        company VARCHAR(255),
        since DATE,
        registeredDate DATE,
        pin INT,
        bio TEXT,
        location VARCHAR(255)
      );`;
    await connection.query(createUserTable);
    console.log("User table created");

    // Create the 'product' table
    const createProductTable = `
  CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    image_url TEXT,
    price DECIMAL(10, 2),
    stock INT,
    user_id INT,
    user_name VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user(id)
  );
`;

    await connection.query(createProductTable);
    console.log("Product table created");

    // Create the 'transaction_history' table
    const createTransactionTable = `
      CREATE TABLE IF NOT EXISTS transaction_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        buyer_id INT,
        quantity INT,
        price_at_purchase DECIMAL(10, 2),
        image_url TEXT,
        FOREIGN KEY (product_id) REFERENCES product(id),
        FOREIGN KEY (buyer_id) REFERENCES user(id)
      );
    `;
    await connection.query(createTransactionTable);
    console.log("Transaction History table created");

    const createBackgroundTable = `
    CREATE TABLE IF NOT EXISTS background (
        id INT AUTO_INCREMENT PRIMARY KEY,
        imageUrl TEXT NOT NULL
    );`;
    await connection.query(createBackgroundTable);
    console.log("Background table created");

    // Seed the 'user' table
    const users = [
      {
        username: "jane_doe",
        password: "jane123",
        role: "buyer",
        email: "jane.doe@example.com",
        name: "Jane Doe",
        registeredDate: "2022-02-20",
        pin: 375,
      },
      {
        username: "mike_brown",
        password: "mikeb456",
        role: "buyer",
        email: "mike.brown@example.com",
        name: "Mike Brown",
        registeredDate: "2022-03-15",
        pin: 475,
      },
      {
        username: "tom_smith",
        password: "protompassLeading",
        role: "seller",
        email: "tom.smith@salespro.com",
        name: "Tom Smith",
        company: "ElectroGoods Inc.",
        bio: "Leading provider of electronic devices.",
        location: "San Francisco",
        pin: 684,
      },
      {
        username: "lisa_white",
        password: "lisawspotapparel",
        role: "seller",
        email: "lisa.white@fashionspot.com",
        name: "Lisa White",
        company: "FashionSpot Boutique",
        bio: "Fashion and apparel expert.",
        location: "New York",
        pin: 613,
      },
      {
        username: "alice_jones",
        password: "Operationsalicecorp",
        role: "admin",
        email: "alice.jones@admincorp.com",
        name: "Alice Jones",
        department: "Operations",
        since: "2020-07-15",
        pin: 951,
      },
    ];

    for (let user of users) {
      await connection.query("INSERT INTO user SET ?", user);
    }
    console.log("User table seeded");

    // Seed the 'product' table
    let products = [
      {
        name: "Laptop intel i9-1200h", // You can replace this with the actual product name
        image_url: "laptopROG.png",
        price: 15000000,
        stock: 100,
        user_id: 3,
        user_name: "tom_smith",
      },
      // Add more products here as needed
    ];

    for (let product of products) {
      await connection.query("INSERT INTO product SET ?", product);
    }
    console.log("Product table seeded");

    // Seed the 'transaction_history' table
    let transactions = [
      {
        product_id: 1, // Assuming this is a product's ID
        buyer_id: 2, // Assuming this is a buyer's ID
        quantity: 2,
        price_at_purchase: 15000000, // Price per unit at the time of purchase
        image_url: "http://example.com/product1.jpg",
      },
      // ...add more transactions as needed...
    ];

    for (let transaction of transactions) {
      await connection.query(
        "INSERT INTO transaction_history SET ?",
        transaction
      );
    }
    console.log("Transaction History table seeded");

    await connection.end();
  } catch (err) {
    console.error("Failed to initialize database:", err);
    throw err;
  }
};

module.exports = initializeDatabase;
