import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOneTeacherDetails } from "../../../Redux/Slices/TeacherSlice";
import EditTeacherForm from "../../../components/EditTeacherForm";

const TeacherProfile = () => {
  const { myId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const getDetails = useSelector((state) => state.teacher.oneTeacherDetailsData);

  useEffect(() => {
    if (myId) {
      dispatch(fetchOneTeacherDetails(myId));
    }
  }, [dispatch, myId]);

  const BackToTeacherHomePage = () => {
    navigate(`/teacher/profile/${myId}`);
  };

  const handleEdit = () => {
    setEditFormVisibility(true);
    if (myId) {
      dispatch(fetchOneTeacherDetails(myId));
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      {/* Edit Profile Modal */}
      {editFormVisibility && (
        <EditTeacherForm
          teacher={getDetails}
          OnEditBtnClick={() => {
            setEditFormVisibility(false);
            if (myId) dispatch(fetchOneTeacherDetails(myId));
          }}
        />
      )}

      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 ${editFormVisibility ? "blur-xs pointer-events-none" : ""
          }`}
      >
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={BackToTeacherHomePage}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/70 border border-amber-200 px-4 py-2.5 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 self-start"
          >
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Card */}
        {getDetails ? (
          <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 sm:h-36 bg-linear-to-r from-amber-700 via-amber-600 to-amber-500 relative px-6 sm:px-8 flex items-end">
              <div className="absolute right-6 top-6 flex items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide">
                  Academic Staff
                </span>
              </div>
            </div>

            {/* Profile Identity Section */}
            <div className="px-6 sm:px-8 pb-8 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 gap-4 mb-6">
                <div className="flex items-end gap-4">

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                      {getDetails.name}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-0.5">
                      Subject Specialist: {getDetails.subject || "General Faculty"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {getDetails.standard && (
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-extrabold">
                      Class {getDetails.standard}
                      {getDetails.division ? `-${getDetails.division}` : ""}
                    </span>
                  )}


                </div>
              </div>

              {/* Information Grid */}
              <div className="space-y-4 pt-4 border-t border-amber-100">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">

                  TEACHER INFORMATION
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Full Name
                    </span>
                    <p className="text-sm font-bold text-stone-900">
                      {getDetails.name || "—"}
                    </p>
                  </div>

                  {/* Teaching Subject */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Teaching Subject
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.subject || "—"}
                    </p>
                  </div>

                  {/* Class In-Charge */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Class In-Charge
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.standard ? `Standard ${getDetails.standard}` : "No Class Assigned"}
                    </p>
                  </div>

                  {/* Assigned Division */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Assigned Division
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.division ? `Division ${getDetails.division}` : "—"}
                    </p>
                  </div>

                  {/* Contact Phone */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Contact Phone
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.phoneNumber || getDetails.phonenumber ? (
                        <a
                          href={`tel:${getDetails.phoneNumber || getDetails.phonenumber}`}
                          className="text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
                        >
                          {getDetails.phoneNumber || getDetails.phonenumber}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Email Address
                    </span>
                    <p className="text-sm font-semibold text-stone-900 truncate">
                      {getDetails.Email || getDetails.email}
                    </p>
                  </div>

                  {/* City / Location */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      City / Location
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.city || "—"}
                    </p>
                  </div>

                  {/* Pincode */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Pincode
                    </span>
                    <p className="text-sm font-semibold text-stone-900">
                      {getDetails.pin || "—"}
                    </p>
                  </div>

                  {/* Faculty ID */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Teacher ID
                    </span>
                    <code className="text-xs text-amber-900 font-mono bg-amber-100/70 px-2 py-0.5 rounded-lg inline-block">
                      {getDetails._id || myId}
                    </code>
                  </div>
                </div>
              </div>



            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-amber-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-amber-950">Loading faculty profile...</p>
            <p className="text-xs text-stone-500">Contacting database and resolving credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
