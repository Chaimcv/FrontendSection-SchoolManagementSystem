import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_SCHOOL;

const initialState = {
  errors: null,
  AnnouncementData: [],
  message: null,
};

const AnnouncementSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errors = action.payload;
    },
    setAnnouncementData: (state, action) => {
      state.AnnouncementData = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setDeleteNotice: (state, action) => {
      state.AnnouncementData = state.AnnouncementData.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const fetchNoticeData = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/announcements`);
    if (response.data) {
      const { data, message } = response.data;
      dispatch(setAnnouncementData(data));
      dispatch(setMessage(message));
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const addNotice = (formData) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/announcements`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

export const deleteNotice = (deleteId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${baseUrl}/announcements/${deleteId}`);
    if (response.data) {
      dispatch(setDeleteNotice(deleteId));
      dispatch(setMessage(response.data.message));
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const { setError, setAnnouncementData, setMessage, setDeleteNotice } =
  AnnouncementSlice.actions;
export default AnnouncementSlice.reducer;