import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const baseUrl = process.env.REACT_APP_API_SCHOOL;

const initialState={
    PostData:[],
    error:null,
    message:null,
}
const PostSlice=createSlice({
    name:"Posts",
    initialState,
    reducers:{
        setError:(state,action)=>{
            state.error=action.payload;
        },
        setPostData:(state,action)=>{
            state.PostData=action.payload;
        },
        setMessage:(state,action)=>{
            state.message=action.payload;
        }
       
    }
});
 export const fetchAllPost=()=>async(dispatch)=>{
    try{
        const response=await axios.get(`${baseUrl}/post`);
        console.log(response.data,"response at post slice");
        if(response.data){
            const{data,message}=response.data;  //??????check response or response.data
            dispatch(setPostData(data));
            dispatch(setMessage(message));
        }

    }catch(error){
        dispatch(setError(error))
    }
 }
 export const addNewPost=(formdata)=>async(dispatch)=>{
  try{
    const response=await axios.post(`${baseUrl}/post/create`,formdata);
  }catch(error){
    dispatch(setError(error));
  }
 }
 export const{setError,setPostData,setMessage}=PostSlice.actions;
 export default PostSlice.reducer;