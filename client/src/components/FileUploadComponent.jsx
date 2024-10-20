import React, { useState } from 'react';
import { UploadFile } from '@mui/icons-material';

const FileUploadComponent = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file); // Notify parent component about the file upload
    }
  };

  return (
    <div className="p-6">
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center">
        <UploadFile className="mr-2" />
        Upload File
        <input
          hidden
          accept="image/*,application/pdf"
          type="file"
          onChange={handleFileChange}
        />
      </label>

      {selectedFile && (
        <div className="mt-4">
          <p className="text-gray-600">Selected file: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
