import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchOneParentDetails } from '../../../Redux/Slices/ParentSlice';

const ViewParentProfile = () => {
  const{id}=useParams();
  console.log(id,"parent id");
   const getParticularParentData=useSelector((state)=>state.parent.oneParentDetailsData);
  console.log(getParticularParentData,"parent data fetched in view parent profile page");
  const dispatch=useDispatch();
useEffect(()=>{
dispatch(fetchOneParentDetails(id));
},[id,dispatch]);  

  return (
    <div>ViewParentProfile..........{getParticularParentData}.</div>
  )
}

export default ViewParentProfile