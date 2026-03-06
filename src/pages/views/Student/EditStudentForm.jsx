import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const EditStudentForm = () => {
const dispatch=useDispatch();
const studentDetails=useSelector((state)=>state.student.oneStudentDetailsData)
console.log(studentDetails,"student details");
const[studentForm,setStudentForm]=useState();
useEffect(()=>{

},[]);
  return (
    <div></div>
  )
}

export default EditStudentForm