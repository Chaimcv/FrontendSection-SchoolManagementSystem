import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProfile from '../pages/AdminProfile'
import AnnouncementDashboard from '../pages/views/announcements/AnnouncementDashboard'
import AdminAttendance from '../pages/views/AdminAttendence'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
        <Route path="/" element={<AdminLogin />}></Route>
        < Route path='/dashboard' element={<AdminDashboard />}/>
        <Route path='/profile' element={<AdminProfile />}/>
         <Route path='/announcementsDashboard' element={<AnnouncementDashboard />}/>
         <Route path='/adminAttendence' element={<AdminAttendance />}/>
        </Routes>
    </div>
  )
}

export default AdminRoutes