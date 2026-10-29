import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchParentsData, deleteAParent } from "../../../Redux/Slices/ParentSlice";

const ParentsList = () => {
  const { loggedteacherId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allParents = useSelector((state) => state.parent.parentData) || [];
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchParentsData());
  }, [dispatch]);

  const handleDelete = async (parentIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this guardian record?")) {
      await dispatch(deleteAParent(parentIdToDelete));
      dispatch(fetchParentsData());
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white text-stone-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-amber-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-serif">
                Parent & Guardian Directory
              </h1>
              {/* <div className="flex items-center gap-3 "> */}
              {loggedteacherId && (
                <button
                  onClick={() => navigate(`/addingParent/${loggedteacherId}`)}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <span className="text-base leading-none">+</span> Add Parent
                </button>
              )}
              {/* </div> */}
            </div>

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
                {allParents.map((item, index) => (
                  <tr key={item._id} className="hover:bg-amber-50/40 transition-colors">


                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">

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
                      {item?.address ? `${item.address}-${item.pincode} ` : ""}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(item?._id)}
                        className="text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}


              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentsList;
