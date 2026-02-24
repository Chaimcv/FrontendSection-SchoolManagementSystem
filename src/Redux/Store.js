import { configureStore } from "@reduxjs/toolkit";
import TeacherReducer from "./Slices/TeacherSlice";    //whole TeacherSlice will be imported irrespective of name(Teacherreducer)
import StudentSlice from "./Slices/StudentSlice"; 
import ParentSlice from "./Slices/ParentSlice";
const store=configureStore({
    reducer:{
        teacher:TeacherReducer,
        student:StudentSlice,
        parent:ParentSlice
       
    }
});
export default store;