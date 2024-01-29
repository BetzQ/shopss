import { useEffect, useState } from "react";
import { addProduct } from "../api/product";
import { Modal } from "./Modal";

const AddProduct = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [operationSuccessful, setOperationSuccessful] = useState(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      return () => URL.revokeObjectURL(newPreviewUrl);
    }
  }, [file]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleStockChange = (e) => {
    setStock(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUserDetails = localStorage.getItem("userDetails");
    let userId = null;

    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      userId = userDetails.id;
    }

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const productData = {
      name,
      file,
      price,
      stock,
    };

    try {
      await addProduct(productData, userId);
      setOperationSuccessful(true);
      setModalMessage("Product added successfully");
      setIsModalOpen(true);
      // Optionally reset form or redirect
    } catch (error) {
      console.error("Error adding product:", error);
      setOperationSuccessful(false);
      setModalMessage("Error adding product");
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filePreview = previewUrl ? (
    <div>
      <p>{file.name}</p>
      <img
        src={previewUrl}
        alt="Preview"
        style={{ maxWidth: "200px", maxHeight: "200px" }}
      />
    </div>
  ) : null;

  return (
    <section className="max-w-xl p-6 mt-5 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800">
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        messageType={operationSuccessful ? "success" : "failure"}
      >
        <p>{modalMessage}</p>
      </Modal>

      <h1 className="text-xl font-bold text-white capitalize dark:text-white">
        Add Your Product
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
          <div>
            <label className="text-white dark:text-gray-200" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="text-white dark:text-gray-200" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={handlePriceChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="text-white dark:text-gray-200" htmlFor="stock">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={handleStockChange}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Image
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            >
              <div className="space-y-1 text-center">
                {filePreview ? (
                  filePreview
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-white"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span className="">Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1 text-white">or drag and drop</p>
                </div>
                <p className="text-xs text-white">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-pink-500 rounded-md hover:bg-pink-700 focus:outline-none focus:bg-gray-600"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
