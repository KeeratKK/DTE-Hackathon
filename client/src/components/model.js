import { useState } from "react";


const Modal = ({ showModal, closeModal, sendEmail }) => {
    const [email, setEmail] = useState("");
  
    const handleSend = () => {
      sendEmail(email);
      closeModal();
    };
  
    if (!showModal) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Send Info to Doctor</h2>
          <input
            type="email"
            placeholder="Enter doctor's email"
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="bg-[#87CEEB] text-white py-2 px-4 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

export default Modal;