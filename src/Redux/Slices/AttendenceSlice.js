
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_SCHOOL || "http://localhost:8000";

const ATTENDANCE_URL = `${API_URL}/api/attendance`;

// Attach the existing JWT token to attendance requests.
const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Convert API errors into readable Redux errors.
const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong.";

// 1. ADMIN: Fetch all attendance records.
export const fetchAllAttendance = createAsyncThunk(
  "attendance/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/all`,
        {
          ...getAuthConfig(),
          params: filters,
        }
      );

      return response.data.records || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 2. TEACHER: Fetch attendance for a class and date.
export const fetchClassAttendance = createAsyncThunk(
  "attendance/fetchClass",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        ATTENDANCE_URL,
        {
          ...getAuthConfig(),
          params: filters,
        }
      );

      return {
        date: response.data.date,
        standard: response.data.standard,
        division: response.data.division,
        students: response.data.students || [],
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 3. TEACHER: Save or update attendance.
export const saveClassAttendance = createAsyncThunk(
  "attendance/saveClass",
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${ATTENDANCE_URL}/bulk`,
        attendanceData,
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 4. TEACHER: Delete a register for a class and date.
export const deleteClassAttendance = createAsyncThunk(
  "attendance/deleteClass",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${ATTENDANCE_URL}/register`,
        {
          ...getAuthConfig(),
          params: filters,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 5. STUDENT: Fetch attendance belonging to the logged-in student.
export const fetchMyAttendance = createAsyncThunk(
  "attendance/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/my`,
        getAuthConfig()
      );

      return response.data.records || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 6. PARENT: Fetch attendance belonging to the linked student.
export const fetchChildAttendance = createAsyncThunk(
  "attendance/fetchChild",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/child`,
        getAuthConfig()
      );

      return response.data.records || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 7. TEACHER: Fetch classes assigned to the logged-in teacher.
export const fetchMyAssignedClasses = createAsyncThunk(
  "attendance/fetchAssignedClasses",
  async (teacherId, { rejectWithValue }) => {
    try {
      const id = teacherId || localStorage.getItem("id");
      const response = await axios.get(
        `${ATTENDANCE_URL}/my-classes`,
        {
          ...getAuthConfig(),
          params: id ? { teacherId: id } : {},
        }
      );

      return response.data.classes || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 8. Fetch a monthly attendance report.
export const fetchAttendanceReport = createAsyncThunk(
  "attendance/fetchReport",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/report`,
        {
          ...getAuthConfig(),
          params: filters,
        }
      );

      return response.data.report || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 9. ADMIN: Fetch all classes in school with assigned teachers.
export const fetchAllSchoolClasses = createAsyncThunk(
  "attendance/fetchAllClasses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/classes`,
        getAuthConfig()
      );

      return response.data.classes || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 10. Fetch assigned class teacher for standard and division.
export const fetchClassTeacher = createAsyncThunk(
  "attendance/fetchClassTeacher",
  async ({ standard, division }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_URL}/class-teacher`,
        {
          ...getAuthConfig(),
          params: { standard, division },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  allRecords: [],
  classRecords: [],
  myRecords: [],
  childRecords: [],
  assignedClasses: [],
  monthlyReport: [],

  selectedClass: null,
  currentClassTeacher: null,

  loading: false,
  saving: false,
  deleting: false,

  error: null,
  successMessage: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,

  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },

    clearAttendanceMessage: (state) => {
      state.successMessage = null;
    },

    clearSelectedClass: (state) => {
      state.classRecords = [];
      state.selectedClass = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ADMIN: Fetch all records
      .addCase(fetchAllAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.allRecords = action.payload;
      })
      .addCase(fetchAllAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TEACHER: Fetch class register
      .addCase(fetchClassAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.classRecords = action.payload.students;
        state.selectedClass = {
          date: action.payload.date,
          standard: action.payload.standard,
          division: action.payload.division,
        };
      })
      .addCase(fetchClassAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TEACHER: Save attendance
      .addCase(saveClassAttendance.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(saveClassAttendance.fulfilled, (state, action) => {
        state.saving = false;
        state.successMessage =
          action.payload.message || "Attendance saved successfully.";
      })
      .addCase(saveClassAttendance.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // TEACHER: Delete register
      .addCase(deleteClassAttendance.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteClassAttendance.fulfilled, (state, action) => {
        state.deleting = false;
        state.classRecords = [];
        state.successMessage =
          action.payload.message || "Attendance register deleted.";
      })
      .addCase(deleteClassAttendance.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      // STUDENT: Fetch own records
      .addCase(fetchMyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecords = action.payload;
      })
      .addCase(fetchMyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PARENT: Fetch linked student's records
      .addCase(fetchChildAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.childRecords = action.payload;
      })
      .addCase(fetchChildAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // TEACHER: Fetch assigned classes
      .addCase(fetchMyAssignedClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAssignedClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedClasses = action.payload;
      })
      .addCase(fetchMyAssignedClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Monthly report
      .addCase(fetchAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlyReport = action.payload;
        if (Array.isArray(action.payload) && action.payload.length > 0) {
          state.currentClassTeacher = action.payload[0].classTeacherName || null;
        }
      })
      .addCase(fetchAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all school classes
      .addCase(fetchAllSchoolClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSchoolClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedClasses = action.payload;
      })
      .addCase(fetchAllSchoolClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch class teacher
      .addCase(fetchClassTeacher.fulfilled, (state, action) => {
        state.currentClassTeacher = action.payload.classTeacherName || null;
      });
  },
});

export const {
  clearAttendanceError,
  clearAttendanceMessage,
  clearSelectedClass,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;