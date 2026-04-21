import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNoticeData, deleteNotice } from '../../../Redux/Slices/AnnouncementSlice';

import AddAnnouncementForm from './AddAnnouncementForm';

const AnnouncementDashboard = () => {
  const dispatch = useDispatch();
  const allAnnouncements = useSelector((state) => state.announcement.AnnouncementData) || [];
  const [formDisplay, setFormDisplay] = useState(false);

  useEffect(() => {
    dispatch(fetchNoticeData());
  }, [dispatch]);

  const handleDelete = async (id) => {
   // if (window.confirm("Are you sure you want to delete this announcement?")) {
      await dispatch(deleteNotice(id));
      dispatch(fetchNoticeData());
    //}
  };

  return (
    <div className='min-h-screen bg-amber-100 pb-20'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b border-amber-200 py-8 px-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-extrabold text-amber-900'>Announcement Management</h1>
            {/* <p className='text-gray-500 mt-1'>Manage your school's official notices and announcements.</p> */}
          </div>
          <button 
            className='bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2'
            onClick={() => setFormDisplay(true)}
          >
            {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg> */}
            Add New Notice
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className='max-w-7xl mx-auto px-4 mt-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {allAnnouncements.map((item) => (
            <div key={item._id} className='bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 group transition-all hover:shadow-xl relative'>
              {/* Delete Action Section - Always available at top right */}
              <div className='absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity'>
                <button 
                  className='bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl shadow-lg transition-all transform hover:scale-110 active:scale-90 flex items-center justify-center'
                  onClick={() => handleDelete(item._id)}
                  title="Delete Announcement"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Image Section - Only shown if exists */}
              {item.ImageUrl && (
                <div className='h-48 bg-amber-50 relative'>
                  <img src={item.ImageUrl} alt={item.Title} className='w-full h-full object-cover' />
                </div>
              )}


              <div className='p-6'>
                <h3 className='text-xl font-bold text-amber-950 mb-2 truncate'>{item.Title}</h3>
                <p className='text-gray-600 text-sm line-clamp-3 h-15'>{item.Description}</p>
                <div className='mt-4 pt-4 border-t border-gray-50 flex justify-between items-center'>
                  <span className='text-xs text-gray-400'>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {allAnnouncements.length === 0 && (
          <div className='text-center py-20'>
            <div className='bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className='text-xl font-medium text-gray-900'>No announcements yet</h3>
            <p className='text-gray-500 mt-2'>Click the button above to create your first notice.</p>
          </div>
        )}
      </div>

      {formDisplay && (
        <AddAnnouncementForm 
          OnAddAnnouncementClick={() => setFormDisplay(false)} 
        />
      )}
    </div>
  );
};

export default AnnouncementDashboard;
