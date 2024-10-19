import './css/App.css';
import Home from './components/home';
import {React, useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import { UserContext } from './components/userContext';
import DoctorDashboard from './components/doctor';
import PatientDashboard from './components/patient';


function App() {

  const {user} = useContext(UserContext);

  return(
    <>
         <Routes>
            <Route path="/" element={<Home />} />
            {user ?
            <> 
            <Route path="/login" element={<Dashboard />} />
            <Route path="/signup" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            </>
            :
            <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Login />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />
            </>
            
            }
            
         </Routes>
      </>
  );
}

export default App;
