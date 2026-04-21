import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchNoticeData } from '../../../Redux/Slices/AnnouncementSlice';
import AnnouncementCarousel from './AnnouncementCarousel';


const Announcements = () => {
  const dispatch = useDispatch();
  const allAnnouncements = useSelector((state) => state.announcement.AnnouncementData) || [];

  useEffect(() => {
    dispatch(fetchNoticeData());
  }, [dispatch]);

  return (
    <div className='py-12 bg-gray-50/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-10'>
          <h2 className='text-4xl font-extrabold text-amber-900 mb-2'>Latest Announcements</h2>
          <div className='h-1.5 w-24 bg-amber-500 mx-auto rounded-full'></div>
        </div>
        
        <div className='relative'>
           <AnnouncementCarousel announcements={allAnnouncements} />
        </div>
      </div>
    </div>
  );
};

export default Announcements;