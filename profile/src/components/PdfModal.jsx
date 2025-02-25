import React, { useState } from "react";

const PdfModal = ({ pdfUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 h-3/4">
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          Close
        </button>
        <iframe
          src={pdfUrl}
          className="w-full h-full"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PdfModal;