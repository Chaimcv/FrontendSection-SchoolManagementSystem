import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOneParentDetails,
  postEditedParentDetails,
  fetchParentsData,
} from "../../../Redux/Slices/ParentSlice";
import { fetchStudentsData } from "../../../Redux/Slices/StudentSlice";

const EditParent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const parentDetails = useSelector(
    (state) => state.parent.oneParentDetailsData
  );
  const students = useSelector((state) => state.student.studentData) || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentname: "",
    studentId: "",
    phonenumber: "",
    address: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchOneParentDetails(id));
    }
    dispatch(fetchStudentsData());
  }, [id, dispatch]);

  useEffect(() => {
    if (parentDetails) {
      setFormData({
        name: parentDetails.Name || parentDetails.name || "",
        email: parentDetails.email || "",
        studentname: parentDetails.Student_name || parentDetails.studentname || "",
        studentId: parentDetails.student_id || parentDetails.studentId || "",
        phonenumber:
          parentDetails.phonenumber !== undefined && parentDetails.phonenumber !== null
            ? parentDetails.phonenumber
            : "",
        address: parentDetails.address || "",
        pincode: parentDetails.pincode || "",
      });
    }
  }, [parentDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Dropdown selection for linked student
    if (e.target.tagName === "SELECT") {
      const selectedStudent = students.find(
        (student) => String(student._id) === String(value)
      );
      if (selectedStudent) {
        setFormData((prev) => ({
          ...prev,
          studentId: selectedStudent._id,
          studentname: selectedStudent.Name,
        }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(postEditedParentDetails({ id, formData }));
      await dispatch(fetchParentsData());
      setSuccessMessage("Parent details updated successfully!");
      setTimeout(() => {
        navigate("/parentslist");
      }, 700);
    } catch (err) {
      console.error("Failed to update parent details:", err);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/70 via-stone-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-2xs hover:scale-105 active:scale-95"
          >
            Back to Parents List
          </button>
          <span className="text-xs font-semibold text-stone-500">
            ID: <span className="font-mono text-amber-900">{id}</span>
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 sm:px-8 py-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3.5">

              <div>
                <h1 className="text-xl sm:text-2xl text-amber-900 font-bold">EDIT GUARDIAN PROFILE</h1>

              </div>
            </div>
          </div>


          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Guardian Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Guardian Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. parent@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="number"
                  name="phonenumber"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Linked Student Dropdown
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Linked Student
                </label> */}
              {/* <select
                  name="studentSelect"
                  value={formData.studentId || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                >
                  <option value="">
                    {formData.studentname
                      ? ` ${formData.studentname}`
                      : "Select Student"}
                  </option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.Name} ({student.Standard || "Class"} - {student.Division || ""})
                    </option>
                  ))}
                </select> */}
              {/* </div> */}

              {/* Linked Student ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU-1002"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Student Name (Direct / Fallback) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  name="studentname"
                  value={formData.studentname}
                  // onChange={handleChange}
                  placeholder="Student Full Name"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Postal Pincode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 682001"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                />
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                  Residential Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full residential address, street, landmark, city"
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/30 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-amber-200 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Saving Updates..." : "Save Guardian Changes"}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default EditParent;

