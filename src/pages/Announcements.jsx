import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { fetchNoticeData } from '../Redux/Slices/AnnouncementSlice';

const Announcements = () => {
  const dispatch=useDispatch();
  const AllAnnouncements=useSelector((state)=>state.announcement.AnnouncementData)||[];
  console.log(AllAnnouncements,"all announcements");

  useEffect(()=>{
  dispatch(fetchNoticeData());
  },[]);
 
  return (
    <div className='h-[50vh] w-full bg-amber-400'>
      {AllAnnouncements?.map((item)=>(
     <div key={item._id} className='border-red-600 rounded-md p-[5%]'>
      <div> 
         <img></img>
         </div>
        <p>{item?.Text}</p>
        </div>
      ))}
    </div>

  )
}

export default Announcements