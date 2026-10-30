import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TeacherHomepage = () => {
    const { loggedteacherId } = useParams();
    const navigate = useNavigate();

    const StudentList = () => {
        navigate(`/allStudentslisted/${loggedteacherId}`);
    }
    const ParentList = () => {
        navigate(`/parentslist/${loggedteacherId}`);
    }
    const ProfileView = () => {
        navigate(`/teacher/viewProfile/${loggedteacherId}`);
    }
    const StudentAttendence = () => {
        navigate(`/teacher/studentAttendence/${loggedteacherId}`);
    }
    const ExamSection = () => {
        navigate(`/teacher/exams/${loggedteacherId}`);
    }

    return (
        <div className='bg-amber-100 min-h-screen py-12 flex flex-col items-center justify-center'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl sm:text-4xl font-extrabold text-amber-950 font-serif tracking-tight'>
                    Teacher Portal Dashboard
                </h1>
                <p className='text-sm text-stone-600 mt-2'>
                    Select an operational module to view and manage class records.
                </p>
            </div>

            <div className='flex flex-wrap justify-center items-center gap-6 max-w-6xl px-4'>
                <button
                    className='bg-white text-amber-600 text-2xl border-2 border-amber-700 rounded-2xl shadow-xl px-10 py-14 transition hover:scale-105 hover:bg-amber-50 duration-300 ease-in-out font-bold active:scale-95'
                    onClick={ProfileView}
                >
                    My Profile
                </button>

                <button
                    className='bg-white text-amber-600 text-2xl border-2 border-amber-700 rounded-2xl shadow-xl px-10 py-14 transition hover:scale-105 hover:bg-amber-50 duration-300 ease-in-out font-bold active:scale-95'
                    onClick={StudentList}
                >
                    Students
                </button>

                <button
                    className='bg-white text-amber-600 text-2xl border-2 border-amber-700 rounded-2xl shadow-xl px-10 py-14 transition hover:scale-105 hover:bg-amber-50 duration-300 ease-in-out font-bold active:scale-95'
                    onClick={ParentList}
                >
                    Parents
                </button>

                <button
                    className='bg-white text-amber-600 text-2xl border-2 border-amber-700 rounded-2xl shadow-xl px-10 py-14 transition hover:scale-105 hover:bg-amber-50 duration-300 ease-in-out font-bold active:scale-95'
                    onClick={StudentAttendence}
                >
                    Attendence
                </button>

                <button
                    className='bg-white text-amber-600 text-2xl border-2 border-amber-700 rounded-2xl shadow-xl px-10 py-14 transition hover:scale-105 hover:bg-amber-50 duration-300 ease-in-out font-bold active:scale-95'
                    onClick={ExamSection}
                >
                    Exams
                </button>
            </div>
        </div>
    )
}

export default TeacherHomepage;
