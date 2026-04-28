import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
   const navigate=useNavigate();
  //const idOfUser=localStorage.getItem("id");
  const studentId=localStorage.getItem("studentId");
  console.log(studentId,"id of student");
  //console.log(idOfUser,"id of the logged user for navbar functions");
  const TeacherId=localStorage.getItem("teacherId");
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
    <>
    <button className="bg-amber-400 rounded-lg p-2 m-1" onClick={BackToHomepage}>Home</button>
    {studentId &&(<div className='bg-amber-100'><button className="bg-amber-400 rounded-lg p-2 m-1" onClick={BackToStudentDashboard}>Dashboard</button></div>)}
     {TeacherId &&(<div className='bg-amber-100'><button className="bg-amber-400 rounded-lg p-2 m-1" onClick={BackToTeacherDashboard}>Dashboard</button></div>)}
      {ifAdmin &&(<div className='bg-amber-100'><button className="bg-amber-400 rounded-lg p-2 m-1" onClick={BackToAdminDashboard}>Dashboard</button></div>)}

    </>
  )
}

export default Navbar