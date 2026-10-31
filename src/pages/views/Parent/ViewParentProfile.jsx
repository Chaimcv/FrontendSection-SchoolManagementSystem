import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchOneParentDetails } from "../../../Redux/Slices/ParentSlice";

const ViewParentProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const getParticularParentData = useSelector(
    (store) => store.parent.oneParentDetailsData
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOneParentDetails(id));
    }
  }, [id, dispatch]);

  const isStandalonePage = location.pathname.startsWith("/viewParentProfile");

  // If rendered as sidebar inside ParentDashboard
  if (!isStandalonePage) {
    return (
      <div className="h-full bg-linear-to-b from-amber-600 to-amber-700 text-white p-6 md:p-8 flex flex-col justify-between shadow-xl">
        {getParticularParentData ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-extrabold shadow-md">
                {getParticularParentData.Name
                  ? getParticularParentData.Name.charAt(0).toUpperCase()
                  : "P"}
              </div>
              <div>
                <h3 className="text-xl font-black leading-tight">
                  {getParticularParentData.Name}
                </h3>
                <span className="text-xs text-amber-200 font-medium">
                  Verified Guardian
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-amber-500/50 text-xs sm:text-sm">
              <div>
                <span className="text-amber-200 text-[11px] uppercase tracking-wider block font-bold">
                  Linked Student
                </span>
                <span className="font-semibold block mt-0.5">
                  🎓 {getParticularParentData.Student_name || "—"}
                </span>
              </div>

              <div>
                <span className="text-amber-200 text-[11px] uppercase tracking-wider block font-bold">
                  Contact Phone
                </span>
                <span className="font-semibold block mt-0.5">
                  📞 {getParticularParentData.phonenumber || "—"}
                </span>
              </div>

              <div>
                <span className="text-amber-200 text-[11px] uppercase tracking-wider block font-bold">
                  Email
                </span>
                <span className="font-semibold block mt-0.5 break-all">
                  ✉️ {getParticularParentData.email || "—"}
                </span>
              </div>

              <div>
                <span className="text-amber-200 text-[11px] uppercase tracking-wider block font-bold">
                  Residential Address
                </span>
                <span className="font-medium block mt-0.5 leading-relaxed text-amber-50">
                  📍 {getParticularParentData.address || "—"}
                  {getParticularParentData.pincode && ` - ${getParticularParentData.pincode}`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-amber-200 text-sm">Loading guardian profile...</div>
        )}

        <div className="pt-6 border-t border-amber-500/50 text-[11px] text-amber-200">
          School Parent Portal
        </div>
      </div>
    );
  }

  // Standalone Full-Page View (e.g. /viewParentProfile/:id)
  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/parentslist")}
            className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Parents Directory
          </button>
        </div>

        {getParticularParentData ? (
          <div className="bg-white rounded-3xl shadow-md border border-amber-200 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 sm:px-8 py-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-18 h-18 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl font-extrabold shadow-lg">
                  {getParticularParentData.Name
                    ? getParticularParentData.Name.charAt(0).toUpperCase()
                    : "P"}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black">
                    {getParticularParentData.Name}
                  </h1>
                  <p className="text-amber-200 text-sm font-medium mt-0.5">
                    Parent / Guardian of{" "}
                    <strong className="text-white">
                      {getParticularParentData.Student_name || "Assigned Student"}
                    </strong>
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Active Guardian
              </span>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-extrabold text-amber-950 flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-amber-600 inline-block"></span>
                Guardian Information Record
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Full Name
                  </span>
                  <span className="text-stone-900 font-bold text-base mt-1 block">
                    {getParticularParentData.Name || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Email Address
                  </span>
                  <span className="text-stone-900 font-semibold mt-1 block break-all">
                    {getParticularParentData.email || "Not Provided"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Contact Phone
                  </span>
                  <span className="text-stone-900 font-semibold mt-1 block">
                    {getParticularParentData.phonenumber ? (
                      <a
                        href={`tel:${getParticularParentData.phonenumber}`}
                        className="text-amber-700 hover:underline"
                      >
                        📞 {getParticularParentData.phonenumber}
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Linked Student
                  </span>
                  <span className="text-stone-900 font-semibold mt-1 block">
                    🎓 {getParticularParentData.Student_name || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Student ID
                  </span>
                  <span className="text-stone-900 font-mono font-bold mt-1 block">
                    {getParticularParentData.student_id || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Postal Pincode
                  </span>
                  <span className="text-stone-900 font-semibold mt-1 block">
                    {getParticularParentData.pincode || "—"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Residential Address
                  </span>
                  <span className="text-stone-900 font-medium mt-1 block leading-relaxed">
                    📍 {getParticularParentData.address || "No residential address provided."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-amber-200 shadow-sm space-y-3">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-amber-950">Loading guardian profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewParentProfile;
