import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoticeData, deleteNotice } from "../../../Redux/Slices/AnnouncementSlice";
import AddAnnouncementForm from "./AddAnnouncementForm";
import { useNavigate } from "react-router-dom";

const AnnouncementDashboard = () => {
  const dispatch = useDispatch();
  const allAnnouncements = useSelector((state) => state.announcement.AnnouncementData) || [];
  const [formDisplay, setFormDisplay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchNoticeData());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      await dispatch(deleteNotice(id));
      dispatch(fetchNoticeData());
    }
  };


  return (
    <div className="relative min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      {formDisplay && (
        <AddAnnouncementForm OnAddAnnouncementClick={() => setFormDisplay(false)} />
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 ${formDisplay ? "blur-xs" : ""}`}>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                Announcement Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              Publish and broadcast official school bulletins, events, circulars, and notices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/70 border border-amber-200 px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setFormDisplay(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
            >
              <span className="text-base leading-none">+</span> Post New Notice
            </button>
          </div>
        </div>


        {/* Announcements Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {filteredAnnouncements.map((item) => ( */}
          {allAnnouncements.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-sm border border-amber-200 overflow-hidden group hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between relative"
            >
              {/* Top Banner / Image */}
              <div className="relative">
                {item.ImageUrl ? (
                  <div className="h-48 bg-amber-100 overflow-hidden">
                    <img
                      src={item.ImageUrl}
                      alt={item.Title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-24 bg-linear-to-r from-amber-100 via-amber-50 to-white flex items-center px-6">

                  </div>
                )}

                {/* Delete Button */}
                <button
                  className="absolute top-3 right-3 bg-white/90 hover:bg-rose-50 border border-rose-200 text-rose-600 p-2 rounded-xl shadow-md transition-all hover:scale-110 active:scale-95"
                  onClick={() => handleDelete(item._id)}
                  title="Delete Announcement"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 mb-2">
                    Official Notice
                  </span>
                  <h3 className="text-lg font-bold text-amber-950 font-serif mb-2 line-clamp-1">
                    {item.Title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-4 leading-relaxed mb-4">
                    {item.Description}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Active"}
                  </span>
                  <span className="text-amber-700 font-semibold">Central Public School</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDashboard;

