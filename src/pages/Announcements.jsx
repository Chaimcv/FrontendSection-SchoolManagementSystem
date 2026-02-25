import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { fetchNoticeData } from '../Redux/Slices/AnnouncementSlice';

const Announcements = () => {
  const dispatch=useDispatch();
  const AllAnnouncements=useSelector((state)=>state.announcement.AnnouncementData)||[];
  console.log(AllAnnouncements,"all announcements");
  const[formDisplay,setFormDiaplay]=useState(false);
  const[data,setData]=useState({
    image:"",
    text:""
  });
  useEffect(()=>{
  dispatch(fetchNoticeData());
  console.log(dispatch);
  },[]);
  const handleData=()=>{

  }

  const Add=()=>{
    setFormDiaplay(true);
  } 
  return (
    <div className='h-[50vh] w-full bg-amber-400'>
      <button className='bg-amber-500 rounded-lg m-2 p-2' onClick={Add}>Add</button>
      {AllAnnouncements?.map((item)=>(
     <div key={item._id}>
        <p>{item?.Text}</p>
        </div>
      ))}


      {/* <div>
       <label>Image:<input type='file'></input></label>
        <label>Text:<input type='text' value={data.text} onChange={handleData}></input></label>
        <button>Submit</button>
      </div> */}
    </div>


  )
}

export default Announcements