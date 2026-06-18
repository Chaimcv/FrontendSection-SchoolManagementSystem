import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOneStudentDetails, postEditedStudentDetails } from '../../../Redux/Slices/StudentSlice';
import { useNavigate } from 'react-router-dom';


const EditStudentForm = () => {
const dispatch=useDispatch();
const studentDetails=useSelector((state)=>state.student.oneStudentDetailsData)
console.log(studentDetails,"student details");
const navigate=useNavigate();
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
      Pincode:studentDetails.Pincode||""
    });
  }
},[studentDetails]);
const handleChange=(e)=>{
  e.preventDefault();
  const{name,value}=e.target;
  setStudentForm((prevData)=>({
    ...prevData,
    [name]: value,
  }));
}
const edited=(id)=>{
 console.log(id,"student edit id in editform");
 dispatch(postEditedStudentDetails({id,studentForm}))
}
const BackToStudentDetails=()=>{
  // navigate(`/viewAStudent/id`);
  navigate(-1);
}
  return (
    <div>
      <form onSubmit={edited(studentDetails?._id)}>
        <div className='border border-black flex flex-col m-5 p-5 space-y-5'>
           <h2>Name : <input type='text' name='Name' value={studentForm.Name}  onchange={handleChange}></input></h2>
           <h2>Age : <input type='number' name='Age' value={studentForm.Age}  onchange={handleChange}></input></h2>
            <h2>Gender : <select  onchange={handleChange}>
              <option value="">{studentForm.Gender}</option>
               <option value="Female"></option>
               <option value="Male"></option>
            </select></h2>
           <h2>Standard : <input type='number' name='Standard' value={studentForm.Standard}  onchange={handleChange}></input></h2>
           <h2>Division :<input type='text' name='Division' value={studentForm.Division}  onchange={handleChange}></input> </h2>
           <h2>Guardian Name : <input type='text' name='Guardian' value={studentForm.Guardian_Name}  onchange={handleChange}></input></h2>
           <h2>Guardian Phonenumber :<input type='number' name='Guardian number' value={studentForm.Guardian_Phonenumber}  onchange={handleChange}></input> </h2>
           <h2>Address :<input type='text' name='Address' value={studentForm.Address}  onchange={handleChange}></input> </h2>
           <h2>Pincode : <input type='number' name='pincode' value={studentForm.Pincode}  onchange={handleChange}></input></h2>
           <button type='submit'>Submit</button>
           <button onClick={BackToStudentDetails}>Back</button>
        </div>
      </form> 
    </div>
  )
}

export default EditStudentForm