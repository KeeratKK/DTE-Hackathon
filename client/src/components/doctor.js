import { useState, useEffect, useContext } from 'react';
import manImg from '../images/man.png';
import womanImg from '../images/woman.png';
import resume from '../images/resume.pdf';
import axios from 'axios'
import { UserContext } from './userContext';
import { Link, useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewedDoc, setViewedDoc] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("Patient");
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [email, setEmail] = useState(""); // Track email input
    const [patients, setPatients] = useState([]); // State to store fetched patients
    const {user} = useContext(UserContext)

    const documents = [
        { id: 1, name: "Surgery Report", file: resume },
    ];

    // Fetch patient data from the API when the component mounts
    useEffect(() => {
        const fetchDoctorPatients = async () => {
            try {
                const response = await axios.get(`/doctor-patients?doctorId=${user.id}`);
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching doctor's patients:", error);
            }
        };
    
        fetchDoctorPatients();
    }, [user.id]);
    

    console.log(patients);

    const toggleDocument = (docId) => {
        setViewedDoc(viewedDoc === docId ? null : docId);
    };

    // Filter the patients based on the search query
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    console.log(user.id);
    // Handle request submission for new patient
    const handleRequestSubmit = async () => {
        if (email.trim()) {
            try {
                // Call API to request patient data based on email
                await axios.post('/request-data', {
                    email,
                    doctorId: user.id // Replace with actual doctorId from session or context
                });
                alert(`Request sent for new patient with email: ${email}`);
                setEmail(""); // Clear email input after submission
                setRequestModalOpen(false); // Close the modal
            } catch (error) {
                console.error("Error submitting patient data request:", error);
                alert("Error requesting patient data.");
            }
        } else {
            alert("Please enter an email.");
        }
    };

    // Dummy data for tabs (replace with real data from API in the future)
    const tabContent = {
        Patient: selectedPatient ? `Patient Information: Pamela Rogers, 56 years old, Female.` : "",
        Condition: "Condition: Hypertension, Diabetes.",
        Observation: "Observation: Blood Pressure 120/80, Heart Rate 72 bpm.",
        MedicationRequest: "Medication: Metformin, Lisinopril.",
        Procedure: "Procedure: Appendectomy performed on 2020-01-15.",
        DocumentReference: "Documents: Surgery Report, Lab Results.",
    };

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
                    <button onClick={logoutUser} className="bg-white text-[#87CEEB] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
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
                                    <h2 className="text-5xl font-bold text-gray-700 mb-2">
                                        Pamela Rogers
                                    </h2>
                                    <p className="text-gray-600 mb-1">Gender: Female</p>
                                    <p className="text-gray-600">Birthday: 06/02/1984</p>
                                </div>

                                <img
                                    src={selectedPatient.gender === "Male" ? manImg : womanImg}
                                    alt="Patient"
                                    className="w-32 h-32 object-cover rounded-full border-4 border-[#87CEEB] p-2"
                                />
                            </div>

                            {/* Tabs */}
                            <div className="mb-6">
                                <div className="flex space-x-4">
                                    {["Patient", "Condition", "Observation", "MedicationRequest", "Procedure", "DocumentReference"].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-[#87CEEB] text-white" : "bg-white text-[#87CEEB] border border-[#87CEEB]"}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Display Tab Content */}
                                <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                                    <h3 className="text-lg font-semibold">{activeTab} Information</h3>
                                    <p className="text-gray-700 mt-2">{tabContent[activeTab]}</p>
                                </div>
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
