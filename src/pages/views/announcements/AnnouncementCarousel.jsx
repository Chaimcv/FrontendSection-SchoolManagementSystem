import React, { useState, useEffect } from 'react';

const AnnouncementCarousel = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements]);

  if (!announcements || announcements.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">No announcements available at this time.</p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-white group">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[400px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {announcements.map((item, index) => {
          const hasImage = !!item.ImageUrl;
          return (
            <div key={item._id} className="min-w-full h-full relative flex flex-col md:flex-row">
              {/* Image Section - Only shown if an image exists */}
              {hasImage && (
                <div className="w-full md:w-1/2 h-48 md:h-full bg-amber-100 overflow-hidden">
                  <img 
                    src={item.ImageUrl} 
                    alt={item.Title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )}

              {/* Content Section - Expands to full width if no image */}
              <div className={`w-full ${hasImage ? 'md:w-1/2' : 'md:w-full text-center'} p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50`}>
                <span className="text-amber-600 font-semibold tracking-widest text-sm mb-2 uppercase"></span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-amber-950 mb-4 leading-tight">
                  {item.Title}
                </h2>
                <div className={`w-12 h-1 bg-amber-500 mb-6 rounded-full ${!hasImage ? 'mx-auto' : ''}`}></div>
                <p className="text-gray-600 text-lg leading-relaxed line-clamp-4">
                  {item.Description}
                </p>
                
                {/* <div className="mt-8">
                  <button className="px-6 py-2 bg-amber-600 text-white rounded-full font-medium shadow-md hover:bg-amber-700 transition-colors">
                    Read More
                  </button>
                </div> */}
              </div>
            </div>
          );
        })}

      </div>

      {/* Navigation Arrows */}
      {announcements.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-amber-900 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg text-amber-900 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-amber-600' : 'w-2 bg-amber-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementCarousel;
