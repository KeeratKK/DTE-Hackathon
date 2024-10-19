import './css/App.css';
import Home from './components/home';
import {React, useContext} from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import { UserContext } from './components/userContext';


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
            </>
            
            }
            
         </Routes>
      </>
  );
}

export default App;
