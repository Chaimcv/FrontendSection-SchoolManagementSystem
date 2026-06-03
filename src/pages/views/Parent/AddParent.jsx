import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addNewParentToDb } from '../../../Redux/Slices/ParentSlice';
import { useNavigate, useParams } from 'react-router-dom';

const AddParent = () => {
  const loggedteacherId=useParams();
const [selectedUser, setSelectedUser] = useState(null);
const [disId,setDisId]=useState();
const[parentName,setParentName]=useState();
    const students= useSelector((state)=>state.student.studentData);
   const dispatch=useDispatch();                                              //email: 'q@gmail.com',
                                                                                //password: 'sXRwzGHV1r'
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
    //console.log(students);
     const handleChange = (e) => {
  const { name, value,file } = e.target;
   
//   const selectedId = e.target.value;
//    const selectedObj = users.find(user => user._id == selectedId);
// console.log(selectedObj?._id,"id testing");
//  setDisId(selectedObj?._id);
//  console.log(disId);
//   setSelectedUser(selectedObj);

   // Dropdown selection
  if (e.target.tagName === "SELECT") {
    const selectedObj = students.find(student => student._id == value);
    setDisId(selectedObj?._id);
    setSelectedUser(selectedObj);

    setFormData((prev) => ({
      ...prev,
      studentId: selectedObj?._id,
      studentname: selectedObj?.Name,
    }));

    return;
  }

  // File input
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
  navigate(`/allStudentslisted/${loggedteacherId}`);
}
const Back=()=>{
  navigate(-1);
}
  return (
    <div className='bg-white h-screen '>
       
        <form onSubmit={AddNewParent}>
            <div className='flex flex-col m-16 p-4 space-y-4 bg-amber-50 rounded-xl shadow-xl'>
                  {/* <label>STUDENT NAME: 
                <select 
                name="studentname" value={formData.studentname} onChange={handleChange}>
                    {students.map((item)=>(  
              <option key={item?._id} value={item.Name} >{item.Name}</option>
             ))}
        </select>
        </label> */}
        <label> STUDENT NAME:
        <select onChange={(e) => handleChange(e)}>
  <option value="">Select Student</option>
  {students.map(student => (
    <option key={student?._id} value={student?._id}>
      {student.Name}
    </option>
  ))}
</select>
</label>
              <label>NAME :   <input type='text' class='border border-amber-700' name="name" value={formData.name} onChange={handleChange}></input></label>
                 <label>STUDENT ID :  <input type='text' defaultValue={disId} ></input></label>
     <label>PROFILE PICTURE: <input
        type="file"
        accept="image/*"
        onChange={handleChange}
      /></label> 
              <label>EMAIL :  <input type='email' name="email" value={formData.email} onChange={handleChange}></input></label>
               <label>ADDRESS :  <input type='text' name="address" value={formData.address} onChange={handleChange}></input></label>
                <label>PINCODE :<input type='number' name="pincode" value={formData.pincode} onChange={handleChange}></input></label>
               <label>PHONENUMBER:  <input type='number' name="phonenumber" value={formData.phonenumber} onChange={handleChange}></input></label>
                <button className='bg-amber-600 p-2 rounded-lg text-white shadow-lg font-bold'>Sumbit</button>
                 <button className='bg-amber-600  text-white p-2 rounded-lg shadow-lg font-bold' onClick={Back}>Back</button>
            </div>
        </form>
        {/* <button className='bg-amber-400 p-2 rounded-lg' onClick={BackTo}>Back</button> */}
    </div>
  )
}

export default AddParent