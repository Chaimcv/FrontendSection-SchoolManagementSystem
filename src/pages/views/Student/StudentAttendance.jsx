import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchOneStudentDetails } from "../../../Redux/Slices/StudentSlice";

const API_URL = process.env.REACT_APP_API_SCHOOL || "http://localhost:8000";

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

const StudentAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector((state) => state.student.oneStudentDetailsData);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch student info
  useEffect(() => {
    if (id) {
      dispatch(fetchOneStudentDetails(id));
    }
  }, [id, dispatch]);

  // Fetch student attendance for selected month
  const fetchAttendance = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/attendance/student/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { month: selectedMonth },
      });
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch student attendance:", err);
    } finally {
      setLoading(false);
    }
  }, [id, selectedMonth]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

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

  const dailyMap = attendanceData?.dailyMap || {};
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
      const status = dailyMap[item.date] || "unmarked";
      if (statusFilter === "all") return true;
      if (statusFilter === "Present") return status === "Present";
      if (statusFilter === "Absent") return status === "Absent";
      if (statusFilter === "Late") return status === "Late";
      if (statusFilter === "unmarked") return !dailyMap[item.date];
      return true;
    });
  }, [monthDates, dailyMap, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="mx-auto max-w-5xl">
        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                Attendance Record
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                My Attendance Sheet
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Review your monthly attendance history, working days, and present/absent status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/studentDashboard/${id}`)}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Student Profile & Active Month Banner */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center gap-3.5 sm:border-r border-emerald-100 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              👨‍🎓
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Student Name
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {student?.Name || attendanceData?.student?.name || "Student"}
              </div>
              <div className="text-[11px] text-slate-500">
                Standard {student?.Standard || attendanceData?.student?.standard || "—"} - Division{" "}
                {student?.Division || attendanceData?.student?.division || "—"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 sm:border-r border-emerald-100 pr-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              📅
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                Selected Month
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5 capitalize">
                {formatMonthName(selectedMonth)}
              </div>
              <div className="text-[11px] text-slate-500">
                {monthDates.length} Days in month
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              📊
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Attendance Rate
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {summary.percentage}%
              </div>
              <div className="text-[11px] text-slate-500">
                {summary.present} of {summary.total} marked days present
              </div>
            </div>
          </div>
        </div>

        {/* Summary KPI Cards */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Days Marked
            </div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">{summary.total}</div>
            <div className="mt-1 text-[11px] text-slate-400">Recorded Working Days</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Present Days
            </div>
            <div className="mt-1 text-2xl font-extrabold text-emerald-700">{summary.present}</div>
            <div className="mt-1 text-[11px] text-emerald-600">✓ Attended</div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
              Absent Days
            </div>
            <div className="mt-1 text-2xl font-extrabold text-rose-700">{summary.absent}</div>
            <div className="mt-1 text-[11px] text-rose-600">✗ Missed</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Late Days
            </div>
            <div className="mt-1 text-2xl font-extrabold text-amber-700">{summary.late}</div>
            <div className="mt-1 text-[11px] text-amber-600">⏱ Delayed arrival</div>
          </div>
        </div>

        {/* Month Selector & Filter Toolbar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200 sm:flex-row sm:items-center sm:justify-between">
          {/* Month Picker Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Previous Month"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              ◀
            </button>

            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={handleNextMonth}
              title="Next Month"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              ▶
            </button>

            <button
              type="button"
              onClick={() => setSelectedMonth(getCurrentMonth())}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              This Month
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">All Dates ({monthDates.length})</option>
              <option value="Present">Present Only ({summary.present})</option>
              <option value="Absent">Absent Only ({summary.absent})</option>
              <option value="Late">Late Only ({summary.late})</option>
              <option value="unmarked">Unmarked / Holidays</option>
            </select>
          </div>
        </div>

        {/* Attendance Schedule Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Attendance Log for {formatMonthName(selectedMonth)}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredDates.length} of {monthDates.length} calendar days
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <span className="inline-block animate-spin text-2xl mb-2">⏳</span>
              <p className="text-sm font-semibold">Loading attendance sheet...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Day</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Day of Week</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDates.map((item) => {
                    const status = dailyMap[item.date] || "";

                    return (
                      <tr
                        key={item.date}
                        className={`hover:bg-slate-50 transition-colors ${
                          item.isWeekend ? "bg-slate-50/50" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-center text-xs font-extrabold text-slate-400">
                          {String(item.day).padStart(2, "0")}
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-800 text-xs">
                          {item.date}
                        </td>

                        <td className="py-3 px-4 text-xs text-slate-600">
                          <span className={item.isWeekend ? "font-semibold text-slate-400" : ""}>
                            {item.dayName}
                            {item.isWeekend ? " (Weekend)" : ""}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
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
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200">
                              — No Record / Holiday
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDates.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-500">
                        No dates matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Bottom Print / Save Helper Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Student Attendance Record for {formatMonthName(selectedMonth)}.
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span>🖨️</span> Print Attendance Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
