import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewStudentToDb } from '../../../Redux/Slices/StudentSlice';
import { useNavigate, useParams } from 'react-router-dom';

const AddNewStudent = () => {
    const {loggedteacherId}=useParams();
    const [formdata, setformData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "",
        standard: "",
        division: "",
        guardian: "",
        guardian_phonenumber: "",
        address: "",
        pincode: ""
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const AddStudent = async (e) => {
        e.preventDefault();
         setLoading(true);

        const data = new FormData();
        Object.keys(formdata).forEach(key => {
            data.append(key, formdata[key]);
        });
        if (image) {
            data.append('profileImage', image);
        }

        // try {
             dispatch(addNewStudentToDb(data));
            alert("Student added successfully!");
          navigate(`/allStudentslisted/${loggedteacherId}`);   
        // } catch (error) {
        //     console.error(error);
        //     alert("Failed to add student");
        // } finally {
        //     setLoading(false);
        // }
    };
    const Back=()=>{
        navigate(-1);
    }

    return (
        <div className='min-h-screen bg-amber-50 py-12 px-4'>
            <div className='max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden'>
                {/* <div className='bg-amber-600 py-6 px-8 text-white'>
                    <h2 className='text-3xl font-bold'>Add New Student</h2>
                  
                </div> */}

                <form onSubmit={AddStudent} className='p-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Profile Image Section */}
                        <div className='md:col-span-2 flex flex-col items-center mb-4'>
                            <div className='relative group'>
                                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-amber-100 shadow-lg bg-gray-50 flex items-center justify-center transition-all group-hover:border-amber-400'>
                                    {preview ? (
                                        <img src={preview} alt='preview' className='w-full h-full object-cover' />
                                    ) : (
                                        <svg className="w-16 h-16 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <label className='absolute bottom-0 right-0 bg-amber-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-amber-700 transition-colors'>
                                    {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg> */}
                                    <input type='file' className='hidden' onChange={handleImageChange} accept="image/*" />
                                </label>
                            </div>
                            <p className='text-sm text-gray-500 mt-2'>Upload Profile Picture</p>
                        </div>

                        {/* Standard Fields */}
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>NAME</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='text' name="name" value={formdata.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>EMAIL</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='email' name="email" value={formdata.email} onChange={handleChange} required />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-semibold text-amber-900 mb-1'>AGE</label>
                                    <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='number' name="age" value={formdata.age} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-amber-900 mb-1'>GENDER</label>
                                    <select className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white' name='gender' value={formdata.gender} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-semibold text-amber-900 mb-1'>STANDARD</label>
                                    <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='number' name='standard' value={formdata.standard} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className='block text-sm font-semibold text-amber-900 mb-1'>DIVISION</label>
                                    <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='text' name='division' value={formdata.division} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>GUARDIAN NAME</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='text' name='guardian' value={formdata.guardian} onChange={handleChange} />
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>GUARDIAN PHONENUMBER</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='number' name="guardian_phonenumber" value={formdata.guardian_phonenumber} onChange={handleChange} />
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>ADDRESS</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='text' name='address' value={formdata.address} onChange={handleChange} />
                            </div>
                            <div>
                                <label className='block text-sm font-semibold text-amber-900 mb-1'>PINCODE</label>
                                <input className='w-full px-4 py-2 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none' type='number' name='pincode' value={formdata.pincode} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className='mt-10'>
                        <button 
                            type="submit" 
                             disabled={loading}
                            className='w-full py-4 bg-amber-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-amber-700 transition-all transform active:scale-95 disabled:bg-amber-300'>
                            {loading ? 'Adding student...' : 'REGISTER STUDENT'}
                        </button>
                        <button
                        onClick={Back} 
                         className='w-full py-4 bg-amber-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-amber-700 transition-all transform active:scale-95 disabled:bg-amber-300'>CANCEL</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewStudent;
