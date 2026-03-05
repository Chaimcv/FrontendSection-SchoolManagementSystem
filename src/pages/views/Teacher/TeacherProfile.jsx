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
    <div className='bg-amber-200 '>
       <div>
        <img />
        </div>    
      <div>
        <h2>Name : {getDetails?.name}</h2>
        <h2>Class : {getDetails?.standard}</h2>
        <h2>Subject :{getDetails?.subject}</h2>
        <h2>City : {getDetails?.city}</h2>
        <h2>Pincode : {getDetails?.pin}</h2>
        <h2>Phonenumber : {getDetails?.phoneNumber}</h2>
      </div>
      <button className='bg-amber-400 rounded-lg px-2 py-1' onClick={BackToTeacherHomePage}>Back</button>    
    </div>
  )
}

export default TeacherProfile