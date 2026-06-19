import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchOneTeacherDetails } from '../Redux/Slices/TeacherSlice';
import EditTeacherForm from '../components/EditTeacherForm';

const ViewTeacherDetails = () => {
const[editformVisibility,setEditFormVisibility]=useState(false);
const navigate=useNavigate();
const dispatch=useDispatch();
const oneTeacherDetail=useSelector((store)=>store.teacher.oneTeacherDetailsData);
console.log(oneTeacherDetail,"oneteacher");
    const {teacherid}=useParams();
    console.log(teacherid,"id obtained");

        useEffect(()=>{
        dispatch(fetchOneTeacherDetails(teacherid))
         
        },[teacherid]);
       //console.log(teacher,"teacher accessed");


       const EditTeacherDetails=(EditId)=>{
        setEditFormVisibility(true);
      //console.log(EditId,"editid");                          
      dispatch(fetchOneTeacherDetails(EditId))                 //passed id
       }
       const BackToTeacherDashboard=()=>{
        navigate("/teacher/teacherDashboard");
       }
      
  return (
    <div  className='relative min-h-screen bg-amber-100'>
      {editformVisibility &&(
        <EditTeacherForm
        OnEditBtnClick={()=>setEditFormVisibility(false)} />
      )}
         <div className={`${editformVisibility ? "blur-sm" : ""}`}>
         <h1 className='font-bold'>Teacher Details</h1>

    {oneTeacherDetail ? (
      <div className='bg-amber-50 p-[1%] mx-[20%]'>
        <h2>Name: {oneTeacherDetail.name}</h2>
        <h2>Class: {oneTeacherDetail.standard}</h2>
        <h2>City: {oneTeacherDetail.city}</h2>
        <h2>Pincode: {oneTeacherDetail.pin}</h2>
        <h2>Phonenumber: {oneTeacherDetail.phoneNumber}</h2>
      </div>
    ) : (
      <h2>No teacher</h2>
    )}
    <button className='bg-amber-400 rounded-xl py-1 px-3 m-1 text-white' onClick={()=>EditTeacherDetails(oneTeacherDetail?._id)} >Edit</button>
     <button className='bg-amber-400 rounded-xl py-1 px-3 m-1 text-white' onClick={BackToTeacherDashboard} >Back</button>
    </div>
    </div>
    
  )
}

export default ViewTeacherDetails