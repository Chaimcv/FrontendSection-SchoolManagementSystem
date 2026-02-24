import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminLogin from '../pages/AdminLogin'
import AdminDashboard from '../pages/AdminDashboard'
import AdminProfile from '../pages/AdminProfile'
import Announcements from '../pages/Announcements'

const AdminRoutes = () => {
  return (
    <div>
        <Routes>
        <Route path="/" element={<AdminLogin />}></Route>
        < Route path='/dashboard' element={<AdminDashboard />}/>
        <Route path='/profile' element={<AdminProfile />}/>
         <Route path='/announcements' element={<Announcements />}/>
        </Routes>
    </div>
  )
}

export default AdminRoutes