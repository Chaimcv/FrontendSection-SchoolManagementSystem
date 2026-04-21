import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachersData } from '../Redux/Slices/TeacherSlice';
import { useNavigate } from 'react-router-dom';
import SchoolImage from "../assets/SchoolImage.png";
import { LoginStudent } from '../Redux/Slices/StudentSlice';

const Login = () => {
    const[inputtedEmail,setInputtedEmail]=useState("");
    const[inputtedPassword,setInputtedPassword]=useState("");
    const navigate=useNavigate();

    const dispatch=useDispatch(); 
const LoginFunction = async () => {
  const result = await dispatch(
    LoginStudent({ inputtedEmail, inputtedPassword })
  );
 if (result.success) {
    const token = result.data.token;
    const studentId = result.data.id;
    const name = result.data.name;
     localStorage.setItem("token",token);
         localStorage.setItem("name",name);
    // console.log(token, "TOKEN");
    // console.log(studentId, "ID");
    // console.log(name, "NAME");

    navigate(`/studentDashboard/${studentId}`);
  }
    
    }
   const TeacherLoginPage=()=>{
    navigate("/teacher/login");
   }
    const PrincipalLoginPage=()=>{
    navigate("/admin");
   }
   const ParentLoginPage=()=>{
    navigate("/parentLogin");
   }
  return (
    <div className='flex rounded-lg h-80 w-[90%] m-2 h-screen'>
       <div className='w-[40%] ml-20'>
        <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 ' />
       </div>
    
       
  
        <div className=' bg-amber-400  p-1 w-[30%] space-y-5'>
          <br /><r />
           <button className="bg-amber-100 rounded-lg w-full p-1" onClick={TeacherLoginPage}>LOGIN AS TEACHER</button><br />
         
         <button className="bg-amber-100 rounded-lg  w-full p-1" onClick={PrincipalLoginPage}>LOGIN AS PRINCIPAL</button><br />
          
          <button className="bg-amber-100 rounded-lg w-full p-1" onClick={ParentLoginPage}>LOGIN AS PARENT</button><br />
          <br />
          <h2>STUDENT LOGIN</h2>
          <br />
          <label >Email:  <input className='p-1 my-1 ml-[1] w-[85%] rounded-lg'type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
            <label >Password: <input className='p-1 rounded-lg w-[76%]' type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
           <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginFunction}>LOGIN</button>
        </div>
       
    </div>
  )
}

export default Login