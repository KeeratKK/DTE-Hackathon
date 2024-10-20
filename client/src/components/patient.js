import React, { useState } from 'react';
import { UserCircle, File, X } from 'lucide-react';
import manImg from '../images/man.png';
import trashLogo from '../images/trashLogo.png';
import uploadLogo from '../images/upload.png';
import eyeImg from '../images/eye.png';
import Modal from './model'

const PatientDashboard = ({ onUploadComplete }) => {
  const doctorsData = [
    { name: "Dr. Smith", status: "accepted" },
    { name: "Dr. Johnson", status: "pending" },
    { name: "Dr. Williams", status: "accepted" },
  ];

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null); // Track the selected document for preview
  const [documents, setDocuments] = useState([
    { },
  ]);

  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setDocuments([...documents, { name: selectedFile.name, id: documents.length + 1, file: URL.createObjectURL(selectedFile) }]);
      setSelectedFile(null);
      if (onUploadComplete) {
        onUploadComplete();
      }
    }
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(null); // Clear preview if deleted document was selected
    }
  };

  const sendDoctorInfo = (email) => {
    console.log("Sending info to:", email);
    // You can add your logic for sending the email or doctor info here
  };

  const filteredDoctors = doctorsData.filter((doctor) => {
    if (filter === "all") return true;
    return doctor.status === filter;
  });

  return (
    <div className="flex flex-row h-screen bg-[#87CEEB]">
      {/* Left Section: Profile and Doctors */}
      <div className="flex flex-col h-full w-1/3 shadow-2xl items-center shadow-xl drop-shadow-lg shadow-gray-500">
        {/* Profile Section */}
        <div className="p-3 flex flex-col items-center mb-3">
          <img
            src={manImg}
            alt="Patient"
            className="w-48 h-48 object-cover rounded-full border-4 border-[#87CEEB] p-4"
          />
          <h2 className="text-3xl font-bold text-white mt-4">Welcome Back, John Doe!</h2>
        </div>

        {/* Divider */}

        <button
          className="text-4xl bg-white rounded-full pr-3 pl-3 hover:bg-gray-400 transition-colors"
          onClick={() => setShowModal(true)}
        >
          +
        </button>

        <div className="h-1 w-5/6 bg-gray-300 rounded-full mb-5 mt-5"></div>

        {/* Doctors Section */}
        <div className="p-3 flex flex-col w-full items-center">
          <h3 className="text-3xl font-bold mb-2">My Doctors</h3>

          {/* Filter Buttons */}
          <div className="flex justify-center space-x-2 mb-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${
                filter === "all" ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${
                filter === "accepted" ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => setFilter("accepted")}
            >
              Accepted
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${
                filter === "pending" ? "bg-gray-300" : "bg-white"
              }`}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
          </div>

          {/* Doctors List */}
          <div className="overflow-y-auto h-[300px] px-2 w-full">
            {filteredDoctors.map((doctor, index) => (
              <div
                key={index}
                className="flex flex-col justify-between bg-white p-2 mb-1 rounded-lg shadow-sm w-[450px] h-auto"
              >
                <div className="flex justify-between items-center flex-row">
                  <div className="flex flex-col">
                    <div className="text-lg font-bold">{doctor.name}</div>
                    {doctor.status === "pending" && (
                      <p className="text-xs text-gray-500">
                        Allow this doctor to view your medical records?
                      </p>
                    )}
                  </div>

                  {doctor.status === "pending" && (
                    <div className="flex space-x-2 items-center ml-auto">
                      <button className="text-red-500 font-bold text-lg">X</button>
                      <button className="text-green-500 font-bold text-lg">✓</button>
                    </div>
                  )}

                  {doctor.status === "accepted" && (
                    <button className="text-red-500">
                      <img
                        className="size-10 hover:bg-gray-300 rounded-full p-1"
                        src={trashLogo}
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="text-lg bg-white rounded-full p-2 pl-4 pr-4 hover:bg-gray-400 transition-colors absolute bottom-4">
            Sign Out
          </button>
        </div>
      </div>

      {/* Modal for adding new doctor */}
      <Modal showModal={showModal} closeModal={() => setShowModal(false)} sendEmail={sendDoctorInfo} />

      {/* Right Section: Documents */}
      <div className="flex flex-col w-2/3 bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 col-span-2">
          <h3 className="text-3xl font-bold mb-2">My Documents</h3>
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-[#87CEEB] text-white py-2 px-4 rounded hover:bg-gray-400 transition duration-300 text-sm"
            >
              Upload Document
            </label>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
            {selectedFile && (
              <div className="mt-2">
                <span className="text-sm">{selectedFile.name}</span>
                <button
                  onClick={handleUpload}
                  className="ml-2 bg-gray-300 text-white py-1 px-2 rounded text-xs"
                >
                  Upload
                </button>
              </div>
            )}
          </div>
          <ul className="space-y-2 overflow-y-auto max-h-[200px]">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span className="flex items-center text-sm">
                  <File className="w-8 h-8 mr-2" />
                  {doc.name}
                </span>
                <div className="flex flex-row gap-3">
                  <img
                    src={eyeImg}
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)} // Set selected document for preview
                  />
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 col-span-3 rounded-2xl mt-4">
            <h3 className="text-lg font-bold mb-2">Document Preview</h3>
            <div className="border-2 border-dashed border-[#87CEEB] rounded-lg h-[350px] flex items-center justify-center">
              {selectedDoc ? (
                <iframe
                  src={selectedDoc.file} // Use the selected document file for preview
                  title="Document Preview"
                  className="w-full h-full"
                />
              ) : (
                <p className="text-gray-500">Select a document to preview</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
