import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchOneParentDetails } from '../../../Redux/Slices/ParentSlice';

const ViewParentProfile = () => {
  const{id}=useParams();
  //console.log(id,"parent id");
   const getParticularParentData=useSelector((store)=>store.parent.oneParentDetailsData);
  console.log(getParticularParentData,"parent data fetched in view parent profile page");
  const dispatch=useDispatch();
useEffect(()=>{
dispatch(fetchOneParentDetails(id))
},[id]);  

  return (
    <div>
      {getParticularParentData ?(
        <div className='bg-amber-500 h-screen p-[5%]'>
            <h4>Name: {getParticularParentData.Name}</h4>
            <h4>Address: {getParticularParentData.address}</h4>
            <h4>Phonenumber: {getParticularParentData.phonenumber}</h4>
            <h4>Student name: {getParticularParentData.Student_name}</h4>
        </div>
      ):(
        <>no data</>
      )}
    </div>
  )
}

export default ViewParentProfile