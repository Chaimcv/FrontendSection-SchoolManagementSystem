import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Announcements from "../../pages/Announcements";

const baseUrl=process.env.REACT_APP_API_SCHOOL

const initialState={
    errors:null,
    AnnouncementData:[],
    message:null,

}
const AnnouncementSlice=createSlice({
    name:"announcements",
    initialState,
    reducers:{
         setError:(state,action)=>{
              state.errors=action.payload;
            },
            setAnnouncementData:(state,action)=>{
                state.AnnouncementData=action.payload;
            },
            setMessage:(state,action)=>{
                state.message=action.payload;
           },
             setAddNotice:(state,action)=>{
                    state.addNotice=action.payload;
           },
           setDeleteNotice:(state,action)=>{
                   state.deleteNotice=action.payload;
          }
        }
});

 export const fetchNoticeData=()=>async(dispatch)=>{                   
        try{
           const response=await axios.get(`${baseUrl}/announcements`)
           console.log(response.data,"response checked");
           
             if(response.data)
               {
                const {data,message}=response.data;
                  dispatch(setAnnouncementData(data));
                  dispatch(setMessage(message));
                 }
           
        }catch(error){
            dispatch(setError(error));
        }
    }

    export const addNotice=(formData)=>async(dispatch)=>{
            try {
                 const response=await axios.post(`${baseUrl}/announcements`,formData)
                
            } catch (error) {
                 dispatch(setError(error));   
            }
        }


     export const deleteNotice=(deleteId)=>async(dispatch)=>{
         console.log(deleteId,"deletion id");
    try {
      const response=await axios.delete(`${baseUrl}/announcements/${deleteId}`) 
      console.log(response,"response checking");
     
      if(response.data)
               {
               
                  dispatch(setDeleteNotice(response.data));
    
                 }
    } catch (error) {
         dispatch(setError(error)); 
    }
    };


    export const{setError,setAnnouncementData,setMessage,setAddNotice,setDeleteNotice}=AnnouncementSlice.actions;
    export default AnnouncementSlice.reducer;