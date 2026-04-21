import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotice, fetchNoticeData } from '../../../Redux/Slices/AnnouncementSlice';


const AddAnnouncementForm = ({ OnAddAnnouncementClick }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      await dispatch(addNotice(formData));
      alert("Announcement added successfully!");
      dispatch(fetchNoticeData()); // Refresh data
      OnAddAnnouncementClick(); // Close form
    } catch (error) {
      console.error(error);
      alert("Failed to add announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-amber-900'>New Announcement</h2>
          <button 
            onClick={OnAddAnnouncementClick}
            className='text-gray-400 hover:text-gray-600'
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-amber-800 mb-1'>Title</label>
            <input 
              type='text' 
              className='w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all'
              placeholder='Enter announcement title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-amber-800 mb-1'>Description</label>
            <textarea 
              className='w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all h-32 resize-none'
              placeholder='Enter detailed description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-amber-800 mb-1'>Image (Optional)</label>
            <div className='mt-1 flex items-center gap-4'>
              <label className='cursor-pointer bg-amber-50 px-4 py-2 rounded-lg border-2 border-dashed border-amber-200 hover:bg-amber-100 transition-all text-amber-700 text-sm'>
                Choose File
                <input 
                  type='file' 
                  className='hidden'
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
              {preview && (
                <div className='w-16 h-16 rounded-lg overflow-hidden border border-amber-200'>
                  <img src={preview} alt='preview' className='w-full h-full object-cover' />
                </div>
              )}
            </div>
          </div>

          <button 
            type='submit' 
            disabled={loading}
            className='w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:bg-amber-300 transform active:scale-95'
          >
            {loading ? 'Adding...' : 'Post Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncementForm;