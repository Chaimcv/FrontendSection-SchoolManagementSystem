import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchOneTeacherDetails } from "../../../Redux/Slices/TeacherSlice";
import { fetchStudentsData } from "../../../Redux/Slices/StudentSlice";
import { fetchParentsData } from "../../../Redux/Slices/ParentSlice";
import {
  sendMessage,
  fetchTeacherMessages,
  fetchTeacherInbox,
  deleteMessage
} from "../../../Redux/Slices/MessageSlice";

const TeacherMessages = () => {
  const { loggedteacherId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux data
  const teacher = useSelector((state) => state.teacher.oneTeacherDetailsData);
  const rawStudents = useSelector((state) => state.student.studentData);
  const rawParents = useSelector((state) => state.parent.parentData);
  const teacherMessages = useSelector((state) => state.message.teacherMessages) || [];
  const teacherInbox = useSelector((state) => state.message.teacherInbox) || [];
  const messageLoading = useSelector((state) => state.message.loading);

  const allStudents = useMemo(() => (Array.isArray(rawStudents) ? rawStudents : []), [rawStudents]);
  const allParents = useMemo(() => (Array.isArray(rawParents) ? rawParents : []), [rawParents]);

  // Tab State: "compose" | "inbox" | "sent"
  const [activeTab, setActiveTab] = useState("inbox");

  // Form state
  // recipientType: "Student" | "ClassStudents" | "Parent" | "ClassParents"
  const initialType = searchParams.get("type") || "Student";
  const initialStudentId = searchParams.get("studentId") || "";
  const initialParentId = searchParams.get("parentId") || "";

  const [recipientType, setRecipientType] = useState(initialType);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
  const [selectedParentId, setSelectedParentId] = useState(initialParentId);
  const [title, setTitle] = useState("");
  const [messageText, setMessageText] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  useEffect(() => {
    if (loggedteacherId) {
      dispatch(fetchOneTeacherDetails(loggedteacherId));
      dispatch(fetchTeacherMessages(loggedteacherId));
      dispatch(fetchTeacherInbox(loggedteacherId));
    }
    dispatch(fetchStudentsData());
    dispatch(fetchParentsData());
  }, [loggedteacherId, dispatch]);

  // Synchronize query parameters if user arrives with direct links
  useEffect(() => {
    if (searchParams.get("type")) {
      setRecipientType(searchParams.get("type"));
      setActiveTab("compose");
    }
    if (searchParams.get("studentId")) setSelectedStudentId(searchParams.get("studentId"));
    if (searchParams.get("parentId")) setSelectedParentId(searchParams.get("parentId"));
  }, [searchParams]);

  // Filter students belonging to this teacher's assigned class
  const classStudents = useMemo(() => {
    if (!teacher || teacher.standard === undefined || teacher.standard === null) return allStudents;
    return allStudents.filter((s) => {
      const matchStd = Number(s.Standard) === Number(teacher.standard);
      const matchDiv = teacher.division
        ? String(s.Division || "").trim().toUpperCase() === String(teacher.division).trim().toUpperCase()
        : true;
      return matchStd && matchDiv;
    });
  }, [allStudents, teacher]);

  // Filter parents belonging to students in this teacher's class
  const classParents = useMemo(() => {
    if (!classStudents || classStudents.length === 0) return allParents;
    const studentIds = new Set(classStudents.map((s) => String(s._id)));
    const studentNames = new Set(classStudents.map((s) => (s.Name || "").trim().toLowerCase()));

    return allParents.filter((p) => {
      if (p.student_id && studentIds.has(String(p.student_id))) return true;
      if (p.Student_name && studentNames.has(String(p.Student_name).trim().toLowerCase())) return true;
      return false;
    });
  }, [classStudents, allParents]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    if (!messageText.trim()) {
      setFeedback({ type: "error", text: "Please enter a message to send." });
      return;
    }

    if (recipientType === "Student" && !selectedStudentId) {
      setFeedback({ type: "error", text: "Please select a recipient student." });
      return;
    }

    if (recipientType === "Parent" && !selectedParentId) {
      setFeedback({ type: "error", text: "Please select a recipient parent." });
      return;
    }

    const payload = {
      senderId: loggedteacherId,
      recipientType,
      recipientStudentId: recipientType === "Student" ? selectedStudentId : null,
      recipientParentId: recipientType === "Parent" ? selectedParentId : null,
      standard: teacher?.standard,
      division: teacher?.division,
      title: title.trim() || undefined,
      message: messageText.trim()
    };

    const res = await dispatch(sendMessage(payload));
    if (res && res.success) {
      setFeedback({ type: "success", text: "Message dispatched successfully!" });
      setMessageText("");
      setTitle("");
      // Refresh teacher message history
      dispatch(fetchTeacherMessages(loggedteacherId));
    } else {
      setFeedback({ type: "error", text: res?.error || "Failed to dispatch message." });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this message record?")) {
      await dispatch(deleteMessage(id));
      dispatch(fetchTeacherMessages(loggedteacherId));
      dispatch(fetchTeacherInbox(loggedteacherId));
    }
  };

  // Reply handler for incoming messages from students or parents
  const handleReply = (msg) => {
    setActiveTab("compose");
    if (msg.senderRole === "Student" && msg.senderStudent) {
      setRecipientType("Student");
      setSelectedStudentId(msg.senderStudent._id || msg.senderStudent);
    } else if (msg.senderRole === "Parent" && msg.senderParent) {
      setRecipientType("Parent");
      setSelectedParentId(msg.senderParent._id || msg.senderParent);
    }
    setTitle(msg.title ? `Re: ${msg.title}` : "Reply from Class Teacher");
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const getRecipientTypeLabel = (type) => {
    switch (type) {
      case "Student":
        return "Particular Student";
      case "ClassStudents":
        return "All Students in Class";
      case "Parent":
        return "Particular Parent";
      case "ClassParents":
        return "All Parents of Class";
      case "Teacher":
        return "Direct to Faculty";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-amber-950 font-serif tracking-tight">
              Classroom Communications & Messaging Hub
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Two-way communications between Class Teacher, Students, and Parents.
            </p>
          </div>

          <button
            onClick={() => navigate(`/teacher/profile/${loggedteacherId}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-300 text-amber-900 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Teacher Class Info Banner */}
        {teacher && (
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-200">Class In-Charge</span>
              <h2 className="text-xl font-extrabold">{teacher.name || "Faculty Member"}</h2>
              <p className="text-xs text-amber-100 font-medium">
                {teacher.subject ? `Subject: ${teacher.subject} • ` : ""}
                Standard: <span className="font-bold underline">{teacher.standard || "N/A"}</span>
                {teacher.division ? ` • Division: ${teacher.division}` : ""}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-amber-200 uppercase font-black block">Class Students</span>
                <span className="text-lg font-black">{classStudents.length}</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                <span className="text-[10px] text-amber-200 uppercase font-black block">Class Parents</span>
                <span className="text-lg font-black">{classParents.length}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center border border-white/20">
                <span className="text-[10px] text-amber-100 uppercase font-black block">Incoming Queries</span>
                <span className="text-lg font-black">{teacherInbox.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-amber-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "inbox"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span>📥 Inbox: From Students & Parents</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-current">
              {teacherInbox.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "compose"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span>✍️ Compose New Communication</span>
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "sent"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-amber-200 hover:bg-amber-50"
            }`}
          >
            <span>📬 Sent Outbox</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-current">
              {teacherMessages.length}
            </span>
          </button>
        </div>

        {/* TAB 1: INBOX (Messages received from Students & Parents) */}
        {activeTab === "inbox" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-amber-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
                  <span className="p-2 bg-amber-100 rounded-xl text-amber-700">📥</span>
                  Student & Parent Inquiries
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Messages received from enrolled students in your class and their registered guardians.
                </p>
              </div>
              <span className="text-xs font-black px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                {teacherInbox.length} Total Messages
              </span>
            </div>

            {teacherInbox && teacherInbox.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teacherInbox.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-5 rounded-2xl border border-amber-100 bg-amber-50/20 hover:bg-white hover:border-amber-300 transition-all shadow-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                            msg.senderRole === "Student"
                              ? "bg-indigo-600 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {msg.senderRole === "Student" ? "🎓 Student" : "👨‍👩‍👧 Parent"}
                        </span>
                      </div>

                      <span className="text-[10px] text-stone-400 font-bold">
                        {new Date(msg.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm">{msg.senderName}</h4>
                      <p className="text-[11px] text-stone-500 font-medium">{msg.senderDetails}</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-amber-100">
                      <h5 className="font-bold text-xs text-stone-800 mb-1">{msg.title}</h5>
                      <p className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleReply(msg)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>↩️</span> Reply to {msg.senderRole}
                      </button>

                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-stone-400">
                <span className="text-4xl block mb-2">📭</span>
                <p className="text-sm font-bold text-stone-600">No incoming messages yet.</p>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  When a student or parent sends a query or update regarding Standard{" "}
                  {teacher?.standard || "your class"}, it will be delivered here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPOSE NEW COMMUNICATION */}
        {activeTab === "compose" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md max-w-3xl mx-auto">
            <h3 className="text-xl font-extrabold text-amber-950 mb-6 flex items-center gap-2">
              <span className="p-2 bg-amber-100 rounded-xl text-amber-700">✍️</span>
              Compose New Message / Broadcast
            </h3>

            {/* Notification Feedback */}
            {feedback.text && (
              <div
                className={`mb-6 p-4 rounded-2xl text-xs font-bold border flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Mode Selector */}
              <div>
                <label className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-3">
                  Select Recipient Audience
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRecipientType("Student")}
                    className={`py-3 px-3 text-xs font-extrabold rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      recipientType === "Student"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "bg-amber-50/50 text-amber-900 border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    <span>🎓</span>
                    <span>Particular Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType("ClassStudents")}
                    className={`py-3 px-3 text-xs font-extrabold rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      recipientType === "ClassStudents"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "bg-amber-50/50 text-amber-900 border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    <span>🏫</span>
                    <span>All Class Students</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType("Parent")}
                    className={`py-3 px-3 text-xs font-extrabold rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      recipientType === "Parent"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "bg-amber-50/50 text-amber-900 border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    <span>👨‍👩‍👧</span>
                    <span>Particular Parent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType("ClassParents")}
                    className={`py-3 px-3 text-xs font-extrabold rounded-2xl border transition-all text-left flex items-center gap-2 cursor-pointer ${
                      recipientType === "ClassParents"
                        ? "bg-amber-600 text-white border-amber-600 shadow-md"
                        : "bg-amber-50/50 text-amber-900 border-amber-200 hover:bg-amber-100/60"
                    }`}
                  >
                    <span>📢</span>
                    <span>All Class Parents</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Target Selection / Info */}
              {recipientType === "Student" && (
                <div>
                  <label className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                    Choose Student
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 text-stone-800 font-semibold text-sm focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="">-- Select a Student from Class --</option>
                    {classStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.Name} (Std {s.Standard}{s.Division ? `-${s.Division}` : ""})
                      </option>
                    ))}
                    {allStudents.length > classStudents.length && (
                      <optgroup label="Other Students in School">
                        {allStudents
                          .filter((s) => !classStudents.some((cs) => cs._id === s._id))
                          .map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.Name} (Std {s.Standard}{s.Division ? `-${s.Division}` : ""})
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              )}

              {recipientType === "Parent" && (
                <div>
                  <label className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                    Choose Parent / Guardian
                  </label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/30 text-stone-800 font-semibold text-sm focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="">-- Select a Parent / Guardian --</option>
                    {classParents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.Name} (Guardian of: {p.Student_name || "Enrolled Student"})
                      </option>
                    ))}
                    {allParents.length > classParents.length && (
                      <optgroup label="Other Parents in Directory">
                        {allParents
                          .filter((p) => !classParents.some((cp) => cp._id === p._id))
                          .map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.Name} (Guardian of: {p.Student_name || "Student"})
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              )}

              {recipientType === "ClassStudents" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <span className="font-extrabold text-amber-900 text-xs block">
                      Broadcast to Entire Class Roster
                    </span>
                    <p className="text-[11px] text-amber-700 font-medium">
                      This message will appear on the dashboards of all {classStudents.length} students enrolled in Standard{" "}
                      {teacher?.standard || "Assigned"}{teacher?.division ? ` - Division ${teacher.division}` : ""}.
                    </p>
                  </div>
                </div>
              )}

              {recipientType === "ClassParents" && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                  <span className="text-2xl">📢</span>
                  <div>
                    <span className="font-extrabold text-amber-900 text-xs block">
                      Broadcast to All Parents of Class Students
                    </span>
                    <p className="text-[11px] text-amber-700 font-medium">
                      This communication will be dispatched to guardians of all {classStudents.length} students enrolled in Standard{" "}
                      {teacher?.standard || "Assigned"}{teacher?.division ? ` - Division ${teacher.division}` : ""}.
                    </p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                  Subject / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Science Project Submission, Parent-Teacher Meeting"
                  className="w-full p-3.5 rounded-2xl border border-amber-200 bg-amber-50/20 text-stone-800 font-semibold text-sm focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                  Message Content *
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message, directions, or notice details here..."
                  rows="4"
                  className="w-full p-4 rounded-2xl border border-amber-200 bg-amber-50/20 text-stone-800 font-medium text-sm focus:border-amber-600 focus:outline-hidden resize-none"
                />
              </div>

              {/* Dispatch Button */}
              <button
                type="submit"
                disabled={messageLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-600/20 hover:scale-[1.01] active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {messageLoading ? (
                  <span>Dispatching Message...</span>
                ) : (
                  <>
                    <span>🚀 Send Communication</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SENT COMMUNICATIONS (OUTBOX) */}
        {activeTab === "sent" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-4">
              <h3 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
                <span className="p-2 bg-amber-100 rounded-xl text-amber-700">📬</span>
                Sent Communications Log ({teacherMessages.length})
              </h3>
            </div>

            {teacherMessages && teacherMessages.length > 0 ? (
              <div className="space-y-4">
                {teacherMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-5 rounded-2xl border border-amber-100 bg-amber-50/30 hover:bg-white hover:border-amber-300 transition-all shadow-xs space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-amber-600 text-white">
                          {getRecipientTypeLabel(msg.recipientType)}
                        </span>
                      </div>

                      <span className="text-[10px] text-stone-400 font-bold">
                        {new Date(msg.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-amber-900">
                      {msg.recipientType === "Student" && (
                        <span>Target Student: <span className="underline">{msg.recipientStudentName || msg.recipientStudent?.Name || "Student"}</span></span>
                      )}
                      {msg.recipientType === "Parent" && (
                        <span>Target Guardian: <span className="underline">{msg.recipientParentName || msg.recipientParent?.Name || "Parent"}</span></span>
                      )}
                      {msg.recipientType === "ClassStudents" && (
                        <span>Target: All Students in Standard {msg.standard}{msg.division ? `-${msg.division}` : ""}</span>
                      )}
                      {msg.recipientType === "ClassParents" && (
                        <span>Target: All Parents of Standard {msg.standard}{msg.division ? `-${msg.division}` : ""}</span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-stone-900 text-sm">
                      {msg.title || "Classroom Notice"}
                    </h4>

                    <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-100/50">
                      {msg.message}
                    </p>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                      >
                        Delete Record
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400">
                <span className="text-3xl block mb-2">📭</span>
                <p className="text-xs font-bold">No messages dispatched yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMessages;
