import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachersData, loginTeacher } from '../../../Redux/Slices/TeacherSlice';
import { useNavigate } from 'react-router-dom';
import SchoolImage from "../../../assets/SchoolImage.png";

const TeacherLogin = () => {
     const[inputtedEmail,setInputtedEmail]=useState("");
        const[inputtedPassword,setInputtedPassword]=useState("");
         const navigate=useNavigate();
            const dispatch=useDispatch();

       
     
        const LoginAsTeacher=async()=>{
         const result=await dispatch(loginTeacher({inputtedEmail,inputtedPassword}));
         console.log(result,"result values");
         console.log(result?.data?.id,"id obtained");
         const {id,token,name}=result?.data;
         if (result) {
         localStorage.setItem("token",token);
         localStorage.setItem("name",name);
          localStorage.setItem("id",id);
           navigate(`/teacher/profile/${id}`);

         }
         else{
          alert("Error");
         }
        }
        const BackToLogin=()=>{
   navigate("/login");
    }
  return (
    <>
    {/* large screen */}
    <div className='hidden lg:flex'>
        <div className='flex rounded-lg  w-[100%] my-2 bg-amber-100 h-screen'>
          <div className='w-[40%] ml-20'>
                  <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 ' />
                 </div>
            <div className=' bg-amber-400  p-1 w-[25%] space-y-5'>
              <h2>TEACHER LOGIN</h2>
              <br />
          <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] 'type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]'type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
          <div>
            <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={LoginAsTeacher}>LOGIN</button><br /><br />
             <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={BackToLogin}>BACK</button>
             </div>
        </div>
       </div>
    </div>
{/* small screen */}
<div className='flex lg:hidden'>
     <div className='flex rounded-lg  w-screen my-2 bg-amber-100 h-screen'>
       <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit mx-[3%] rounded-md'>
              <h1>TEACHER LOGIN</h1>
              <br />
              <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] 'type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
              <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]'type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
            <div>
                  <br />
                  <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg transition ease-in-out" onClick={LoginAsTeacher}>LOGIN</button><br /><br />
                  <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={BackToLogin}>BACK</button>
            </div>
      </div>
   </div>
</div>
    </>
  )
}

export default TeacherLogin