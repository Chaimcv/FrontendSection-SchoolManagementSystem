import React, { useEffect, useState } from 'react'
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import AddPostForm from '../../../components/AddPostForm';

const StudentDashboard = () => {
    const { id } = useParams();
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
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">Student Dashboard</h1>
                    {/* <Link to="/" className="text-sm font-medium text-amber-600 hover:text-amber-700 font-semibold tracking-wide uppercase">View Community Feed</Link> */}
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
                                    className="mt-8 w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95 flex items-center justify-center gap-2"
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
                <div>
                    <h4>Report card</h4>
                    <h3>Exam schedule</h3>
                    {/* add more sections */}
                    
                    <h4> Posts</h4>
                </div>

                {/* Dashboard Stats / Quick Actions */}
                {/* <div className="md:col-span-2 space-y-8">
                   <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-amber-900 mb-2">Welcome Back!</h3>
                            <p className="text-amber-800/80 mb-6 max-w-md">Share your latest updates, projects, or questions with your school community in the social feed.</p>
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 py-3 px-6 bg-white text-amber-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
                            >
                                Jump to Feed
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30"></div>
                   </div>
                </div> */}
            </div>

            {/* Post Form Modal */}
            {postForm && <AddPostForm onClose={togglePostForm} />}
        </div>
    )
}

export default StudentDashboard