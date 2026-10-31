import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchParentsData, deleteAParent } from "../../../Redux/Slices/ParentSlice";

const ParentsList = () => {
  const { loggedteacherId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rawParents = useSelector((state) => state.parent.parentData);
  const allParents = useMemo(
    () => (Array.isArray(rawParents) ? rawParents : []),
    [rawParents]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    dispatch(fetchParentsData());
  }, [dispatch]);

  // Handle Parent Deletion
  const handleDelete = async (parentIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this guardian record?")) {
      await dispatch(deleteAParent(parentIdToDelete));
      dispatch(fetchParentsData());
    }
  };

  // Filter Parents by Search Query
  const filteredParents = useMemo(() => {
    const list = Array.isArray(allParents) ? allParents : [];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((p) => {
      return (
        (p?.Name && p.Name.toLowerCase().includes(q)) ||
        (p?.email && p.email.toLowerCase().includes(q)) ||
        (p?.Student_name && p.Student_name.toLowerCase().includes(q)) ||
        (p?.student_id && String(p.student_id).toLowerCase().includes(q)) ||
        (p?.phonenumber && String(p.phonenumber).toLowerCase().includes(q)) ||
        (p?.address && p.address.toLowerCase().includes(q))
      );
    });
  }, [allParents, searchQuery]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                Parent Directory
              </h1>

            </div>

          </div>

          <div className="flex items-center gap-3">
            {loggedteacherId && (
              <button
                onClick={() => navigate(`/addingParent/${loggedteacherId}`)}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span className="text-base leading-none">+</span> Add Parent
              </button>
            )}
          </div>
        </div>

        {/* Search & Counter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by guardian name, email, student, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm bg-stone-50/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>


        </div>

        {/* Parent Directory Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-amber-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-amber-100/70 text-xs font-bold uppercase tracking-wider text-amber-900 border-b border-amber-200">
                <tr>
                  <th className="py-3.5 px-4">Guardian Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Linked Student</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-100 text-stone-700">
                {filteredParents.length > 0 ? (
                  filteredParents.map((item) => (
                    <tr key={item._id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {item?.Name ? item.Name.charAt(0).toUpperCase() : "P"}
                          </div>
                          <span className="font-bold text-stone-900">{item?.Name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-600 font-medium">
                        {item?.email || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-stone-900">
                        {item?.Student_name || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-stone-600">
                        {item?.student_id || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-stone-800">
                        {item?.phonenumber || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-600 max-w-xs truncate">
                        {item?.address ? `${item.address}${item.pincode ? ` - ${item.pincode}` : ""}` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedParent(item)}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-2xs"
                            title="View guardian details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(item?._id)}
                            className="text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-2xs"
                            title="Delete guardian record"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 px-4 text-center text-stone-400">
                      <div className="text-3xl mb-2">🔍</div>
                      <p className="text-sm font-semibold text-stone-600">No guardian records found</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {searchQuery
                          ? `No records matching "${searchQuery}". Try a different keyword.`
                          : "No parents registered in the database yet."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PARENT DETAILS MODAL (Shows full details on clicking View)                 */}
      {/* ========================================================================= */}
      {selectedParent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedParent(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl">

                </div>
                <div>
                  <h3 className="text-lg font-bold">Guardian Details</h3>

                </div>
              </div>
              <button
                onClick={() => setSelectedParent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Profile Card Banner */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <div className="w-14 h-14 rounded-2xl bg-amber-200 text-amber-900 font-extrabold text-xl flex items-center justify-center shadow-xs shrink-0">
                  {selectedParent.Name ? selectedParent.Name.charAt(0).toUpperCase() : "P"}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xl font-extrabold text-amber-950 truncate">
                    {selectedParent.Name || "Unnamed Guardian"}
                  </h4>
                  <p className="text-xs text-amber-800 font-medium">
                    Parent / Guardian of{" "}
                    <strong className="text-amber-950 font-bold">
                      {selectedParent.Student_name || "Assigned Student"}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Guardian Name */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Guardian Name
                  </span>
                  <span className="text-stone-900 font-semibold mt-0.5 block">
                    {selectedParent.Name || "—"}
                  </span>
                </div>

                {/* Email Address */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Email Address
                  </span>
                  <span className="text-stone-900 font-semibold mt-0.5 block break-all">
                    {selectedParent.email || "Not Provided"}
                  </span>
                </div>

                {/* Phone Number */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Phone Number
                  </span>
                  <span className="text-stone-900 font-semibold mt-0.5 block">
                    {selectedParent.phonenumber ? (
                      <a
                        href={`tel:${selectedParent.phonenumber}`}
                        className="text-amber-700 hover:underline"
                      >
                        {selectedParent.phonenumber}
                      </a>
                    ) : (
                      "Not Provided"
                    )}
                  </span>
                </div>

                {/* Linked Student */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Linked Student
                  </span>
                  <span className="text-stone-900 font-semibold mt-0.5 block">
                    🎓 {selectedParent.Student_name || "—"}
                  </span>
                </div>

                {/* Student ID */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Student ID
                  </span>
                  <span className="text-stone-900 font-mono font-bold mt-0.5 block">
                    {selectedParent.student_id || "—"}
                  </span>
                </div>

                {/* Pincode */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Postal Pincode
                  </span>
                  <span className="text-stone-900 font-semibold mt-0.5 block">
                    {selectedParent.pincode || "—"}
                  </span>
                </div>

                {/* Residential Address */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Residential Address
                  </span>
                  <span className="text-stone-900 font-medium mt-0.5 block">
                    {selectedParent.address || "No residential address on file"}
                  </span>
                </div>


              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => navigate(`/viewParentProfile/${selectedParent._id}`)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Open Profile Page →
              </button>

              <button
                onClick={() => setSelectedParent(null)}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentsList;
