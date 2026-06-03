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

        <div className='flex row-span-3'>
         <button className="bg-amber-400 rounded-xl py-1 shadow-md px-2 m-3" onClick={announcements}>Announcements</button><br/>
        <label>Teachers <button className="bg-amber-400 rounded-xl shadow-md py-1 px-2 m-3" onClick={ViewTeachers}>View Teachers</button></label><br />
        {/* <button className="bg-amber-400"onClick={AddNewTeachers}>Add Teacher</button><br/> */}
        {/* <label>Class <button className="bg-amber-400 rounded-2xl py-1 px-2 m-3" onClick={ViewClasses}>View Classes</button></label><br/> */}
        <label>Parents<button className="bg-amber-400 rounded-xl shadow-md py-1 px-2 m-3" onClick={ViewParents}>View Parents</button></label>
       </div>
    </div>
  )
}

export default AdminDashboard