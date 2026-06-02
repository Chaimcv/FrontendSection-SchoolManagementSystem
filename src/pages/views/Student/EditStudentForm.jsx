import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOneStudentDetails, postEditedStudentDetails } from '../../../Redux/Slices/StudentSlice';


const EditStudentForm = () => {
const dispatch=useDispatch();
const studentDetails=useSelector((state)=>state.student.oneStudentDetailsData)
console.log(studentDetails,"student details");
const[studentForm,setStudentForm]=useState({
Name:"",
Age:"",
Standard:"",
Division:"",
Gender:"",
Guardian_Name:"",
Guardian_Phonenumber:"",
Address:"",
Pincode:"",
ProfileImageUrl:""

});
useEffect(()=>{
//dispatch(fetchOneStudentDetails())
if(studentDetails){
  
    setStudentForm({
      Name:studentDetails.Name||"",
      Age:studentDetails.Age||"",
      Standard:studentDetails.Standard||"",
      Division:studentDetails.Division||"",
      Gender:studentDetails.Gender||"",
      Guardian_Name:studentDetails.Guardian||"",
      Guardian_Phonenumber:studentDetails.Guardian_Phonenumber||"",
      Address:studentDetails.Address||"",
      Pincode:studentDetails.Pincode
    });
  
}
},[]);
const edited=(id)=>{
 console.log(id,"student edit id");
 dispatch(postEditedStudentDetails({}))
}
  return (
    <div>
      <form onSubmit={edited(studentDetails?._id)}>
        <div className='border border-black flex flex-col m-5 p-5 space-y-5'>
           <h2>Name : </h2>
           <h2>Age : </h2>
           <h2>Gender : </h2>
           <h2>Standard : </h2>
           <h2>Division : </h2>
           <h2>Guardian Name : </h2>
           <h2>Guardian Phonenumber : </h2>
           <h2>Address : </h2>
           <h2>Pincode : </h2>
        </div>
      </form> 
    </div>
  )
}

export default EditStudentForm