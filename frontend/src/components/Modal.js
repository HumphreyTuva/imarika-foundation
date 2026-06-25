// components/Modal.js
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const Modal = ({ children, onClose, width = "max-w-md" }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-[90%] sm:w-full ${width} relative max-h-[90vh] overflow-y-auto p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 bg-white hover:text-red-600 hover:bg-gray-100 p-2 rounded-full shadow transition"
          aria-label="Close"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
