import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const rawApiUrl = process.env.REACT_APP_API_SCHOOL || "http://localhost:8000";
const API_URL = rawApiUrl.trim().replace(/\/+$/, "");
const EXAM_URL = `${API_URL}/api/exams`;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "An unexpected error occurred.";

// 1. Create a new exam timetable
export const createExamTimetable = createAsyncThunk(
  "exam/createExamTimetable",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("POSTing exam timetable to:", EXAM_URL, payload);
      const response = await axios.post(EXAM_URL, payload, getAuthConfig());
      console.log("POST exam response:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST exam error:", error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 2. Fetch all timetables created by a teacher
export const fetchTeacherExams = createAsyncThunk(
  "exam/fetchTeacherExams",
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${EXAM_URL}/teacher/${teacherId}`, getAuthConfig());
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 3. Fetch timetables for a specific class
export const fetchClassExams = createAsyncThunk(
  "exam/fetchClassExams",
  async ({ standard, division }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${EXAM_URL}/class/${standard}/${division}`, getAuthConfig());
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 4. Update an existing exam timetable
export const updateExamTimetable = createAsyncThunk(
  "exam/updateExamTimetable",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${EXAM_URL}/${id}`, data, getAuthConfig());
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// 5. Delete an exam timetable
export const deleteExamTimetable = createAsyncThunk(
  "exam/deleteExamTimetable",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${EXAM_URL}/${id}`, getAuthConfig());
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const examSlice = createSlice({
  name: "exam",
  initialState: {
    teacherExams: [],
    classExams: [],
    loading: false,
    deleting: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearExamError: (state) => {
      state.error = null;
    },
    clearExamSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Timetable
      .addCase(createExamTimetable.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createExamTimetable.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload?.message || "Exam timetable created successfully!";
        if (action.payload?.data) {
          state.teacherExams.unshift(action.payload.data);
        }
      })
      .addCase(createExamTimetable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Teacher Exams
      .addCase(fetchTeacherExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherExams.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherExams = action.payload;
      })
      .addCase(fetchTeacherExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Class Exams
      .addCase(fetchClassExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassExams.fulfilled, (state, action) => {
        state.loading = false;
        state.classExams = action.payload;
      })
      .addCase(fetchClassExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Timetable
      .addCase(deleteExamTimetable.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteExamTimetable.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = "Exam timetable deleted successfully!";
        state.teacherExams = state.teacherExams.filter(
          (item) => item._id !== action.payload.id
        );
      })
      .addCase(deleteExamTimetable.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { clearExamError, clearExamSuccess } = examSlice.actions;
export default examSlice.reducer;

