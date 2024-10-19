import { useState } from 'react';
import manImg from '../images/man.png';
import womanImg from '../images/woman.png';
import resume from '../images/RogehBeshayResume.pdf';

const DoctorDashboard = () => {
    const [viewedDoc, setViewedDoc] = useState(null);
  
    const patientData = {
      name: "John Doe",
      gender: "Male",
      birthday: "January 10, 1980",
      summary:
        "Patient is a 44-year-old male with a history of hypertension and diabetes. Recent tests show stable vitals with no new symptoms. Prescribed medication is being taken regularly, and the condition is under control.",
    };
  
    const documents = [
      { id: 1, name: "Doc 1", file: resume },
      { id: 2, name: "Doc 2", file: resume },
      { id: 3, name: "Doc 3", file: resume },
      { id: 4, name: "Doc 4", file: resume },
      { id: 5, name: "Doc 5", file: resume },
      { id: 6, name: "Doc 6", file: resume },
    ];
  
    const toggleDocument = (docId) => {
      setViewedDoc(viewedDoc === docId ? null : docId);
    };
  
    return (
      <div className="flex flex-col h-screen w-screen bg-gray-50">
        <div className="w-1/4 bg-white shadow-md p-6 fixed h-screen overflow-y-auto">
          <div className="font-bold text-3xl text-center text-gray-700 pb-4 border-b-2 border-[#87CEEB]">
            My Patients
          </div>
  
          {["Patient 1", "Patient 2", "Patient 3", "Patient 4"].map(
            (patient, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-sm transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg mt-4"
              >
                <div className="text-lg font-semibold text-gray-600">
                  {patient}
                </div>
                <button className="mt-2 bg-[#87CEEB] text-white py-2 px-6 rounded-full transition hover:bg-[#87CEEB]">
                  View Data
                </button>
              </div>
            )
          )}
        </div>

        <div className="w-3/4 ml-[25%] p-10 bg-white shadow-lg overflow-y-auto h-screen">
          <div className="w-full h-[100px] flex flex-row items-center justify-between bg-gray-200 drop-shadow-2xl shadow-md p-4 mb-6">
  
            <div className="flex-1 mx-4">
              <input
                type="text"
                placeholder="Search here"
                className="w-full p-2 border rounded-lg"
              />
            </div>
  
            <div className="flex items-center space-x-6">
              <button className="bg-gray-300 text-gray-800 pr-3 pl-3 rounded-full hover:shadow-lg hover:drop-shadow-lg hover:bg-[#87CEEB] text-[25px]">
              &#43;
              </button>
  
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:shadow-lg hover:drop-shadow-lg">
                Logout
              </button>
            </div>
          </div>
  
          <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  {patientData.name}
                </h2>
                <p className="text-gray-600 mb-1">Gender: {patientData.gender}</p>
                <p className="text-gray-600">Birthday: {patientData.birthday}</p>
              </div>
  
              <img
                src={patientData.gender === "Male" ? manImg : womanImg}
                alt="Patient"
                className="w-32 h-32 object-cover rounded-full border-4 border-[#87CEEB] p-2"
              />
            </div>
  
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Patient Summary
              </h3>
              <p className="text-gray-600">{patientData.summary}</p>
            </div>
  
            <div className="flex flex-col space-y-3">
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
                      className="w-full h-[1000px] mt-4"
                      src={doc.file}
                      title={doc.name}
                    ></iframe>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default DoctorDashboard;
  