import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const EditStudentForm = () => {
const dispatch=useDispatch();
const studentDetails=useSelector((state)=>state.student.oneStudentDetailsData)
console.log(studentDetails,"student details");
useEffect(()=>{

},[]);
  return (
    <div></div>
  )
}

export default EditStudentForm