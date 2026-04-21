import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAStudent, fetchStudentsData } from '../../../Redux/Slices/StudentSlice';
import { useNavigate, useParams } from 'react-router-dom';

const StudentListing = () => {
    const { loggedteacherId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const AllStudents = useSelector((state) => state.student.studentData) || [];

    useEffect(() => {
        dispatch(fetchStudentsData());
    }, [dispatch]);

    const viewStudentDetails = (studentIDToView) => {
        navigate(`/viewAStudent/${studentIDToView}`);
    };

    const deleteStudent = async (studentIdToDelete) => {
        // if (window.confirm("Are you sure you want to delete this student record?")) {
            await dispatch(deleteAStudent(studentIdToDelete));
            dispatch(fetchStudentsData());
        // }
    };

    const AddStudent = () => navigate(`/addNewStudent/${loggedteacherId}`);
    const AddParent = () => navigate(`/addingParent/${loggedteacherId}`);
    const BackToProfile = () => navigate(`/teacher/profile/${loggedteacherId}`);

    return (
        <div className='min-h-screen bg-gray-50 pb-20'>
            {/* Header / Actions */}
            <div className='bg-white shadow-sm border-b border-gray-200 py-8 px-6'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
                    <div>
                        <h1 className='text-3xl font-extrabold text-amber-900'>Student Records</h1>
                        {/* <p className='text-gray-500 mt-1'>Manage academic records and personal details of all students.</p> */}
                    </div>
                    <div className='flex gap-3'>
                        <button 
                            className='bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all flex items-center gap-2'
                            onClick={AddStudent}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Student
                        </button>
                        <button 
                            className='bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2'
                            onClick={AddParent}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Parent
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='max-w-7xl mx-auto px-6 mt-10'>
                <div className='bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-amber-50 border-b border-amber-100'>
                            <tr>
                                <th className='py-5 px-6 font-bold text-amber-900'>PHOTO</th>
                                <th className='py-5 px-6 font-bold text-amber-900'>NAME</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>AGE</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>CLASS</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>DIV</th>
                                <th className='py-5 px-6 font-bold text-amber-900'>GUARDIAN</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-right'>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50'>
                            {AllStudents.map((item) => (
                                <tr key={item._id} className='hover:bg-amber-50/30 transition-colors group'>
                                    <td className='py-4 px-6'>
                                        <div className='w-12 h-12 rounded-full overflow-hidden bg-amber-100 border-2 border-white shadow-sm'>
                                            {item.ProfileImageUrl ? (
                                                <img src={item.ProfileImageUrl} alt={item.Name} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-amber-400'>
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 font-semibold text-gray-800'>{item.Name}</td>
                                    <td className='py-4 px-6 text-gray-600 text-center'>{item.Age}</td>
                                    <td className='py-4 px-6 text-amber-700 font-medium text-center'>{item.Standard}th</td>
                                    <td className='py-4 px-6 text-gray-600 text-center font-bold'>{item.Division}</td>
                                    <td className='py-4 px-6 text-gray-600'>{item.Guardian}</td>
                                    <td className='py-4 px-6 text-right space-x-2'>
                                        <button 
                                            className='bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-lg font-medium transition-colors'
                                            onClick={() => viewStudentDetails(item._id)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className='bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors'
                                            onClick={() => deleteStudent(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {AllStudents.length === 0 && (
                        <div className='text-center py-20 bg-gray-50/50'>
                            <p className='text-gray-400 text-lg'>No student records found.</p>
                        </div>
                    )}
                </div>

                <div className='mt-8 flex justify-start'>
                    <button 
                        className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl transition-all'
                        onClick={BackToProfile}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentListing;
