import React from 'react';
import { Link } from 'react-router-dom';
import waveLogo from '../images/goodbye.png';
import calendarImg from '../images/heartPic.png';
import '../css/homeStyle.css'; 

export const Home = () => {
  return (
    <div className="area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
              <div className="flex justify-evenly items-center text-center flex-row gap-5 h-screen">
              <div className="content-container flex justify-a items-center text-center flex-row gap-5 h-screen">
          <div className="w-[700px] text-center flex flex-col justify-center">
            <h1 className="text-7xl font-extrabold text-left">
              Welcome to <img src={waveLogo} alt="Wave Icon" className="inline-block w-16 h-16" />
              <span className='text-[#87CEEB] inline-flex'>Care Exchange!</span>
            </h1>
            <div className="mt-8 text-center w-[700px]">
              <p className="text-gray-500 text-base text-left">
              Effortlessly transfer your medical data, securely connect with healthcare providers, and streamline your health journey—all in one place.
              </p>
              <Link className="bg-[#87CEEB] w-48 h-16 rounded-lg hover:shadow-xl hover:font-semibold flex justify-center items-center mt-[20px]" to="/signup">
                Get Started ▶
              </Link>
            </div>
          </div>
          <img className='size-[400px] shadow-[#958fc1]' src={calendarImg} alt="Calendar" />
        </div>

      </div>
    </div>
  );
};

export default Home;
