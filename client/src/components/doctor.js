import { useState } from 'react';
import manImg from '../images/man.png';
import womanImg from '../images/woman.png';
import resume from '../images/RogehBeshayResume.pdf';

const DoctorDashboard = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewedDoc, setViewedDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [requestModalOpen, setRequestModalOpen] = useState(false); // Track modal open/close
    const [firstName, setFirstName] = useState(""); // Track first name input
    const [lastName, setLastName] = useState(""); // Track last name input
    const [email, setEmail] = useState(""); // Track email input

    // Sample patients data
    const patients = [
        { id: 1, name: "John Doe", gender: "Male", birthday: "January 10, 1980" },
        { id: 2, name: "Jane Smith", gender: "Female", birthday: "March 15, 1985" },
        { id: 3, name: "Michael Johnson", gender: "Male", birthday: "July 22, 1970" },
        { id: 4, name: "Emily Davis", gender: "Female", birthday: "April 10, 1992" },
        { id: 5, name: "Charles Brown", gender: "Male", birthday: "November 1, 1965" }
    ];

    const documents = [
        { id: 1, name: "Surgery Report", file: resume },
        { id: 2, name: "Lab Results", file: resume },
        { id: 3, name: "Prescription History", file: resume },
    ];

    const toggleDocument = (docId) => {
        setViewedDoc(viewedDoc === docId ? null : docId);
    };

    // Filter the patients based on the search query (for the left panel)
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle request submission for new patient
    const handleRequestSubmit = () => {
        if (firstName.trim() && lastName.trim() && email.trim()) {
            alert(`Request sent for new patient: ${firstName} ${lastName} (Email: ${email})`);
            setFirstName(""); // Clear the inputs after submission
            setLastName("");
            setEmail(""); // Clear email input
            setRequestModalOpen(false); // Close the modal
        } else {
            alert("Please enter first name, last name, and email.");
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-50">
            {/* NavBar */}
            <nav className="w-full bg-[#87CEEB] p-6 flex justify-between items-center shadow-lg">
                <div>
                    <a href="/" className="text-white text-2xl font-bold mx-6 hover:underline">Home</a>
                    <a href="/doctor" className="text-white text-2xl font-bold hover:underline">Doctor Dashboard</a>
                </div>
                <div className="flex items-center space-x-6">
                    {/* Request Patient Data Button */}
                    <button
                        className="bg-white text-[#87CEEB] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setRequestModalOpen(true)}
                    >
                        Request Patient Data
                    </button>
                    {/* Logout Button */}
                    <button className="bg-white text-[#87CEEB] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="flex flex-row">
                {/* Sidebar */}
                <div className="w-1/4 bg-white shadow-md p-6 h-screen overflow-y-auto">
                    <div className="font-bold text-3xl text-center text-gray-700 pb-4 border-b-2 border-[#87CEEB]">
                        My Patients
                    </div>

                    <input
                        type="text"
                        placeholder="Search patients..."
                        className="w-full mt-4 p-2 border border-gray-300 rounded-lg mb-4"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />

                    {filteredPatients.map((patient) => (
                        <div
                            key={patient.id}
                            className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg mt-4"
                        >
                            <div className="text-lg font-semibold text-gray-600">{patient.name}</div>
                            <button
                                className="mt-2 bg-[#87CEEB] text-white py-2 px-6 rounded-full transition hover:bg-[#71b8d1]"
                                onClick={() => setSelectedPatient(patient)}
                            >
                                View Data
                            </button>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="w-3/4 p-10 bg-white shadow-lg overflow-y-auto h-screen">
                    {selectedPatient ? (
                        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                                        {selectedPatient.name}
                                    </h2>
                                    <p className="text-gray-600 mb-1">Gender: {selectedPatient.gender}</p>
                                    <p className="text-gray-600">Birthday: {selectedPatient.birthday}</p>
                                </div>

                                <img
                                    src={selectedPatient.gender === "Male" ? manImg : womanImg}
                                    alt="Patient"
                                    className="w-32 h-32 object-cover rounded-full border-4 border-[#87CEEB] p-2"
                                />
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Patient Summary</h3>
                                <p className="text-gray-600">
                                    Patient is a {selectedPatient.gender.toLowerCase()} with stable vitals. No new symptoms observed.
                                </p>
                            </div>

                            <div className="flex flex-col space-y-3 mb-6">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="">
                                        <div className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                            <span className="text-gray-700 font-medium">{doc.name}</span>
                                            <button
                                                className="text-[#87CEEB] hover:underline"
                                                onClick={() => toggleDocument(doc.id)}
                                            >
                                                {viewedDoc === doc.id ? "Hide" : "View"}
                                            </button>
                                        </div>

                                        {viewedDoc === doc.id && (
                                            <iframe
                                                className="w-full h-[600px] mt-4"
                                                src={doc.file}
                                                title={doc.name}
                                            ></iframe>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-xl text-gray-600">Select a patient to view their data.</h2>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Patient Data Modal */}
            {requestModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Request New Patient Data</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                onClick={() => setRequestModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-[#87CEEB] text-white px-4 py-2 rounded-lg hover:bg-[#71b8d1]"
                                onClick={handleRequestSubmit}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
