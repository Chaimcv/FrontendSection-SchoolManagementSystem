import React, { useEffect, useMemo, useState } from "react";
import ViewParentProfile from "./ViewParentProfile";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
import { fetchOneParentDetails } from "../../../Redux/Slices/ParentSlice";
import { fetchOneStudentDetails, fetchStudentsData } from "../../../Redux/Slices/StudentSlice";
import { fetchClassExams } from "../../../Redux/Slices/ExamSlice";
import { fetchParentMessages, fetchAssignedTeacherForParent, sendMessageToTeacher } from "../../../Redux/Slices/MessageSlice";
import { applyLeave, fetchParentLeaves, deleteLeave } from "../../../Redux/Slices/LeaveSlice";

// const API_URL = (process.env.REACT_APP_API_SCHOOL || "http://localhost:8000").trim().replace(/\/+$/, "");

/*
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatMonthName = (monthStr) => {
  if (!monthStr || !monthStr.includes("-")) return monthStr;
  const [year, month] = monthStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};
*/

const ParentDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // Redux state
  const getOneParentInfo = useSelector((store) => store.parent.oneParentDetailsData);
  const getStudentInfo = useSelector((state) => state.student.oneStudentDetailsData);
  const rawAllStudents = useSelector((state) => state.student.studentData);
  const allStudents = useMemo(
    () => (Array.isArray(rawAllStudents) ? rawAllStudents : []),
    [rawAllStudents]
  );
  const { classExams, loading: examsLoading } = useSelector((state) => state.exam);
  const parentMessages = useSelector((state) => state.message.parentMessages) || [];
  const assignedData = useSelector((state) => state.message.assignedTeacherData);
  const parentLeaves = useSelector((state) => state.leave?.parentLeaves) || [];

  // Message Form State
  const [teacherModal, setTeacherModal] = useState(false);
  const [msgTitle, setMsgTitle] = useState("");
  const [msgContent, setMsgContent] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgFeedback, setMsgFeedback] = useState({ type: "", text: "" });

  // Leave Form State
  const [leaveModal, setLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Medical / Sick Leave");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSending, setLeaveSending] = useState(false);
  const [leaveFeedback, setLeaveFeedback] = useState({ type: "", text: "" });

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

  // Attendance State (Commented out per CTO instruction)
  /*
  const [activeTab, setActiveTab] = useState("attendance");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  */

  // 1. Fetch parent details and all students on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchOneParentDetails(id));
      dispatch(fetchParentMessages(id));
      dispatch(fetchAssignedTeacherForParent(id));
      dispatch(fetchParentLeaves(id));
    }
    dispatch(fetchStudentsData());
  }, [id, dispatch]);

  const handleSendMessageToTeacher = async (e) => {
    e.preventDefault();
    setMsgFeedback({ type: "", text: "" });

    if (!msgContent.trim()) {
      setMsgFeedback({ type: "error", text: "Please enter your message." });
      return;
    }

    const targetTeacherId = chosenTeacherId || primaryTeacher?._id || allAssignedTeachers[0]?._id;
    if (!targetTeacherId) {
      setMsgFeedback({ type: "error", text: "No assigned teacher found for your child's class." });
      return;
    }

    setMsgSending(true);
    const res = await dispatch(
      sendMessageToTeacher({
        senderRole: "Parent",
        senderId: id,
        teacherId: targetTeacherId,
        title: msgTitle.trim() || undefined,
        message: msgContent.trim()
      })
    );

    setMsgSending(false);
    if (res && res.success) {
      setMsgFeedback({ type: "success", text: "Message sent to teacher successfully!" });
      setMsgTitle("");
      setMsgContent("");
      setTimeout(() => {
        setTeacherModal(false);
        setMsgFeedback({ type: "", text: "" });
      }, 1500);
      dispatch(fetchParentMessages(id));
    } else {
      setMsgFeedback({ type: "error", text: res?.error || "Failed to send message." });
    }
  };

  const studentID = getOneParentInfo?.student_id;
  const studentName = getOneParentInfo?.Student_name;

  // Resolve matching student object if student_id is empty or was stored by name
  const matchedStudent = useMemo(() => {
    if (getStudentInfo) return getStudentInfo;
    if (Array.isArray(allStudents)) {
      if (studentID) {
        const byId = allStudents.find((s) => String(s._id) === String(studentID));
        if (byId) return byId;
      }
      if (studentName) {
        const byName = allStudents.find(
          (s) => s?.Name && s.Name.trim().toLowerCase() === studentName.trim().toLowerCase()
        );
        if (byName) return byName;
      }
    }
    return null;
  }, [getStudentInfo, allStudents, studentID, studentName]);

  const resolvedStudent = getStudentInfo || matchedStudent;
  const targetStudentId = resolvedStudent?._id || (studentID && studentID.length === 24 ? studentID : null);

  // 2. Fetch student (child) details
  useEffect(() => {
    if (targetStudentId) {
      dispatch(fetchOneStudentDetails(targetStudentId));
    }
  }, [targetStudentId, dispatch]);

  // 3. Fetch exam timetable for child's class (Standard & Division)
  useEffect(() => {
    const std = resolvedStudent?.Standard || resolvedStudent?.standard;
    const div = resolvedStudent?.Division || resolvedStudent?.division;
    if (std && div) {
      dispatch(
        fetchClassExams({
          standard: String(std),
          division: String(div),
        })
      );
    }
  }, [resolvedStudent, dispatch]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setLeaveFeedback({ type: "", text: "" });

    if (!targetStudentId) {
      setLeaveFeedback({ type: "error", text: "Child student record could not be resolved." });
      return;
    }

    const targetTeacherId = chosenTeacherId || primaryTeacher?._id || allAssignedTeachers[0]?._id;
    if (!targetTeacherId) {
      setLeaveFeedback({ type: "error", text: "No assigned teacher found for your child's class." });
      return;
    }

    if (!leaveStartDate || !leaveEndDate) {
      setLeaveFeedback({ type: "error", text: "Please select start and end dates." });
      return;
    }

    if (new Date(leaveStartDate) > new Date(leaveEndDate)) {
      setLeaveFeedback({ type: "error", text: "Start date cannot be after end date." });
      return;
    }

    if (!leaveReason.trim()) {
      setLeaveFeedback({ type: "error", text: "Please specify the reason for leave." });
      return;
    }

    setLeaveSending(true);
    const res = await dispatch(
      applyLeave({
        parentId: id,
        studentId: targetStudentId,
        teacherId: targetTeacherId,
        leaveType,
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason.trim()
      })
    );

    setLeaveSending(false);
    if (res && res.success) {
      setLeaveFeedback({ type: "success", text: "Leave application submitted to teacher successfully!" });
      setLeaveStartDate("");
      setLeaveEndDate("");
      setLeaveReason("");
      setTimeout(() => {
        setLeaveModal(false);
        setLeaveFeedback({ type: "", text: "" });
      }, 1500);
      dispatch(fetchParentLeaves(id));
    } else {
      setLeaveFeedback({ type: "error", text: res?.error || "Failed to submit leave application." });
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (window.confirm("Cancel this leave request?")) {
      await dispatch(deleteLeave(leaveId));
      dispatch(fetchParentLeaves(id));
    }
  };

  // 4. Fetch child student attendance records for selected month (Commented out per CTO instruction)
  /*
  const fetchAttendance = useCallback(async () => {
    if (!targetStudentId) return;
    setAttendanceLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/attendance/student/${targetStudentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { month: selectedMonth },
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch child attendance:", err);
    } finally {
      setAttendanceLoading(false);
    }
  }, [targetStudentId, selectedMonth]);

  useEffect(() => {
    if (targetStudentId) {
      fetchAttendance();
    }
  }, [targetStudentId, fetchAttendance]);

  const handlePrevMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const prevDate = new Date(Date.UTC(y, m - 2, 1));
    const newY = prevDate.getUTCFullYear();
    const newM = String(prevDate.getUTCMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newY}-${newM}`);
  };

  const handleNextMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number);
    const nextDate = new Date(Date.UTC(y, m, 1));
    const newY = nextDate.getUTCFullYear();
    const newM = String(nextDate.getUTCMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${newY}-${newM}`);
  };

  const monthDates = useMemo(() => {
    if (!selectedMonth || !selectedMonth.includes("-")) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${selectedMonth}-${dayStr}`;
      const dateObj = new Date(Date.UTC(year, month - 1, d));
      const dayName = dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "UTC",
      });
      const isWeekend = dayName === "Sat" || dayName === "Sun";
      dates.push({
        date: dateStr,
        day: d,
        dayName,
        isWeekend,
      });
    }
    return dates;
  }, [selectedMonth]);

  const dailyMap = useMemo(() => attendanceData?.dailyMap || {}, [attendanceData]);
  const summary = attendanceData?.summary || {
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0,
  };

  const filteredDates = useMemo(() => {
    return monthDates.filter((item) => {
      const status = dailyMap[item.date];
      if (statusFilter === "all") return true;
      if (statusFilter === "Present") return status === "Present";
      if (statusFilter === "Absent") return status === "Absent";
      if (statusFilter === "Late") return status === "Late";
      if (statusFilter === "unmarked") return !status;
      return true;
    });
  }, [monthDates, dailyMap, statusFilter]);
  */

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-800">
      {/* Left Sidebar: Parent Profile */}
      <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 shadow-lg z-10">
        <ViewParentProfile />
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        {/* Child Student Card */}
        {resolvedStudent ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-amber-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-100 shadow-md"
                  src={
                    resolvedStudent?.ProfileImageUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt={resolvedStudent?.Name || "Student photo"}
                />

              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Child Profile
                  </span>
                </div>

                <h2 className="text-2xl font-black text-amber-950 mt-1">
                  {resolvedStudent?.Name}
                </h2>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-bold text-stone-600">
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
                    Standard:{" "}
                    <strong className="text-stone-900">
                      {resolvedStudent?.Standard || resolvedStudent?.standard || "—"}
                    </strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
                    Division:{" "}
                    <strong className="text-stone-900">
                      {resolvedStudent?.Division || resolvedStudent?.division || "—"}
                    </strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 font-mono">
                    Student ID:{" "}
                    <strong className="text-stone-900">
                      {resolvedStudent?._id || studentID || "—"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 text-center text-stone-400 border border-amber-200">
            Loading child student records...
          </div>
        )}


        {/* ========================================================================= */}
        {/* CHILD'S CLASS EXAMINATION TIMETABLE (STRICTLY READ-ONLY FOR PARENTS)       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-amber-950 font-serif">
                  Class Exam Timetable
                </h3>
              </div>
            </div>
          </div>

          {examsLoading ? (
            <div className="p-12 text-center text-stone-400">
              <span className="text-2xl inline-block animate-spin mb-2">⏳</span>
              <p className="font-semibold text-xs">Loading exam schedule...</p>
            </div>
          ) : classExams && classExams.length > 0 ? (
            <div className="space-y-6">
              {classExams.map((exam) => (
                <div
                  key={exam._id}
                  className="rounded-2xl border border-amber-200 bg-amber-50/20 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-600 text-white text-[11px] font-black uppercase">
                        Class {exam.standard}-{exam.division}
                      </span>
                      <h4 className="text-base font-extrabold text-stone-900">
                        {exam.examTitle}
                      </h4>
                    </div>
                    <span className="text-xs text-stone-400">
                      Academic Year: {exam.academicYear || "2026-2027"}
                    </span>
                  </div>

                  {/* Read-Only Timetable Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-amber-100/70 text-amber-950 font-bold uppercase tracking-wider border-b border-amber-200">
                        <tr>
                          <th className="py-2.5 px-4 w-12 text-center"></th>
                          <th className="py-2.5 px-4">Subject</th>
                          <th className="py-2.5 px-4">Exam Date</th>
                          <th className="py-2.5 px-4">Time Slot</th>
                          <th className="py-2.5 px-4 text-center">Duration</th>
                          <th className="py-2.5 px-4 text-center">Max Marks</th>
                          <th className="py-2.5 px-4 text-center">Hall / Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 font-medium">
                        {(exam.subjects || []).map((sub, idx) => (
                          <tr key={sub._id || idx} className="hover:bg-amber-50/40">
                            <td className="py-2.5 px-4 text-center font-bold text-amber-700">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-stone-900">{sub.subject}</td>
                            <td className="py-2.5 px-4 text-stone-700 font-semibold">{sub.examDate}</td>
                            <td className="py-2.5 px-4 text-amber-900 font-bold">
                              {sub.startTime} - {sub.endTime}
                            </td>
                            <td className="py-2.5 px-4 text-center text-stone-600">
                              {sub.duration || "3 Hours"}
                            </td>
                            <td className="py-2.5 px-4 text-center font-bold text-stone-800">
                              {sub.maxMarks}
                            </td>
                            <td className="py-2.5 px-4 text-center text-stone-600">
                              {sub.roomNumber || "Main Hall"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[11px] text-stone-400 text-right">
                    Instructor: {exam.createdBy?.name || "Class Teacher"} • Published for Parent & Student Portal
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-amber-50/30 rounded-2xl border border-dashed border-amber-300">
              <h4 className="text-sm font-bold text-amber-950">
                No Exam Timetables Published Yet
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                The class teacher for Standard{" "}
                {resolvedStudent?.Standard || resolvedStudent?.standard || "your child's class"} has not
                scheduled any examinations yet. Check back soon!
              </p>
            </div>
          )}
        </div>

        {/* CHILD LEAVE APPLICATIONS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-amber-950">Child Leave Applications</h3>
                <p className="text-xs text-stone-500 font-medium">
                  Submit formal leave requests to your child's assigned class teacher
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLeaveModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              >
                Apply for Leave
              </button>
              <span className="text-xs font-black px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                {parentLeaves.length} Applications
              </span>
            </div>
          </div>

          {parentLeaves && parentLeaves.length > 0 ? (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {parentLeaves.map((leave) => {
                const days = calculateDays(leave.startDate, leave.endDate);
                const isPending = leave.status === "Pending";
                const isApproved = leave.status === "Approved";
                const isRejected = leave.status === "Rejected";

                return (
                  <div
                    key={leave._id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${isPending
                      ? "border-amber-200 bg-amber-50/25 hover:bg-amber-50/40"
                      : isApproved
                        ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/35"
                        : "border-rose-200 bg-rose-50/20 hover:bg-rose-50/35"
                      }`}
                  >
                    {/* Top Row: Type, Dates & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                          {leave.leaveType}
                        </span>
                        <span className="text-xs font-bold text-stone-700">
                          {leave.startDate} ➔ {leave.endDate} ({days} {days === 1 ? "Day" : "Days"})
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-xl border flex items-center gap-1.5 ${isPending
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : isApproved
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "bg-rose-100 text-rose-800 border-rose-300"
                          }`}
                      >
                        {isPending && "⏳ Pending Teacher Review"}
                        {isApproved && "✅ Approved by Faculty"}
                        {isRejected && "❌ Rejected by Faculty"}
                      </span>
                    </div>

                    {/* Faculty in charge & Submitted At */}
                    <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 font-medium">
                      <span>
                        Assigned Faculty:{" "}
                        <span className="font-bold text-amber-950">
                          {leave.teacherName || leave.teacher?.name || "Class Teacher"}
                        </span>
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Submitted:{" "}
                        {new Date(leave.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>

                    {/* Reason */}
                    <div className="bg-white p-3 rounded-xl border border-amber-100/70 text-xs text-stone-700 leading-relaxed">
                      <span className="font-bold text-stone-900 block mb-0.5">Application Reason:</span>
                      {leave.reason}
                    </div>

                    {/* If Rejected: Show Teacher's Rejection Reason */}
                    {isRejected && leave.rejectionReason && (
                      <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                        <span className="font-black text-rose-800 flex items-center gap-1.5">
                          Faculty Reason for Rejection:
                        </span>
                        <p className="text-rose-900 font-medium">{leave.rejectionReason}</p>
                      </div>
                    )}

                    {/* Cancel Option if Pending */}
                    {isPending && (
                      <div className="text-right pt-1">
                        <button
                          onClick={() => handleCancelLeave(leave._id)}
                          className="text-xs text-rose-700 hover:text-rose-900 font-bold hover:underline cursor-pointer"
                        >
                          Cancel Application
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200 text-stone-400">

              <p className="text-xs font-bold text-stone-600">No leave applications submitted yet.</p>

            </div>
          )}
        </div>

        {/* TEACHER COMMUNICATIONS & GUARDIAN NOTICES */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl font-extrabold text-amber-950">Communications from Class Faculty</h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTeacherModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
              >
                Message Class Teacher
              </button>
              <span className="text-xs font-black px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                {parentMessages.length} Messages
              </span>
            </div>
          </div>

          {parentMessages && parentMessages.length > 0 ? (
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {parentMessages.map((msg) => {
                const isFromMe = msg.senderRole === "Parent";
                return (
                  <div
                    key={msg._id}
                    className={`p-5 rounded-2xl border transition-all space-y-2.5 ${isFromMe
                      ? "border-sky-200 bg-sky-50/30 hover:bg-sky-50/50"
                      : "border-amber-100 bg-amber-50/20 hover:bg-amber-50/40"
                      }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">


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
                      {msg.title || (isFromMe ? "Parent Note" : "Faculty Communication")}
                    </h4>

                    <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed bg-white p-3.5 rounded-xl border border-amber-100/60">
                      {msg.message}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-amber-50/30 rounded-2xl border border-dashed border-amber-200 text-stone-400">

              <p className="text-xs font-bold text-stone-600">No communications yet.</p>
              <p className="text-[11px] mt-1">Click "Message Class Teacher" above to ask a question, report attendance, or message the teacher directly.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Message Assigned Teacher */}
      {teacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-amber-950">Message Your Child's Class Teacher</h3>
                <p className="text-xs text-stone-500">Submit an inquiry, progress question, or note to faculty</p>
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
                <label className="text-xs font-bold text-amber-900 block mb-1.5">Recipient Faculty</label>
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
                        ? `${primaryTeacher.name} (${primaryTeacher.subject || "Class Teacher"} • Std ${primaryTeacher.standard}${primaryTeacher.division ? `-${primaryTeacher.division}` : ""})`
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
                  placeholder="e.g. Leave Application / Meeting Request"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-semibold text-stone-800 focus:outline-hidden"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">Your Message *</label>
                <textarea
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  placeholder="Type your message, query, or note to the teacher here..."
                  rows="4"
                  className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-medium text-stone-800 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={msgSending}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {msgSending ? "Dispatching Message..." : " Send Message to Teacher"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal: Apply for Leave */}
      {leaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-amber-950">
                  Submit Child Leave Application
                </h3>
                <p className="text-xs text-stone-500">
                  For: <span className="font-bold text-stone-800">{resolvedStudent?.Name || "Your Child"}</span>
                  {resolvedStudent?.Standard && ` (Std ${resolvedStudent.Standard}${resolvedStudent.Division ? `-${resolvedStudent.Division}` : ""})`}
                </p>
              </div>
              <button
                onClick={() => setLeaveModal(false)}
                className="w-8 h-8 rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {leaveFeedback.text && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold border ${leaveFeedback.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}
              >
                {leaveFeedback.text}
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-4">
              {/* Recipient Teacher Info */}
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">
                  Recipient Class Faculty
                </label>
                {allAssignedTeachers.length > 1 ? (
                  <select
                    value={chosenTeacherId}
                    onChange={(e) => setChosenTeacherId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-bold text-stone-800 focus:outline-hidden"
                  >
                    {allAssignedTeachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.subject || "Faculty"} • Std {t.standard}
                        {t.division ? `-${t.division}` : ""})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between">
                    <span>
                      {primaryTeacher
                        ? `${primaryTeacher.name} (${primaryTeacher.subject || "Class Teacher"} • Std ${primaryTeacher.standard}${primaryTeacher.division ? `-${primaryTeacher.division}` : ""})`
                        : "Class Faculty In-Charge"}
                    </span>
                    <span className="text-[10px] text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                      Assigned
                    </span>
                  </div>
                )}
              </div>

              {/* Leave Type */}
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">
                  Leave Category *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-semibold text-stone-800 focus:outline-hidden"
                >
                  <option value="Medical / Sick Leave">Medical / Sick Leave</option>
                  <option value="Family Function">Family Function / Event</option>
                  <option value="Personal / Emergency">Personal / Family Emergency</option>
                  <option value="Vacation / Travel">Vacation / Travel</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveStartDate}
                    onChange={(e) => setLeaveStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-semibold text-stone-800 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-amber-900 block mb-1.5">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={leaveStartDate || undefined}
                    value={leaveEndDate}
                    onChange={(e) => setLeaveEndDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-semibold text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Reason Description */}
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">
                  Detailed Reason for Leave *
                </label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Explain the reason for absence, doctor consultation details, or planned family events..."
                  rows="3"
                  required
                  className="w-full p-3 rounded-xl border border-amber-200 bg-amber-50/10 text-xs font-medium text-stone-800 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={leaveSending}
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-xl shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {leaveSending ? "Transmitting Application..." : " Submit Application to Faculty"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
