import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewParentToDb } from '../../../Redux/Slices/ParentSlice';
import { useNavigate } from 'react-router-dom';

const AddParent = () => {
   const students= useSelector((state)=>state.student.studentData);
   const dispatch=useDispatch();
   const navigate=useNavigate();
   //const[nameSelection,setNameSelection]=useState();
   const[formData,setFormData]=useState({
    name:"",
    email:"",
    studentname:"",
    studentId:"",
    phonenumber:"",
    address:"",
    pincode:"",
    image:""

   });
    console.log(students);

    const AllStudents=()=>{
      
    }

     const handleChange = (e) => {
  const { name, value,file } = e.target;

    if (name === "image") {
    setFormData((prev) => ({
      ...prev,
      image: file[0],   // store file object
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  
};
const AddNewParent=(e)=>{
    e.preventDefault();
  dispatch(addNewParentToDb(formData));
  navigate("/allStudentslisted");
}

// const AddNewParent = (e) => {
//   e.preventDefault();

//   const data = new FormData();

//   data.append("name", formData.name);
//   data.append("email", formData.email);
//   data.append("studentname", formData.studentname);
//   data.append("studentId", formData.studentId);
//   data.append("phonenumber", formData.phonenumber);
//   data.append("address", formData.address);
//   data.append("pincode", formData.pincode);
//   data.append("image", formData.image);

//   dispatch(addNewParentToDb(data));
//   console.log(data,"addded data");
//   navigate("/allStudentslisted");
// };


//....

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleStudentChange = (e) => {
//     const selectedId = e.target.value;

//     const selectedStudent = students.find(
//       (student) => student._id === selectedId
//     );

//     setFormData((prev) => ({
//       ...prev,
//       studentId: selectedStudent?._id || "",
//       studentname: selectedStudent?.Name || "",
//     }));
//   };

//   const AddNewParent = (e) => {
//     e.preventDefault();
//     dispatch(addNewParentToDb(formData));
//   };
// //.....
  return (
    <div className='bg-amber-300 h-screen '>
       
        <form onSubmit={AddNewParent}>
            <div className='flex flex-col m-16 p-4 space-y-4'>
                  <label>STUDENT NAME: 
                <select 
              //    name="studentId"
              // value={formData.studentId}
              // onChange={handleChange}>
                name="studentname" value={formData.studentname} onChange={handleChange}>
                    {students.map((item)=>(  
            // <option key={students?._id} value={students.Name} >{item.Name}</option>
              <option key={item?._id} value={item.Name} >{item.Name}</option>
            
        ))}
        </select>
        </label>
              <label>NAME :   <input type='text' name="name" value={formData.name} onChange={handleChange}></input></label>
              
     <label>PROFILE PICTURE: <input
        type="file"
        accept="image/*"
        onChange={handleChange}
      /></label> 
              <label>EMAIL :  <input type='email' name="email" value={formData.email} onChange={handleChange}></input></label>
               <label>ADDRESS :  <input type='text' name="address" value={formData.address} onChange={handleChange}></input></label>
                <label>PINCODE :<input type='number' name="pincode" value={formData.pincode} onChange={handleChange}></input></label>
               <label>PHONENUMBER:  <input type='number' name="phonenumber" value={formData.phonenumber} onChange={handleChange}></input></label>
                <button className='bg-amber-400 p-2 rounded-lg'>Sumbit</button>
            </div>
        </form>
    </div>
  )
}

export default AddParent