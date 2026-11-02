import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { setDeleteParent } from "./ParentSlice";

const rawUrl = process.env.REACT_APP_API_SCHOOL || "http://localhost:8000";
const baseUrl = rawUrl.trim().replace(/\/+$/, "");

const initialState = {
  errors: null,
  teacherData: [], // for all teachers
  message: null,
  oneTeacherDetailsData: null,
};

const TeacherSlice = createSlice({
  name: "Teacher",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.errors = action.payload;
    },
    setTeacherData: (state, action) => {
      state.teacherData = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setOneTeacherData: (state, action) => {
      state.oneTeacherDetailsData = action.payload;
    },
    setAddNewTeacherDb: (state, action) => {
      state.addNewTeacherToDb = action.payload;
    },
    setDeleteParent: (state, action) => {
      state.deleteParent = action.payload;
    },
    setEditedTeacherData: (state, action) => {
      state.postEditedTeacherDetails = action.payload;
      if (action.payload?.data) {
        state.oneTeacherDetailsData = action.payload.data;
        if (Array.isArray(state.teacherData)) {
          state.teacherData = state.teacherData.map((item) =>
            item._id === action.payload.data._id ? action.payload.data : item
          );
        }
      }
    },
    setTeacherLogin: (state, action) => {
      state.loginTeacher = action.payload;
    },
  },
});

// fetch all teachers
export const fetchTeachersData = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/teacher`);
    if (response.data) {
      const { data, message } = response.data;
      dispatch(setTeacherData(data));
      dispatch(setMessage(message));
    }
  } catch (error) {
    dispatch(setError(error));
  }
};

// fetch one teacher
export const fetchOneTeacherDetails = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/teacher/${id}`);
    if (response.data) {
      dispatch(setOneTeacherData(response.data.data));
    }
  } catch (error) {
    dispatch(setError(error));
  }
};

// add new teacher
export const addNewTeacherToDb = () => async (dispatch) => {
  try {
    await axios.post(`${baseUrl}/teacher`);
  } catch (error) {
    dispatch(setError(error));
  }
};

// delete a teacher
export const deleteAParent = (deleteId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${baseUrl}/teacher/${deleteId}`);
    if (response.data) {
      dispatch(setDeleteParent(response.data));
    }
  } catch (error) {
    dispatch(setError(error));
  }
};

// post edited teacher
export const postEditedTeacherDetails =
  ({ id, formData }) =>
  async (dispatch) => {
    try {
      const response = await axios.put(`${baseUrl}/teacher/${id}`, formData);
      if (response.data) {
        dispatch(setEditedTeacherData(response.data));
        if (response.data.data) {
          dispatch(setOneTeacherData(response.data.data));
        }
      }
      return response.data;
    } catch (error) {
      dispatch(setError(error));
      throw error;
    }
  };

// teacher login
export const loginTeacher =
  ({ inputtedEmail, inputtedPassword }) =>
  async (dispatch) => {
    try {
      const response = await axios.post(`${baseUrl}/teacher/login`, {
        email: inputtedEmail,
        password: inputtedPassword,
      });
      if (response.data.message === "Login Successful") {
        dispatch(setTeacherLogin(response.data.data));
        return {
          success: true,
          message: "Login Successful",
          data: response?.data?.data,
        };
      }
    } catch (error) {
      dispatch(setError(error));
    }
  };

export const {
  setError,
  setTeacherData,
  setMessage,
  setOneTeacherData,
  setAddNewTeacherDb,
  setEditedTeacherData,
  setTeacherLogin,
} = TeacherSlice.actions;

export default TeacherSlice.reducer;
