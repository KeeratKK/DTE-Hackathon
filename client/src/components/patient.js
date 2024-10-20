import { useState } from 'react';

const PatientDashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [viewedDoc, setViewedDoc] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newDoc = { id: documents.length + 1, name: file.name, file: URL.createObjectURL(file) };
            setDocuments([...documents, newDoc]);
        }
    };

    const toggleDocument = (docId) => {
        setViewedDoc(viewedDoc === docId ? null : docId);
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-100">
            {/* Top Navigation */}
            <div className="w-full h-[60px] flex justify-between items-center bg-[#87CEEB] px-6 shadow-lg">
                <h1 className="text-2xl font-bold text-white">Patient Dashboard</h1>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition ease-in-out duration-200">
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 space-y-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome, Patient!</h2>

                {/* Upload New Document Section */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Upload New Document</h3>
                    <div className="flex items-center">
                        <input 
                            type="file" 
                            onChange={handleFileUpload}
                            className="block w-[250px] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#87CEEB] file:text-white hover:file:bg-[#87CEEB] hover:bg-red-700 hover:shadow-lg hover:drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* View Current Documents Section */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">View Current Documents</h3>
                    {documents.length === 0 ? (
                        <p className="text-gray-500">No documents uploaded yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition ease-in-out duration-200">
                                    <span className="text-gray-700 font-medium">{doc.name}</span>
                                    <button 
                                        className="text-blue-600 font-semibold hover:underline"
                                        onClick={() => toggleDocument(doc.id)}
                                    >
                                        {viewedDoc === doc.id ? "Hide" : "View"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Document Viewer */}
                    {viewedDoc && (
                        <div className="mt-6">
                            <h4 className="text-xl font-semibold text-gray-700 mb-4">Viewing: {documents.find(doc => doc.id === viewedDoc).name}</h4>
                            <iframe
                                className="w-full h-[600px] border-2 border-gray-300 rounded-lg shadow-sm"
                                src={documents.find(doc => doc.id === viewedDoc).file}
                                title={documents.find(doc => doc.id === viewedDoc).name}
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;