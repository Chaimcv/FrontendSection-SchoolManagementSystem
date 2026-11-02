import React, { useEffect, useState, useMemo, useCallback } from "react";
import ViewParentProfile from "./ViewParentProfile";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchOneParentDetails } from "../../../Redux/Slices/ParentSlice";
import { fetchOneStudentDetails, fetchStudentsData } from "../../../Redux/Slices/StudentSlice";
import { fetchClassExams } from "../../../Redux/Slices/ExamSlice";

const API_URL = (process.env.REACT_APP_API_SCHOOL || "http://localhost:8000").trim().replace(/\/+$/, "");

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

const ParentDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const getOneParentInfo = useSelector((store) => store.parent.oneParentDetailsData);
  const getStudentInfo = useSelector((state) => state.student.oneStudentDetailsData);
  const rawAllStudents = useSelector((state) => state.student.studentData);
  const allStudents = useMemo(
    () => (Array.isArray(rawAllStudents) ? rawAllStudents : []),
    [rawAllStudents]
  );
  const { classExams, loading: examsLoading } = useSelector((state) => state.exam);

  // Tab State: "attendance" | "exams"
  const [activeTab, setActiveTab] = useState("attendance");

  // Attendance State
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // 1. Fetch parent details and all students on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchOneParentDetails(id));
    }
    dispatch(fetchStudentsData());
  }, [id, dispatch]);

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

  // 4. Fetch child student attendance records for selected month
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

  // Month navigation helpers
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

  // Generate calendar dates for the active month
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

  // Filtered calendar dates
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
              {/* <div className="relative">
                <img
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-100 shadow-md"
                  src={
                    resolvedStudent?.ProfileImageUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt={resolvedStudent?.Name || "Student photo"}
                />
                
              </div> */}

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Child Profile
                  </span>
                  {summary.total > 0 && (
                    <span
                      className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${summary.percentage >= 75
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : summary.percentage >= 60
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                        }`}
                    >
                      {summary.percentage}% Monthly Attendance
                    </span>
                  )}
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

        {/* Tab Switcher: Attendance Sheet vs Exam Timetable */}
        <div className="flex items-center gap-2 border-b border-amber-200 pb-2">
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${activeTab === "attendance"
              ? "bg-amber-600 text-white shadow-md scale-102"
              : "bg-white text-stone-600 hover:bg-amber-50 hover:text-amber-950 border border-amber-200"
              }`}
          >
            <span>📊</span>
            <span>Attendance Sheet</span>
            {summary.total > 0 && (
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === "attendance"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
                  }`}
              >
                {summary.present}/{summary.total}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("exams")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${activeTab === "exams"
              ? "bg-amber-600 text-white shadow-md scale-102"
              : "bg-white text-stone-600 hover:bg-amber-50 hover:text-amber-950 border border-amber-200"
              }`}
          >
            <span>📝</span>
            <span>Exam Timetable</span>
            {classExams && classExams.length > 0 && (
              <span
                className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === "exams"
                  ? "bg-white/20 text-white"
                  : "bg-amber-100 text-amber-800"
                  }`}
              >
                {classExams.length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CHILD'S ATTENDANCE SHEET                                           */}
        {/* ========================================================================= */}
        {activeTab === "attendance" && (
          <div className="space-y-6">
            {/* Attendance Container Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-6 md:p-8 space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-amber-950 font-serif">
                      Student Attendance Sheet
                    </h3>

                  </div>

                </div>


              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Working Days Marked
                  </span>
                  <span className="text-2xl font-black text-stone-900 mt-1 block">
                    {summary.total}
                  </span>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">Total recorded</span>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Present Days
                  </span>
                  <span className="text-2xl font-black text-emerald-700 mt-1 block">
                    {summary.present}
                  </span>
                  <span className="text-[11px] text-emerald-600 mt-0.5 block font-medium">✓ Attended</span>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block">
                    Absent Days
                  </span>
                  <span className="text-2xl font-black text-rose-700 mt-1 block">
                    {summary.absent}
                  </span>
                  <span className="text-[11px] text-rose-600 mt-0.5 block font-medium">✗ Missed</span>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    Late Days
                  </span>
                  <span className="text-2xl font-black text-amber-700 mt-1 block">
                    {summary.late}
                  </span>
                  <span className="text-[11px] text-amber-600 mt-0.5 block font-medium">⏱ Delayed arrival</span>
                </div>
              </div>

              {/* Progress & Rate Bar */}
              {summary.total > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-amber-950">
                    <span>Monthly Attendance Rate</span>
                    <span
                      className={
                        summary.percentage >= 75
                          ? "text-emerald-700"
                          : summary.percentage >= 60
                            ? "text-amber-700"
                            : "text-rose-700"
                      }
                    >
                      {summary.percentage}% Overall ({summary.present} / {summary.total} Days)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${summary.percentage >= 75
                        ? "bg-emerald-600"
                        : summary.percentage >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                        }`}
                      style={{ width: `${Math.min(100, Math.max(0, summary.percentage))}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Month Navigation & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                {/* Month Picker Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
                  >
                    ◀
                  </button>

                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 shadow-2xs focus:border-amber-500 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors shadow-2xs"
                  >
                    ▶
                  </button>

                  <span className="text-xs font-extrabold text-amber-950 ml-2">
                    {formatMonthName(selectedMonth)}
                  </span>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                  {[
                    { id: "all", label: "All" },
                    { id: "Present", label: "Present" },
                    { id: "Absent", label: "Absent" },
                    { id: "Late", label: "Late" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setStatusFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === filter.id
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-amber-50 hover:text-amber-900"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendance Register Table */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-amber-200">


                {attendanceLoading ? (
                  <div className="p-12 text-center text-stone-400">
                    <span className="text-2xl inline-block animate-spin mb-2">⏳</span>
                    <p className="font-semibold text-xs">Loading child's attendance records...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-4 w-12 text-center">#</th>
                          <th className="py-2.5 px-4">Date</th>
                          <th className="py-2.5 px-4">Day of Week</th>
                          <th className="py-2.5 px-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {filteredDates.map((item, idx) => {
                          const status = dailyMap[item.date];

                          return (
                            <tr
                              key={item.date}
                              className={`hover:bg-amber-50/40 transition-colors ${item.isWeekend ? "bg-stone-50/60" : ""
                                }`}
                            >
                              <td className="py-2.5 px-4 text-center text-stone-400 font-mono text-[11px]">
                                {idx + 1}
                              </td>
                              <td className="py-2.5 px-4 font-bold text-stone-900">
                                {item.date}
                              </td>
                              <td className="py-2.5 px-4 text-stone-600">
                                <span className={item.isWeekend ? "font-semibold text-stone-400" : ""}>
                                  {item.dayName}
                                  {item.isWeekend ? " (Weekend)" : ""}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                {status === "Present" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    ✓ Present
                                  </span>
                                ) : status === "Absent" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    ✗ Absent
                                  </span>
                                ) : status === "Late" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    ⏱ Late
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-400 border border-stone-200">
                                    — No Record / Off
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {filteredDates.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-12 text-center text-stone-400">
                              No attendance dates matching the selected filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHILD'S CLASS EXAMINATION TIMETABLE (STRICTLY READ-ONLY FOR PARENTS) */}
        {/* ========================================================================= */}
        {activeTab === "exams" && (
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
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
