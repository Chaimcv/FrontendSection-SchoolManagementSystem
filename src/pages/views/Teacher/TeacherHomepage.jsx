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
        navigate("/parentslist");
    }
    const ProfileView=()=>{
        navigate(`/teacher/viewProfile/${loggedteacherId}`)
    }
  return (
    <div className='bg-amber-200'>
        <div>
            <button className='bg-amber-500 rounded-lg p-2 m-2' onClick={ProfileView}>My Profile</button>
        </div>
        <div>
            <button className='bg-amber-500 rounded-lg p-2 m-2' onClick={StudentList}>Students</button><br />
             <button className='bg-amber-500 rounded-lg p-2 m-2' onClick={ParentList}>Parents</button>
            <button></button>
        </div>
    </div>
  )
}

export default TeacherHomepage