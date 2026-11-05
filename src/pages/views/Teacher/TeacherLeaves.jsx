import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherLeaves, updateLeaveStatus } from "../../../Redux/Slices/LeaveSlice";
import { fetchOneTeacherDetails } from "../../../Redux/Slices/TeacherSlice";

const TeacherLeaves = () => {
  const { loggedteacherId } = useParams();
  const teacherId = loggedteacherId || localStorage.getItem("id");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teacher = useSelector((state) => state.teacher.oneTeacherDetailsData);
  const teacherLeaves = useSelector((state) => state.leave.teacherLeaves) || [];
  const loading = useSelector((state) => state.leave.loading);

  const [activeTab, setActiveTab] = useState("all"); // "all" | "Pending" | "Approved" | "Rejected"
  const [rejectModal, setRejectModal] = useState({ open: false, leaveId: null, studentName: "" });
  const [rejectionReason, setRejectionReason] = useState("");
  const [feedback, setFeedback] = useState({ type: "", text: "" });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (teacherId) {
      dispatch(fetchOneTeacherDetails(teacherId));
      dispatch(fetchTeacherLeaves(teacherId));
    }
  }, [teacherId, dispatch]);

  const stats = useMemo(() => {
    const total = teacherLeaves.length;
    const pending = teacherLeaves.filter((l) => l.status === "Pending").length;
    const approved = teacherLeaves.filter((l) => l.status === "Approved").length;
    const rejected = teacherLeaves.filter((l) => l.status === "Rejected").length;
    return { total, pending, approved, rejected };
  }, [teacherLeaves]);

  const filteredLeaves = useMemo(() => {
    if (activeTab === "all") return teacherLeaves;
    return teacherLeaves.filter((l) => l.status === activeTab);
  }, [teacherLeaves, activeTab]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleApprove = async (leaveId) => {
    setProcessingId(leaveId);
    setFeedback({ type: "", text: "" });
    const res = await dispatch(updateLeaveStatus({ leaveId, status: "Approved" }));
    setProcessingId(null);
    if (res && res.success) {
      setFeedback({ type: "success", text: "Leave application approved successfully!" });
      setTimeout(() => setFeedback({ type: "", text: "" }), 3000);
    } else {
      setFeedback({ type: "error", text: res?.error || "Failed to approve leave application." });
    }
  };

  const openRejectModal = (leave) => {
    setRejectModal({
      open: true,
      leaveId: leave._id,
      studentName: leave.studentName || leave.student?.Name || "Student"
    });
    setRejectionReason("");
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert("Please specify the reason for rejection.");
      return;
    }

    setProcessingId(rejectModal.leaveId);
    const res = await dispatch(
      updateLeaveStatus({
        leaveId: rejectModal.leaveId,
        status: "Rejected",
        rejectionReason: rejectionReason.trim()
      })
    );
    setProcessingId(null);

    if (res && res.success) {
      setRejectModal({ open: false, leaveId: null, studentName: "" });
      setRejectionReason("");
      setFeedback({ type: "success", text: "Leave application rejected with reason specified." });
      setTimeout(() => setFeedback({ type: "", text: "" }), 3000);
    } else {
      alert(res?.error || "Failed to reject leave application.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Bar Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-amber-600 text-white rounded-2xl text-2xl shadow-md">
              📋
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif tracking-tight">
                Student Leave Applications
              </h1>
              <p className="text-xs text-stone-600 font-medium">
                Review, accept, or reject student leave requests submitted by parents of your class.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(teacherId ? `/teacher/profile/${teacherId}` : "/")}
            className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Faculty & Class Context Card */}
        {teacher && (
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-5 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200">
                Class In-Charge
              </span>
              <h2 className="text-xl font-black">{teacher.name}</h2>
              <p className="text-xs text-amber-100/90 font-medium mt-0.5">
                Subject: {teacher.subject || "Faculty"} • Standard:{" "}
                <span className="font-bold underline">{teacher.standard}</span>
                {teacher.division ? ` • Division: ${teacher.division}` : ""}
              </p>
            </div>

            {/* Stat Counters */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-white/10">
                <span className="text-[10px] font-bold text-amber-200 uppercase block">Total</span>
                <span className="text-lg font-black">{stats.total}</span>
              </div>
              <div className="bg-amber-500/30 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-amber-300/30">
                <span className="text-[10px] font-bold text-amber-200 uppercase block">Pending</span>
                <span className="text-lg font-black text-amber-300">{stats.pending}</span>
              </div>
              <div className="bg-emerald-500/20 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-emerald-400/30">
                <span className="text-[10px] font-bold text-emerald-200 uppercase block">Approved</span>
                <span className="text-lg font-black text-emerald-300">{stats.approved}</span>
              </div>
              <div className="bg-rose-500/20 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center border border-rose-400/30">
                <span className="text-[10px] font-bold text-rose-200 uppercase block">Rejected</span>
                <span className="text-lg font-black text-rose-300">{stats.rejected}</span>
              </div>
            </div>
          </div>
        )}

        {/* Global Feedback Banner */}
        {feedback.text && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border transition-all animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Main Applications Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                All Requests ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab("Pending")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "Pending"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab("Approved")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "Approved"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setActiveTab("Rejected")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "Rejected"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>

            <span className="text-xs text-stone-400 font-bold">
              Showing {filteredLeaves.length} application{filteredLeaves.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Applications List */}
          {loading && teacherLeaves.length === 0 ? (
            <div className="text-center py-12 text-stone-500 font-medium">
              Loading leave applications...
            </div>
          ) : filteredLeaves.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredLeaves.map((leave) => {
                const days = calculateDays(leave.startDate, leave.endDate);
                const isPending = leave.status === "Pending";
                const isApproved = leave.status === "Approved";
                const isRejected = leave.status === "Rejected";

                return (
                  <div
                    key={leave._id}
                    className={`p-6 rounded-2xl border transition-all space-y-4 shadow-xs ${
                      isPending
                        ? "border-amber-200 bg-amber-50/20 hover:bg-amber-50/40"
                        : isApproved
                        ? "border-emerald-200 bg-emerald-50/15 hover:bg-emerald-50/30"
                        : "border-rose-200 bg-rose-50/15 hover:bg-rose-50/30"
                    }`}
                  >
                    {/* Header Row: Student info, Leave type, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-base font-black text-stone-900">
                          {leave.studentName || leave.student?.Name || "Student"}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                          Std {leave.standard}
                          {leave.division ? `-${leave.division}` : ""}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
                          {leave.leaveType}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                          isPending
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : isApproved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-rose-100 text-rose-800 border-rose-300"
                        }`}
                      >
                        {isPending && "⏳ Pending Action"}
                        {isApproved && "✅ Approved"}
                        {isRejected && "❌ Rejected"}
                      </span>
                    </div>

                    {/* Metadata Details Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-stone-200/60">
                      <div>
                        <span className="text-stone-400 font-semibold block">Applicant (Parent):</span>
                        <span className="font-bold text-stone-800">
                          {leave.parentName || leave.parent?.Name || "Guardian"}
                        </span>
                        {(leave.parentPhone || leave.parent?.phonenumber) && (
                          <span className="text-stone-500 block text-[11px]">
                            📞 {leave.parentPhone || leave.parent?.phonenumber}
                          </span>
                        )}
                        {(leave.parentEmail || leave.parent?.email) && (
                          <span className="text-stone-500 block text-[11px]">
                            ✉️ {leave.parentEmail || leave.parent?.email}
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block">Leave Duration:</span>
                        <span className="font-bold text-stone-900">
                          {leave.startDate} ➔ {leave.endDate}
                        </span>
                        <span className="text-amber-700 font-bold block text-[11px]">
                          {days} {days === 1 ? "Day" : "Days"} total
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 font-semibold block">Submitted On:</span>
                        <span className="font-semibold text-stone-600">
                          {new Date(leave.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Parent's Reason */}
                    <div>
                      <span className="text-xs font-black text-amber-900 block mb-1">
                        Reason for Leave:
                      </span>
                      <p className="text-xs text-stone-700 bg-white p-3.5 rounded-xl border border-amber-100 leading-relaxed">
                        {leave.reason}
                      </p>
                    </div>

                    {/* Rejection Note if Rejected */}
                    {isRejected && leave.rejectionReason && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                        <span className="font-black text-rose-800 flex items-center gap-1.5">
                          <span>⚠️</span> Rejection Reason Specified by You:
                        </span>
                        <p className="text-rose-900 font-medium">{leave.rejectionReason}</p>
                      </div>
                    )}

                    {/* Action Controls for Teacher */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                      {isPending ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleApprove(leave._id)}
                            disabled={processingId === leave._id}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
                          >
                            <span>✅</span> {processingId === leave._id ? "Processing..." : "Approve Application"}
                          </button>
                          <button
                            onClick={() => openRejectModal(leave)}
                            disabled={processingId === leave._id}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
                          >
                            <span>❌</span> Reject with Reason
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-400 font-medium">
                            Decision finalized on{" "}
                            {leave.reviewedAt
                              ? new Date(leave.reviewedAt).toLocaleDateString()
                              : "record"}
                          </span>
                          <button
                            onClick={() => (isApproved ? openRejectModal(leave) : handleApprove(leave._id))}
                            className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                          >
                            Change Decision
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-amber-50/30 rounded-3xl border border-dashed border-amber-200">
              <span className="text-4xl block mb-2">🏖️</span>
              <h3 className="text-base font-bold text-amber-950">No Leave Applications Found</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {activeTab === "all"
                  ? "There are currently no leave requests submitted for your class."
                  : `There are no ${activeTab.toLowerCase()} leave applications at this time.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-rose-950">
                  Reject Leave Application
                </h3>
                <p className="text-xs text-stone-500">
                  Student: <span className="font-bold text-stone-800">{rejectModal.studentName}</span>
                </p>
              </div>
              <button
                onClick={() => setRejectModal({ open: false, leaveId: null, studentName: "" })}
                className="w-8 h-8 rounded-full bg-rose-50 text-rose-800 hover:bg-rose-100 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-rose-950 block mb-1.5">
                  Specify Reason for Rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Crucial midterm review sessions and science lab tests scheduled on these dates."
                  rows="4"
                  required
                  className="w-full p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 text-xs font-medium text-stone-800 focus:outline-hidden focus:border-rose-400 resize-none"
                />
                <span className="text-[11px] text-stone-400 block mt-1">
                  This note will be transmitted to the student's guardian on their portal.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, leaveId: null, studentName: "" })}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === rejectModal.leaveId || !rejectionReason.trim()}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>❌</span> Confirm & Reject Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLeaves;

