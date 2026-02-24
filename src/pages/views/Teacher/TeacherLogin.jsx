import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachersData } from '../../../Redux/Slices/TeacherSlice';
import { useNavigate } from 'react-router-dom';
import SchoolImage from "../../../assets/SchoolImage.png";

const TeacherLogin = () => {
     const[inputtedEmail,setInputtedEmail]=useState();
        const[inputtedPassword,setInputtedPassword]=useState();
         const navigate=useNavigate();
         const DatabaseValues=useSelector((state)=>state.teacher.teacherData);
         console.log(DatabaseValues,"valuesss");

//          const test = DatabaseValues.find(
//   (t) => t.Email === inputtedEmail
// );

// console.log(test?.name);

         const test=DatabaseValues.find((t)=>
            t.Email===inputtedEmail);
         const teacherIdPassedForLogin=test?._id;
            console.log(teacherIdPassedForLogin,"specific value");
        //   console.log(test?.password,"specific value");
     const dispatch=useDispatch();
     
        const LoginAsTeacher=()=>{
          dispatch(fetchTeachersData());
          if(inputtedEmail===test?.Email&& inputtedPassword===test?.Password){
            console.log("ok");
            navigate(`/teacher/profile/${teacherIdPassedForLogin}`);

          }
          else{
            console.log("not ok");
          }
              console.log(inputtedEmail,"email");
              console.log(inputtedPassword,"password");
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
              <h2>TEACHER LOGIN</h2>
          <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] 'type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
          <div>
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginAsTeacher}>LOGIN</button><br /><br />
             <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={BackToLogin}>BACK</button>
             </div>
        </div>
    </div>
  )
}

export default TeacherLogin