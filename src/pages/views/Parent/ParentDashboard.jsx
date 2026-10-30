import React, { useEffect } from "react";
import ViewParentProfile from "./ViewParentProfile";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneParentDetails } from "../../../Redux/Slices/ParentSlice";
import { fetchOneStudentDetails } from "../../../Redux/Slices/StudentSlice";
import { fetchClassExams } from "../../../Redux/Slices/ExamSlice";

const ParentDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const getOneParentInfo = useSelector((store) => store.parent.oneParentDetailsData);
  const getStudentInfo = useSelector((state) => state.student.oneStudentDetailsData);
  const { classExams, loading: examsLoading } = useSelector((state) => state.exam);

  // 1. Fetch parent details
  useEffect(() => {
    if (id) {
      dispatch(fetchOneParentDetails(id));
    }
  }, [id, dispatch]);

  const studentID = getOneParentInfo?.student_id;

  // 2. Fetch student (child) details
  useEffect(() => {
    if (studentID) {
      dispatch(fetchOneStudentDetails(studentID));
    }
  }, [studentID, dispatch]);

  // 3. Fetch exam timetable for child's class (Standard & Division)
  useEffect(() => {
    if (getStudentInfo?.Standard && getStudentInfo?.Division) {
      dispatch(
        fetchClassExams({
          standard: String(getStudentInfo.Standard),
          division: String(getStudentInfo.Division),
        })
      );
    }
  }, [getStudentInfo?.Standard, getStudentInfo?.Division, dispatch]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-800">
      {/* Left Sidebar: Parent Profile */}
      <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 shadow-lg z-10">
        <ViewParentProfile />
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Child Student Card */}
        {getStudentInfo ? (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-amber-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-100 shadow-md"
                  src={
                    getStudentInfo?.ProfileImageUrl ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  }
                  alt={getStudentInfo?.Name || "Student photo"}
                />
                <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Enrolled
                </span>
              </div>

              <div className="text-center sm:text-left flex-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Child Profile
                </span>
                <h2 className="text-2xl font-black text-amber-950 mt-1">
                  {getStudentInfo?.Name}
                </h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs font-bold text-stone-600">
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
                    Standard: <strong className="text-stone-900">{getStudentInfo?.Standard}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
                    Division: <strong className="text-stone-900">{getStudentInfo?.Division}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200">
                    Student ID: <strong className="text-stone-900">{getStudentInfo?._id || studentID}</strong>
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
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-300">
                  🔒 View Only
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Official exam schedule published by the class teacher for Standard{" "}
                <strong>{getStudentInfo?.Standard || "—"}</strong>, Division{" "}
                <strong>{getStudentInfo?.Division || "—"}</strong>.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              disabled={!classExams || classExams.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-all self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🖨️ Print Timetable
            </button>
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
                          <th className="py-2.5 px-4 w-12 text-center">#</th>
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
              <span className="text-3xl mb-2 block">📋</span>
              <h4 className="text-sm font-bold text-amber-950">
                No Exam Timetables Published Yet
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                The class teacher for Standard {getStudentInfo?.Standard || "your child's class"} has not scheduled any examinations yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
