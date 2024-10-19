// src/components/FileUpload.jsx
import React from 'react';

const FileUpload = ({ onFileChange }) => {
  return (
    <div className="mb-8">
      <input 
        type="file" 
        accept=".pdf,.docx" 
        className="hidden" 
        id="fileInput" 
        onChange={(e) => onFileChange(e.target.files[0])} 
      />
      <label 
        htmlFor="fileInput" 
        className="bg-[#87CEEB] text-white px-8 py-4 rounded-xl cursor-pointer text-xl font-bold hover:bg-[#71b8d1] transition"
      >
        Upload New Document
      </label>
    </div>
  );
};

export default FileUpload;
