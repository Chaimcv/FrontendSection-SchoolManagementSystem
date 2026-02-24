import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginParent } from '../../../Redux/Slices/ParentSlice';
import SchoolImage from "../../../assets/SchoolImage.png";

const ParentLogin = () => {
    const[inputtedEmail,setInputtedEmail]=useState("");
    const[inputtedPassword,setInputtedPassword]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const LoginAsParent=()=>{
     dispatch(loginParent({inputtedEmail,inputtedPassword}));

    }
    const BackToLogin=()=>{
   navigate("/login");
    }
  return (
     <div className='flex rounded-lg h-80 w-[90%] m-2'>
      <div className='w-[40%] ml-20'>
         <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 ' />
                     </div>
         
            <div className=' bg-amber-400  p-1 w-[30%] space-y-5'>
              <h2>PARENT LOGIN</h2>
               <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginAsParent}>LOGIN</button><br />
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={BackToLogin}>BACK</button>
        </div>
    </div>
  )
}

export default ParentLogin