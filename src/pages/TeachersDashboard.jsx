import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AddTeacherForm from '../components/AddTeacherForm';
import { fetchTeachersData } from '../Redux/Slices/TeacherSlice';
import { useDispatch, useSelector } from 'react-redux';

const TeachersDashboard = () => {
  const SchoolUrl=process.env.REACT_APP_API_SCHOOL

  const dispatch=useDispatch();
  const TeachersDataInfo=useSelector((state)=>state.teacher.teacherData);    //teacher=name in store,teacherData= data stored in slice
  console.log(TeachersDataInfo,"teacherDataInfo");

 const [formvisible, setFormvisible] = useState(false);

  const navigate=useNavigate();

   const[teachers,setTEachers]=useState([]);
  // const[deleteTeacherVariable,setDeleteTeacherFunction]=useState();
    
  useEffect(()=>{
     dispatch(fetchTeachersData());     //from TeacherSlice
    },[]);
   console.log(teachers,"data accessed");
  
  const AddTeacher=()=>{
    setFormvisible(true);
  }


   const viewTeacherDetails=(teacherid)=>{
    console.log(teacherid,"teacher id got inside view function");
    
     navigate(`/teacher/details/${teacherid}`);
   }

   const deleteTeacher = async(deletionId) =>{
     const Deletion=await fetch( `${SchoolUrl}/teacher/${deletionId}`,
         {
            method: 'DELETE',
         }
        // setDeleteTeacherFunction(Deletion);
      );
    console.log(deletionId);
    alert("Deleted successfully");
    dispatch(fetchTeachersData()); 

   }

   const BackToAdminDashboard=()=>{
    navigate("/admin/dashboard");
   }
  return (
                      <div  className='relative min-h-screen bg-amber-100'>
      { formvisible && (
        <AddTeacherForm
        OnAddTeacherClick={()=>setFormvisible(false)} />
      )}
                       <div className={`${formvisible ? "blur-sm" : ""}`}>
      <div >
        <h3>Add New Teacher  <button className="bg-white rounded-lg py-1 px-4 font-extrabold m-1" onClick={AddTeacher}>+</button></h3></div>
      <div>
        <h3 className='font-extrabold p-2 text-4xl text-amber-900 '>List of teachers</h3>
          <table className='auto p-2 my-2 mx-[10%] rounded-lg'>
            <thead>
              <tr className='bg-white text-amber-700 rounded-md p-2 m-10'>
                <th className='m-3 p-2'> NAME </th>
                <th className='m-3 p-2'> CLASS IN CHARGE </th>
                <th className='col-span-2'> ACTIONS </th>
                {/* <th></th> */}
              </tr>
            </thead>
            
            <tbody  className='bg-amber-200' >
               {TeachersDataInfo.map((item)=>(
              <tr key={item._id}>
                <td>{item?.name}</td>
                   <td>{item?.standard}</td>
                      <td><button className='text-amber-400  bg-white rounded-lg m-2 p-2' onClick={ ()=> viewTeacherDetails(item?._id)}>View Details</button></td>
                         <td><button className='text-amber-400 bg-white rounded-lg m-2 p-2' onClick={ ()=> deleteTeacher(item?._id)}>Delete</button></td>
              </tr>
               ))}
            </tbody>
            
          </table>
         <button className='bg-white text-amber-700 rounded-lg m-1 p-2' onClick={BackToAdminDashboard}>Back</button> 
      </div>
                         </div>
      
    </div>
  )
}

export default TeachersDashboard