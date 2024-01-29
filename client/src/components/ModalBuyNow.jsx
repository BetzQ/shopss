import { useState } from "react";
import { Modal } from "./Modal";
import { purchaseProduct } from "../api/transaction";

/* eslint-disable react/prop-types */
export const ModalBuyNow = ({ isOpen, setIsModalBuyOpen, product }) => {
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (event) => {
    const newQuantity = Math.max(1, parseInt(event.target.value, 10));
    setQuantity(newQuantity);
  };
  const [modalState, setModalState] = useState({
    show: false,
    message: "",
    type: "",
  });

  const closeModal = () => {
    setIsModalBuyOpen(false);
  };

  const handleBuyButtonClick = () => {
    purchaseProduct(product, quantity)
      .then((data) => {
        console.log("Pembelian berhasil:", data.message);
        setModalState({
          show: true,
          message: "Buy product successfully!",
          type: "success",
        });

        setTimeout(() => {
          window.location.reload();
          setModalState({ show: false, message: "", type: "" });
          closeModal();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error pembelian:", error);
        setModalState({
          show: true,
          message: "Error Buying product.",
          type: "error",
        });

        setTimeout(() => {
          setModalState({ show: false, message: "", type: "" });
        }, 1000);
      });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50  flex items-center">
      <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div>
          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-between mt-2">
            <button
              onClick={handleBuyButtonClick}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Buy Now
            </button>

            <button
              onClick={closeModal}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
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
