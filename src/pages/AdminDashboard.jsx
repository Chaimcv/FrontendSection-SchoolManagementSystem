import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate=useNavigate();

    const ViewProfile=()=>{
   navigate("/profile");
    }
   const ViewTeachers=()=>{
    navigate("/teacher/teacherDashboard");
   }
   const ViewClasses=()=>{
    navigate("/classDashboard");
   }
   const ViewParents=()=>{
    navigate("/parentslist");
   }
   const announcements=()=>{
    navigate("/admin/announcementsDashboard");
   }

  return (
    
    <div className='bg-amber-100 flex-wrap h-screen'>
        {/* <button className="bg-amber-400 rounded-xl shadow-md py-1 px-2 m-3" onClick={ViewProfile}>My Profile</button><br/> */}

        <div className='flex row-span-3 mx-[20%]'>
         <button className="bg-white text-amber-600 text-2xl border-amber-700 rounded-xl  shadow-lg px-[5%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out" onClick={announcements}>Announcements</button><br/>
         <button className="bg-white text-amber-600 text-2xl border-amber-700 rounded-xl shadow-lg px-[5%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out " onClick={ViewTeachers}>Teacher Section</button><br />
        {/* <button className="bg-amber-400"onClick={AddNewTeachers}>Add Teacher</button><br/> */}
        {/* <label>Class <button className="bg-amber-400 rounded-2xl py-1 px-2 m-3" onClick={ViewClasses}>View Classes</button></label><br/> */}
        <button className="bg-white text-amber-600 text-2xl border-amber-700 rounded-xl shadow-lg px-[5%] py-[15%] m-3 transition hover:scale-110 duration-300 ease-in-out " onClick={ViewParents}> Parent Section</button>
       </div>
    </div>
  )
}

export default AdminDashboard