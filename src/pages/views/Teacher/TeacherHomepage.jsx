import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TeacherHomepage = () => {
    const{ loggedteacherId }=useParams();
    //console.log(loggedteacherId,"teacher-id");
    const navigate=useNavigate();
    const StudentList=()=>{
        navigate(`/allStudentslisted/${loggedteacherId}`);
    }
    const ParentList=()=>{
        navigate(`/parentslist/${loggedteacherId}`);
    }
    const ProfileView=()=>{
        navigate(`/teacher/viewProfile/${loggedteacherId}`)
    }
  return (
    <div className='bg-amber-100 h-screen '>
        <div className='flex row-span-3  mx-[15%] my[10%]'>
            <button className='bg-white text-amber-600 text-2xl border-amber-700 rounded-xl  shadow-lg px-[5%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out' onClick={ProfileView}>My Profile</button>
       
            <button className='bg-white text-amber-600 text-2xl border-amber-700 rounded-xl  shadow-lg px-[5%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out' onClick={StudentList}>Students</button><br />
             <button className='bg-white text-amber-600 text-2xl border-amber-700 rounded-xl  shadow-lg px-[6%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out' onClick={ParentList}>Parents</button>
            <button></button>
        </div>
    </div>
  )
}

export default TeacherHomepage