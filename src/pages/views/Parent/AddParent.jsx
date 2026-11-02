import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewParentToDb } from '../../../Redux/Slices/ParentSlice';
import { fetchStudentsData } from '../../../Redux/Slices/StudentSlice';
import { useNavigate, useParams } from 'react-router-dom';

const AddParent = () => {
  const { loggedteacherId } = useParams();

  const rawStudents = useSelector((state) => state.student.studentData);
  const students = Array.isArray(rawStudents) ? rawStudents : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentname: "",
    studentId: "",
    phonenumber: "",
    address: "",
    pincode: "",
    image: ""
  });

  useEffect(() => {
    dispatch(fetchStudentsData());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Dropdown selection
    if (e.target.tagName === "SELECT") {
      const selectedObj = students.find((student) => String(student._id) === String(value));

      setFormData((prev) => ({
        ...prev,
        studentId: selectedObj?._id || "",
        studentname: selectedObj?.Name || "",
      }));

      return;
    }

    // File input
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files && files.length > 0 ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const AddNewParent = (e) => {
    e.preventDefault();
    dispatch(addNewParentToDb(formData));
    if (loggedteacherId) {
      navigate(`/parentslist/${loggedteacherId}`);
    } else {
      navigate('/parentslist');
    }
  };

  const Back = () => {
    navigate(-1);
  };

  return (
    <div className='bg-white min-h-screen pb-16'>
      <form onSubmit={AddNewParent}>
        <div className='flex flex-col m-16 p-6 space-y-4 bg-amber-50 rounded-xl shadow-xl border border-amber-200 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold text-amber-900 mb-2'>Add New Guardian / Parent</h2>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            STUDENT NAME:
            <select
              value={formData.studentId || ""}
              onChange={handleChange}
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500'
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student?._id} value={student?._id}>
                  {student.Name} {student.Standard ? `(${student.Standard}th - ${student.Division || ""})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            NAME :
            <input
              type='text'
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            STUDENT ID :
            <input
              type='text'
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white font-mono'
              placeholder='Auto-filled on selecting student'
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            PROFILE PICTURE:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            EMAIL :
            <input
              type='email'
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            ADDRESS :
            <input
              type='text'
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            PINCODE :
            <input
              type='number'
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </label>

          <label className='flex flex-col text-sm font-semibold text-amber-950'>
            PHONENUMBER:
            <input
              type='number'
              className='border border-amber-500 rounded-md p-2 mt-1 bg-white'
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
            />
          </label>

          <div className='flex gap-3 pt-4'>
            <button
              type='submit'
              className='bg-amber-600 hover:bg-amber-700 transition-colors p-2.5 px-6 rounded-lg text-white shadow-lg font-bold'
            >
              Submit
            </button>
            <button
              type='button'
              className='bg-stone-200 hover:bg-stone-300 transition-colors text-stone-800 p-2.5 px-6 rounded-lg font-bold'
              onClick={Back}
            >
              Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddParent;
