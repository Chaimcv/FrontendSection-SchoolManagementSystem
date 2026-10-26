import React, { useEffect, useState } from 'react'
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AddPostForm from '../../../components/AddPostForm';

const StudentDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postForm, setPostForm] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchOneStudentDetails(id))
    }, [id, dispatch]);

    const getStudentInfo = useSelector((state) => state.student.oneStudentDetailsData);

    const togglePostForm = () => {
        setPostForm(!postForm);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Premium Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                        Student Dashboard
                    </h1>

                    <div className="flex items-center gap-3">

                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        {getStudentInfo ? (
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    <img
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                        src={getStudentInfo?.ProfileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                        alt='profile'
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{getStudentInfo?.Name}</h2>
                                <p className="text-amber-600 font-semibold text-sm mb-6">Student</p>

                                <div className="w-full space-y-3 text-left">
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-500 text-sm">Standard</span>
                                        <span className="font-bold text-gray-800">{getStudentInfo?.Standard}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-500 text-sm">Division</span>
                                        <span className="font-bold text-gray-800">{getStudentInfo?.Division}</span>
                                    </div>
                                </div>





                                <button
                                    onClick={togglePostForm}
                                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add New Post
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400">Loading student data...</div>
                        )}
                    </div>
                </div>

                {/* Dashboard Main Panel: Core Action Cards */}
                <div className="md:col-span-2 space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50 rounded-3xl p-7 border border-amber-200/80 shadow-xs relative overflow-hidden">
                        <div className="relative z-10">

                            <h2 className="text-2xl font-extrabold text-amber-950 mb-1.5">
                                Welcome Back, {getStudentInfo?.Name || 'Student'}!
                            </h2>

                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-200/60 rounded-full blur-2xl"></div>
                    </div>

                    {/* TWO PRIMARY ACTION BUTTONS/CARDS: EXAMS & ATTENDANCE SHEET */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* 1. BUTTON / CARD FOR EXAMS */}
                        <div
                            onClick={() => navigate(`/studentExams/${id}`)}
                            className="group cursor-pointer rounded-3xl bg-white p-6 shadow-md hover:shadow-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50 rounded-full blur-xl group-hover:bg-indigo-100 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform">
                                    📝
                                </div>
                                <span className="inline-block px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-indigo-200">
                                    Academic Schedule
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    Exams
                                </h3>

                            </div>
                        </div>

                        {/* 2. BUTTON / CARD FOR ATTENDANCE SHEET */}
                        <div
                            onClick={() => navigate(`/studentAttendance/${id}`)}
                            className="group cursor-pointer rounded-3xl bg-white p-6 shadow-md hover:shadow-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-full blur-xl group-hover:bg-emerald-100 transition-colors"></div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md mb-4 group-hover:scale-110 transition-transform">
                                    📊
                                </div>
                                <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-emerald-200">
                                    Monthly Roll-Call
                                </span>
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    Attendance Sheet
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Quick Community / Social Action */}
                    <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900">School Community Feed</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Connect with your classmates and teachers on the campus bulletin feed.
                            </p>
                        </div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shrink-0"
                        >
                            View Feed →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Post Form Modal */}
            {postForm && <AddPostForm onClose={togglePostForm} />}
        </div>
    )
}

export default StudentDashboard