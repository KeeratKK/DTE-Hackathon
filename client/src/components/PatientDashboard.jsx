import React, { useState } from 'react';
import NavBar from './NavBar';
import FileUpload from './FileUpload';
import DocumentList from './DocumentList';
import DocumentViewer from './DocumentViewer';

const predefinedTags = ['Immunizations', 'Lab Results', 'Allergies', 'Prescriptions', 'Surgical History'];

const PatientDashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(''); // Track selected tag when uploading

  // Doctor requests for data access
  const [requests, setRequests] = useState([
    { doctorName: 'Dr. Smith', requestId: 1 },
    { doctorName: 'Dr. Emily', requestId: 2 },
  ]);

  // Handle requests approval/denial
  const handleRequest = (request, approved) => {
    if (approved) {
      alert(`${request.doctorName} has been granted access to your data.`);
    } else {
      alert(`You denied access to ${request.doctorName}.`);
    }
    setRequests(requests.filter(req => req.requestId !== request.requestId));
  };

  // Handle file upload
  const handleFileChange = (file) => {
    if (file && file.type === 'application/pdf') {
      const newDoc = {
        name: file.name,
        type: file.type,
        tags: selectedTag ? [selectedTag] : [], // Only add a tag if selected
        file: file,
      };
      const duplicate = documents.some(doc => doc.name === file.name);

      if (duplicate) {
        alert('A file with the same name already exists.');
      } else {
        setDocuments([...documents, newDoc]);
        setSelectedTag(''); // Reset tag after upload
      }
    } else {
      alert('Please upload a PDF file.');
    }
  };

  // Handle document selection
  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc.file);
  };

  // Handle document deletion
  const handleDeleteDoc = (doc) => {
    setDocuments(documents.filter(d => d.name !== doc.name));
    if (selectedDoc === doc.file) {
      setSelectedDoc(null);
    }
  };

  // Handle document search and filtering
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter documents based on search query (name or tags)
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <NavBar requests={requests} handleRequest={handleRequest} />
      <div className="p-10 bg-[#F0F8FF] min-h-screen">
        <h2 className="text-4xl font-bold mb-10 text-black">Welcome, Patient!</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <input 
            type="text" 
            className="border border-gray-300 p-2 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-[#87CEEB]" 
            placeholder="Search by document name or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Tag Selector for Upload */}
        <div className="mb-6">
          <label htmlFor="tag-select" className="mr-4 font-bold text-black">Select Tag:</label>
          <select
            id="tag-select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
          >
            <option value="" disabled>Select a tag</option>
            {predefinedTags.map((tag, index) => (
              <option key={index} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* File Upload Section */}
        <FileUpload onFileChange={handleFileChange} />

        {/* Main Content: Document List and Viewer */}
        <div className="flex">
          <DocumentList 
            documents={filteredDocuments} 
            onSelect={handleSelectDoc} 
            onDelete={handleDeleteDoc} 
          />
          
          <DocumentViewer selectedDoc={selectedDoc} />
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
