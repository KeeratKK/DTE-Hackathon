import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import '../css/homeStyle.css'; 
import ToggleSwitch from "./toggleSwitch";

export const Signup = () => {
    const navigate = useNavigate();

    // State to store form data for signup
    const [data, setData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [isDoctor, setIsDoctor] = useState(false);

    // Function to handle user signup
    const registerUser = async (e) => {
        e.preventDefault();
        const {first_name, last_name, email, password} = data;
        try{
            const {data} = await axios.post('/signup', {
                first_name, last_name, email, password
            });
            if(data.error){
                toast.error(data.error)
            }else{
                setData({})
                toast.success('Signup Successful. Welcome!')
                navigate('/calender');
                window.location.reload();
            }
        }catch (error){
            console.log(error.response);
        }
    }

    return(
        <div className="flex justify-center items-center mt-[75px] text-black">
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
        <div className="content-container w-[500px] h-[590px] border-2 border-[#87CEEB] rounded-2xl flex-col flex justify-center items-center text-center">
            <div className="w-[420px] flex flex-col gap-5">
                <p className="mt-[-25px] text-[25px] font-semibold text-left">Sign Up</p>
                <p className="mt-[-15px] text-gray-500 text-left">to continue using Care Exchange!</p>
                <ToggleSwitch isDoctor={isDoctor} setIsDoctor={setIsDoctor} />
                <form className="flex-col flex justify-center text-center gap-5" onSubmit={registerUser}>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-5">
                        <label className="text-left">First Name</label>
                        <input onChange={(e)=>{setData({...data, first_name: e.target.value})}} value={data.first_name} className="mt-[-15px] text-black border-gray-300 shadow-sm border-[0.5px] rounded-md w-[200px] h-10 p-2 focus:outline-none"></input>
                        </div>
                        <div className="flex flex-col gap-5">
                        <label value={data.last_name} className="text-left">Last Name</label>
                        <input onChange={(e) => {setData({...data, last_name: e.target.value})}} className="mt-[-15px] text-black border-gray-300 shadow-sm border-[0.5px] rounded-md w-[200px] h-10 p-2 focus:outline-none"></input>
                        </div>
                    </div>
                    <label value={data.email} type="email" className="text-md text-left">Email address</label>
                    <input onChange={(e) => {setData({...data, email: e.target.value})}} className="mt-[-15px] text-black border-gray-300 shadow-sm border-[0.5px] rounded-md w-[420px] h-10 p-2 focus:outline-none"></input>
                    <label value={data.password} className="text-md text-left">Password</label>
                    <input type="password" onChange={(e) => {setData({...data, password: e.target.value})}} className="text-black mt-[-15px] border-gray-300 shadow-sm border-[0.5px] rounded-md w-[420px] h-10 p-2 focus:outline-none"></input>
                    <button type="submit" className="bg-[#87CEEB] shadow-sm border-[0.5px] rounded-md w-[420px] h-10 font-bold hover:shadow-lg">CONTINUE</button>
                </form>
                <p className="text-left text-sm text-gray-500">Already a memeber? <Link className="text-[#87CEEB]" to="/login">Login</Link></p>
            </div> 
        </div>
        </div>
    )
};

export default Signup