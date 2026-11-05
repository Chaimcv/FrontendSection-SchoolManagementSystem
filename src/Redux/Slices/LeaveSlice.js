import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_SCHOOL || "http://127.0.0.1:8000";

const initialState = {
  parentLeaves: [],
  teacherLeaves: [],
  loading: false,
  error: null,
  message: null
};

const LeaveSlice = createSlice({
  name: "Leave",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setParentLeaves: (state, action) => {
      state.parentLeaves = action.payload;
    },
    setTeacherLeaves: (state, action) => {
      state.teacherLeaves = action.payload;
    },
    addParentLeave: (state, action) => {
      state.parentLeaves.unshift(action.payload);
    },
    updateLeaveInLists: (state, action) => {
      const updated = action.payload;
      state.parentLeaves = state.parentLeaves.map((l) =>
        l._id === updated._id ? { ...l, ...updated } : l
      );
      state.teacherLeaves = state.teacherLeaves.map((l) =>
        l._id === updated._id ? { ...l, ...updated } : l
      );
    },
    removeParentLeave: (state, action) => {
      state.parentLeaves = state.parentLeaves.filter((l) => l._id !== action.payload);
    }
  }
});

export const {
  setLoading,
  setError,
  setMessage,
  setParentLeaves,
  setTeacherLeaves,
  addParentLeave,
  updateLeaveInLists,
  removeParentLeave
} = LeaveSlice.actions;

// 1. Submit Leave Application (Parent)
export const applyLeave = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const res = await axios.post(`${baseUrl}/api/leaves/apply`, payload);
    if (res.data && res.data.data) {
      dispatch(addParentLeave(res.data.data));
      dispatch(setMessage(res.data.message));
      dispatch(setLoading(false));
      return { success: true, data: res.data.data };
    }
    dispatch(setLoading(false));
    return { success: false, error: res.data?.message || "Failed to submit leave application" };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(setError(errorMsg));
    dispatch(setLoading(false));
    return { success: false, error: errorMsg };
  }
};

// 2. Fetch Parent Leave Applications
export const fetchParentLeaves = (parentId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${baseUrl}/api/leaves/parent/${parentId}`);
    if (res.data && res.data.data) {
      dispatch(setParentLeaves(res.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 3. Fetch Teacher Leave Applications
export const fetchTeacherLeaves = (teacherId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${baseUrl}/api/leaves/teacher/${teacherId}`);
    if (res.data && res.data.data) {
      dispatch(setTeacherLeaves(res.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 4. Update Leave Status (Accept or Reject with Reason)
export const updateLeaveStatus = ({ leaveId, status, rejectionReason }) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const res = await axios.patch(`${baseUrl}/api/leaves/${leaveId}/status`, {
      status,
      rejectionReason
    });
    if (res.data && res.data.data) {
      dispatch(updateLeaveInLists(res.data.data));
      dispatch(setMessage(res.data.message));
      dispatch(setLoading(false));
      return { success: true, data: res.data.data };
    }
    dispatch(setLoading(false));
    return { success: false, error: res.data?.message || "Failed to update leave status" };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(setError(errorMsg));
    dispatch(setLoading(false));
    return { success: false, error: errorMsg };
  }
};

// 5. Delete / Cancel Leave Application
export const deleteLeave = (leaveId) => async (dispatch) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/leaves/${leaveId}`);
    dispatch(removeParentLeave(leaveId));
    dispatch(setMessage(res.data?.message || "Leave application cancelled"));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

export default LeaveSlice.reducer;

