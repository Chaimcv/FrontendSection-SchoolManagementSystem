import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const studentId = localStorage.getItem("studentId");
  const teacherId = localStorage.getItem("id");
  const adminName = localStorage.getItem("name");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (adminName === "Principal") {
      setIsAdmin(true);
    }
  }, [adminName]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className="bg-amber-50/90 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-3 overflow-x-auto">
        {/* Left: Home Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              location.pathname === "/"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-amber-900 hover:bg-amber-100/70"
            }`}
            title="School Homepage"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>
        </div>

        {/* Center/Right: Admin Navigation Menu */}
        {isAdmin && (
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5">
            <Link
              to="/admin/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/admin/dashboard")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/announcementsDashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/admin/announcementsDashboard")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Announcements</span>
            </Link>

            <Link
              to="/teacher/teacherDashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/teacher/teacherDashboard")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Faculty</span>
            </Link>

            <Link
              to="/parentslist"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/parentslist")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Parents</span>
            </Link>

            <Link
              to="/admin/adminAttendence"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/admin/adminAttendence")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Attendance</span>
            </Link>

            <Link
              to="/admin/profile"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive("/admin/profile")
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-800 hover:bg-amber-100 hover:text-amber-950"
              }`}
            >
              <span>Profile</span>
            </Link>
          </div>
        )}

        {/* Individual Student/Teacher Dashboards */}
        {!isAdmin && (
          <div className="flex items-center gap-2 shrink-0">
            {studentId && (
              <button
                className="text-amber-800 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                onClick={() => navigate(`/studentDashboard/${studentId}`)}
              >
                Student Portal
              </button>
            )}
            {teacherId && (
              <button
                className="text-amber-800 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-lg text-xs transition-all"
                onClick={() => navigate(`/teacher/profile/${teacherId}`)}
              >
                Teacher Portal
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;