import React, { useState } from 'react';
import { FiBell } from 'react-icons/fi'; // Notification bell icon from react-icons

const NavBar = ({ requests, handleRequest, handleLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav className="bg-[#87CEEB] p-6 flex justify-between items-center shadow-lg">
      <div>
        <a href="/" className="text-white text-2xl font-bold mx-6 hover:underline">Home</a>
        <a href="/patient" className="text-white text-2xl font-bold hover:underline">Patient Dashboard</a>
      </div>
      
      <div className="flex items-center space-x-6">
        {/* Notification Bell Icon */}
        <div className="relative">
          <button 
            onClick={toggleDropdown} 
            className="relative focus:outline-none"
          >
            <FiBell className="text-white text-4xl" />
            {/* Notification Count (Positioned in top-right corner) */}
            {requests.length > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {requests.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-4">
                {requests.length > 0 ? (
                  <ul className="space-y-4">
                    {requests.map((request, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">{request.doctorName} is requesting access to your data</span>
                        <div className="space-x-2">
                          {/* Approve Request (Green Check) */}
                          <button 
                            onClick={() => handleRequest(request, true)}
                            className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition"
                          >
                            ✓
                          </button>
                          
                          {/* Deny Request (Red X) */}
                          <button 
                            onClick={() => handleRequest(request, false)}
                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                          >
                            ✗
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No new requests</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="bg-white text-[#87CEEB] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
