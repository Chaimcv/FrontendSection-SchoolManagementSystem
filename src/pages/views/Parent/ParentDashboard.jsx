import React, { useEffect, useState } from 'react'
import ViewParentProfile from './ViewParentProfile'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneParentDetails } from '../../../Redux/Slices/ParentSlice';
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';

const ParentDashboard = () => {
    const {id}=useParams();
   // console.log(id,"parent id")
      const getOneParentInfo=useSelector((store)=>store.parent.oneParentDetailsData);
       const dispatch=useDispatch();
useEffect(()=>{
dispatch(fetchOneParentDetails(id))
},[id]);
//console.log(getOneParentInfo,"get info of parent");
const studentID=getOneParentInfo?.student_id;
//console.log(studentID,"student id from parent");
useEffect(()=>{
    dispatch(fetchOneStudentDetails(studentID))
},[studentID]);
const getStudentInfo=useSelector((state)=>state.student.oneStudentDetailsData);
console.log(getStudentInfo,"get info of student")
  return (
    <div className='flex h-screen'>
        <div className='w-[30%]'><ViewParentProfile/></div>
          <div className='w-[70%] bg-amber-100 p-[10%]'>
           <div>
            {getStudentInfo?(
                <div>
                    <h1 className='font-bold text-orange-900 '>STUDENT SECTION</h1>
                    <div >
                    <div  className='flex w-[20%]'>
                        <img  className="w-[30%] h-[30%]" src={getStudentInfo?.ProfileImageUrl} alt='image'></img></div>
               <div className=' w-[80%]'>
                <h4>Student Name:{getStudentInfo?.Name}</h4>
                 <h4>Standard:{getStudentInfo?.Standard}</h4>
                  <h4>Division:{getStudentInfo?.Division}</h4>
                  </div>
                  </div>
            </div>
             ):(
                <>No data</>
            )}
           </div>
          </div>
    </div>
  )
}

export default ParentDashboard