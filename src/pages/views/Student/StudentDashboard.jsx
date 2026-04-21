import React, { useEffect, useState } from 'react'
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddPostForm from '../../../components/AddPostForm';

const StudentDashboard = () => {
 const {id}=useParams();
 const[postForm,setPostForm]=useState(false);
 console.log(id,"student id accessed from url");
 const dispatch=useDispatch();
  useEffect(()=>{
    dispatch(fetchOneStudentDetails(id))
},[id]);
const getStudentInfo=useSelector((state)=>state.student.oneStudentDetailsData);
console.log(getStudentInfo,"get info of student")

const AddPost=()=>{
  setPostForm(true);

}
  return (
    <>
    <div className='h-screen bg-amber-100'>
      {getStudentInfo?(
        <div  className=''>
                        <img  className="w-[20%] h-[20%]" src={getStudentInfo?.ProfileImageUrl} alt='image'></img>
                        
               
                <h4>Student Name:{getStudentInfo?.Name}</h4>
                 <h4>Standard:{getStudentInfo?.Standard}</h4>
                  <h4>Division:{getStudentInfo?.Division}</h4>
       </div>           
                  
    ):(
      <>No data</>
    )}</div>
    <div>
      {postForm &&
      <AddPostForm />}
      <button onClick={AddPost}>Add Post</button>
    </div>
   </> 
  )
}

export default StudentDashboard