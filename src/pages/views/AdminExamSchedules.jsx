import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllExams,
  deleteExamTimetable,
  clearExamError,
  clearExamSuccess,
} from "../../Redux/Slices/ExamSlice";

const AdminExamSchedules = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allExams = [], loading, deleting, error, successMessage } = useSelector(
    (state) => state.exam
  );

  // Filter States: Standard and Division only
  const [filterStandard, setFilterStandard] = useState("All");
  const [filterDivision, setFilterDivision] = useState("All");

  // Fetch all timetables 
  useEffect(() => {
    dispatch(fetchAllExams());
  }, [dispatch]);



  // Filter Logic: Standard and Division only 
  const filteredExams = useMemo(() => {
    const list = Array.isArray(allExams) ? [...allExams] : [];

    return list.filter((exam) => {
      // 1. Standard matching
      const matchesStandard =
        filterStandard === "All" ||
        String(exam.standard ?? "").trim() === String(filterStandard).trim();

      // 2. Division matching
      const matchesDivision =
        filterDivision === "All" ||
        String(exam.division ?? "").trim().toUpperCase() ===
        String(filterDivision).trim().toUpperCase();

      return matchesStandard && matchesDivision;
    });
  }, [allExams, filterStandard, filterDivision]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const list = Array.isArray(allExams) ? allExams : [];
    const totalTimetables = list.length;
    const totalPapers = list.reduce(
      (acc, item) => acc + (Array.isArray(item.subjects) ? item.subjects.length : 0),
      0
    );

    const classesSet = new Set(
      list.map((item) => `${item.standard}-${(item.division || "").toUpperCase()}`)
    );

    const teachersSet = new Set(
      list.map((item) => item.createdBy?._id || item.createdBy?.name || "unknown")
    );

    return {
      totalTimetables,
      totalPapers,
      classesCovered: classesSet.size,
      contributingTeachers: teachersSet.size,
    };
  }, [allExams]);

  // Handle Admin Deletion of an Exam Timetable
  const handleDeleteTimetable = (id, title, classLabel) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete the exam timetable "${title}" for Class ${classLabel}?`
      )
    ) {
      dispatch(deleteExamTimetable(id));
    }
  };

  // Format Date for Display
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white pb-20 text-stone-800">

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Navigation Bar / Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5 no-print">
          <div className="space-y-1.5">

            <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 tracking-tight flex items-center gap-2">
              <span>📅</span> School Examination Schedules
            </h1>

          </div>


        </div>


        {/* Metrics KPI Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 no-print">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Total Schedules
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1 block">
                {metrics.totalTimetables}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Published timetables</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 text-xl">
              🗓️
            </div>
          </div>





        </div>

        {/* Filter Panel (Standard and Division Only) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs space-y-4 no-print">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                Filter by Class:
              </span>

              {/* Standard Filter */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <span>Standard:</span>
                <select
                  value={filterStandard}
                  onChange={(e) => setFilterStandard(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="All">All Standards</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      Standard {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Division Filter */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <span>Division:</span>
                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="All">All Divisions</option>
                  {["A", "B", "C", "D", "E"].map((d) => (
                    <option key={d} value={d}>
                      Division {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters */}
              {(filterStandard !== "All" || filterDivision !== "All") && (
                <button
                  onClick={() => {
                    setFilterStandard("All");
                    setFilterDivision("All");
                  }}
                  className="text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 font-bold text-xs px-3 py-2 rounded-xl transition-all"
                >
                  Reset Filter
                </button>
              )}
            </div>


          </div>
        </div>

        {/* Timetables Master Listing Section */}
        <div className="space-y-6 print-area">
          {loading && allExams.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-200 space-y-3">
              <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-bold text-amber-950">Loading school examination schedules...</p>

            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-200 space-y-3 no-print">
              <div className="text-4xl">📋</div>
              <h3 className="text-lg font-bold text-amber-950">No Examination Timetables Found</h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                {filterStandard !== "All" || filterDivision !== "All"
                  ? "No timetables matched the selected Standard / Division. Try resetting the filters to view all schedules."
                  : "Teachers haven't created or published any examination timetables yet. They will appear here once submitted."}
              </p>
              {(filterStandard !== "All" || filterDivision !== "All") && (
                <button
                  onClick={() => {
                    setFilterStandard("All");
                    setFilterDivision("All");
                  }}
                  className="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all"
                >
                  Show All Timetables
                </button>
              )}
            </div>
          ) : (
            filteredExams.map((exam) => {
              const teacher = exam.createdBy || {};
              const teacherName = teacher.name || "Faculty Teacher";
              const teacherSubject = teacher.subject || "Not Specified";
              const teacherEmail = teacher.Email || "";
              const classLabel = `Class ${exam.standard} - Division ${exam.division}`;

              return (
                <div
                  key={exam._id}
                  id={`timetable-${exam._id}`}
                  className="timetable-card bg-white rounded-3xl border border-amber-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-linear-to-r from-amber-100/90 via-amber-50 to-white px-6 py-5 border-b border-amber-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-amber-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-xs">
                          Class {exam.standard}-{exam.division}
                        </span>

                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                        {exam.examTitle}
                      </h2>
                    </div>

                    {/* Teacher Attribution & Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-amber-200/50">
                      {/* Teacher Profile Tag */}
                      <div className="flex items-center gap-2 bg-white/90 border border-amber-200 rounded-2xl px-3.5 py-2 shadow-2xs">

                        <div className="text-left">
                          <div className="text-xs font-bold text-amber-950 leading-tight">
                            TEACHER IN CHARGE: {teacherName}
                          </div>

                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 no-print">

                        <button
                          onClick={() =>
                            handleDeleteTimetable(exam._id, exam.examTitle, classLabel)
                          }
                          disabled={deleting}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-2 rounded-xl border border-rose-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                          title="Admin remove timetable"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Exam Subjects Schedule Table */}
                  <div className="p-5 sm:p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-amber-200/80 bg-amber-50/50 text-amber-900 font-extrabold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4 rounded-l-xl">#</th>
                            <th className="py-3 px-4">Subject</th>
                            <th className="py-3 px-4">Exam Date</th>
                            <th className="py-3 px-4">Time Window</th>
                            <th className="py-3 px-4">Duration</th>
                            <th className="py-3 px-4 text-center">Max Marks</th>
                            <th className="py-3 px-4 rounded-r-xl">Hall / Room</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                          {exam.subjects && exam.subjects.length > 0 ? (
                            exam.subjects.map((sub, idx) => (
                              <tr
                                key={sub._id || idx}
                                className="hover:bg-amber-50/30 transition-colors"
                              >
                                <td className="py-3.5 px-4 font-bold text-stone-400">
                                  {idx + 1}
                                </td>
                                <td className="py-3.5 px-4 font-bold text-amber-950">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    <span>{sub.subject}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="font-semibold text-stone-800">
                                    {formatDate(sub.examDate)}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-bold text-xs">
                                    {sub.startTime || "TBD"} – {sub.endTime || "TBD"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-stone-600">
                                  {sub.duration || "—"}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs">
                                    {sub.maxMarks ? `${sub.maxMarks} Marks` : "100"}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-stone-600">
                                  {sub.roomNumber ? (
                                    <span className="font-semibold text-stone-800">
                                      📍 {sub.roomNumber}
                                    </span>
                                  ) : (
                                    <span className="text-stone-400 italic">Not Assigned</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="7"
                                className="py-6 px-4 text-center text-stone-400 italic"
                              >
                                No examination papers listed in this timetable.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
                      <div>
                        <span>Timetable ID: </span>
                        <code className="text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">
                          {exam._id}
                        </code>
                      </div>
                      <div>
                        Created on:{" "}
                        <strong className="text-stone-700">
                          {exam.createdAt ? new Date(exam.createdAt).toLocaleDateString() : "Recent"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminExamSchedules;
