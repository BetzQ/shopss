/* eslint-disable react/prop-types */
export const Modal = ({ show, onClose, children, messageType }) => {
  if (!show) return null;

  const imageSrc =
    messageType === "success" ? "/checklist.gif" : "/redCross.gif";

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <img src={imageSrc} alt={messageType} />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900"></h3>
          <div className="mt-2 px-7 py-3">{children}</div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
