import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPost, likePost, addComment, deletePost, updatePost } from '../Redux/Slices/PostSlice';
import AddPostForm from '../components/AddPostForm';

const PostCard = ({ post, currentStudentId, hasToken }) => {
    const dispatch = useDispatch();
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text);

    const isOwner = currentStudentId && post.student?._id === currentStudentId;
    const hasLiked = currentStudentId && post.likes?.includes(currentStudentId);

    const handleLike = () => {
        if (!hasToken) return;
        dispatch(likePost(post._id));
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!hasToken || !commentText.trim()) return;
        dispatch(addComment(post._id, commentText));
        setCommentText('');
    };

    const handleDelete = () => {
        if (window.confirm("Delete this story?")) {
            dispatch(deletePost(post._id));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Text', editText);
        dispatch(updatePost(post._id, formData));
        setIsEditing(false);
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 mb-8 group">
            <div className="p-6 flex justify-between items-center bg-gradient-to-br from-indigo-50/30 to-white/30">
                <div className="flex items-center gap-4">
                    <div className="relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                        <img
                            src={post.student?.ProfileImageUrl} //|| `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.student?._id}`}
                            alt=""
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md relative z-10"
                        />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-gray-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">{post.student?.Name}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                {isOwner && (
                    <div className="flex gap-2">
                        <button onClick={() => setIsEditing(!isEditing)} className="p-2.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-2xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={handleDelete} className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                )}
            </div>

            <div className="px-8 pb-4">
                {isEditing ? (
                    <form onSubmit={handleUpdate} className="py-4 space-y-4">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-5 rounded-2xl border-2 border-indigo-50 focus:border-indigo-400 focus:ring-8 focus:ring-indigo-50 outline-none transition-all resize-none font-medium text-gray-700 shadow-inner bg-gray-50/50"
                            rows="4"
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest">Update story</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 bg-white text-gray-500 font-bold rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-700 text-xl leading-relaxed mb-6 font-semibold tracking-tight whitespace-pre-wrap selection:bg-indigo-100">{post.text}</p>
                )}
            </div>

            {post.imageUrl && !isEditing && (
                <div className="px-8 pb-6">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-200/50 ring-1 ring-gray-100 group/image">
                        <img src={post.imageUrl} alt="Visual Story" className="w-full object-cover max-h-[600px] hover:scale-105 transition-transform duration-[1.5s] ease-out" />
                    </div>
                </div>
            )}

            <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/20">
                <div className="flex gap-6">
                    <button
                        onClick={handleLike}
                        className={`group/btn flex items-center gap-3 py-2 px-5 rounded-2xl transition-all ${hasLiked ? "bg-rose-50 text-rose-500 shadow-xl shadow-rose-100" : "hover:bg-indigo-50 text-gray-500 hover:text-indigo-600"}`}
                        disabled={!hasToken}
                    >
                        <svg className={`w-6 h-6 transition-transform duration-500 group-hover/btn:scale-125 ${hasLiked ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-black text-sm">{post.likes?.length || 0}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`group/btn flex items-center gap-3 py-2 px-5 rounded-2xl transition-all ${showComments ? "bg-indigo-50 text-indigo-600" : "hover:bg-indigo-50 text-gray-500 hover:text-indigo-600"}`}
                    >
                        <svg className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                        <span className="font-black text-sm">{post.comments?.length || 0}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="px-8 pb-8 space-y-6 animate-in slide-in-from-top-8 duration-500">
                    {hasToken ? (
                        <form onSubmit={handleCommentSubmit} className="flex gap-4 p-4 bg-indigo-50/30 rounded-3xl border border-indigo-100">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your perspective..."
                                className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold text-gray-700 placeholder-indigo-300"
                            />
                            <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:rotate-12 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                    ) : (
                        <div className="p-6 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <p className="text-sm font-bold text-gray-400">Join the discussion by signing in</p>
                        </div>
                    )}

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments?.map((comment) => (
                            <div key={comment._id} className="group/comment flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                <img
                                    src={comment.student?.ProfileImageUrl} //|| `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.student?._id}`}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                />
                                <div className="flex-1 bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 group-hover/comment:border-indigo-100 transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <h5 className="font-extrabold text-sm text-gray-800">{comment.student?.Name || "Scholar"}</h5>
                                        <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-semibold leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PostsSection = () => {
    const dispatch = useDispatch();
    const { PostData } = useSelector((state) => state.post);
    const currentStudent = useSelector((state) => state.student.loginAsStudent);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Robust identification: Check multiple storage locations
    const hasToken = localStorage.getItem("token");
    const currentStudentId = currentStudent?.id || 
                             currentStudent?.data?.id || 
                             localStorage.getItem("studentId") || 
                             localStorage.getItem("id");

    useEffect(() => {
        dispatch(fetchAllPost());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-rose-50/30 py-16 px-6">
            <div className="max-w-2xl mx-auto">
                <header className="flex flex-col items-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full"></div>
                    <h2 className="text-5xl md:text-6xl font-[1000] text-amber-950">POSTS   
                        {/*  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-600 bg-clip-text text-transparent italic">Verse</span> */}
                    </h2>
                    <div className="w-20 h-2 bg-amber-600 rounded-full mb-8"></div>

                    {/* {hasToken && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="group relative px-8 py-4 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-opacity group-hover:opacity-0"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative flex items-center gap-3">
                                <svg className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                <span className="text-white font-black uppercase text-sm tracking-widest">Share your story</span>
                            </div>
                        </button>
                    )} */}
                </header>

                {isFormOpen && <AddPostForm onClose={() => setIsFormOpen(false)} />}

                {PostData && PostData.length > 0 ? (
                    <div className="space-y-4">
                        {PostData.map((post) => (
                            <PostCard key={post._id} post={post} currentStudentId={currentStudentId} hasToken={hasToken} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[3rem] border border-white shadow-xl p-12">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            {/* <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-10 animate-pulse"></div>
                            <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> */}
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-3 tracking-tight"> waiting...</h3>
                        <p className="text-gray-400 font-semibold mb-10 max-w-sm mx-auto leading-relaxed">Student story</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostsSection;