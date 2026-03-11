import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const EditStudentForm = () => {
const dispatch=useDispatch();
const studentDetails=useSelector((state)=>state.student.oneStudentDetailsData)
console.log(studentDetails,"student details");
const[studentForm,setStudentForm]=useState();
useEffect(()=>{
dispatch(fetchOneStudentDetails())
},[]);
const edited=(id)=>{
 console.log(id,"student edit id");
 dispatch(postEditedStudentDetails({}))
}
  return (
    <div>
      <form onSubmit={edited(studentDetails?._id)}>
        <div className='border border-black flex flex-col m-5 p-5 space-y-5'>
           <h2></h2>
           <h2></h2>
           <h2></h2>
        </div>
      </form> 
    </div>
  )
}

export default EditStudentForm