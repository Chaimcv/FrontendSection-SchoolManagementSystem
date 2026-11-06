import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAStudent, fetchStudentsData } from '../../../Redux/Slices/StudentSlice';
import { fetchOneTeacherDetails } from '../../../Redux/Slices/TeacherSlice';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const StudentListing = () => {
    const { loggedteacherId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux state
    const AllStudents = useSelector((state) => state.student.studentData) || [];
    const teacher = useSelector((state) => state.teacher?.oneTeacherDetailsData);

    // Filter states initialized from URL params if present
    const [selectedClass, setSelectedClass] = useState(
        searchParams.get("standard") || searchParams.get("class") || ""
    );
    const [selectedDivision, setSelectedDivision] = useState(
        searchParams.get("division") || ""
    );
    const [searchQuery, setSearchQuery] = useState(
        searchParams.get("search") || ""
    );

    // Keep URL in sync when filters change
    useEffect(() => {
        const params = {};
        if (selectedClass) params.standard = selectedClass;
        if (selectedDivision) params.division = selectedDivision;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        setSearchParams(params, { replace: true });
    }, [selectedClass, selectedDivision, searchQuery, setSearchParams]);

    useEffect(() => {
        dispatch(fetchStudentsData());
        if (loggedteacherId) {
            dispatch(fetchOneTeacherDetails(loggedteacherId));
        }
    }, [dispatch, loggedteacherId]);

    // Teacher's assigned class metadata
    const teacherAssignedClass = useMemo(() => {
        if (teacher && teacher.standard !== undefined && teacher.standard !== null) {
            return {
                standard: teacher.standard,
                division: teacher.division || null
            };
        }
        return null;
    }, [teacher]);

    // Compute unique available classes
    const availableClasses = useMemo(() => {
        const classesSet = new Set();
        AllStudents.forEach((s) => {
            if (s.Standard !== undefined && s.Standard !== null && s.Standard !== "") {
                const num = Number(s.Standard);
                if (!isNaN(num)) classesSet.add(num);
            }
        });
        if (classesSet.size === 0) {
            for (let i = 1; i <= 10; i++) classesSet.add(i);
        }
        return Array.from(classesSet).sort((a, b) => a - b);
    }, [AllStudents]);

    // Compute unique available divisions
    const availableDivisions = useMemo(() => {
        const divsSet = new Set(["A", "B", "C", "D"]);
        AllStudents.forEach((s) => {
            if (s.Division && typeof s.Division === "string" && s.Division.trim()) {
                divsSet.add(s.Division.trim().toUpperCase());
            }
        });
        return Array.from(divsSet).sort();
    }, [AllStudents]);

    // Filtered students list
    const filteredStudents = useMemo(() => {
        return AllStudents.filter((student) => {
            // 1. Class / Standard filter
            if (selectedClass) {
                if (String(student.Standard || "") !== String(selectedClass)) {
                    return false;
                }
            }
            // 2. Division filter
            if (selectedDivision) {
                const studentDiv = String(student.Division || "").trim().toUpperCase();
                if (studentDiv !== selectedDivision.trim().toUpperCase()) {
                    return false;
                }
            }
            // 3. Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                const nameMatch = String(student.Name || "").toLowerCase().includes(q);
                const guardianMatch = String(student.Guardian || "").toLowerCase().includes(q);
                if (!nameMatch && !guardianMatch) {
                    return false;
                }
            }
            return true;
        });
    }, [AllStudents, selectedClass, selectedDivision, searchQuery]);

    const isFiltered = Boolean(selectedClass || selectedDivision || searchQuery.trim());

    const resetFilters = () => {
        setSelectedClass("");
        setSelectedDivision("");
        setSearchQuery("");
    };

    const viewStudentDetails = (studentIDToView) => {
        navigate(`/viewAStudent/${studentIDToView}`);
    };

    const deleteStudent = async (studentIdToDelete) => {
        await dispatch(deleteAStudent(studentIdToDelete));
        dispatch(fetchStudentsData());
    };

    const AddStudent = () => navigate(`/addNewStudent/${loggedteacherId}`);
    const AddParent = () => navigate(`/addingParent/${loggedteacherId}`);
    const BackToProfile = () => navigate(`/teacher/profile/${loggedteacherId}`);

    return (
        <div className='min-h-screen bg-amber-50/50 pb-20'>
            {/* Header / Actions */}
            <div className='bg-white shadow-sm border-b border-gray-200 py-7 px-6'>
                <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
                    <div className='flex items-center gap-3'>

                        <div>
                            <h1 className='text-3xl font-extrabold text-amber-900 font-serif tracking-tight'>
                                STUDENTS RECORD
                            </h1>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-2.5'>
                        {loggedteacherId && (
                            <button
                                className='bg-amber-700 hover:bg-amber-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95'
                                onClick={() => navigate(`/teacher/messages/${loggedteacherId}`)}
                            >
                                Message Hub
                            </button>
                        )}
                        <button
                            className='bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95'
                            onClick={AddStudent}
                        >
                            Add Student
                        </button>
                        <button
                            className='bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95'
                            onClick={AddParent}
                        >
                            Add Parent
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className='max-w-7xl mx-auto px-6 mt-6'>
                <div className='bg-white rounded-3xl shadow-md border border-amber-200/80 p-6 space-y-4'>
                    <div className='flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3'>
                        <div className='flex items-center gap-2.5'>
                            <div>
                                <h2 className='text-lg font-black text-amber-950 font-serif'>Filter Student Records</h2>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            {isFiltered && (
                                <button
                                    onClick={resetFilters}
                                    className='text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-all flex items-center gap-1 cursor-pointer'
                                >
                                    ✕ Reset Filters
                                </button>
                            )}
                            <span className='text-xs font-black px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl border border-amber-200'>
                                Showing {filteredStudents.length} of {AllStudents.length} Students
                            </span>
                        </div>
                    </div>

                    {/* Filter Controls Grid */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end'>
                        {/* Class / Standard Select */}
                        <div>
                            <label className='text-xs font-bold text-amber-900 block mb-1.5'>
                                Class / Standard
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className='w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-amber-500 transition-all cursor-pointer'
                            >
                                <option value=''>All Classes</option>
                                {availableClasses.map((cls) => (
                                    <option key={cls} value={cls}>
                                        Class {cls}th
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Division Select */}
                        <div>
                            <label className='text-xs font-bold text-amber-900 block mb-1.5'>
                                Division
                            </label>
                            <select
                                value={selectedDivision}
                                onChange={(e) => setSelectedDivision(e.target.value)}
                                className='w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-amber-500 transition-all cursor-pointer'
                            >
                                <option value=''>All Divisions</option>
                                {availableDivisions.map((div) => (
                                    <option key={div} value={div}>
                                        Division {div}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Input */}
                        <div>
                            <label className='text-xs font-bold text-amber-900 block mb-1.5'>
                                Search Student / Guardian
                            </label>
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Type student or guardian name...'
                                className='w-full p-2.5 rounded-xl border border-amber-200 bg-amber-50/20 text-xs font-semibold text-stone-800 focus:outline-hidden focus:border-amber-500 transition-all'
                            />
                        </div>

                        {/* Quick Action: Filter Teacher's Own Class or Clear */}
                        <div>
                            {teacherAssignedClass ? (
                                <button
                                    onClick={() => {
                                        setSelectedClass(String(teacherAssignedClass.standard || ""));
                                        setSelectedDivision(teacherAssignedClass.division || "");
                                    }}
                                    className='w-full py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                                    title='Filter directly to your assigned class'
                                >
                                    <span>
                                        My Class (Std {teacherAssignedClass.standard}
                                        {teacherAssignedClass.division ? `-${teacherAssignedClass.division}` : ""})
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={resetFilters}
                                    disabled={!isFiltered}
                                    className='w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-bold text-xs rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer'
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filter Badges */}
                    {isFiltered && (
                        <div className='flex flex-wrap items-center gap-2 pt-2 border-t border-amber-100/60 text-xs'>
                            <span className='text-stone-400 font-semibold'>Active Filters:</span>
                            {selectedClass && (
                                <span className='px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg flex items-center gap-1.5 border border-amber-200'>
                                    Class: {selectedClass}th
                                    <button
                                        onClick={() => setSelectedClass('')}
                                        className='hover:text-rose-600 font-black cursor-pointer'
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {selectedDivision && (
                                <span className='px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg flex items-center gap-1.5 border border-amber-200'>
                                    Division: {selectedDivision}
                                    <button
                                        onClick={() => setSelectedDivision('')}
                                        className='hover:text-rose-600 font-black cursor-pointer'
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                            {searchQuery.trim() && (
                                <span className='px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-lg flex items-center gap-1.5 border border-amber-200'>
                                    Search: "{searchQuery.trim()}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className='hover:text-rose-600 font-black cursor-pointer'
                                    >
                                        ✕
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area / Students Table */}
            <div className='max-w-7xl mx-auto px-6 mt-6'>
                <div className='bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-amber-100 border-b border-amber-100'>
                            <tr>
                                <th className='py-5 px-6 font-bold text-amber-900'>PHOTO</th>
                                <th className='py-5 px-6 font-bold text-amber-900'>NAME</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>AGE</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>CLASS</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-center'>DIV</th>
                                <th className='py-5 px-6 font-bold text-amber-900'>GUARDIAN</th>
                                <th className='py-5 px-6 font-bold text-amber-900 text-right'>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50'>
                            {filteredStudents.map((item) => (
                                <tr key={item._id} className='hover:bg-amber-50/30 transition-colors group'>
                                    <td className='py-4 px-6'>
                                        <div className='w-12 h-12 rounded-full overflow-hidden bg-amber-100 border-2 border-white shadow-sm'>
                                            {item.ProfileImageUrl ? (
                                                <img src={item.ProfileImageUrl} alt={item.Name} className='w-full h-full object-cover' />
                                            ) : (
                                                <div className='w-full h-full flex items-center justify-center text-amber-400'>
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className='py-4 px-6 font-semibold text-gray-800'>{item.Name}</td>
                                    <td className='py-4 px-6 text-gray-600 text-center'>{item.Age}</td>
                                    <td className='py-4 px-6 text-amber-700 font-medium text-center'>
                                        {item.Standard !== undefined && item.Standard !== null ? `${item.Standard}th` : "-"}
                                    </td>
                                    <td className='py-4 px-6 text-gray-600 text-center font-bold'>
                                        {item.Division || "-"}
                                    </td>
                                    <td className='py-4 px-6 text-gray-600'>{item.Guardian || "-"}</td>
                                    <td className='py-4 px-6 text-right space-x-2'>
                                        {loggedteacherId && (
                                            <button
                                                className='bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg font-bold transition-all text-xs shadow-xs hover:scale-105 active:scale-95'
                                                onClick={() => navigate(`/teacher/messages/${loggedteacherId}?type=Student&studentId=${item._id}`)}
                                                title="Send direct message to this student"
                                            >
                                                Message
                                            </button>
                                        )}
                                        <button
                                            className='bg-amber-100 hover:scale-105 active:scale-95 text-xs text-amber-700 hover:bg-amber-200 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer'
                                            onClick={() => viewStudentDetails(item._id)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className='bg-red-50 text-xs hover:scale-105 active:scale-95 text-red-600 hover:bg-red-100 px-3.5 py-2 rounded-lg font-medium transition-colors cursor-pointer'
                                            onClick={() => deleteStudent(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStudents.length === 0 && (
                        <div className='text-center py-16 bg-gray-50/50 space-y-2'>
                            <span className='text-3xl block'>🔍</span>
                            <p className='text-gray-700 font-bold text-sm'>
                                {AllStudents.length === 0
                                    ? "No student records found."
                                    : "No students match the selected filter criteria."}
                            </p>
                            <p className='text-gray-400 text-xs'>
                                {AllStudents.length === 0
                                    ? "Add a student using the 'Add Student' button above."
                                    : "Try selecting a different class/division or clear your filters."}
                            </p>
                            {isFiltered && (
                                <button
                                    onClick={resetFilters}
                                    className='mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer'
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentListing;
