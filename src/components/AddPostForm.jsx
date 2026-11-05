import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewPost } from '../Redux/Slices/PostSlice';

const AddPostForm = ({ onClose, onSuccess }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleTextChange = (e) => {
        setText(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            if (errorMessage) setErrorMessage('');
        }
    };

    const handleRemoveImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!token) {
            setErrorMessage("You must be logged in as a student to publish a post. Please log in first.");
            return;
        }

        if (!text.trim() && !image) {
            setErrorMessage("Please enter some text or select an image to post.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('Text', text.trim());
            if (image) {
                formData.append('postImage', image);
            }

            const result = await dispatch(addNewPost(formData));
            if (result && result.success) {
                if (onSuccess) {
                    onSuccess(result.data);
                }
                onClose();
            } else {
                setErrorMessage(result?.error || "Failed to create post. Please try again.");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            setErrorMessage(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all relative z-10 border border-amber-100 my-8">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-[1000] text-amber-950 tracking-tight">Create Post</h2>
                            <p className="text-xs font-bold text-amber-600 mt-1 uppercase tracking-widest">Share with your school community</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-amber-50 text-amber-600 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Authentication Warning */}
                    {!token && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                                <svg className="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Please sign in as a student to publish posts.</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors shrink-0"
                            >
                                Login
                            </button>
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Text Content */}
                        <div className="relative group">
                            <label className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black text-amber-600 uppercase tracking-widest z-20">Content</label>
                            <textarea
                                onChange={handleTextChange}
                                value={text}
                                placeholder="What's on your mind?..."
                                rows="3"
                                className="w-full p-5 rounded-2xl border-2 border-amber-100 focus:outline-none focus:border-amber-500 transition-all resize-none text-slate-800 font-medium placeholder-slate-400 bg-amber-50/20"
                            />
                        </div>

                        {/* Image Selection / Preview */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-amber-700 uppercase tracking-widest ml-1">Photo / Visual</label>

                            {!preview ? (
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
                                        className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-amber-200 rounded-2xl cursor-pointer hover:border-amber-500 hover:bg-amber-50/40 transition-all group/upload"
                                    >
                                        <div className="p-3 bg-amber-100/70 text-amber-700 rounded-2xl group-hover/upload:scale-110 transition-transform duration-300 mb-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-amber-800">Click to choose image</span>
                                        <span className="text-[10px] text-amber-600/70 mt-1">PNG, JPG, WEBP, or GIF</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-200 group/preview">
                                    <img src={preview} alt="Post Preview" className="w-full h-52 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-4">
                                        <span className="text-white text-xs font-semibold truncate max-w-[220px]">
                                            {image?.name || "Selected Image"}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="p-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors shadow-md flex items-center gap-1 text-xs font-bold"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || (!text.trim() && !image)}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-extrabold rounded-2xl shadow-xl shadow-amber-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase text-sm tracking-widest flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Uploading & Posting...</span>
                                </>
                            ) : (
                                <span>Publish Post</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPostForm;
