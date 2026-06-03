import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import HomeIcon from "../assets/HomeIcon.png";

const Navbar = () => {
   const navigate=useNavigate();
  //const idOfUser=localStorage.getItem("id");
  const studentId=localStorage.getItem("studentId");
  console.log(studentId,"id of student");
  //console.log(idOfUser,"id of the logged user for navbar functions");
  const TeacherId=localStorage.getItem("id");  //teacherId changed to check dashboard
  const Admin=localStorage.getItem("name");
  const[ifAdmin,setIfAdmin]=useState(false);
  useEffect(()=>{
    if(Admin==="Principal"){
    setIfAdmin(true)
  }
  },[])
 
 
    const BackToAdminDashboard=()=>{
       if(Admin==="Principal"){
    navigate(`admin/dashboard`);
    }
  }
  const BackToTeacherDashboard=()=>{
    navigate(`teacher/profile/${TeacherId}`)
  }
 
  const BackToStudentDashboard=()=>{
    navigate(`/studentDashboard/${studentId}`)
  }
  const BackToHomepage=()=>{
    navigate("/");
  }
  return (//dashboard
    <div className='bg-amber-50 flex justify-center'>
    <button className=" rounded-lg mx-1" onClick={BackToHomepage}><img src={HomeIcon} className='w-[35%] h-[45%] transition hover:scale-x-110 '></img></button>
    {studentId &&(<button className=" text-amber-700 m-1 font-bold bg-white rounded-lg px-1 transition hover:scale-x-110 " onClick={BackToStudentDashboard}>Dashboard</button>)}
     {TeacherId &&(<button className=" text-amber-700 m-1 font-bold bg-white rounded-lg px-1 transition hover:scale-x-110 " onClick={BackToTeacherDashboard}>Dashboard</button>)}
      {ifAdmin &&(<button className=" text-amber-700 m-1 font-bold bg-white rounded-lg px-1 transition hover:scale-x-110 " onClick={BackToAdminDashboard}>Dashboard</button>)}

    </div>
  )
}

export default Navbar