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

        <div className='flex row-span-3 mx-[10%]'>
         <button className="bg-white text-amber-500 border-amber-700 rounded-xl py-1 shadow-lg px-2 m-3 h-[70%] w-[30%]" onClick={announcements}>Announcements</button><br/>
         <button className="bg-amber-400 rounded-xl shadow-md py-1 px-2 m-3" onClick={ViewTeachers}>Teachers</button><br />
        {/* <button className="bg-amber-400"onClick={AddNewTeachers}>Add Teacher</button><br/> */}
        {/* <label>Class <button className="bg-amber-400 rounded-2xl py-1 px-2 m-3" onClick={ViewClasses}>View Classes</button></label><br/> */}
        <button className="bg-amber-400 rounded-xl shadow-md py-1 px-2 m-3" onClick={ViewParents}> Parents</button>
       </div>
    </div>
  )
}

export default AdminDashboard