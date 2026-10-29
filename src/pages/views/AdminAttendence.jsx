import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllSchoolClasses,
  fetchAttendanceReport,
  fetchClassTeacher,
  fetchAllAttendance,
  clearAttendanceError,
} from "../../Redux/Slices/AttendenceSlice";

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

const AdminAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    assignedClasses,
    monthlyReport,
    allRecords,
    currentClassTeacher,
    loading,
    error,
  } = useSelector((state) => state.attendance);

  // Main tab mode: "monthly" (Whole class by month & class) or "raw" (Single Date / Filter list)
  const [activeTab, setActiveTab] = useState("monthly");

  // Selection states for Monthly Class View
  const [selectedClassIndex, setSelectedClassIndex] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [monthlySearchQuery, setMonthlySearchQuery] = useState("");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);

  // Local state for resolved Class Teacher Name
  const [localTeacherName, setLocalTeacherName] = useState("");

  // States for Legacy / Single Date Filter tab (Backward compatibility)
  const [filterStandard, setFilterStandard] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Load all school classes on mount
  useEffect(() => {
    dispatch(fetchAllSchoolClasses());
  }, [dispatch]);

  // Auto-select the first class once classes are loaded
  useEffect(() => {
    if (assignedClasses && assignedClasses.length > 0 && selectedClassIndex === "") {
      setSelectedClassIndex("0");
    }
  }, [assignedClasses, selectedClassIndex]);

  // Resolve active selected class details
  const selectedClassDetails = useMemo(() => {
    if (
      selectedClassIndex !== "" &&
      assignedClasses &&
      assignedClasses[Number(selectedClassIndex)]
    ) {
      return assignedClasses[Number(selectedClassIndex)];
    }
    return null;
  }, [assignedClasses, selectedClassIndex]);

  // Generate all calendar dates for the active month (1 to 28/29/30/31)
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

  // Fetch class teacher when class changes
  useEffect(() => {
    if (selectedClassDetails) {
      // 1. Initial check from class item if already populated
      if (selectedClassDetails.classTeacherName) {
        setLocalTeacherName(selectedClassDetails.classTeacherName);
      }

      // 2. Fetch fresh teacher info via dedicated thunk
      dispatch(
        fetchClassTeacher({
          standard: selectedClassDetails.standard,
          division: selectedClassDetails.division,
        })
      )
        .unwrap()
        .then((res) => {
          if (res && res.classTeacherName) {
            setLocalTeacherName(res.classTeacherName);
          }
        })
        .catch(() => {
          // Fallback to assignedClasses or currentClassTeacher
        });
    } else {
      setLocalTeacherName("");
    }
  }, [dispatch, selectedClassDetails]);

  // Keep local teacher name in sync with Redux or student records
  useEffect(() => {
    if (currentClassTeacher) {
      setLocalTeacherName(currentClassTeacher);
    } else if (
      monthlyReport &&
      monthlyReport.length > 0 &&
      monthlyReport[0].classTeacherName
    ) {
      setLocalTeacherName(monthlyReport[0].classTeacherName);
    }
  }, [currentClassTeacher, monthlyReport]);

  // Load monthly report for the selected class and month
  const loadClassMonthlyAttendance = useCallback(() => {
    if (!selectedClassDetails || !selectedMonth) return;

    dispatch(clearAttendanceError());
    dispatch(
      fetchAttendanceReport({
        standard: selectedClassDetails.standard,
        division: selectedClassDetails.division,
        month: selectedMonth,
      })
    );
  }, [dispatch, selectedClassDetails, selectedMonth]);

  // Auto-fetch when selected class or month changes in Monthly Tab
  useEffect(() => {
    if (activeTab === "monthly" && selectedClassDetails && selectedMonth) {
      loadClassMonthlyAttendance();
    }
  }, [activeTab, selectedClassDetails, selectedMonth, loadClassMonthlyAttendance]);

  // Initial load for legacy single-date filter tab if switched
  useEffect(() => {
    if (activeTab === "raw") {
      dispatch(fetchAllAttendance({}));
    }
  }, [dispatch, activeTab]);

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

  // Filtered monthly student records
  const filteredMonthlyStudents = useMemo(() => {
    return (monthlyReport || []).filter((student) => {
      const name = (student.name || "").toLowerCase();
      return name.includes(monthlySearchQuery.toLowerCase().trim());
    });
  }, [monthlyReport, monthlySearchQuery]);

  // Legacy single-date filter handler
  const handleLegacyFilter = (e) => {
    e.preventDefault();
    dispatch(
      fetchAllAttendance({
        ...(filterStandard && { standard: filterStandard }),
        ...(filterDivision && { division: filterDivision }),
        ...(filterDate && { date: filterDate }),
      })
    );
  };

  const handleLegacyReset = () => {
    setFilterStandard("");
    setFilterDivision("");
    setFilterDate("");
    dispatch(fetchAllAttendance({}));
  };

  // Legacy sorted records
  const filteredLegacyRecords = useMemo(() => {
    const records = [...(allRecords || [])];
    return records.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || a.studentName || "").localeCompare(
          b.name || b.studentName || ""
        );
      }
      if (sortBy === "date") {
        return (b.date || "").localeCompare(a.date || "");
      }
      if (sortBy === "standard") {
        return (a.standard || "").localeCompare(b.standard || "");
      }
      return 0;
    });
  }, [allRecords, sortBy]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Absent":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Late":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white p-4 md:p-8 text-stone-800">
      <div className="mx-auto max-w-7xl">
        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-amber-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-amber-950 font-serif md:text-3xl">
                Attendance Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              Inspect whole-class monthly attendance registers, review assigned class teachers, and audit student roll calls.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/70 border border-amber-200 px-4 py-2 rounded-xl shadow-xs transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="inline-flex rounded-xl bg-amber-100/70 p-1 border border-amber-200">
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "monthly"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-900 hover:text-amber-950 hover:bg-amber-100/50"
              }`}
            >
              Whole Class Monthly Register
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "raw"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-amber-900 hover:text-amber-950 hover:bg-amber-100/50"
              }`}
            >
              Single Date & Raw Records Filter
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => dispatch(clearAttendanceError())}
              className="font-bold hover:text-rose-950 ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: WHOLE CLASS ATTENDANCE LIST BY MONTH & CLASS                       */}
        {/* ========================================================================= */}
        {activeTab === "monthly" && (
          <div className="space-y-6">
            {/* Control Panel: Class Selector, Month Picker, & Class Teacher Display */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-200 lg:grid-cols-12">
              {/* Class Selector Dropdown */}
              <div className="lg:col-span-4">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-800">
                  Select Class
                </label>
                <select
                  value={selectedClassIndex}
                  onChange={(e) => setSelectedClassIndex(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium text-stone-800 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                >
                  <option value="">Select a class</option>
                  {(assignedClasses || []).map((item, index) => (
                    <option
                      key={`${item.standard}-${item.division}-${index}`}
                      value={index}
                    >
                      Standard {item.standard} - Division {item.division}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Picker with Prev/Next Controls */}
              <div className="lg:col-span-4">
                <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-800">
                  <span>Select Month</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                  >
                    ◀
                  </button>

                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium text-stone-800 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  />

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                  >
                    ▶
                  </button>
                </div>
              </div>

              {/* Refresh Button */}
              <div className="lg:col-span-4 flex items-end">
                <button
                  type="button"
                  onClick={loadClassMonthlyAttendance}
                  disabled={loading || !selectedClassDetails || !selectedMonth}
                  className="w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <span>↻</span> Fetch Class Sheet
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CLASS TEACHER & CLASS INFO BANNER */}
            {selectedClassDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-linear-to-r from-amber-100/70 via-amber-50/50 to-white p-5 border border-amber-200 shadow-xs">
                {/* 1. Class Teacher Card */}
                <div className="flex items-center gap-3.5 sm:border-r border-amber-200/80 pr-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Class Teacher
                    </div>
                    <div className="text-base font-extrabold text-amber-950 mt-0.5">
                      {localTeacherName || selectedClassDetails.classTeacherName || "Not Assigned"}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {localTeacherName && localTeacherName !== "Not Assigned"
                        ? "Assigned class in-charge"
                        : "No teacher assigned for this class"}
                    </div>
                  </div>
                </div>

                {/* 2. Selected Class Info */}
                <div className="flex items-center gap-3.5 sm:border-r border-amber-200/80 pr-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Class
                    </div>
                    <div className="text-base font-extrabold text-amber-950 mt-0.5">
                      Standard {selectedClassDetails.standard} - Division {selectedClassDetails.division}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {filteredMonthlyStudents.length} Students registered
                    </div>
                  </div>
                </div>

                {/* 3. Month & Working Days */}
                <div className="flex items-center gap-3.5">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      Month
                    </div>
                    <div className="text-base font-extrabold text-amber-950 mt-0.5 capitalize">
                      {formatMonthName(selectedMonth)}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {monthDates.length} Calendar days in month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Search & Legend Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <span className="font-bold text-amber-950">Whole Class Attendance Register</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search student by name..."
                    value={monthlySearchQuery}
                    onChange={(e) => setMonthlySearchQuery(e.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  />
                  {monthlySearchQuery && (
                    <button
                      onClick={() => setMonthlySearchQuery("")}
                      className="absolute right-3 top-2 text-xs text-stone-400 hover:text-stone-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Badges Legend */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-100 pt-3 text-xs">
                <div className="text-xs text-stone-500">
                  Showing daily roll call across all {monthDates.length} days of the month.
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <span className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-[10px]">P</span>
                    Present
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800">
                    <span className="w-5 h-5 rounded bg-rose-100 flex items-center justify-center text-[10px]">A</span>
                    Absent
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800">
                    <span className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-[10px]">L</span>
                    Late
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400">
                    <span className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center text-[10px]">—</span>
                    No Record
                  </span>
                </div>
              </div>
            </div>

            {/* Whole Class Monthly Attendance Register Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-amber-100/70 text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200">
                    <tr>
                      {/* Sticky Index */}
                      <th className="py-3 px-3 w-12 text-center sticky left-0 bg-amber-100 z-30 border-r border-amber-200">
                        #
                      </th>

                      {/* Sticky Student Name */}
                      <th className="py-3 px-4 min-w-[200px] sticky left-12 bg-amber-100 z-30 border-r border-amber-200 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                        Student Name
                      </th>

                      {/* All Calendar Dates (01..31) */}
                      {monthDates.map((item) => (
                        <th
                          key={item.date}
                          className={`py-2 px-1 text-center min-w-[38px] max-w-[42px] border-r border-amber-200/80 ${
                            item.isWeekend
                              ? "bg-amber-200/50 text-amber-800/80"
                              : "bg-amber-100/70 text-amber-900"
                          }`}
                          title={`${item.date} (${item.dayName})`}
                        >
                          <div className="text-[11px] font-extrabold leading-tight">
                            {String(item.day).padStart(2, "0")}
                          </div>
                          <div className="text-[9px] font-medium leading-tight text-amber-800/70">
                            {item.dayName}
                          </div>
                        </th>
                      ))}

                      {/* Summary Columns */}
                      <th
                        className="py-3 px-2 text-center bg-emerald-50 text-emerald-800 border-r border-emerald-200 min-w-[48px]"
                        title="Total Present Days"
                      >
                        P
                      </th>
                      <th
                        className="py-3 px-2 text-center bg-rose-50 text-rose-800 border-r border-rose-200 min-w-[48px]"
                        title="Total Absent Days"
                      >
                        A
                      </th>
                      <th
                        className="py-3 px-2 text-center bg-amber-50 text-amber-800 border-r border-amber-200 min-w-[48px]"
                        title="Total Late Days"
                      >
                        L
                      </th>
                      <th
                        className="py-3 px-2 text-center bg-amber-100/70 text-amber-900 min-w-[56px] border-r border-amber-200"
                        title="Total Days Marked"
                      >
                        Total
                      </th>
                      <th className="py-3 px-3 text-center bg-amber-100/70 text-amber-900 min-w-[90px]">
                        Breakdown
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-amber-100">
                    {filteredMonthlyStudents.map((student, index) => (
                      <tr
                        key={student.studentId || index}
                        className="hover:bg-amber-50/40 transition-colors"
                      >
                        {/* Sticky Row Index */}
                        <td className="py-2.5 px-3 text-center text-xs font-medium text-stone-400 sticky left-0 bg-white z-20 border-r border-amber-100">
                          {index + 1}
                        </td>

                        {/* Sticky Student Name */}
                        <td className="py-2.5 px-4 font-semibold text-stone-800 sticky left-12 bg-white z-20 border-r border-amber-200 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                              {(student.name || "S").charAt(0)}
                            </div>
                            <div className="truncate max-w-[150px]" title={student.name}>
                              <div className="text-xs font-semibold text-stone-900 truncate">
                                {student.name || "Unnamed Student"}
                              </div>
                              <div className="text-[10px] text-stone-400">
                                ID: {student.studentId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Date Status Cells */}
                        {monthDates.map((item) => {
                          const status = student.dailyAttendance
                            ? student.dailyAttendance[item.date]
                            : "";

                          return (
                            <td
                              key={item.date}
                              className={`py-2 px-0.5 text-center border-r border-amber-100 ${
                                item.isWeekend ? "bg-amber-50/30" : ""
                              }`}
                            >
                              {status === "Present" ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[11px] shadow-xs cursor-default"
                                  title={`${student.name}: Present on ${item.date}`}
                                >
                                  P
                                </span>
                              ) : status === "Absent" ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-rose-100 text-rose-800 font-extrabold text-[11px] shadow-xs cursor-default"
                                  title={`${student.name}: Absent on ${item.date}`}
                                >
                                  A
                                </span>
                              ) : status === "Late" ? (
                                <span
                                  className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[11px] shadow-xs cursor-default"
                                  title={`${student.name}: Late on ${item.date}`}
                                >
                                  L
                                </span>
                              ) : (
                                <span
                                  className="text-stone-300 font-bold text-xs select-none"
                                  title={`No record on ${item.date}`}
                                >
                                  ·
                                </span>
                              )}
                            </td>
                          );
                        })}

                        {/* Summary: Present */}
                        <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-emerald-50/20">
                          <span className="text-xs font-bold text-emerald-700">
                            {student.present || 0}
                          </span>
                        </td>

                        {/* Summary: Absent */}
                        <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-rose-50/20">
                          <span className="text-xs font-bold text-rose-700">
                            {student.absent || 0}
                          </span>
                        </td>

                        {/* Summary: Late */}
                        <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-amber-50/20">
                          <span className="text-xs font-bold text-amber-700">
                            {student.late || 0}
                          </span>
                        </td>

                        {/* Summary: Total Working Days */}
                        <td className="py-2.5 px-2 text-center font-bold text-xs text-amber-950 border-r border-amber-200">
                          {student.totalMarked || 0}
                        </td>

                        {/* Action: Open Modal */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForModal(student)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:bg-amber-100/70 px-2 py-1 rounded-lg border border-amber-200 transition-colors"
                          >
                            📋 All Dates
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredMonthlyStudents.length === 0 && (
                      <tr>
                        <td
                          colSpan={monthDates.length + 7}
                          className="py-12 text-center text-stone-500"
                        >
                          {monthlySearchQuery
                            ? `No students matching "${monthlySearchQuery}" found.`
                            : "No attendance records recorded for this class in this month."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODAL: CHRONOLOGICAL LIST OF ALL DATES IN THE MONTH FOR ONE STUDENT */}
            {selectedStudentForModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs"
                onClick={() => setSelectedStudentForModal(null)}
              >
                <div
                  className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-amber-200 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-amber-100 p-5 bg-amber-50/70">
                    <div>
                      <h3 className="text-lg font-bold text-amber-950 font-serif">
                        {selectedStudentForModal.name}&apos;s Attendance Breakdown
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5">
                        Class: Standard {selectedClassDetails?.standard}-{selectedClassDetails?.division} • Class Teacher:{" "}
                        <span className="font-semibold text-amber-800">
                          {localTeacherName || selectedClassDetails?.classTeacherName || "Not Assigned"}
                        </span>{" "}
                        • Month: <span className="font-semibold text-stone-800">{formatMonthName(selectedMonth)}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForModal(null)}
                      className="rounded-xl p-2 text-stone-400 hover:bg-amber-100 hover:text-stone-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-4 gap-2 p-4 bg-amber-50/30 border-b border-amber-100 text-center">
                    <div className="rounded-xl bg-white p-2.5 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-stone-500">Total Days</div>
                      <div className="text-base font-extrabold text-amber-950">{monthDates.length}</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-200">
                      <div className="text-[10px] uppercase font-bold text-emerald-700">Present</div>
                      <div className="text-base font-extrabold text-emerald-700">
                        {selectedStudentForModal.present || 0}
                      </div>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-2.5 border border-rose-200">
                      <div className="text-[10px] uppercase font-bold text-rose-700">Absent</div>
                      <div className="text-base font-extrabold text-rose-700">
                        {selectedStudentForModal.absent || 0}
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-700">Late</div>
                      <div className="text-base font-extrabold text-amber-700">
                        {selectedStudentForModal.late || 0}
                      </div>
                    </div>
                  </div>

                  {/* All Dates Chronological List */}
                  <div className="overflow-y-auto p-4 flex-1">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-amber-100/70 text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 w-12 text-center">#</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Day</th>
                          <th className="py-2.5 px-3 text-right">Attendance Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {monthDates.map((item) => {
                          const status = selectedStudentForModal.dailyAttendance
                            ? selectedStudentForModal.dailyAttendance[item.date]
                            : "";
                          return (
                            <tr
                              key={item.date}
                              className={`hover:bg-amber-50/50 transition-colors ${
                                item.isWeekend ? "bg-amber-50/20" : ""
                              }`}
                            >
                              <td className="py-2.5 px-3 text-center text-xs font-medium text-stone-400">
                                {item.day}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-xs text-stone-800">
                                {item.date}
                              </td>
                              <td className="py-2.5 px-3 text-xs text-stone-500">
                                <span className={item.isWeekend ? "font-semibold text-amber-800/70" : ""}>
                                  {item.dayName}
                                  {item.isWeekend ? " (Weekend)" : ""}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {status === "Present" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    ✓ Present
                                  </span>
                                ) : status === "Absent" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    ✗ Absent
                                  </span>
                                ) : status === "Late" ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                    ⏱ Late
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-400 border border-stone-200">
                                    — No Record / Holiday
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-amber-100 p-4 bg-amber-50/50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl border border-amber-200 bg-white text-xs font-bold text-amber-900 hover:bg-amber-50 transition-colors"
                    >
                      🖨️ Print Student Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForModal(null)}
                      className="px-5 py-2 rounded-xl bg-amber-600 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: SINGLE DATE & RAW RECORDS FILTER (BACKWARD COMPATIBILITY)         */}
        {/* ========================================================================= */}
        {activeTab === "raw" && (
          <div className="space-y-6">
            <form
              onSubmit={handleLegacyFilter}
              className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-200 md:grid-cols-4"
            >
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-800">
                  Standard
                </label>
                <input
                  type="text"
                  value={filterStandard}
                  onChange={(e) => setFilterStandard(e.target.value)}
                  placeholder="e.g. 6"
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-800">
                  Division
                </label>
                <input
                  type="text"
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  placeholder="e.g. A"
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-800">
                  Specific Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2.5 text-sm font-medium text-stone-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors"
                >
                  Apply Filter
                </button>

                <button
                  type="button"
                  onClick={handleLegacyReset}
                  className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-stone-500">
                Total Records Displayed:{" "}
                <span className="font-bold text-amber-950">{filteredLegacyRecords.length}</span>
              </p>

              <div className="flex items-center gap-2">
                <label htmlFor="attendance-sort" className="text-xs font-bold text-amber-800">
                  Sort by:
                </label>

                <select
                  id="attendance-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 focus:border-amber-500 focus:outline-none"
                >
                  <option value="date">Latest Date</option>
                  <option value="name">Student Name</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm border-collapse">
                  <thead className="bg-amber-100/70 text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4 text-center">Standard</th>
                      <th className="py-3 px-4 text-center">Division</th>
                      <th className="py-3 px-4 text-center">Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-amber-100">
                    {filteredLegacyRecords.map((record, index) => (
                      <tr
                        key={record._id || `${record.studentId}-${record.date}-${index}`}
                        className="hover:bg-amber-50/40 transition-colors"
                      >
                        <td className="py-3 px-4 text-center text-xs font-medium text-stone-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800">
                          {record.name || record.studentName || "—"}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-stone-600">
                          {record.standard || "—"}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-stone-600">
                          {record.division || "—"}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-stone-600">
                          {record.date || "—"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold border ${getStatusBadge(
                              record.status
                            )}`}
                          >
                            {record.status || "Not Marked"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredLegacyRecords.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-stone-500">
                          No attendance records found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;