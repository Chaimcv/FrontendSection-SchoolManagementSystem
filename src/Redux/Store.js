import { configureStore } from "@reduxjs/toolkit";
import TeacherReducer from "./Slices/TeacherSlice";    //whole TeacherSlice will be imported irrespective of name(Teacherreducer)
import StudentSlice from "./Slices/StudentSlice"; 
import ParentSlice from "./Slices/ParentSlice";
import AnnouncementSlice from "./Slices/AnnouncementSlice";
import PostSlice from "./Slices/PostSlice";
import attendanceReducer from "./Slices/AttendenceSlice";
const store=configureStore({
    reducer:{
        teacher:TeacherReducer,
        student:StudentSlice,
        parent:ParentSlice,
        announcement:AnnouncementSlice,
        post:PostSlice,
       attendance: attendanceReducer,
    }
});
export default store;