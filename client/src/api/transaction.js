import { BASE_URL } from "../App";

export async function purchaseProduct(product, quantity) {
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const buyer_id = user.id;
  const product_id = product.id;

  const requestData = {
    product_id,
    buyer_id,
    quantity,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(`${BASE_URL}/purchase`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error purchasing product:", error);
    throw error;
  }
}
