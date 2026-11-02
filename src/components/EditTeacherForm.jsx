import React, { useEffect, useState } from "react";
import { postEditedTeacherDetails } from "../Redux/Slices/TeacherSlice";
import { useDispatch, useSelector } from "react-redux";

const EditTeacherForm = ({ OnEditBtnClick, teacher }) => {
  const dispatch = useDispatch();
  const reduxTeacher = useSelector((store) => store.teacher.oneTeacherDetailsData);
  const teacherData = teacher || reduxTeacher;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    pin: "",
    city: "",
    phonenumber: "",
    subject: "",
    standard: "",
    division: "",
  });

  useEffect(() => {
    if (teacherData) {
      setFormData({
        name: teacherData.name || "",
        pin: teacherData.pin ?? "",
        city: teacherData.city || "",
        phonenumber: teacherData.phoneNumber ?? teacherData.phonenumber ?? "",
        subject: teacherData.subject || "",
        standard: teacherData.standard ?? "",
        division: teacherData.division || "",
      });
    }
  }, [teacherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherData?._id) return;

    setLoading(true);
    setErrorMessage("");

    const payload = {
      name: formData.name,
      subject: formData.subject,
      standard: formData.standard,
      division: formData.division,
      city: formData.city,
      pin: formData.pin,
      phoneNumber: formData.phonenumber,
      phonenumber: formData.phonenumber,
    };

    try {
      await dispatch(postEditedTeacherDetails({ id: teacherData._id, formData: payload }));
      if (OnEditBtnClick) {
        OnEditBtnClick();
      }
    } catch (err) {
      console.error("Failed to update teacher:", err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-100 p-6 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40">
          <div>
            <h2 className="text-xl font-extrabold text-amber-950 font-serif">
              Edit Faculty Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={OnEditBtnClick}
            className="rounded-xl p-2 text-stone-400 hover:bg-amber-100 hover:text-stone-700 transition-colors"
          >
            ✕
          </button>
        </div>



        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Class In-Charge (Standard)
              </label>
              <input
                type="number"
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                placeholder="e.g. 10"
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Division
              </label>
              <input
                type="text"
                name="division"
                value={formData.division}
                onChange={handleChange}
                placeholder="e.g. A"
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Pincode
              </label>
              <input
                type="number"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-100">
            <button
              type="button"
              onClick={OnEditBtnClick}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-xs font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeacherForm;
