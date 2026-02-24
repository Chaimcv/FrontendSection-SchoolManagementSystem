import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchOneTeacherDetails } from '../Redux/Slices/TeacherSlice';
import EditTeacherForm from '../components/EditTeacherForm';

const ViewTeacherDetails = () => {
const[editformVisibility,setEditFormVisibility]=useState(false);

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
      console.log(EditId,"editid");                          
      dispatch(fetchOneTeacherDetails(EditId))                 //passed id
       }
      
  return (
    <div  className='relative min-h-screen'>
      {editformVisibility &&(
        <EditTeacherForm
        OnEditBtnClick={()=>setEditFormVisibility(false)} />
      )}
         <div className={`${editformVisibility ? "blur-sm" : ""}`}>
         <h1>Teacher Details</h1>

    {oneTeacherDetail ? (
      <div>
        <h2>Name: {oneTeacherDetail.name}</h2>
        <h2>Class: {oneTeacherDetail.standard}</h2>
        <h2>City: {oneTeacherDetail.city}</h2>
        <h2>Pincode: {oneTeacherDetail.pin}</h2>
        <h2>Phonenumber: {oneTeacherDetail.phoneNumber}</h2>
      </div>
    ) : (
      <h2>No teacher</h2>
    )}
    <button onClick={()=>EditTeacherDetails(oneTeacherDetail?._id)} >Edit</button>
    </div>
    </div>
  )
}

export default ViewTeacherDetails