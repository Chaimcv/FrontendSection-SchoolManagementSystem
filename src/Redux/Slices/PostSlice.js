import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_SCHOOL;

const initialState = {
  PostData: [],
  error: null,
  message: null,
  loading: false
};

const PostSlice = createSlice({
  name: "Posts",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPostData: (state, action) => {
      state.PostData = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    updatePostInState: (state, action) => {
      const index = state.PostData.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.PostData[index] = action.payload;
      }
    },
    removePostFromState: (state, action) => {
      state.PostData = state.PostData.filter(post => post._id !== action.payload);
    },
    addPostToState: (state, action) => {
      state.PostData.unshift(action.payload);
    }
  }
});

export const {
  setLoading,
  setError,
  setPostData,
  setMessage,
  updatePostInState,
  removePostFromState,
  addPostToState
} = PostSlice.actions;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAllPost = () => async (dispatch) => {
  try {
    const response = await axios.get(`${baseUrl}/post`);
    if (response.data && response.data.data) {
      dispatch(setPostData(response.data.data));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const addNewPost = (formdata) => async (dispatch) => {
  try {
    const response = await axios.post(`${baseUrl}/post/create`, formdata, {
      headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
    });
    if (response.data && response.data.data) {
      dispatch(addPostToState(response.data.data));
      dispatch(setMessage(response.data.message));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const updatePost = (id, formdata) => async (dispatch) => {
  try {
    const response = await axios.put(`${baseUrl}/post/${id}`, formdata, {
      headers: { ...getAuthHeader(), "Content-Type": "multipart/form-data" }
    });
    if (response.data && response.data.data) {
      dispatch(updatePostInState(response.data.data));
      dispatch(setMessage(response.data.message));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`${baseUrl}/post/${id}`, {
      headers: getAuthHeader()
    });
    dispatch(removePostFromState(id));
    dispatch(setMessage(response.data.message));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const likePost = (id) => async (dispatch, getState) => {
  try {
    const response = await axios.post(`${baseUrl}/post/${id}/like`, {}, {
      headers: getAuthHeader()
    });
    const currentPosts = getState().post.PostData;
    const updatedPost = currentPosts.find(p => p._id === id);
    if (response.data && response.data.data) {
      dispatch(updatePostInState(response.data.data));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const addComment = (id, text) => async (dispatch, getState) => {
  try {
    const response = await axios.post(`${baseUrl}/post/${id}/comment`, { text }, {
      headers: getAuthHeader()
    });
    if (response.data && response.data.data) {
      dispatch(updatePostInState(response.data.data));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export default PostSlice.reducer;