import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOneTeacherDetails } from '../../../Redux/Slices/TeacherSlice';

const TeacherProfile = () => {
    const {myId}=useParams();
    const navigate=useNavigate();
    console.log(myId,"id of a teacher");
    const dispatch=useDispatch();
    const getDetails=useSelector((state)=>state.teacher.oneTeacherDetailsData)
    useEffect(()=>{
            dispatch(fetchOneTeacherDetails(myId))
            },[myId]);
            const BackToTeacherHomePage=()=>{
               navigate(`/teacher/profile/${myId}`)
            }
  return (
    <div className='bg-amber-100 h-screen'>
       <div>
        <img />
        </div>    
      <div className='bg-amber-50 border-amber-600 rounded-xl m-[5%]'>
        <h2>Name : {getDetails?.name}</h2>
        <h2>Class : {getDetails?.standard}</h2>
        <h2>Subject :{getDetails?.subject}</h2>
        <h2>City : {getDetails?.city}</h2>
        <h2>Pincode : {getDetails?.pin}</h2>
        <h2>Phonenumber : {getDetails?.phoneNumber}</h2>
      </div>
      <button className='bg-amber-600 text-white rounded-lg px-4 py-1 shadow-lg' onClick={BackToTeacherHomePage}>Back</button>    
    </div>
  )
}

export default TeacherProfile