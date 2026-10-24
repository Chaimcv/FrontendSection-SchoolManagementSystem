import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneStudentDetails } from "../../../Redux/Slices/StudentSlice";

const StudentExams = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector((state) => state.student.oneStudentDetailsData);
  const [activeTab, setActiveTab] = useState("timetable");
  const [selectedTerm, setSelectedTerm] = useState("Mid-Term 2026");

  useEffect(() => {
    if (id) {
      dispatch(fetchOneStudentDetails(id));
    }
  }, [id, dispatch]);

  const examSchedules = [
    {
      subject: "Mathematics",
      code: "MATH-101",
      date: "2026-11-02",
      day: "Monday",
      time: "09:30 AM - 12:30 PM",
      duration: "3 Hours",
      room: "Hall A (Room 204)",
      maxMarks: 100,
      status: "Upcoming",
    },
    {
      subject: "Physics & Science",
      code: "SCI-102",
      date: "2026-11-04",
      day: "Wednesday",
      time: "09:30 AM - 12:30 PM",
      duration: "3 Hours",
      room: "Hall A (Room 204)",
      maxMarks: 100,
      status: "Upcoming",
    },
    {
      subject: "English Language & Lit",
      code: "ENG-103",
      date: "2026-11-06",
      day: "Friday",
      time: "09:30 AM - 12:00 PM",
      duration: "2.5 Hours",
      room: "Hall B (Room 108)",
      maxMarks: 80,
      status: "Upcoming",
    },
    {
      subject: "Social Studies & History",
      code: "SOC-104",
      date: "2026-11-09",
      day: "Monday",
      time: "09:30 AM - 12:00 PM",
      duration: "2.5 Hours",
      room: "Hall B (Room 108)",
      maxMarks: 80,
      status: "Upcoming",
    },
    {
      subject: "Computer Science",
      code: "CS-105",
      date: "2026-11-11",
      day: "Wednesday",
      time: "10:00 AM - 12:00 PM",
      duration: "2 Hours",
      room: "Lab 2 (Ground Floor)",
      maxMarks: 50,
      status: "Upcoming",
    },
  ];

  const gradingScale = [
    { grade: "A+", range: "90% - 100%", gpa: "4.0", remarks: "Outstanding" },
    { grade: "A", range: "80% - 89%", gpa: "3.7", remarks: "Excellent" },
    { grade: "B+", range: "70% - 79%", gpa: "3.3", remarks: "Very Good" },
    { grade: "B", range: "60% - 69%", gpa: "3.0", remarks: "Good" },
    { grade: "C", range: "50% - 59%", gpa: "2.0", remarks: "Satisfactory" },
    { grade: "D", range: "40% - 49%", gpa: "1.0", remarks: "Pass" },
    { grade: "F", range: "Below 40%", gpa: "0.0", remarks: "Needs Improvement" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-800">
      <div className="mx-auto max-w-5xl">
        {/* Header Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4 border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider">
                Exams & Assessment
              </span>
              <span className="text-xs text-slate-500 font-medium">Academic Year 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
              Examination Center
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Review your schedules, hall tickets, timings, and assessment guidelines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/studentAttendance/${id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <span>📊</span> Attendance
            </button>
            <button
              type="button"
              onClick={() => navigate(`/studentDashboard/${id}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>←</span> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Student Profile Overview Card */}
        {student && (
          <div className="mb-6 rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={student?.ProfileImageUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
              alt="student"
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{student?.Name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold w-fit mx-auto sm:mx-0">
                  Roll / ID: {student?._id?.slice(-6)?.toUpperCase()}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-slate-600">
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <strong>Standard:</strong> {student?.Standard || "N/A"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <strong>Division:</strong> {student?.Division || "N/A"}
                </span>
                <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <strong>Total Subjects:</strong> {examSchedules.length}
                </span>
              </div>
            </div>
            <div className="text-right flex flex-col items-center sm:items-end gap-1">
              <span className="text-xs text-slate-400 font-medium">Current Term</span>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Mid-Term 2026">Mid-Term Exams 2026</option>
                <option value="Final-Term 2026">Final Exams 2026</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("timetable")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "timetable"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            📅 Exam Timetable
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("grading")}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === "grading"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            🏆 Grading Scale & Guidelines
          </button>
        </div>

        {/* Timetable Tab Content */}
        {activeTab === "timetable" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">
                  Official Timetable • {selectedTerm}
                </h3>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {examSchedules.length} Papers Scheduled
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-100/60 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Subject & Code</th>
                      <th className="px-6 py-3.5">Date & Day</th>
                      <th className="px-6 py-3.5">Timings</th>
                      <th className="px-6 py-3.5">Location</th>
                      <th className="px-6 py-3.5 text-center">Max Marks</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {examSchedules.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{item.subject}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.code}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{item.date}</div>
                          <div className="text-xs text-slate-500">{item.day}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700">{item.time}</div>
                          <div className="text-xs text-slate-400">{item.duration}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            📍 {item.room}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800">
                          {item.maxMarks}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Instructions Card */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2 mb-2">
                <span>ℹ️</span> Examination Guidelines for Students
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-indigo-950/80">
                <li>Students must arrive at the examination hall at least 20 minutes before the scheduled start time.</li>
                <li>Please carry your school identity card and physical hall ticket into the examination hall.</li>
                <li>Electronic gadgets, smartwatches, and unauthorized papers are strictly prohibited in the hall.</li>
                <li>Write your roll number and standard accurately on all answer sheets.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Grading Scale Tab Content */}
        {activeTab === "grading" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm">
                  Institutional Grading System
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm">
                  <thead className="bg-slate-100/60 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3.5">Grade</th>
                      <th className="px-6 py-3.5">Percentage Range</th>
                      <th className="px-6 py-3.5">Grade Point (GPA)</th>
                      <th className="px-6 py-3.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gradingScale.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3 font-extrabold text-indigo-600 text-base">
                          {row.grade}
                        </td>
                        <td className="px-6 py-3 font-medium text-slate-800">{row.range}</td>
                        <td className="px-6 py-3 font-mono font-bold text-slate-700">{row.gpa}</td>
                        <td className="px-6 py-3">
                          <span className="font-medium text-slate-600">{row.remarks}</span>
                        </td>
                      </tr>
                    ))}
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

export default StudentExams;
