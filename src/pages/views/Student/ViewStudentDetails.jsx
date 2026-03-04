import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';

const ViewStudentDetails = () => {
    const{id}=useParams();
    //console.log(id,"viewid");
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const getStudentDetails=useSelector((state)=>state.student.oneStudentDetailsData);
    useEffect(()=>{
     dispatch(fetchOneStudentDetails(id));
    },[])
   
  console.log(getStudentDetails,"get Student details");

  const BackToStudentListing=()=>{

  }
  return (
    <div>
        {getStudentDetails ?(
          <div className='bg-amber-100'>
            <h2 className='font-serif'>NAME : {getStudentDetails?.Name}</h2>
            <h2 className='font-serif'>EMAIL : {getStudentDetails?.Email}</h2>
            <h2  className='font-serif'>AGE : {getStudentDetails?.Age}</h2>
             <h2  className='font-serif'>GENDER :{getStudentDetails?.Gender}</h2>
             <h2  className='font-serif'>STANDARD :{getStudentDetails?.Standard}</h2>
              <h2 className='font-serif'>DIVISION :{getStudentDetails?.Division}</h2>
             <h2  className='font-serif'>GUARDIAN NAME :{getStudentDetails?.guardian}</h2>
            <h2  className='font-serif'>GUARDIAN PHONENUMBER :{getStudentDetails?.Guardian_phonenumber}</h2>
               <h2  className='font-serif'>ADDRESS :{getStudentDetails?.Address}</h2>
                 <h2  className='font-serif'>PINCODE :{getStudentDetails?.Pincode}</h2>
                    
              <button className='bg-amber-400 p-1 m-2 rounded-md '>EDIT</button>
               <button className='bg-amber-400 p-1 m-2 rounded-md ' onClick={BackToStudentListing}>BACK</button>
               </div>
               ):(
                <h1>No data available</h1>
               )}
    </div>
  )
}

export default ViewStudentDetails