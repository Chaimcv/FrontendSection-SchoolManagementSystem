import React from "react";
import { useNavigate } from "react-router-dom";
import Emblem from "../assets/emblem.png";

const AdminProfile = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem("name") || "Principal";
  const adminEmail = localStorage.getItem("adminEmail") || "principal@centralpublicschool.edu";

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white py-10 px-4 sm:px-6 lg:px-8 text-stone-800">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl overflow-hidden mb-8">
          {/* Top Decorative Amber Ribbon */}
          <div className="h-32 bg-linear-to-r from-amber-700 via-amber-600 to-amber-500 relative px-8 flex items-end">
          </div>

          {/* Profile Header with Avatar */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-2 border-4 border-white shadow-xl flex items-center justify-center ring-2 ring-amber-300">
                  <img src={Emblem} alt="Administrator Emblem" className="w-full h-full object-contain" />
                </div>
                <div className="mt-2 sm:mt-0">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                    {adminName}
                  </h1>
                  <p className="text-sm font-semibold text-amber-700">
                    Head Principal & Institutional Director
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">Central Public School • Administrative Office</p>
                </div>
              </div>


            </div>

            {/* Profile Grid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-100">
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Name
                </span>
                <p className="text-sm font-semibold text-stone-800">Principal</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  Academic Session
                </span>
                <p className="text-sm font-semibold text-stone-800">2026 - 2027 Academic Year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
