import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMyAssignedClasses,
  fetchClassAttendance,
  saveClassAttendance,
  deleteClassAttendance,
  fetchAttendanceReport,
  clearAttendanceError,
  clearAttendanceMessage,
} from "../../../Redux/Slices/AttendenceSlice";

const getToday = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getYesterday = () => {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedteacherId } = useParams();
  const teacherId = loggedteacherId || localStorage.getItem("id");

  const {
    assignedClasses,
    classRecords,
    monthlyReport,
    selectedClass,
    loading,
    deleting,
    error,
    successMessage,
  } = useSelector((state) => state.attendance);

  // Tab mode: "daily" for individual daily marking, "monthly" for monthly report
  const [activeTab, setActiveTab] = useState("daily");

  const [selectedClassIndex, setSelectedClassIndex] = useState("");
  const [date, setDate] = useState(getToday());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [attendance, setAttendance] = useState({});
  const [registerLoaded, setRegisterLoaded] = useState(false);

  // Search & filter states
  const [dailySearchQuery, setDailySearchQuery] = useState("");
  const [dailyStatusFilter, setDailyStatusFilter] = useState("all");
  const [monthlySearchQuery, setMonthlySearchQuery] = useState("");

  // Monthly report view controls & inspection modal
  const [monthlySubView, setMonthlySubView] = useState("matrix"); // "matrix" | "date_roster"
  const [selectedStudentForModal, setSelectedStudentForModal] = useState(null);
  const [selectedRosterDate, setSelectedRosterDate] = useState("");

  // Track per-student individual saving status
  const [rowSaving, setRowSaving] = useState({});
  const [rowSaved, setRowSaved] = useState({});

  // Fetch classes assigned to this teacher on mount
  useEffect(() => {
    dispatch(fetchMyAssignedClasses(teacherId));
  }, [dispatch, teacherId]);

  // Auto-select the first assigned class once classes are loaded
  useEffect(() => {
    if (assignedClasses && assignedClasses.length > 0 && selectedClassIndex === "") {
      setSelectedClassIndex("0");
    }
  }, [assignedClasses, selectedClassIndex]);

  // Sync attendance state when class records change
  useEffect(() => {
    setAttendance(
      Object.fromEntries(
        (classRecords || []).map((student) => [
          String(student.studentId),
          student.status || "",
        ])
      )
    );

    setRegisterLoaded(Boolean(selectedClass));
  }, [classRecords, selectedClass]);

  const selectedClassDetails =
    selectedClassIndex !== "" && assignedClasses && assignedClasses[Number(selectedClassIndex)]
      ? assignedClasses[Number(selectedClassIndex)]
      : null;

  // Load the daily attendance register
  const loadRegister = useCallback(async () => {
    if (!selectedClassDetails || !date) {
      return;
    }

    dispatch(clearAttendanceError());
    dispatch(clearAttendanceMessage());

    try {
      await dispatch(
        fetchClassAttendance({
          standard: selectedClassDetails.standard,
          division: selectedClassDetails.division,
          date,
        })
      ).unwrap();

      setRegisterLoaded(true);
    } catch {
      setRegisterLoaded(false);
    }
  }, [dispatch, selectedClassDetails, date]);

  // Load the monthly attendance report
  const loadMonthlyReport = useCallback(async () => {
    if (!selectedClassDetails || !selectedMonth) {
      return;
    }

    dispatch(clearAttendanceError());
    dispatch(clearAttendanceMessage());

    try {
      await dispatch(
        fetchAttendanceReport({
          standard: selectedClassDetails.standard,
          division: selectedClassDetails.division,
          month: selectedMonth,
        })
      ).unwrap();
    } catch {
      // Redux slice handles error
    }
  }, [dispatch, selectedClassDetails, selectedMonth]);

  // Auto-load daily register when class or date changes
  useEffect(() => {
    if (activeTab === "daily" && selectedClassDetails && date) {
      loadRegister();
    }
  }, [activeTab, selectedClassDetails, date, loadRegister]);

  // Auto-load monthly report when month, class, or tab changes
  useEffect(() => {
    if (activeTab === "monthly" && selectedClassDetails && selectedMonth) {
      loadMonthlyReport();
    }
  }, [activeTab, selectedClassDetails, selectedMonth, loadMonthlyReport]);

  // Individual student attendance marking & immediate saving
  const handleMarkIndividual = async (studentId, status) => {
    if (!status || !selectedClassDetails || !date) return;

    // 1. Immediately update local state for responsive UI
    setAttendance((prev) => ({
      ...prev,
      [String(studentId)]: status,
    }));

    // 2. Persist this individual student's attendance directly to the backend
    setRowSaving((prev) => ({ ...prev, [String(studentId)]: true }));
    dispatch(clearAttendanceError());

    try {
      await dispatch(
        saveClassAttendance({
          standard: selectedClassDetails.standard,
          division: selectedClassDetails.division,
          date,
          records: [{ studentId, status }],
          teacherId,
        })
      ).unwrap();

      setRowSaved((prev) => ({ ...prev, [String(studentId)]: true }));
      setTimeout(() => {
        setRowSaved((prev) => ({ ...prev, [String(studentId)]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to save individual attendance:", err);
    } finally {
      setRowSaving((prev) => ({ ...prev, [String(studentId)]: false }));
    }
  };

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

  // Daily attendance metrics calculation
  const dailyMetrics = useMemo(() => {
    const total = classRecords?.length || 0;
    let present = 0;
    let absent = 0;
    let late = 0;

    Object.values(attendance).forEach((val) => {
      if (val === "Present") present++;
      else if (val === "Absent") absent++;
      else if (val === "Late") late++;
    });

    const unmarked = Math.max(0, total - (present + absent + late));
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, late, unmarked, percentage };
  }, [classRecords, attendance]);

  // Filtered daily students
  const filteredDailyStudents = useMemo(() => {
    return (classRecords || []).filter((student) => {
      const studentName = (student.name || "").toLowerCase();
      const matchesSearch = studentName.includes(dailySearchQuery.toLowerCase().trim());

      const currentStatus = attendance[String(student.studentId)] || "unmarked";
      const matchesFilter =
        dailyStatusFilter === "all" ||
        (dailyStatusFilter === "unmarked"
          ? !currentStatus || currentStatus === "unmarked"
          : currentStatus === dailyStatusFilter);

      return matchesSearch && matchesFilter;
    });
  }, [classRecords, attendance, dailySearchQuery, dailyStatusFilter]);

  // Generate all calendar dates for the selected month (1 to 28/29/30/31)
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

  // Keep selected roster date aligned with the active month
  useEffect(() => {
    if (selectedMonth && (!selectedRosterDate || !selectedRosterDate.startsWith(selectedMonth))) {
      setSelectedRosterDate(`${selectedMonth}-01`);
    }
  }, [selectedMonth, selectedRosterDate]);

  // Filtered monthly report list
  const filteredMonthlyList = useMemo(() => {
    return (monthlyReport || []).filter((student) => {
      const name = (student.name || "").toLowerCase();
      return name.includes(monthlySearchQuery.toLowerCase().trim());
    });
  }, [monthlyReport, monthlySearchQuery]);

  // Delete attendance register handler
  const handleDelete = async () => {
    if (!selectedClassDetails || !date || !registerLoaded) {
      window.alert("Load the register before deleting it.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the attendance register for Standard ${selectedClassDetails.standard} - Division ${selectedClassDetails.division} on ${date}? This will reset all students for that date.`
    );

    if (!confirmed) return;

    dispatch(clearAttendanceError());
    dispatch(clearAttendanceMessage());

    try {
      await dispatch(
        deleteClassAttendance({
          standard: selectedClassDetails.standard,
          division: selectedClassDetails.division,
          date,
        })
      ).unwrap();

      setAttendance({});
      setRegisterLoaded(false);
    } catch {
      // Redux slice stores error message
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-8 text-amber-800">
      <div className="mx-auto max-w-6xl">
        {/* Top Header Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-amber-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-900 md:text-3xl">
              Teacher Attendance Section
            </h1>
            <p className="mt-1 text-sm text-amber-500">
              Manage daily roll-call attendance and view monthly reports for your assigned class.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(teacherId ? `/teacher/profile/${teacherId}` : -1)}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-white border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-50 hover:text-amber-900 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="inline-flex rounded-xl bg-amber-200/80 p-1 border border-amber-300">
            <button
              type="button"
              onClick={() => setActiveTab("daily")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeTab === "daily"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-amber-600 hover:text-amber-900"
                }`}
            >
              Daily Roll Call
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeTab === "monthly"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-amber-600 hover:text-amber-900"
                }`}
            >
              Monthly Attendance Report
            </button>
          </div>

          {selectedClassDetails && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <span>  Class:</span>
              <span>Standard {selectedClassDetails.standard} - Division {selectedClassDetails.division}</span>
            </div>
          )}
        </div>





        {/*   VIEW 1: DAILY INDIVIDUAL ATTENDANCE ROLL CALL   */}

        {activeTab === "daily" && (
          <div>
            {/* Class & Date Selection Bar */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-200 md:grid-cols-12">
              {/* Class Select */}
              <div className="md:col-span-5">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-600">
                  Class & Division
                </label>
                <select
                  value={selectedClassIndex}
                  onChange={(e) => {
                    setSelectedClassIndex(e.target.value);
                    setRegisterLoaded(false);
                    setAttendance({});
                  }}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-medium text-amber-800 shadow-sm focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <option value="">Select class</option>
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

              {/* Date Picker */}
              <div className="md:col-span-4">
                <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600">
                  <span>Attendance Date</span>
                  <div className="space-x-1.5 font-normal">
                    <button
                      type="button"
                      onClick={() => setDate(getToday())}
                      className={`text-[11px] underline hover:text-amber-600 ${date === getToday() ? "font-bold text-amber-600" : "text-amber-500"
                        }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setDate(getYesterday())}
                      className={`text-[11px] underline hover:text-amber-600 ${date === getYesterday() ? "font-bold text-amber-600" : "text-amber-500"
                        }`}
                    >
                      Yesterday
                    </button>
                  </div>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setRegisterLoaded(false);
                  }}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-medium text-amber-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>

            </div>

            {/* Register Details and Individual Marking Area */}
            {registerLoaded && (
              <div className="space-y-6">
                {/* Live Metrics Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Total</div>
                    <div className="mt-1 text-2xl font-extrabold text-amber-800">{dailyMetrics.total}</div>
                    <div className="mt-1 text-xs text-amber-400">Class Size</div>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
                    <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Present</div>
                    <div className="mt-1 text-2xl font-extrabold text-emerald-700">
                      {dailyMetrics.present}
                      <span className="ml-1.5 text-xs font-normal text-emerald-600">
                        ({dailyMetrics.percentage}%)
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-emerald-600">Marked Present</div>
                  </div>

                  <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 shadow-sm">
                    <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Absent</div>
                    <div className="mt-1 text-2xl font-extrabold text-rose-700">{dailyMetrics.absent}</div>
                    <div className="mt-1 text-xs text-rose-600">Marked Absent</div>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
                    <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Late</div>
                    <div className="mt-1 text-2xl font-extrabold text-amber-700">{dailyMetrics.late}</div>
                    <div className="mt-1 text-xs text-amber-600">Marked Late</div>
                  </div>

                  <div
                    className={`rounded-xl border p-4 shadow-sm ${dailyMetrics.unmarked > 0
                      ? "border-amber-300 bg-amber-50"
                      : "border-amber-200 bg-white"
                      }`}
                  >
                    <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Unmarked</div>
                    <div
                      className={`mt-1 text-2xl font-extrabold ${dailyMetrics.unmarked > 0 ? "text-amber-700" : "text-amber-400"
                        }`}
                    >
                      {dailyMetrics.unmarked}
                    </div>
                    <div className="mt-1 text-xs text-amber-500">
                      {dailyMetrics.unmarked > 0 ? "⚠️ Needs marking" : "All marked"}
                    </div>
                  </div>
                </div>

                {/* Individual Search & Filter Bar */}
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-amber-200 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <span className="font-semibold text-amber-900">Student Roll Call</span>
                    <span className="text-amber-400">•</span>
                    <span>Click a status to mark & save that student individually</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={dailySearchQuery}
                        onChange={(e) => setDailySearchQuery(e.target.value)}
                        className="w-48 sm:w-56 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs text-amber-800 placeholder-amber-400 focus:bg-white focus:border-amber-500 focus:outline-none"
                      />
                      {dailySearchQuery && (
                        <button
                          onClick={() => setDailySearchQuery("")}
                          className="absolute right-2 top-1.5 text-xs text-amber-400 hover:text-amber-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <select
                      value={dailyStatusFilter}
                      onChange={(e) => setDailyStatusFilter(e.target.value)}
                      className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 focus:bg-white focus:outline-none"
                    >
                      <option value="all">All Students ({dailyMetrics.total})</option>
                      <option value="unmarked">Unmarked Only ({dailyMetrics.unmarked})</option>
                      <option value="Present">Present ({dailyMetrics.present})</option>
                      <option value="Absent">Absent ({dailyMetrics.absent})</option>
                      <option value="Late">Late ({dailyMetrics.late})</option>
                    </select>
                  </div>
                </div>

                {/* Attendance Sheet Table with Individual Student Rows */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-amber-100 text-xs font-bold uppercase tracking-wider text-amber-600 border-b border-amber-200">
                        <tr>
                          <th className="py-3.5 px-4 w-12 text-center">#</th>
                          <th className="py-3.5 px-4">Student Name</th>
                          <th className="py-3.5 px-4 text-center">Mark Status (Individual)</th>
                          <th className="py-3.5 px-4 text-right">Saved Status</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-amber-100">
                        {filteredDailyStudents.map((student, index) => {
                          const currentStatus = attendance[String(student.studentId)] || "";
                          const isSaving = rowSaving[String(student.studentId)];
                          const isSaved = rowSaved[String(student.studentId)];

                          return (
                            <tr
                              key={student.studentId || index}
                              className="hover:bg-amber-50/80 transition-colors"
                            >
                              {/* Row Number */}
                              <td className="py-3.5 px-4 text-center text-xs font-medium text-amber-400">
                                {index + 1}
                              </td>

                              {/* Student Name */}
                              <td className="py-3.5 px-4 font-semibold text-amber-800">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                    {(student.name || "S").charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-amber-900">
                                      {student.name || "Unnamed Student"}
                                    </div>
                                    <div className="text-[11px] text-amber-400">
                                      Class: Standard {selectedClassDetails.standard}-{selectedClassDetails.division}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Individual 1-Click Status Marking Buttons */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="inline-flex rounded-xl bg-amber-100 p-1 gap-1 border border-amber-200">
                                  {/* Present Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkIndividual(student.studentId, "Present")}
                                    disabled={isSaving}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${currentStatus === "Present"
                                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1"
                                      : "text-amber-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${currentStatus === "Present" ? "bg-white" : "bg-emerald-500"
                                        }`}
                                    ></span>
                                    Present
                                  </button>

                                  {/* Absent Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkIndividual(student.studentId, "Absent")}
                                    disabled={isSaving}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${currentStatus === "Absent"
                                      ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1"
                                      : "text-amber-600 hover:text-rose-700 hover:bg-rose-50"
                                      }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${currentStatus === "Absent" ? "bg-white" : "bg-rose-500"
                                        }`}
                                    ></span>
                                    Absent
                                  </button>

                                  {/* Late Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkIndividual(student.studentId, "Late")}
                                    disabled={isSaving}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${currentStatus === "Late"
                                      ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500 ring-offset-1"
                                      : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                      }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${currentStatus === "Late" ? "bg-white" : "bg-amber-400"
                                        }`}
                                    ></span>
                                    Late
                                  </button>
                                </div>
                              </td>

                              {/* Individual Saved Status Badge */}
                              <td className="py-3.5 px-4 text-right">
                                {isSaving ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                    Saving...
                                  </span>
                                ) : isSaved ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    <span>✓</span> Saved
                                  </span>
                                ) : currentStatus === "Present" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span>✓</span> Present
                                  </span>
                                ) : currentStatus === "Absent" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                    <span>✗</span> Absent
                                  </span>
                                ) : currentStatus === "Late" ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                    <span>⏱</span> Late
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-500 border border-amber-200">
                                    <span>○</span> Not Marked
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                        {filteredDailyStudents.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-12 text-center text-amber-500">
                              {dailySearchQuery
                                ? `No students matching "${dailySearchQuery}" found.`
                                : "No students registered in this class."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>



                  {/* <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                    >
                      {deleting ? "Deleting..." : "Delete Class Register"}
                    </button> */}
                </div>
              </div>

            )}
          </div>
        )}


        {/* VIEW 2: MONTHLY ATTENDANCE REPORT FOR HER CLASS                           */}

        {activeTab === "monthly" && (
          <div className="space-y-6">
            {/* Monthly Controls Bar */}
            <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm border border-amber-200 md:grid-cols-12">
              {/* Class Select */}
              <div className="md:col-span-5">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-amber-600">
                  Select Class
                </label>
                <select
                  value={selectedClassIndex}
                  onChange={(e) => setSelectedClassIndex(e.target.value)}
                  className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-medium text-amber-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <option value="">Select class</option>
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
              <div className="md:col-span-5">
                <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600">
                  <span>Select Month</span>
                  <span className="font-semibold text-amber-700 capitalize">
                    {formatMonthName(selectedMonth)}
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    ◀
                  </button>

                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm font-medium text-amber-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    ▶
                  </button>
                </div>
              </div>


            </div>

            {/* Monthly View Mode Switcher, Search & Legend Toolbar */}
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-amber-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Sub-view switcher */}
                <div className="inline-flex rounded-xl bg-amber-100 p-1 border border-amber-200 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setMonthlySubView("matrix")}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${monthlySubView === "matrix"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-amber-600 hover:text-amber-900"
                      }`}
                  >
                    <span>📊</span> Full Month Matrix (All Dates)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthlySubView("date_roster")}
                    className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${monthlySubView === "date_roster"
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-amber-600 hover:text-amber-900"
                      }`}
                  >
                    <span>📅</span> Date-by-Date Log
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search student by name..."
                    value={monthlySearchQuery}
                    onChange={(e) => setMonthlySearchQuery(e.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs text-amber-800 placeholder-amber-400 focus:bg-white focus:border-amber-500 focus:outline-none"
                  />
                  {monthlySearchQuery && (
                    <button
                      onClick={() => setMonthlySearchQuery("")}
                      className="absolute right-3 top-2.5 text-xs text-amber-400 hover:text-amber-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Legend & Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-100 pt-3 text-xs">
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <span>Class: Standard {selectedClassDetails?.standard}-{selectedClassDetails?.division}</span>
                  <span className="text-amber-300">•</span>
                  <span>{filteredMonthlyList.length} Students</span>
                  <span className="text-amber-300">•</span>
                  <span>{monthDates.length} Days in {formatMonthName(selectedMonth)}</span>
                </div>

                {/* Badges Legend */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider">Legend:</span>
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
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                    <span className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center text-[10px]">—</span>
                    No Record
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUB-VIEW A: FULL MONTH MATRIX (All Dates 1..31 across table columns)      */}
            {/* ========================================================================= */}
            {monthlySubView === "matrix" && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-amber-100 text-xs font-bold uppercase tracking-wider text-amber-600 border-b border-amber-200">
                      <tr>
                        {/* Sticky Index Column */}
                        <th className="py-3 px-3 w-12 text-center sticky left-0 bg-amber-100 z-30 border-r border-amber-200">
                          #
                        </th>

                        {/* Sticky Student Name Column */}
                        <th className="py-3 px-4 min-w-[200px] sticky left-12 bg-amber-100 z-30 border-r border-amber-200 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]">
                          Student Name
                        </th>

                        {/* All Dates of the Month as Columns (01..31) */}
                        {monthDates.map((item) => (
                          <th
                            key={item.date}
                            className={`py-2 px-1 text-center min-w-[38px] max-w-[42px] border-r border-amber-200 ${item.isWeekend
                              ? "bg-amber-200/60 text-amber-400"
                              : "bg-amber-100 text-amber-700"
                              }`}
                            title={`${item.date} (${item.dayName})`}
                          >
                            <div className="text-[11px] font-extrabold leading-tight">
                              {String(item.day).padStart(2, "0")}
                            </div>
                            <div className="text-[9px] font-medium leading-tight text-amber-500">
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
                          className="py-3 px-2 text-center bg-amber-100 text-amber-700 min-w-[56px] border-r border-amber-200"
                          title="Total Days Marked"
                        >
                          Total
                        </th>
                        <th className="py-3 px-3 text-center bg-amber-100 text-amber-700 min-w-[90px]">
                          Breakdown
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-100">
                      {filteredMonthlyList.map((student, index) => (
                        <tr
                          key={student.studentId || index}
                          className="hover:bg-amber-50/20 transition-colors"
                        >
                          {/* Sticky Row Index */}
                          <td className="py-2.5 px-3 text-center text-xs font-medium text-amber-400 sticky left-0 bg-white z-20 border-r border-amber-100">
                            {index + 1}
                          </td>

                          {/* Sticky Student Name */}
                          <td className="py-2.5 px-4 font-semibold text-amber-800 sticky left-12 bg-white z-20 border-r border-amber-200 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                                {(student.name || "S").charAt(0)}
                              </div>
                              <div className="truncate max-w-[150px]" title={student.name}>
                                <div className="text-xs font-semibold text-amber-900 truncate">
                                  {student.name || "Unnamed Student"}
                                </div>
                                <div className="text-[10px] text-amber-400">
                                  ID: {student.studentId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* All Dates Cells for this Student */}
                          {monthDates.map((item) => {
                            const status = student.dailyAttendance
                              ? student.dailyAttendance[item.date]
                              : "";

                            return (
                              <td
                                key={item.date}
                                className={`py-2 px-0.5 text-center border-r border-amber-100 ${item.isWeekend ? "bg-amber-50/40" : ""
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
                                    className="text-amber-300 font-bold text-xs select-none"
                                    title={`No record on ${item.date}`}
                                  >
                                    ·
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {/* Summary: Present Days */}
                          <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-emerald-50/20">
                            <span className="text-xs font-bold text-emerald-700">
                              {student.present || 0}
                            </span>
                          </td>

                          {/* Summary: Absent Days */}
                          <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-rose-50/20">
                            <span className="text-xs font-bold text-rose-700">
                              {student.absent || 0}
                            </span>
                          </td>

                          {/* Summary: Late Days */}
                          <td className="py-2.5 px-2 text-center border-r border-amber-100 bg-amber-50/20">
                            <span className="text-xs font-bold text-amber-700">
                              {student.late || 0}
                            </span>
                          </td>

                          {/* Summary: Total Working Days */}
                          <td className="py-2.5 px-2 text-center font-bold text-xs text-amber-800 border-r border-amber-200">
                            {student.totalMarked || 0}
                          </td>

                          {/* Action Button: Open All Dates Breakdown Modal */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedStudentForModal(student)}
                              className="text-[11px] font-semibold text-amber-600 hover:text-amber-800 hover:bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 transition-colors"
                            >
                              📋 All Dates
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredMonthlyList.length === 0 && (
                        <tr>
                          <td
                            colSpan={monthDates.length + 7}
                            className="py-12 text-center text-amber-500"
                          >
                            {monthlySearchQuery
                              ? `No students matching "${monthlySearchQuery}" found in this month.`
                              : "No attendance records recorded for this class in this month."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>


              </div>
            )}


            {/* SUB-VIEW B: DATE-BY-DATE LOG (Select any date of the month to inspect)   */}

            {monthlySubView === "date_roster" && (
              <div className="space-y-4">
                {/* Date Selection Strip */}
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-amber-200">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-amber-600">
                    Select Date in {formatMonthName(selectedMonth)}:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {monthDates.map((dObj) => {
                      const isSelected = selectedRosterDate === dObj.date;
                      return (
                        <button
                          key={dObj.date}
                          type="button"
                          onClick={() => setSelectedRosterDate(dObj.date)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center min-w-[48px] ${isSelected
                            ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600 ring-offset-1"
                            : dObj.isWeekend
                              ? "bg-amber-100 text-amber-400 hover:bg-amber-200"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700 border border-amber-200"
                            }`}
                        >
                          <span className="text-[11px] font-extrabold">{String(dObj.day).padStart(2, "0")}</span>
                          <span className={`text-[9px] ${isSelected ? "text-amber-100" : "text-amber-400"}`}>
                            {dObj.dayName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Roster for the Selected Date */}
                {selectedRosterDate && (
                  <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
                    <div className="p-4 bg-amber-50 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-amber-900">
                          Date:  {selectedRosterDate}
                        </h3>

                      </div>

                      {/* Live Date Count Badges */}
                      {(() => {
                        let pres = 0;
                        let abs = 0;
                        let lt = 0;
                        let unmk = 0;
                        filteredMonthlyList.forEach((s) => {
                          const st = s.dailyAttendance ? s.dailyAttendance[selectedRosterDate] : "";
                          if (st === "Present") pres++;
                          else if (st === "Absent") abs++;
                          else if (st === "Late") lt++;
                          else unmk++;
                        });
                        return (
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                              Present: {pres}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800">
                              Absent: {abs}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                              Late: {lt}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-200 text-amber-700">
                              Unmarked: {unmk}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-amber-100 text-xs font-bold uppercase tracking-wider text-amber-600 border-b border-amber-200">
                          <tr>
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4 text-center">Date</th>
                            <th className="py-3 px-4 text-center">Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          {filteredMonthlyList.map((student, idx) => {
                            const status = student.dailyAttendance
                              ? student.dailyAttendance[selectedRosterDate]
                              : "";
                            return (
                              <tr key={student.studentId || idx} className="hover:bg-amber-50 transition-colors">
                                <td className="py-3 px-4 text-center text-xs font-medium text-amber-400">
                                  {idx + 1}
                                </td>
                                <td className="py-3 px-4 font-semibold text-amber-800">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs uppercase">
                                      {(student.name || "S").charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-xs font-semibold text-amber-900">{student.name}</div>
                                      <div className="text-[10px] text-amber-400">ID: {student.studentId}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-center text-xs text-amber-600 font-medium">
                                  {selectedRosterDate}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {status === "Present" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      ✓ Present
                                    </span>
                                  ) : status === "Absent" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                      ✗ Absent
                                    </span>
                                  ) : status === "Late" ? (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                      ⏱ Late
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-400 border border-amber-200">
                                      ○ Not Marked / Holiday
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL: CHRONOLOGICAL LIST OF ALL DATES IN THE MONTH FOR ONE STUDENT       */}
            {/* ========================================================================= */}
            {selectedStudentForModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/60 p-4 backdrop-blur-xs"
                onClick={() => setSelectedStudentForModal(null)}
              >
                <div
                  className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-amber-200 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-amber-200 p-5 bg-amber-50">
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">
                        {selectedStudentForModal.name}&apos;s Attendance Breakdown
                      </h3>
                      <p className="text-xs text-amber-500 mt-0.5">
                        Class: Standard {selectedClassDetails?.standard}-{selectedClassDetails?.division} • Month:{" "}
                        <span className="font-semibold text-amber-700">{formatMonthName(selectedMonth)}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForModal(null)}
                      className="rounded-xl p-2 text-amber-400 hover:bg-amber-200 hover:text-amber-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-4 gap-2 p-4 bg-amber-100/70 border-b border-amber-200 text-center">
                    <div className="rounded-xl bg-white p-2.5 border border-amber-200">
                      <div className="text-[10px] uppercase font-bold text-amber-500">Total Days</div>
                      <div className="text-base font-extrabold text-amber-800">{monthDates.length}</div>
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
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
                      Complete Dates Schedule ({monthDates.length} Days)
                    </div>
                    <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-amber-100 text-xs font-bold uppercase tracking-wider text-amber-600 border-b border-amber-200 sticky top-0">
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
                              className={`hover:bg-amber-50 transition-colors ${item.isWeekend ? "bg-amber-50/50" : ""
                                }`}
                            >
                              <td className="py-2.5 px-3 text-center text-xs font-medium text-amber-400">
                                {item.day}
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-xs text-amber-800">
                                {item.date}
                              </td>
                              <td className="py-2.5 px-3 text-xs text-amber-500">
                                <span className={item.isWeekend ? "font-semibold text-amber-400" : ""}>
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
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-400 border border-amber-200">
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
                  <div className="border-t border-amber-200 p-4 bg-amber-50 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      🖨️ Print Student Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForModal(null)}
                      className="px-5 py-2 rounded-xl bg-amber-800 text-xs font-bold text-white hover:bg-amber-900 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;