import {Link, useNavigate} from "react-router-dom"
import { useState } from 'react';
import axios from "axios";
import {toast} from 'react-hot-toast'
import '../css/homeStyle.css';

export const Login = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: '',
        password: '',
    });
    // State to hold the email and password input values




    // Function to handle user login
    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;
    
        try {
            const response = await axios.post('/login', { email, password }, { withCredentials: true });
            const responseData = response.data;
    
            if (responseData.error) {
                toast.error(responseData.error);
            } else {
                toast.success("Successfully logged in");
                navigate('/calender');
                window.location.reload();
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error("An error occurred during login. Please try again.");
        }
    };
    
    

    return(
        <div className="flex justify-center items-center mt-[75px] bg-black">
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
        <div className="content-container w-[500px] h-[590px] rounded-2xl flex-col flex bg-black border-2 border-white text-white justify-center items-center text-center">
            <div className="w-[420px] flex flex-col gap-5">
                <p className="mt-[-25px] text-[25px] font-semibold text-left">Sign In</p>
                <p className="mt-[-15px] text-gray-500 text-left">to continue using Syllabus Sync</p>
                <form className="flex-col flex justify-center text-center gap-5" onSubmit={loginUser}>
                    <label className="text-md text-left">Email address</label>
                    <input onChange={(e) => {setData({...data, email: e.target.value})}} value={data.email} type="email" className="mt-[-15px] border-gray-300 shadow-sm border-[0.5px] rounded-md w-[420px] h-10 p-2 focus:outline-non text-black"></input>
                    <label className="text-md text-left">Password</label>
                    <input onChange={(e) => {setData({...data, password: e.target.value})}} value={data.password} type="password" className=" mt-[-15px] border-gray-300 shadow-sm border-[0.5px] rounded-md w-[420px] h-10 p-2 focus:outline-none text-black"></input>
                    <button type="submit" className="bg-[#958fc1] shadow-sm border-[0.5px] rounded-md w-[420px] h-10 font-bold hover:shadow-lg">CONTINUE</button>
                </form>
                <p className="text-left text-sm text-gray-500">No Account? <Link className="text-[#958fc1]" to="/signup">Sign Up</Link></p>
            </div> 
        </div>
        </div>
    )
};

export default Login