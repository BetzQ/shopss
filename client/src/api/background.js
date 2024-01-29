import { BASE_URL } from "../App";

// Fetch Backgrounds
export async function fetchBackgrounds() {
  try {
    const response = await fetch(`${BASE_URL}/background`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching backgrounds:", error);
    throw error;
  }
}

// Add Background - Only for admin
export async function addBackground(file) {
  const formData = new FormData();
  formData.append("image", file);
  const userId = JSON.parse(localStorage.getItem("userDetails")).id;
  formData.append("user_id", userId);
  const url = `${BASE_URL}/background`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Update Background - Only for admin
export async function updateBackground(backgroundId, imageUrl) {
  const userId = JSON.parse(localStorage.getItem("userDetails")).id; // Assuming user data is stored in localStorage
  const url = `${BASE_URL}/background/${backgroundId}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
