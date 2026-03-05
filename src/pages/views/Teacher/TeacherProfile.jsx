import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

const TeacherProfile = () => {
    const {myId}=useParams();
    console.log(myId,"id of a teacher");
    const getDetails=useSelector((state)=>state.teacher.oneTeacherDetailsData)
  return (
    <div>TeacherProfile</div>
  )
}

export default TeacherProfile