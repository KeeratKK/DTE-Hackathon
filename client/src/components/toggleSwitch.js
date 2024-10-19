import React from 'react';

const ToggleSwitch = ({ isDoctor, setIsDoctor }) => {
  return (
    <div className="flex items-center justify-center">
      {/* Patient label */}
      <span className={`mr-2 ${!isDoctor ? 'font-bold' : ''}`}>Patient</span>

      {/* Toggle switch */}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isDoctor}
          onChange={() => setIsDoctor(!isDoctor)}
        />
        {/* Background of the toggle */}
        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 relative">
          {/* The moving toggle button */}
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              isDoctor ? 'translate-x-5' : ''
            }`}
          ></div>
        </div>
      </label>

      {/* Doctor label */}
      <span className={`ml-2 ${isDoctor ? 'font-bold' : ''}`}>Doctor</span>
    </div>
  );
};

export default ToggleSwitch;
