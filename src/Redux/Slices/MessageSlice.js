import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_SCHOOL || "http://127.0.0.1:8000";

const initialState = {
  teacherMessages: [],
  teacherInbox: [],
  studentMessages: [],
  parentMessages: [],
  assignedTeacherData: null,
  loading: false,
  error: null,
  message: null
};

const MessageSlice = createSlice({
  name: "Message",
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
    setTeacherMessages: (state, action) => {
      state.teacherMessages = action.payload;
    },
    setTeacherInbox: (state, action) => {
      state.teacherInbox = action.payload;
    },
    setStudentMessages: (state, action) => {
      state.studentMessages = action.payload;
    },
    setParentMessages: (state, action) => {
      state.parentMessages = action.payload;
    },
    setAssignedTeacherData: (state, action) => {
      state.assignedTeacherData = action.payload;
    },
    addTeacherMessage: (state, action) => {
      state.teacherMessages.unshift(action.payload);
    },
    addStudentMessage: (state, action) => {
      state.studentMessages.unshift(action.payload);
    },
    addParentMessage: (state, action) => {
      state.parentMessages.unshift(action.payload);
    },
    removeTeacherMessage: (state, action) => {
      state.teacherMessages = state.teacherMessages.filter(
        (m) => m._id !== action.payload
      );
      state.teacherInbox = state.teacherInbox.filter(
        (m) => m._id !== action.payload
      );
    }
  }
});

export const {
  setLoading,
  setError,
  setMessage,
  setTeacherMessages,
  setTeacherInbox,
  setStudentMessages,
  setParentMessages,
  setAssignedTeacherData,
  addTeacherMessage,
  addStudentMessage,
  addParentMessage,
  removeTeacherMessage
} = MessageSlice.actions;

// 1. Send Message by Teacher
export const sendMessage = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const response = await axios.post(`${baseUrl}/api/messages/send`, payload);
    if (response.data && response.data.data) {
      dispatch(addTeacherMessage(response.data.data));
      dispatch(setMessage(response.data.message));
      dispatch(setLoading(false));
      return { success: true, data: response.data.data };
    }
    dispatch(setLoading(false));
    return { success: false, error: response.data?.message || "Failed to send message" };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(setError(errorMsg));
    dispatch(setLoading(false));
    return { success: false, error: errorMsg };
  }
};

// 2. Send Message to Teacher (from Student or Parent)
export const sendMessageToTeacher = (payload) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const response = await axios.post(`${baseUrl}/api/messages/send-to-teacher`, payload);
    if (response.data && response.data.data) {
      if (payload.senderRole === "Student") {
        dispatch(addStudentMessage(response.data.data));
      } else if (payload.senderRole === "Parent") {
        dispatch(addParentMessage(response.data.data));
      }
      dispatch(setMessage(response.data.message));
      dispatch(setLoading(false));
      return { success: true, data: response.data.data };
    }
    dispatch(setLoading(false));
    return { success: false, error: response.data?.message || "Failed to send message to teacher" };
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    dispatch(setError(errorMsg));
    dispatch(setLoading(false));
    return { success: false, error: errorMsg };
  }
};

// 3. Resolve Assigned Teacher for Student
export const fetchAssignedTeacherForStudent = (studentId) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/api/messages/assigned-teacher/student/${studentId}`);
    if (response.data && response.data.data) {
      dispatch(setAssignedTeacherData(response.data.data));
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching assigned teacher for student:", error);
  }
};

// 4. Resolve Assigned Teacher for Parent
export const fetchAssignedTeacherForParent = (parentId) => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/api/messages/assigned-teacher/parent/${parentId}`);
    if (response.data && response.data.data) {
      dispatch(setAssignedTeacherData(response.data.data));
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching assigned teacher for parent:", error);
  }
};

// 5. Fetch Messages sent by Teacher (Outbox)
export const fetchTeacherMessages = (teacherId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${baseUrl}/api/messages/teacher/${teacherId}`);
    if (response.data && response.data.data) {
      dispatch(setTeacherMessages(response.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 6. Fetch Incoming Messages to Teacher (Inbox from Students & Parents)
export const fetchTeacherInbox = (teacherId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${baseUrl}/api/messages/teacher-inbox/${teacherId}`);
    if (response.data && response.data.data) {
      dispatch(setTeacherInbox(response.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 7. Fetch Messages received & sent by Student
export const fetchStudentMessages = (studentId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${baseUrl}/api/messages/student/${studentId}`);
    if (response.data && response.data.data) {
      dispatch(setStudentMessages(response.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 8. Fetch Messages received & sent by Parent
export const fetchParentMessages = (parentId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(`${baseUrl}/api/messages/parent/${parentId}`);
    if (response.data && response.data.data) {
      dispatch(setParentMessages(response.data.data));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
  }
};

// 9. Delete Message
export const deleteMessage = (messageId) => async (dispatch) => {
  try {
    const response = await axios.delete(`${baseUrl}/api/messages/${messageId}`);
    dispatch(removeTeacherMessage(messageId));
    dispatch(setMessage(response.data?.message || "Message deleted"));
    return { success: true };
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    return { success: false };
  }
};

export default MessageSlice.reducer;
