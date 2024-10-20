import './css/App.css';
import Home from './components/home';
import { React, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import { UserContext } from './components/userContext';
import PatientDashboard from './components/patient';
import DoctorDashboard from './components/doctor';
import axios from "axios";

function App() {
  const { user } = useContext(UserContext);

  axios.defaults.baseURL = 'http://localhost:5000/';
  axios.defaults.withCredentials = true;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
              
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard/>} />
            </>
            
            }
            
         </Routes>
      </>
=======
          </>
        ) : (
          <>
            <Route path="/dashboard" element={user.role === 'Doctor' ? <DoctorDashboard /> : <PatientDashboard />} />
            <Route path="/login" element={user.role === 'Doctor' ? <DoctorDashboard /> : <PatientDashboard />} />
            <Route path="/signup" element={user.role === 'Doctor' ? <DoctorDashboard /> : <PatientDashboard />} />
          </>
        )}
      </Routes>
    </>
>>>>>>> keerat-branch
  );
}

export default App;
