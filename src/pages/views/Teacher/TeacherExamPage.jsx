import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createExamTimetable,
  fetchTeacherExams,
  deleteExamTimetable,
} from "../../../Redux/Slices/ExamSlice";
import { fetchOneTeacherDetails } from "../../../Redux/Slices/TeacherSlice";

const COMMON_SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Social Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Geography",
  "Hindi",
  "Physical Education",
];

const createEmptyRow = (id = 1) => ({
  id,
  subject: "",
  examDate: new Date().toISOString().split("T")[0],
  startTime: "09:30 AM",
  endTime: "12:30 PM",
  duration: "3 Hours",
  maxMarks: 100,
  roomNumber: "Room 101",
});

const TeacherExamPage = () => {
  const { loggedteacherId } = useParams();
  const teacherId = loggedteacherId || localStorage.getItem("id");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { teacherExams, loading, deleting } = useSelector(
    (state) => state.exam
  );
  const teacherInfo = useSelector((state) => state.teacher.oneTeacherDetailsData);

  // Modal Visibility State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Meta State inside Modal
  const [examTitle, setExamTitle] = useState("");
  const [academicYear] = useState("2026-2027");
  const [modalError, setModalError] = useState("");

  // Empty Table rows inside Modal
  const [tableRows, setTableRows] = useState([createEmptyRow(1)]);

  // Derive teacher's assigned class strictly
  const assignedStandard =
    teacherInfo?.standard !== undefined && teacherInfo?.standard !== null
      ? String(teacherInfo.standard)
      : "";
  const assignedDivision = teacherInfo?.division
    ? String(teacherInfo.division).toUpperCase()
    : "A";
  const hasAssignedClass = Boolean(assignedStandard);

  // Fetch teacher info & existing timetables
  useEffect(() => {
    if (teacherId) {
      dispatch(fetchOneTeacherDetails(teacherId));
      dispatch(fetchTeacherExams(teacherId));
    }
  }, [teacherId, dispatch]);

  // Open Modal with a clean empty table locked to assigned class
  const handleOpenCreateModal = () => {
    if (!hasAssignedClass) {
      alert("You cannot create an exam timetable because no class is assigned to your profile. Only assigned class teachers can create timetables.");
      return;
    }
    setExamTitle("");
    setTableRows([createEmptyRow(1)]);
    setModalError("");
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError("");
  };

  // Add a new empty row to the table
  const handleAddRow = () => {
    const nextId = tableRows.length > 0 ? Math.max(...tableRows.map((r) => r.id)) + 1 : 1;
    setTableRows([...tableRows, createEmptyRow(nextId)]);
  };

  // Remove a row from the table
  const handleRemoveRow = (rowId) => {
    if (tableRows.length <= 1) {
      setTableRows([]);
      return;
    }
    setTableRows(tableRows.filter((row) => row.id !== rowId));
  };

  // Update a field in a row
  const handleRowChange = (rowId, field, value) => {
    setTableRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  // Handle Form Submit inside Modal - Enforce assigned class only
  const handleSubmitTimetable = async (e) => {
    e.preventDefault();
    setModalError("");

    if (!hasAssignedClass) {
      setModalError("Authorization Error: You are not assigned to any class. Timetables can only be created for your assigned class.");
      return;
    }

    if (!examTitle.trim()) {
      setModalError("Please enter an Exam Title (e.g. Mid-Term Examination 2026).");
      return;
    }

    if (tableRows.length === 0) {
      setModalError("Please add at least one subject to the table before saving.");
      return;
    }

    // Validate each row
    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      if (!row.subject.trim()) {
        setModalError(`Subject name is missing in Row #${i + 1}.`);
        return;
      }
      if (!row.examDate) {
        setModalError(`Exam date is missing for "${row.subject || `Row #${i + 1}`}".`);
        return;
      }
      if (!row.startTime || !row.endTime) {
        setModalError(`Start or end time is missing for "${row.subject || `Row #${i + 1}`}".`);
        return;
      }
    }

    const payload = {
      examTitle: examTitle.trim(),
      standard: assignedStandard,
      division: assignedDivision,
      academicYear,
      createdBy: teacherId,
      subjects: tableRows.map((r) => ({
        subject: r.subject.trim(),
        examDate: r.examDate,
        startTime: r.startTime.trim(),
        endTime: r.endTime.trim(),
        duration: r.duration || "3 Hours",
        maxMarks: Number(r.maxMarks) || 100,
        roomNumber: r.roomNumber ? r.roomNumber.trim() : "",
      })),
      status: "Published",
    };

    console.log("Submitting timetable payload:", payload);
    const result = await dispatch(createExamTimetable(payload));
    console.log("createExamTimetable result:", result);
    if (result?.meta?.requestStatus === "fulfilled") {
      setIsModalOpen(false);
      if (teacherId) {
        dispatch(fetchTeacherExams(teacherId));
      }
    } else {
      const errorMsg =
        result?.payload ||
        result?.error?.message ||
        "Failed to save and publish timetable. Please check your inputs.";
      setModalError(errorMsg);
    }
  };

  // Delete timetable
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove the timetable for "${title}"?`)) {
      dispatch(deleteExamTimetable(id));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/70 via-stone-50 to-amber-100/40 text-stone-800 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-amber-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/teacher/profile/${teacherId}`)}
              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              ← Back to Dashboard
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-amber-950 font-serif">
                Exam Section
              </h1>
              <p className="text-xs text-stone-500">
                Create, inspect, and manage examination schedules for your classes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-xs font-bold text-amber-900">
              <span>🏫 Assigned Class: Std {assignedStandard || "Not Assigned"}-{assignedDivision || "—"}</span>
            </div>

            {/* THE PRIMARY BUTTON TO CREATE AN EXAM TABLE */}
            <button
              onClick={handleOpenCreateModal}
              disabled={!hasAssignedClass}
              className={`inline-flex items-center gap-2 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all ${hasAssignedClass
                  ? "bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white hover:scale-105 active:scale-95"
                  : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }`}
              title={hasAssignedClass ? "Create Exam Table" : "You have no assigned class to create timetables for"}
            >
              <span className="text-base leading-none font-black">+</span> Create Exam Table
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">




        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Published Timetables
              </span>
              <div className="text-2xl font-extrabold text-amber-950 mt-1">
                {teacherExams?.length || 0}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xl font-bold">
              📋
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-amber-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Assigned Class
              </span>
              <div className="text-2xl font-extrabold text-amber-950 mt-1">
                Standard {teacherInfo?.standard || "—"} - {teacherInfo?.division || "—"}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center text-xl font-bold">
              🏫
            </div>
          </div>


        </div>

        {/* ========================================================================= */}
        {/* PUBLISHED EXAM TIMETABLES SECTION                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-amber-200 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-amber-950 font-serif">
                Exam Timetables
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                All examination timetables created for your classes.
              </p>
            </div>


          </div>

          {teacherExams && teacherExams.length > 0 ? (
            <div className="space-y-6">
              {teacherExams.map((exam) => (
                <div
                  key={exam._id}
                  className="rounded-2xl border border-amber-200 bg-amber-50/20 p-5 shadow-xs hover:border-amber-300 transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wide">
                          Class {exam.standard}-{exam.division}
                        </span>
                        <h3 className="text-base font-extrabold text-stone-900">{exam.examTitle}</h3>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Academic Year: {exam.academicYear || "2026-2027"} • Total Subjects: {exam.subjects?.length || 0}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs rounded-xl shadow-xs transition-all"
                      >
                        🖨️ Print
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id, exam.examTitle)}
                        disabled={deleting}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs rounded-xl transition-all"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  </div>

                  {/* Timetable Table */}
                  <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-amber-100/70 text-amber-950 font-bold uppercase tracking-wider border-b border-amber-200">
                        <tr>
                          <th className="py-2.5 px-4 w-12 text-center">#</th>
                          <th className="py-2.5 px-4">Subject</th>
                          <th className="py-2.5 px-4">Date of Exam</th>
                          <th className="py-2.5 px-4">Time of Exam</th>
                          <th className="py-2.5 px-4 text-center">Duration</th>
                          <th className="py-2.5 px-4 text-center">Max Marks</th>
                          <th className="py-2.5 px-4 text-center">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100">
                        {(exam.subjects || []).map((sub, idx) => (
                          <tr key={sub._id || idx} className="hover:bg-amber-50/40">
                            <td className="py-2.5 px-4 text-center font-bold text-amber-700">{idx + 1}</td>
                            <td className="py-2.5 px-4 font-bold text-stone-900">{sub.subject}</td>
                            <td className="py-2.5 px-4 text-stone-700 font-semibold">{sub.examDate}</td>
                            <td className="py-2.5 px-4 text-amber-900 font-bold">
                              {sub.startTime} - {sub.endTime}
                            </td>
                            <td className="py-2.5 px-4 text-center text-stone-600">{sub.duration || "3 Hours"}</td>
                            <td className="py-2.5 px-4 text-center font-bold text-stone-800">{sub.maxMarks}</td>
                            <td className="py-2.5 px-4 text-center text-stone-600">{sub.roomNumber || "Main Hall"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-amber-50/30 rounded-2xl border border-dashed border-amber-300">
              <span className="text-4xl mb-3 block">📋</span>
              <h3 className="text-base font-bold text-amber-950">No Exam Tables Created Yet</h3>

            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POPUP MODAL: EMPTY EXAM TABLE FOR TEACHER TO ADD SUBJECT, DATE & TIME     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-linear-to-r from-amber-700 via-amber-600 to-amber-500 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-1">
                  New Exam Schedule
                </span>
                <h3 className="text-xl font-black">
                  Create Exam Table
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Fill in the empty table below with subjects, dates, and times of exam.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmitTimetable} className="p-6 space-y-6 overflow-y-auto flex-1">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}

              {/* Class & Exam Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    placeholder="e.g. Mid-Term Examination 2026"
                    className="w-full rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-amber-950 uppercase tracking-wider mb-1">
                    Class Standard & Division (Assigned) 🔒
                  </label>
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-100/70 text-amber-950 text-xs font-bold shadow-xs">
                    <span className="flex items-center gap-1.5">
                      <span>🏫</span> Standard {assignedStandard} - Division {assignedDivision}
                    </span>
                    <span className="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Locked to Assigned Class
                    </span>
                  </div>
                </div>
              </div>

              {/* THE EMPTY EXAM TABLE WHERE TEACHER ADDS SUBJECT, DATE & TIME */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-amber-950 uppercase tracking-wider">
                      Exam Timetable Schedule
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Add subjects with corresponding examination date and time slots.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-sm leading-none">+</span> Add Subject Row
                  </button>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-amber-200 bg-white shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-amber-100 text-amber-950 font-bold uppercase tracking-wider border-b border-amber-200">
                      <tr>
                        <th className="py-3 px-3 w-10 text-center">#</th>
                        <th className="py-3 px-3 min-w-[160px]">Subject Name *</th>
                        <th className="py-3 px-3 min-w-[140px]">Date of Exam *</th>
                        <th className="py-3 px-3 min-w-[200px]">Time of Exam (Start - End) *</th>
                        <th className="py-3 px-3 w-24 text-center">Max Marks</th>
                        <th className="py-3 px-3 w-28 text-center">Room/Hall</th>
                        <th className="py-3 px-3 w-12 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-100">
                      {tableRows.map((row, index) => (
                        <tr key={row.id} className="hover:bg-amber-50/30 transition-colors">
                          {/* Row Number */}
                          <td className="py-3 px-3 text-center font-bold text-amber-800">
                            {index + 1}
                          </td>

                          {/* Subject Field */}
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              required
                              value={row.subject}
                              onChange={(e) => handleRowChange(row.id, "subject", e.target.value)}
                              placeholder="e.g. Mathematics"
                              list={`subject-datalist-${row.id}`}
                              className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                            <datalist id={`subject-datalist-${row.id}`}>
                              {COMMON_SUBJECTS.map((sub) => (
                                <option key={sub} value={sub} />
                              ))}
                            </datalist>
                          </td>

                          {/* Date of Exam Field */}
                          <td className="py-2.5 px-3">
                            <input
                              type="date"
                              required
                              value={row.examDate}
                              onChange={(e) => handleRowChange(row.id, "examDate", e.target.value)}
                              className="w-full rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                          </td>

                          {/* Time of Exam Fields (Start & End) */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                required
                                value={row.startTime}
                                onChange={(e) => handleRowChange(row.id, "startTime", e.target.value)}
                                placeholder="09:30 AM"
                                className="w-1/2 rounded-lg border border-stone-300 px-2 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 text-center"
                              />
                              <span className="text-stone-400 font-bold text-xs">-</span>
                              <input
                                type="text"
                                required
                                value={row.endTime}
                                onChange={(e) => handleRowChange(row.id, "endTime", e.target.value)}
                                placeholder="12:30 PM"
                                className="w-1/2 rounded-lg border border-stone-300 px-2 py-1.5 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500 text-center"
                              />
                            </div>
                          </td>

                          {/* Max Marks Field */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              value={row.maxMarks}
                              onChange={(e) => handleRowChange(row.id, "maxMarks", e.target.value)}
                              className="w-20 rounded-lg border border-stone-300 px-2 py-1.5 text-xs font-semibold text-stone-800 text-center focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* Room Field */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="text"
                              value={row.roomNumber}
                              onChange={(e) => handleRowChange(row.id, "roomNumber", e.target.value)}
                              placeholder="Hall A"
                              className="w-24 rounded-lg border border-stone-300 px-2 py-1.5 text-xs font-semibold text-stone-800 text-center focus:outline-none focus:border-amber-500"
                            />
                          </td>

                          {/* Delete Row Button */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Row"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}

                      {tableRows.length === 0 && (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-stone-400">
                            The table is currently empty. Click <strong>"+ Add Subject Row"</strong> above to add subjects.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-stone-500">
                  <span>Total Scheduled Papers: <strong>{tableRows.length}</strong></span>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="text-amber-700 hover:text-amber-900 font-bold underline"
                  >
                    + Add Another Subject Row
                  </button>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-100 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <span>✓</span> Save & Publish Timetable
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExamPage;
