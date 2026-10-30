import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TeachersDashboard from '../pages/TeachersDashboard'
import ViewTeacherDetails from '../pages/ViewTeacherDetails'
import TeacherLogin from '../pages/views/Teacher/TeacherLogin'
import TeacherHomepage from '../pages/views/Teacher/TeacherHomepage'
import TeacherProfile from '../pages/views/Teacher/TeacherProfile'
import TeacherAttendance from '../pages/views/Teacher/TeacherAttendence'
import TeacherExamPage from '../pages/views/Teacher/TeacherExamPage'

const TeacherRoutes = () => {



  return (
    <div>
      <Routes>

        <Route path="/login" element={<TeacherLogin />} />

        <Route path="/teacherDashboard" element={<TeachersDashboard />} />

        <Route path="/profile/:loggedteacherId" element={<TeacherHomepage />} />
        <Route path='/viewProfile/:myId' element={<TeacherProfile />} />
        <Route path='/studentAttendence/:loggedteacherId' element={<TeacherAttendance />} />
        <Route path='/exams/:loggedteacherId' element={<TeacherExamPage />} />
        <Route path='/exams' element={<TeacherExamPage />} />
        <Route path="/details/:teacherid" element={<ViewTeacherDetails />} />
      </Routes>
    </div>
  )
}

export default TeacherRoutes