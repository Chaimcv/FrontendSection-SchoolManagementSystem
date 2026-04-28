import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = process.env.REACT_APP_API_SCHOOL

const initialState = {
    errors: null,
    studentData: [],
    message: null,
    oneStudent: null

}
const StudentSlice = createSlice({
    name: "Students",
    initialState,
    reducers: {
        setError: (state, action) => {
            state.errors = action.payload;
        },

        setStudentData: (state, action) => {
            state.studentData = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setOneStudentData: (state, action) => {
            state.oneStudentDetailsData = action.payload;
        },
        setAddNewStudentToDb: (state, action) => {
            state.addNewStudentToDb = action.payload;
        },
        setPostEditedStudentData: (state, action) => {
            state.postEditedStudentDetails = action.payload;
        },
        setDeleteStudent: (state, action) => {
            state.deleteStudent = action.payload;
        },
        setLoginStudent: (state, action) => {
            state.loginAsStudent = action.payload;
        }

    }
});

//manipulations
//Fetch all students
export const fetchStudentsData = () => async (dispatch) => {                    //name by whichwe access this function in pages
    try {
        const response = await axios.get(`${baseUrl}/student`)
        console.log(response.data, "response checked  at studentSlice");

        if (response.data) {
            const { data, message } = response.data;
            dispatch(setStudentData(data));
            dispatch(setMessage(message));
        }

    } catch (error) {
        dispatch(setError(error));
    }
}

//fetch one student
export const fetchOneStudentDetails = (id) => async (dispatch) => {
    try {
        console.log(id, "id");
        const response = await axios.get(`${baseUrl}/student/${id}`)

        if (response.data) {

            dispatch(setOneStudentData(response.data.data));

        }

    } catch (error) {
        dispatch(setError(error));
    }
}
//add new student  
export const addNewStudentToDb = (formData) => async (dispatch) => {
    try {
        const response = await axios.post(`${baseUrl}/student`, formData)

    } catch (error) {
        dispatch(setError(error));
    }
}

//edited student posted
export const postEditedStudentDetails = ({ id, formData }) => async (dispatch) => {
    try {
        console.log(id, "edit id in teacherslice");
        const response = await axios.put(`${baseUrl}/student/${id}`, formData)
        if (response.data) {

            dispatch(setPostEditedStudentData(response.data));

        }
    } catch (error) {
        dispatch(setError(error));
    }
}

//delete a student
export const deleteAStudent = (deleteId) => async (dispatch) => {
    console.log(deleteId, "deletion id");
    try {
        const response = await axios.delete(`${baseUrl}/student/${deleteId}`)
        console.log(response, "response checking");

        if (response.data) {

            dispatch(setDeleteStudent(response.data));

        }
    } catch (error) {
        dispatch(setError(error));
    }
}

//login
export const LoginStudent = ({ inputtedEmail, inputtedPassword }) => async (dispatch) => {
    console.log(inputtedEmail, "inputted email in student slice");
    try {

        const response = await axios.post(`${baseUrl}/student/login`, { inputtedEmail, inputtedPassword })
        console.log(response, " login response");
        console.log(response?.data, "response in parent slice");
        if (response.data.message === "Login successful") {

            dispatch(setLoginStudent(response.data));

            return {
                success: true,
                message: "Login successful",
                data: response.data

            };
        }
    } catch (error) {
        dispatch(setError(error));
    }
}




export const { setError, setStudentData, setMessage, setOneStudentData, setAddNewStudentToDb, setPostEditedStudentData, setDeleteStudent, setLoginStudent } = StudentSlice.actions;
export default StudentSlice.reducer;