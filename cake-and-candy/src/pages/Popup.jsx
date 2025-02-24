// Popup.jsx
import React from "react";

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">Fehler</h3>
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
