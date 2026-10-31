import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeachersData } from "../Redux/Slices/TeacherSlice";
import { fetchParentsData } from "../Redux/Slices/ParentSlice";
import { fetchNoticeData } from "../Redux/Slices/AnnouncementSlice";
import { fetchAllSchoolClasses } from "../Redux/Slices/AttendenceSlice";
import { fetchAllExams } from "../Redux/Slices/ExamSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const teachers = useSelector((state) => state.teacher.teacherData) || [];
  const parents = useSelector((state) => state.parent.parentData) || [];
  const announcements = useSelector((state) => state.announcement.AnnouncementData) || [];
  const classes = useSelector((state) => state.attendance.assignedClasses) || [];
  const rawExams = useSelector((state) => state.exam.allExams);
  const allExams = useMemo(() => (Array.isArray(rawExams) ? rawExams : []), [rawExams]);

  useEffect(() => {
    dispatch(fetchTeachersData());
    dispatch(fetchParentsData());
    dispatch(fetchNoticeData());
    dispatch(fetchAllSchoolClasses());
    dispatch(fetchAllExams());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white pb-16 text-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Live Metric KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Total Faculty */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Teaching Faculty
              </span>
              <span className="text-3xl font-extrabold text-amber-950 mt-1 block">
                {teachers.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Registered teachers</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-xs">
              👨‍🏫
            </div>
          </div>

          {/* Total Parents */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Parent Directory
              </span>
              <span className="text-3xl font-extrabold text-amber-950 mt-1 block">
                {parents.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Guardian records</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-xs">
              👨‍👩‍👧
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Active Notices
              </span>
              <span className="text-3xl font-extrabold text-amber-950 mt-1 block">
                {announcements.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Published bulletins</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-xs">
              📢
            </div>
          </div>

          {/* Class Registers */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
                Class Sections
              </span>
              <span className="text-3xl font-extrabold text-amber-950 mt-1 block">
                {classes.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Tracked divisions</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-xs">
              🏛️
            </div>
          </div>

          {/* Exam Schedules KPI */}
          <div
            onClick={() => navigate("/admin/examSchedules")}
            className="bg-white rounded-2xl p-5 border border-amber-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer group hover:border-amber-400"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block group-hover:text-amber-800">
                Exam Schedules
              </span>
              <span className="text-3xl font-extrabold text-amber-950 mt-1 block">
                {allExams.length}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Master timetables</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-xs group-hover:scale-110 transition-transform">
              🗓️
            </div>
          </div>
        </div>

        {/* Primary Management Hub Modules */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-amber-950 tracking-tight flex items-center gap-2 mb-4">
            <span className="w-2.5 h-6 rounded-full bg-amber-600 inline-block"></span>
            Administrative Portals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcements Hub */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    {announcements.length} Published
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                  Announcements & Notice Board
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Broadcast official circulars, event notifications, and urgent school advisories
                  to students, parents, and faculty.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                <button
                  onClick={() => navigate("/admin/announcementsDashboard")}
                  className="bg-amber-600 ml-[35%] hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Manage Notices →
                </button>
              </div>
            </div>

            {/* Faculty Hub */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    {teachers.length} Active Staff
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                  Faculty & Teacher Directory
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Manage instructor credentials, class-in-charge assignments, assigned subjects,
                  and faculty profiles.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                <button
                  onClick={() => navigate("/teacher/teacherDashboard")}
                  className="bg-amber-600 ml-[35%] hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Manage Faculty →
                </button>
              </div>
            </div>

            {/* Parents Hub */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    {parents.length} Guardians
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                  Parent & Guardian Directory
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Maintain verified contact records, residential addresses, and parent-student
                  linkages for emergency correspondence.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                <button
                  onClick={() => navigate("/parentslist")}
                  className="bg-amber-600 ml-[35%] hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Open Directory →
                </button>
              </div>
            </div>

            {/* Attendance Hub */}
            <div className="group bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    Whole School Register
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                  School Attendance Register
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Inspect comprehensive monthly class registers, monitor daily roll calls, review
                  class teacher audits, and filter student records.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                <button
                  onClick={() => navigate("/admin/adminAttendence")}
                  className="bg-amber-600 ml-[35%] hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Attendence Register →
                </button>
              </div>
            </div>

            {/* Exam Schedules Hub (Clickable card like Attendance) */}
            <div
              onClick={() => navigate("/admin/examSchedules")}
              className="group bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                    {allExams.length} Master Timetables
                  </span>
                </div>
                <h3 className="text-xl font-bold text-amber-950 mb-2 group-hover:text-amber-700 transition-colors">
                  School Examination Schedules
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  Inspect comprehensive examination timetables, review paper dates and times created
                  by faculty teachers, print schedules, and manage class exam rosters.
                </p>
              </div>

              <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/admin/examSchedules");
                  }}
                  className="bg-amber-600 ml-[35%] hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Exam Schedules →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
