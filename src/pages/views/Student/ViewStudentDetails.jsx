import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';
import EditStudentForm from './EditStudentForm';

const ViewStudentDetails = () => {
    const { id } = useParams();
    const [editform, setEditform] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getStudentDetails = useSelector((state) => state.student.oneStudentDetailsData);

    useEffect(() => {
        dispatch(fetchOneStudentDetails(id));
    }, [dispatch, id]);

    const handleEdit = () => {
        setEditform(true);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className='min-h-screen bg-amber-50 py-12 px-4'>
            {editform && (
                <EditStudentForm
                    studentId={id}
                    OnEditClick={() => setEditform(false)} 
                />
            )}
            
            <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden transition-all ${editform ? "blur-sm opacity-50 pointer-events-none" : ""}`}>
                {getStudentDetails ? (
                    <div>
                        {/* Profile Header */}
                        <div className='relative h-64 bg-amber-600'>
                            <div className='absolute -bottom-16 left-8 flex items-end gap-6'>
                                <div className='w-40 h-40 rounded-3xl overflow-hidden border-8 border-white shadow-2xl bg-white'>
                                    {getStudentDetails.ProfileImageUrl ? (
                                        <img src={getStudentDetails.ProfileImageUrl} alt={getStudentDetails.Name} className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center bg-amber-100 text-amber-500'>
                                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className='mb-4'>
                                    <h1 className='text-4xl font-black text-amber-950 drop-shadow-md'>{getStudentDetails.Name}</h1>
                                    <p className='text-amber-200 font-medium flex items-center gap-2'>
                                        <span className='bg-white/20 px-3 py-0.5 rounded-full text-sm capitalize'>{getStudentDetails.Gender}</span>
                                        <span>•</span>
                                        <span>Standard {getStudentDetails.Standard}th ({getStudentDetails.Division})</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div className='pt-24 pb-12 px-10'>
                            <div className='flex justify-between items-center mb-8 pb-4 border-b border-gray-100'>
                                <h3 className='text-xl font-bold text-amber-900 uppercase tracking-widest'>Student Information</h3>
                                <div className='flex gap-3'>
                                    <button 
                                        className='bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg transition-all active:scale-95'
                                        onClick={handleEdit}
                                    >
                                        Edit Profile
                                    </button>
                                    <button 
                                        className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-8 rounded-xl transition-all'
                                        onClick={handleBack}
                                    >
                                        Back
                                    </button>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12'>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Contact Email</p>
                                    <p className='text-lg font-medium text-gray-800'>{getStudentDetails.Email}</p>
                                </div>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Age</p>
                                    <p className='text-lg font-medium text-gray-800'>{getStudentDetails.Age} Years Old</p>
                                </div>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Guardian Details</p>
                                    <p className='text-lg font-medium text-gray-800'>{getStudentDetails.Guardian}</p>
                                    <p className='text-sm text-amber-600 font-semibold mt-1'>{getStudentDetails.Guardian_Phonenumber}</p>
                                </div>
                                <div>
                                    <p className='text-xs font-bold text-gray-400 uppercase mb-1'>Address</p>
                                    <p className='text-lg font-medium text-gray-800 leading-snug'>{getStudentDetails.Address}</p>
                                    <p className='text-sm text-gray-500 mt-1 font-mono'>PIN: {getStudentDetails.Pincode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='p-20 text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4'></div>
                        <p className='text-gray-500 text-lg'>Loading student profile...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewStudentDetails;
