import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AddTeacherForm from "../components/AddTeacherForm";
import { fetchTeachersData } from "../Redux/Slices/TeacherSlice";
import { useDispatch, useSelector } from "react-redux";

const TeachersDashboard = () => {
  const SchoolUrl = process.env.REACT_APP_API_SCHOOL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teachers = useSelector((state) => state.teacher.teacherData) || [];
  const [formVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchTeachersData());
  }, [dispatch]);

  const viewTeacherDetails = (teacherId) => {
    navigate(`/teacher/details/${teacherId}`);
  };

  const deleteTeacher = async (deletionId) => {
    if (window.confirm("Are you sure you want to remove this faculty record?")) {
      try {
        await fetch(`${SchoolUrl}/teacher/${deletionId}`, { method: "DELETE" });
        dispatch(fetchTeachersData());
      } catch (err) {
        console.error("Failed to delete teacher", err);
      }
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    const q = searchQuery.toLowerCase().trim();
    return teachers.filter(
      (t) =>
        (t?.name || "").toLowerCase().includes(q) ||
        (t?.subject || "").toLowerCase().includes(q) ||
        String(t?.standard || "").toLowerCase().includes(q)
    );
  }, [teachers, searchQuery]);

  return (
    <div className="relative min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      {formVisible && (
        <AddTeacherForm OnAddTeacherClick={() => setFormVisible(false)} />
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 ${formVisible ? "blur-xs" : ""}`}>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                Faculty & Teacher Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-stone-600">
              Manage school faculty roster, teaching assignments, class teachers, and contact profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white hover:bg-amber-100/70 border border-amber-200 px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={() => setFormVisible(true)}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
            >
              <span className="text-base leading-none">+</span> Add Faculty Member
            </button>
          </div>
        </div>

        {/* Search & Statistics Filter Bar */}
        <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Total Faculty:{" "}
            <span className="text-stone-800 font-extrabold ml-1">{teachers.length} Active Instructors</span>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by teacher name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-xs text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Faculty Roster Data Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-amber-100/70 text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center"> </th>
                  <th className="py-3.5 px-4">Instructor Name</th>
                  <th className="py-3.5 px-4">Class In-Charge</th>
                  <th className="py-3.5 px-4">Division</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-100">
                {filteredTeachers.map((item, index) => (
                  <tr key={item._id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-center text-xs font-medium text-stone-400">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                          {(item?.name || "T").charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{item?.name}</div>
                          <div className="text-[11px] text-stone-400">{item?.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-stone-700">
                      {item?.standard ? `Standard ${item.standard}` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-stone-700">
                      {item?.division}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-stone-700">
                      {item?.subject}
                    </td>

                    {/* <td className="py-3.5 px-4 text-xs font-medium text-amber-900">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                        {item?.subject || "General"}
                      </span>
                    </td> */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => viewTeacherDetails(item?._id)}
                          className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs transition-all hover:scale-105"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => deleteTeacher(item?._id)}
                          className="text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-stone-500">
                      {searchQuery
                        ? `No faculty members found matching "${searchQuery}".`
                        : "No teachers currently registered in the system."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersDashboard;
