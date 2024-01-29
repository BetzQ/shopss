/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { updateProduct } from "../api/product";

const ModalEditProduct = ({ isOpen, onClose, product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [userDetails, setUserDetails] = useState({ id: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalState, setModalState] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (imageFile && imageFile.type.startsWith("image/")) {
      const newPreviewUrl = URL.createObjectURL(imageFile);
      setImagePreview(newPreviewUrl);

      return () => URL.revokeObjectURL(newPreviewUrl);
    }
  }, [imageFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setImageFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFile(selectedFile);
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }

    if (product) {
      setName(product.name);
      setPrice(parseFloat(product.price).toFixed(0));

      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the updateProduct function from productService.js
      await updateProduct(
        product.id,
        { name, price, stock, file: imageFile },
        userDetails.id
      );

      setModalState({
        show: true,
        message: "Product updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        window.location.reload();
        setModalState({ show: false, message: "", type: "" });
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      setModalState({
        show: true,
        message: "Error updating product.",
        type: "error",
      });

      setTimeout(() => {
        setModalState({ show: false, message: "", type: "" });
      }, 1000);
    }
  };

  const filePreview = imagePreview ? (
    <div>
      <p>{imageFile.name}</p>
      <img
        src={imagePreview}
        alt="Preview"
        style={{ maxWidth: "200px", maxHeight: "200px" }}
      />
    </div>
  ) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-bold mb-4">Edit Product</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md bg-gray-800"
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

          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="text"
              id="productPrice"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="productStock"
              className="block text-sm font-medium text-gray-700"
            >
              Stock
            </label>
            <input
              type="text"
              id="productStock"
              name="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Modal
        show={modalState.show}
        onClose={() => setModalState({ show: false, message: "", type: "" })}
        messageType={modalState.type}
      >
        <p>{modalState.message}</p>
      </Modal>
    </div>
  );
};

export default ModalEditProduct;
