import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { fetchNoticeData } from '../Redux/Slices/AnnouncementSlice';

const Announcements = () => {
  const dispatch=useDispatch();
  const AllAnnouncements=useSelector((state)=>state.Announcements.AnnouncementData)||[]
  const[data,setData]=useState({
    image:"",
    text:""
  });
  useEffect(()=>{
  dispatch(fetchNoticeData());
  console.log(dispatch);
  },[]);
  return (
    <div className='h-[50vh] w-full bg-amber-400'>
      <div>

      </div>
    </div>
  )
}

export default Announcements