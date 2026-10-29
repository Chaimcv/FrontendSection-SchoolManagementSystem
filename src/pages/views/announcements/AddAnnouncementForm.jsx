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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-amber-100 p-6 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40">
          <div>
            <h2 className="text-xl font-extrabold text-amber-950 font-serif">Post New Announcement</h2>
            <p className="text-xs text-stone-600 mt-0.5">Broadcast school circulars, notices, or advisories.</p>
          </div>
          <button 
            onClick={OnAddAnnouncementClick}
            className="rounded-xl p-2 text-stone-400 hover:bg-amber-100 hover:text-stone-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Notice Title *</label>
            <input 
              type="text" 
              className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              placeholder="e.g. Annual Sports Meet Schedule Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Detailed Description *</label>
            <textarea 
              className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none h-32 resize-none"
              placeholder="Provide comprehensive details regarding dates, guidelines, or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Banner Image (Optional)</label>
            <div className="mt-1 flex items-center gap-4">
              <label className="cursor-pointer bg-amber-50 px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-200 hover:bg-amber-100 transition-all text-amber-800 text-xs font-bold">
                Choose Image File
                <input 
                  type="file" 
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
              {preview && (
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-200 shadow-xs">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-100">
            <button
              type="button"
              onClick={OnAddAnnouncementClick}
              className="px-5 py-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Broadcast Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncementForm;