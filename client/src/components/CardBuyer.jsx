import { useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";
import ModalEditProduct from "./ModalEditProduct";
import { ModalBuyNow } from "./ModalBuyNow";
import { BASE_URL } from "../App";

/* eslint-disable react/prop-types */
const CardBuyer = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBuyOpen, setIsModalBuyOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  function isEquivalentString(str1, str2) {
    const normalize = (str) => str.toLowerCase().replace(/[\W_]+/g, "");
    return normalize(str1) === normalize(str2);
  }

  const openModal = () => {
    setIsModalBuyOpen(true);
  };

  const imageUrl = product.image_url
    ? `${BASE_URL}/public/images/${product.image_url}`
    : "mutedBOX.gif";

  return (
    <div className="w-80 bg-white shadow rounded">
      <div
        className="h-48 w-full bg-gray-200 flex flex-col justify-between p-4 bg-cover bg-center"
        style={{
          backgroundImage: `url('${imageUrl}')`,
        }}
      >
        <div>
          {isEquivalentString(product.user_name, user.name) ||
          user.role === "admin" ? (
            <button
              onClick={handleOpenModal}
              className="text-white bg-blue-500 px-5 py-1 hover:bg-blue-900 rounded-full text-sm"
            >
              Edit
            </button>
          ) : (
            <span className="uppercase text-xs bg-green-50 p-0.5 border-green-500 border rounded text-green-700 font-medium select-none">
              available
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col items-center">
        <p className="text-gray-400 font-light text-xs text-center">
          {product.user_name}
        </p>
        <h1 className="text-gray-800 text-center mt-1">{product.name}</h1>
        <p className="text-center text-gray-800 mt-1">
          {formatCurrency(product.price)}
        </p>
        <div className="w-full">
          <p className="text-gray-400 font-light text-xs">
            stock: {product.stock}
          </p>
        </div>

        <button
          onClick={openModal}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center"
        >
          BUY
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>

      <ModalEditProduct
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={product}
      />
      <ModalBuyNow
        isOpen={isModalBuyOpen}
        setIsModalBuyOpen={setIsModalBuyOpen}
        product={product}
      />
    </div>
  );
};

export default CardBuyer;
