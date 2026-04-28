import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewPost } from '../Redux/Slices/PostSlice';

const AddPostForm = ({ onClose }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const dispatch = useDispatch();

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text && !image) return;

        const formData = new FormData();
        formData.append('Text', text); // Matching controller expectations for req.body.Text
        if (image) {
            formData.append('postImage', image);
        }

        dispatch(addNewPost(formData));
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={onClose}></div>
            
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] overflow-hidden transform transition-all animate-in zoom-in-95 slide-in-from-bottom-12 duration-500 relative z-10 border border-indigo-50">
                <div className="p-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-3xl font-[1000] text-gray-900 tracking-tighter leading-none mb-2">Create Post </h2>
                           
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-4 bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-500 rounded-3xl transition-all hover:rotate-90 duration-500 shadow-sm"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="relative group">
                            <label className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] z-20 transition-all group-focus-within:text-indigo-600">Expression</label>
                            <textarea
                                onChange={handleTextChange}
                                value={text}
                                placeholder="What's evolving in your world?"
                                rows="5"
                                className="w-full p-8 rounded-[2rem] border-2 border-indigo-50 focus:outline-none focus:ring-0 focus:border-indigo-400 transition-all resize-none text-gray-700 font-semibold placeholder-indigo-200 bg-gray-50/30"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Visual Aura</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                    id="post-file-upload"
                                />
                                <label
                                    htmlFor="post-file-upload"
                                    className="flex items-center justify-center w-full p-10 border-2 border-dashed border-indigo-100 rounded-[2.5rem] cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group/upload"
                                >
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="p-4 bg-indigo-50 rounded-full group-hover/upload:scale-110 transition-transform duration-500">
                                            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Enchant with visuals</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {preview && (
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 ring-4 ring-indigo-50">
                                <img src={preview} alt="Aura Preview" className="w-full h-56 object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImage(null); setPreview(null); }}
                                    className="absolute top-4 right-4 p-3 bg-white/90 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white backdrop-blur-md transition-all shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!text && !image}
                            className="w-full py-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-[1000] rounded-[2rem] shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase text-sm tracking-[0.3em]"
                        >
                            Post
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPostForm;