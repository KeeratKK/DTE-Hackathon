// src/components/DocumentViewer.jsx
import React from 'react';

const DocumentViewer = ({ selectedDoc }) => {
  return (
    <div className="w-3/4 p-6 bg-white rounded-xl shadow-lg border-2 border-[#87CEEB] ml-8">
      {selectedDoc ? (
        <>
          <h3 className="font-bold text-3xl text-black mb-6">{selectedDoc.name}</h3>
          <iframe
            src={URL.createObjectURL(selectedDoc)}
            className="w-full h-[700px] border rounded-xl"
            title="Document Preview"
          />
        </>
      ) : (
        <p className="text-gray-700 text-xl font-semibold">Select a document to view</p>
      )}
    </div>
  );
};

export default DocumentViewer;
