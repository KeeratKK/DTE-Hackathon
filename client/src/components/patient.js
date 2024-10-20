import React, { useState, useEffect, useContext } from 'react';
import { UserCircle, File, X } from 'lucide-react';
import manImg from '../images/man.png';
import trashLogo from '../images/trashLogo.png';
import uploadLogo from '../images/upload.png';
import eyeImg from '../images/eye.png';
import Modal from './model';
import { UserContext } from './userContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const PatientDashboard = ({ onUploadComplete }) => {

    const { user } = useContext(UserContext);

    const [doctorsData, setDoctorsData] = useState([]); // Dynamically fetched doctors
    const [filter, setFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null); 
    const [documents, setDocuments] = useState([]);

    // Fetch doctors data when component loads
    useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const response = await axios.get(`/doctors/${user.id}`);
            console.log(response.data.doctors)
            setDoctorsData(response.data.doctors);
          } catch (error) {
            console.error("Error fetching doctors:", error);
          }
        };
      
        fetchDoctors();
      }, [user.id]);
      
      
      console.log(doctorsData);
  
    // Handle doctor decision (accept/reject)
    const handleDoctorDecision = async (doctorId, decision) => {
      try {
        await axios.post('/update-doctor', {
          patientId: user.id,
          doctorId,
          decision
        });
  
        // Update the local state after the decision
        if (decision.toLowerCase() === 'yes') {
          setDoctorsData((prev) =>
            prev.map((doc) =>
              doc._id === doctorId ? { ...doc, status: 'accepted' } : doc
            )
          );
        } else {
          setDoctorsData((prev) => prev.filter((doc) => doc._id !== doctorId));
        }
        window.location.reload();
      } catch (error) {
        console.error('Error updating doctor decision:', error);
      }
    };
  
    // Filter doctors based on status
    const filteredDoctors = doctorsData.filter((doctor) => {
      if (filter === "all") return true;
      return doctor.status === filter;
    });

    // Handle document upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setSelectedFile(file);
        }
      };
    
    const handleUpload = async () => {
        if (selectedFile) {
          setDocuments([...documents, { name: selectedFile.name, id: documents.length + 1, file: URL.createObjectURL(selectedFile) }]);
          setSelectedFile(null);
          if (onUploadComplete) {
            onUploadComplete();
          }
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("user_id", user.id);
        formData.append("name", user.first_name + user.last_name);
    
        try {
          await axios.post("/api/medicalData/", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } catch (err) {
          console.error("Error uploading file:", err);
        }
    
      };
    
    // Handle document deletion
    const handleDeleteDocument = (id) => {
        setDocuments(documents.filter((doc) => doc.id !== id));
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(null); // Clear preview if deleted document was selected
        }
      };

    // Handle logout
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const logoutUser = async () => {
      try {
          await axios.get('/logout', { withCredentials: true });
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          navigate('/');
          await window.location.reload(false);
      } catch (error) {
          console.error('Logout failed', error);
      }
    };

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
          <h2 className="text-3xl font-bold text-white mt-4">
            Welcome Back, {user.first_name} {user.last_name}!
          </h2>
        </div>

        <div className="h-1 w-5/6 bg-gray-300 rounded-full mb-5 mt-5"></div>

        {/* Doctors Section */}
        <div className="p-3 flex flex-col w-full items-center">
          <h3 className="text-3xl font-bold mb-2">My Doctors</h3>

          {/* Filter Buttons */}
          <div className="flex justify-center space-x-2 mb-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${filter === "all" ? "bg-gray-300" : "bg-white"}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${filter === "accepted" ? "bg-gray-300" : "bg-white"}`}
              onClick={() => setFilter("accepted")}
            >
              Accepted
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm border ${filter === "pending" ? "bg-gray-300" : "bg-white"}`}
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
          <div className="text-lg font-bold">{doctor.first_name} {doctor.last_name}</div>
          {doctor.status === "pending" && (
            <p className="text-xs text-gray-500">
              Allow this doctor to view your medical records?
            </p>
          )}
        </div>

        {/* Conditionally render buttons only if the doctor is pending */}
        {doctor.status === "pending" && (
          <div className="flex space-x-2 items-center ml-auto">
            {/* X Button (Reject Doctor) */}
            <button
              className="text-red-500 font-bold text-lg"
              onClick={() => handleDoctorDecision(doctor.user_id, 'no')}
            >
              X
            </button>
            {/* Checkmark Button (Accept Doctor) */}
            <button
              className="text-green-500 font-bold text-lg"
              onClick={() => handleDoctorDecision(doctor.user_id, 'yes')}
            >
              ✓
            </button>
          </div>
        )}

        {/* Conditionally render a message if the doctor is accepted */}
        {doctor.status === "accepted" && (
          <div className="text-green-500 font-bold text-lg">
            Doctor accepted
          </div>
        )}
      </div>
    </div>
  ))}
</div>


          <button onClick={logoutUser} className="text-lg bg-white rounded-full p-2 pl-4 pr-4 hover:bg-gray-400 transition-colors absolute bottom-4">
            Sign Out
          </button>
        </div>
      </div>


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
