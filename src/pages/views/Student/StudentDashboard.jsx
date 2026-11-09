import React, { useEffect, useState } from 'react';
import { fetchOneStudentDetails } from '../../../Redux/Slices/StudentSlice';
import {
    fetchStudentMessages,
    fetchAssignedTeacherForStudent,
    sendMessageToTeacher
} from '../../../Redux/Slices/MessageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AddPostForm from '../../../components/AddPostForm';

const StudentDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [postForm, setPostForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [teacherModal, setTeacherModal] = useState(false);

    // Message form state
    const [msgTitle, setMsgTitle] = useState("");
    const [msgContent, setMsgContent] = useState("");
    const [msgSending, setMsgSending] = useState(false);
    const [msgFeedback, setMsgFeedback] = useState({ type: "", text: "" });

    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            dispatch(fetchOneStudentDetails(id));
            dispatch(fetchStudentMessages(id));
            dispatch(fetchAssignedTeacherForStudent(id));
        }
    }, [id, dispatch]);

    const getStudentInfo = useSelector((state) => state.student.oneStudentDetailsData);
    const studentMessages = useSelector((state) => state.message.studentMessages) || [];
    const assignedData = useSelector((state) => state.message.assignedTeacherData);

    const primaryTeacher = assignedData?.primaryTeacher;
    const allAssignedTeachers = assignedData?.teachers || [];
    const [chosenTeacherId, setChosenTeacherId] = useState("");

    useEffect(() => {
        if (primaryTeacher && !chosenTeacherId) {
            setChosenTeacherId(primaryTeacher._id);
        } else if (allAssignedTeachers.length > 0 && !chosenTeacherId) {
            setChosenTeacherId(allAssignedTeachers[0]._id);
        }
    }, [primaryTeacher, allAssignedTeachers, chosenTeacherId]);

    const togglePostForm = () => {
        setPostForm(!postForm);
    };

    const handleSendMessageToTeacher = async (e) => {
        e.preventDefault();
        setMsgFeedback({ type: "", text: "" });

        if (!msgContent.trim()) {
            setMsgFeedback({ type: "error", text: "Please enter your message." });
            return;
        }

        const targetTeacherId = chosenTeacherId || primaryTeacher?._id || (allAssignedTeachers[0]?._id);
        if (!targetTeacherId) {
            setMsgFeedback({ type: "error", text: "No assigned teacher found for your class." });
            return;
        }

        setMsgSending(true);
        const res = await dispatch(sendMessageToTeacher({
            senderRole: "Student",
            senderId: id,
            teacherId: targetTeacherId,
            title: msgTitle.trim() || undefined,
            message: msgContent.trim()
        }));

        setMsgSending(false);
        if (res && res.success) {
            setMsgFeedback({ type: "success", text: "Message sent to your teacher successfully!" });
            setMsgTitle("");
            setMsgContent("");
            setTimeout(() => {
                setTeacherModal(false);
                setMsgFeedback({ type: "", text: "" });
            }, 1500);
            dispatch(fetchStudentMessages(id));
        } else {
            setMsgFeedback({ type: "error", text: res?.error || "Failed to send message." });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">
                        Student Dashboard
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        {getStudentInfo ? (
                            <div className="p-8 flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{getStudentInfo?.Name}</h2>
                                <p className="text-amber-600 font-semibold text-sm mb-6">Student</p>

                                <div className="w-full space-y-3 text-left">
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-500 text-sm">Standard</span>
                                        <span className="font-bold text-gray-800">{getStudentInfo?.Standard}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-500 text-sm">Division</span>
                                        <span className="font-bold text-gray-800">{getStudentInfo?.Division}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={togglePostForm}
                                    className="mt-6 w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add New Post
                                </button>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400">Loading student data...</div>
                        )}
                    </div>
                </div>

                {/* Dashboard Main Panel */}
                <div className="md:col-span-2 space-y-6">
                    {/* Post Success Notification Banner */}
                    {successMsg && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3">
                                <span className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                <span className="text-xs font-bold">{successMsg}</span>
                            </div>
                            <Link
                                to="/"
                                className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-colors shrink-0"
                            >
                                View on Feed
                            </Link>
                        </div>
                    )}

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50 rounded-3xl p-7 border border-amber-200/80 shadow-xs relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-extrabold text-amber-950 mb-1.5">
                                Welcome Back,
                            </h2>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-200/60 rounded-full blur-2xl"></div>
                    </div>

                    {/* CORE ACTION CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div
                            onClick={() => navigate(`/studentExams/${id}`)}
                            className="group cursor-pointer rounded-3xl bg-white p-6 shadow-md hover:shadow-xl border border-amber-100 hover:border-amber-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-50 rounded-full blur-xl group-hover:bg-amber-100 transition-colors"></div>
                            <div className="relative z-10">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-amber-200">
                                    Academic Schedule
                                </span>
                                <h3 className="text-xl font-bold text-amber-900 group-hover:text-amber-600 transition-colors">
                                    Exams
                                </h3>
                            </div>
                        </div>

                        {/* Quick Community / Social Action */}
                        <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-md flex flex-col justify-between">
                            <div>
                                <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-amber-200">
                                    Campus Network
                                </span>
                                <h4 className="text-xl font-bold text-slate-900 mb-2">School Feed</h4>
                            </div>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-colors mt-2"
                            >
                                View Feed →
                            </Link>
                        </div>
                    </div>

                    {/* TEACHER COMMUNICATIONS & TWO-WAY MESSAGING */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-100 shadow-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-100 pb-4">
                            <div className="flex items-center gap-2.5">

                                <div>
                                    <h3 className="text-lg font-extrabold text-amber-950">Communications with Class Teacher</h3>
                                </div>
                            </div>

                            <button
                                onClick={() => setTeacherModal(true)}
                                className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                            >
                                Message Teacher
                            </button>
                        </div>

                        {studentMessages && studentMessages.length > 0 ? (
                            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                                {studentMessages.map((msg) => {
                                    const isFromMe = msg.senderRole === "Student";
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`p-4 rounded-2xl border transition-all space-y-2 ${isFromMe
                                                ? "bg-amber-50/40 border-amber-200/80"
                                                : "bg-white border-amber-100 hover:bg-amber-50/20"
                                                }`}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${isFromMe
                                                            ? "bg-stone-700 text-white"
                                                            : msg.recipientType === "Student"
                                                                ? "bg-amber-600 text-white"
                                                                : "bg-amber-100 text-amber-800 border border-amber-200"
                                                            }`}
                                                    >
                                                        {isFromMe
                                                            ? `Sent to Teacher: ${msg.recipientTeacherName || "Faculty"}`
                                                            : msg.recipientType === "Student"
                                                                ? "Direct To You"
                                                                : "Class Announcement"}
                                                    </span>

                                                    {!isFromMe && (
                                                        <span className="text-xs font-bold text-amber-950">
                                                            From: {msg.senderName || msg.sender?.name || "Class Teacher"}
                                                            {msg.senderSubject ? ` (${msg.senderSubject})` : ""}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="text-[10px] text-stone-400 font-bold">
                                                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </span>
                                            </div>

                                            <h4 className="font-extrabold text-stone-900 text-sm">
                                                {msg.title || (isFromMe ? "My Query" : "Class Notice")}
                                            </h4>

                                            <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100/50">
                                                {msg.message}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-stone-400">
                                <p className="text-xs font-bold">No communications yet.</p>
                                <p className="text-[11px] mt-1">Click "Message Teacher" above to ask a question or share an update with your class teacher.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Message Assigned Teacher */}
            {teacherModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl relative space-y-5">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                            <div>
                                <h3 className="text-lg font-extrabold text-amber-950">Message Your Assigned Teacher</h3>
                                <p className="text-xs text-stone-500">Submit a query, assignment question, or note to your faculty</p>
                            </div>
                            <button
                                onClick={() => setTeacherModal(false)}
                                className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center justify-center text-sm font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {msgFeedback.text && (
                            <div
                                className={`p-3.5 rounded-xl text-xs font-bold border ${msgFeedback.type === "success"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    : "bg-rose-50 border-rose-200 text-rose-800"
                                    }`}
                            >
                                {msgFeedback.text}
                            </div>
                        )}

                        <form onSubmit={handleSendMessageToTeacher} className="space-y-4">
                            {/* Teacher Target Info */}
                            <div>
                                <label className="text-xs font-bold text-amber-900 block mb-1.5">Recipient Teacher</label>
                                {allAssignedTeachers.length > 1 ? (
                                    <select
                                        value={chosenTeacherId}
                                        onChange={(e) => setChosenTeacherId(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-bold text-stone-800 focus:outline-hidden"
                                    >
                                        {allAssignedTeachers.map((t) => (
                                            <option key={t._id} value={t._id}>
                                                {t.name} ({t.subject || "Faculty"} • Std {t.standard}{t.division ? `-${t.division}` : ""})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between">
                                        <span>
                                            {primaryTeacher
                                                ? `${primaryTeacher.name} (${primaryTeacher.subject || "Class Teacher"} • Std ${primaryTeacher.standard})`
                                                : "Class Faculty In-Charge"}
                                        </span>
                                        <span className="text-[10px] text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                                            Assigned
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-bold text-amber-900 block mb-1.5">Subject / Topic</label>
                                <input
                                    type="text"
                                    value={msgTitle}
                                    onChange={(e) => setMsgTitle(e.target.value)}
                                    placeholder="e.g. Science Homework Query"
                                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-semibold text-stone-800 focus:outline-hidden"
                                />
                            </div>

                            {/* Message Body */}
                            <div>
                                <label className="text-xs font-bold text-amber-900 block mb-1.5">Your Message *</label>
                                <textarea
                                    value={msgContent}
                                    onChange={(e) => setMsgContent(e.target.value)}
                                    placeholder="Type your message or inquiry here..."
                                    rows="4"
                                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-medium text-stone-800 focus:outline-hidden resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={msgSending}
                                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {msgSending ? "Dispatching Message..." : " Send"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Post Form Modal */}
            {postForm && (
                <AddPostForm
                    onClose={togglePostForm}
                    onSuccess={() => setSuccessMsg("Post published successfully! It is now live on the School Feed.")}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
