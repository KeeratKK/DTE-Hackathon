import React from 'react';
import { Link } from 'react-router-dom';
import waveLogo from '../images/goodbye.png';
import calendarImg from '../images/heartPic.png';
import '../css/homeStyle.css'; 
import smallHeart from '../images/smallheart.png';
import communicationPic from '../images/message.png';
import databasePic from '../images/databasePic.png';

export const Home = () => {
  return (
    <div className="flex-col">

      <div className="area flex flex-col relative h-screen shadow-lg">
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
          <div className="content-container flex justify-center items-center text-center flex-row gap-5">
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
      <div className="h-[800px] flex flex-col justify-around items-center py-16 bg-[#1e1e2f]">
      <p className='text-white text-7xl font-semibold'>Your Health, Seamlessly Connected!</p>
        <div className='flex flex-row gap-16'>
        <div className="card w-96 h-96 p-8 bg-[#2a2a3d] border-2 border-red-500 rounded-xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
            <img src={smallHeart} className="icon w-16 h-16"></img>
            <h3 className="text-white text-xl font-semibold mt-4">User-Friendly Interface</h3>
            <p className="text-gray-400 text-lg mt-2 h-[120px]">
            Simple and clean design makes it easy for patients and doctors to navigate and access records.
            </p>
            <a className="text-[#87CEEB] font-bold mt-4 inline-block hover:text-[#58a6ff] transition-colors">Start Navigating ➜</a>
          </div>
          

          <div className="card w-96 h-96 p-8 bg-[#2a2a3d] border-2 border-[#ebb305] rounded-xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
            <img src={databasePic} className="icon w-16 h-16"></img>
            <h3 className="text-white text-xl font-semibold mt-4">Centralized Data Management</h3>
            <p className="text-gray-400 text-lg mt-2 h-[120px]">
            All medical data is stored in one place, making access and transfers quick and easy.
            </p>
            <a className="text-[#87CEEB] font-bold mt-4 inline-block hover:text-[#58a6ff] transition-colors">Access Your Data ➜</a>
          </div>

          <div className="card w-96 h-96 p-8 bg-[#2a2a3d] border-2 border-green-500 rounded-xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl">
          <img src={communicationPic} className="icon w-16 h-16"></img>
            <h3 className="text-white text-xl font-semibold mt-4">Effortless Communication</h3>
            <p className="text-gray-400 text-lg mt-2 h-[120px]">
            Patients and doctors can easily share and update medical data in real-time, improving the healthcare services.
            </p>
            <a className="text-[#87CEEB] font-bold mt-4 inline-block hover:text-[#58a6ff] transition-colors">Connect Seamlessly ➜</a>
          </div>
          </div>
      </div>

    </div>
  );
};


export default Home;