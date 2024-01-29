import { BASE_URL } from "../App";

export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/product`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

const addProduct = async (productData, userId) => {
  const url = `${BASE_URL}/product`;
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("image", productData.file);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);
  formData.append("user_id", userId);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    // Fetch automatically sets the 'Content-Type' to 'multipart/form-data'
    // with the correct boundary when you pass FormData
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export { addProduct };

export async function updateProduct(productId, productData, userId) {
  const url = `${BASE_URL}/product/${productId}`;
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("image", productData.file);
  formData.append("price", productData.price);
  formData.append("stock", productData.stock);
  formData.append("user_id", userId);

  try {
    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}
