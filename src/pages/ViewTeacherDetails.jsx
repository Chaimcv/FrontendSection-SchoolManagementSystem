import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOneTeacherDetails } from "../Redux/Slices/TeacherSlice";
import EditTeacherForm from "../components/EditTeacherForm";

const ViewTeacherDetails = () => {
  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const teacher = useSelector((store) => store.teacher.oneTeacherDetailsData);
  const { teacherid } = useParams();

  useEffect(() => {
    if (teacherid) {
      dispatch(fetchOneTeacherDetails(teacherid));
    }
  }, [dispatch, teacherid]);

  const handleEdit = () => {
    setEditFormVisibility(true);
    if (teacher?._id) {
      dispatch(fetchOneTeacherDetails(teacher._id));
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      {editFormVisibility && (
        <EditTeacherForm
          OnEditBtnClick={() => {
            setEditFormVisibility(false);
            if (teacherid) dispatch(fetchOneTeacherDetails(teacherid));
          }}
        />
      )}

      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 ${editFormVisibility ? "blur-xs" : ""}`}>
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/teacher/teacherDashboard")}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/70 border border-amber-200 px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            ← Back to Faculty Roster
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
            Faculty Profile
          </span>
        </div>

        {/* Teacher Profile Card */}
        {teacher ? (
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-28 bg-linear-to-r from-amber-700 via-amber-600 to-amber-500 relative px-6 flex items-end">
              <span className="absolute right-6 top-6 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                Academic Staff
              </span>
            </div>

            {/* Profile Header */}
            <div className="px-6 sm:px-8 pb-8 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 gap-4 mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 border-4 border-white shadow-xl flex items-center justify-center ring-2 ring-amber-300">
                    <div className="w-full h-full rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-3xl font-extrabold uppercase">
                      {(teacher.name || "T").charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-amber-950 font-serif">
                      {teacher.name}
                    </h1>
                    <p className="text-xs font-semibold text-amber-700">
                      Subject Specialist: {teacher.subject || "General Faculty"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleEdit}
                  className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Edit Profile ✏️
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-amber-100">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Class In-Charge
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.standard ? `Standard ${teacher.standard}` : "No Class Assigned"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Assigned Division
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.division ? `Division ${teacher.division}` : "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Teaching Subject
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.subject || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Contact Phone
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.phoneNumber || teacher.phonenumber || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    City / Location
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.city || "—"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                    Pincode
                  </span>
                  <p className="text-sm font-semibold text-stone-900">
                    {teacher.pin || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center shadow-sm">
            <p className="text-sm text-stone-500">Loading faculty member details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTeacherDetails;