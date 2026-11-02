import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneStudentDetails } from "../../../Redux/Slices/StudentSlice";
import { fetchClassExams } from "../../../Redux/Slices/ExamSlice";

const StudentExams = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector((state) => state.student.oneStudentDetailsData);
  const { classExams, loading } = useSelector((state) => state.exam);

  useEffect(() => {
    if (id) {
      dispatch(fetchOneStudentDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (student?.Standard && student?.Division) {
      dispatch(
        fetchClassExams({
          standard: String(student.Standard),
          division: String(student.Division),
        })
      );
    }
  }, [student, dispatch]);

  return (
    <div className="min-h-screen bg-amber-50 text-amber-800 pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/studentDashboard/${id}`)}
              className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
            >
              Back to Dashboard
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  Examination Schedule
                </h1>

              </div>

            </div>
          </div>

          {student && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
              <span> Student: {student.Name}</span>
              <span>•</span>
              <span>Class {student.Standard}-{student.Division}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {loading ? (
          <div className="p-12 text-center text-amber-400 bg-white rounded-3xl border border-amber-200 shadow-sm">
            <span className="text-2xl animate-spin inline-block mb-2"></span>
            <p className="font-semibold text-sm">Loading exam timetables...</p>
          </div>
        ) : classExams && classExams.length > 0 ? (
          <div className="space-y-6">
            {classExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold uppercase tracking-wider">
                        Class {exam.standard}-{exam.division}
                      </span>
                      <h2 className="text-xl font-bold text-amber-900">{exam.examTitle}</h2>
                    </div>
                    <p className="text-xs text-amber-400 mt-1">
                      Academic Year: {exam.academicYear} • Instructor: {exam.createdBy?.name || "Faculty Member"}
                    </p>
                  </div>


                </div>

                {/* Timetable Table */}
                <div className="overflow-x-auto rounded-2xl border border-amber-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-amber-100 text-amber-700 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Exam Date</th>
                        <th className="py-3 px-4">Time Slot</th>
                        <th className="py-3 px-4 text-center">Duration</th>
                        <th className="py-3 px-4 text-center">Max Marks</th>
                        <th className="py-3 px-4 text-center">Hall / Room</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 font-medium">
                      {(exam.subjects || []).map((sub, idx) => (
                        <tr key={sub._id || idx} className="hover:bg-amber-50/70 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-amber-600">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-amber-900">{sub.subject}</td>
                          <td className="py-3 px-4 text-amber-700 font-semibold">{sub.examDate}</td>
                          <td className="py-3 px-4 text-amber-700 font-bold">
                            {sub.startTime} - {sub.endTime}
                          </td>
                          <td className="py-3 px-4 text-center text-amber-500">{sub.duration || "3 Hours"}</td>
                          <td className="py-3 px-4 text-center font-bold text-amber-800">{sub.maxMarks}</td>
                          <td className="py-3 px-4 text-center text-amber-600">{sub.roomNumber || "Main Hall"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-amber-200 shadow-xs">

            <h3 className="text-base font-bold text-amber-800">No Exam Timetables Published Yet</h3>
            <p className="text-xs text-amber-400 mt-1 max-w-sm mx-auto">
              Your class teachers have not scheduled any examinations for Standard {student?.Standard || "your class"}. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExams;
