import React, { useEffect, useState } from 'react'
import { postEditedTeacherDetails } from '../Redux/Slices/TeacherSlice';
import { useDispatch, useSelector } from 'react-redux';

const EditTeacherForm = () => {
    const dispatch=useDispatch();
const TeacherDataFromDatabase=useSelector((store)=>store.teacher.oneTeacherDetailsData);
console.log(TeacherDataFromDatabase,"teacher to be Edited");

 const [formData, setFormData] = useState({
    name:"",
    pin:"",
    city:"",
    phonenumber:"",
    subject:""
 });
 
   useEffect(()=>{
   if(TeacherDataFromDatabase){
      setFormData({
        name: TeacherDataFromDatabase.name || "",
        class: TeacherDataFromDatabase.class || "",
        pin: TeacherDataFromDatabase.pin || "",
        city: TeacherDataFromDatabase.city || "",
        phonenumber:TeacherDataFromDatabase.phoneNumber || "",
        subject:TeacherDataFromDatabase.subject || "",
        standard:TeacherDataFromDatabase.standard || ""
      });
   }
 },[TeacherDataFromDatabase])
const handleChange=(e)=>{
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
    ...prevData,            // Spread the previous state to retain other values
    [name]: value,            // Update the specific field using the input's 'name' attribute
  }));
  console.log(formData,"formdata");
}

     const EditTeacher=(id)=>{
        console.log(id,"manipulation id");
     dispatch(postEditedTeacherDetails({id,formData}))
    }
  return (
    <div>
        <form onSubmit={EditTeacher(TeacherDataFromDatabase?._id)}>
            {TeacherDataFromDatabase ? (
        <div className='border border-black flex flex-col m-5 p-5 space-y-5 bg-amber-100'>

          <label>NAME: <input type='text' name="name" value={formData.name}   onChange={handleChange} /></label>
          
          <label>PINCODE: <input type='text' name="pin" value={formData.pin}  onChange={handleChange} /></label>
          <label>CITY: <input type='text'   name="city" value={formData.city}  onChange={handleChange} /></label>
          <label>SUBJECT: <input type='text' name="subject"  value={formData.subject}  onChange={handleChange} /></label>
          <label>PHONE: <input type='number'  name="phonenumber"value={formData.phonenumber}  onChange={handleChange} /></label>
          <label>STANDARD: <input type='text'  name="standard" value={formData.standard}  onChange={handleChange} /></label>
            <label>SUBJECT: <input type='text'  name="standard" value={formData.subject}  onChange={handleChange} /></label>

          <button type='submit'>SUBMIT</button>

        </div>
        ):
        <><h1>no teacher</h1></>}
      </form>
    </div>
  )
}

export default EditTeacherForm