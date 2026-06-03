import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { setDeleteParent } from "./ParentSlice";
 
const baseUrl=process.env.REACT_APP_API_SCHOOL
const initialState={ 
        errors:null,
        teacherData:[],        //for all teachers
        message:null,
        oneTeacherDetailsData:null,
    }
const TeacherSlice=createSlice({
    name:"Teacher",
    initialState,
    reducers:{                      //like setFuction in useState
         setError:(state,action)=>{
              state.errors=action.payload;
         },
         
            setTeacherData:(state,action)=>{
                state.teacherData=action.payload;
            },
            setMessage:(state,action)=>{
                state.message=action.payload;
            },
            setOneTeacherData:(state,action)=>{
                state.oneTeacherDetailsData=action.payload;
            },
            setAddNewTeacherDb:(state,action)=>{
                state.addNewTeacherToDb=action.payload;
            },
            setDeleteParent:(state,action)=>{
                state.deleteParent=action.payload;
            },
            setEditedTeacherData:(state,action)=>{
                state.postEditedTeacherDetails=action.payload;
            },
            setTeacherLogin:(state,action)=>{
                state.loginTeacher=action.payload;
            }
         
    }
 });
 // fetch teachers              
    export const fetchTeachersData=()=>async(dispatch)=>{
        try{
           const response=await axios.get(`${baseUrl}/teacher`)
           console.log(response.data,"response checked for teacher at teacherSlice");
           
             if(response.data)
               {
                const {data,message}=response.data;
                  dispatch(setTeacherData(data));
                  dispatch(setMessage(message));
                 }
           
        }catch(error){
            dispatch(setError(error));
        }
    }
    export const fetchOneTeacherDetails=(id)=>async(dispatch)=>{
        try {
            console.log(id,"id");
              const response=await axios.get(`${baseUrl}/teacher/${id}`)
              
             if(response.data)
               {
               
                  dispatch(setOneTeacherData(response.data.data));
    
                 }
           
        } catch (error) {
            dispatch(setError(error));  
        }
    }
    //add new teacher   not done-------------
    export const addNewTeacherToDb=()=>async(dispatch)=>{
        try {
             const response=await axios.post(`${baseUrl}/teacher`)
            
        } catch (error) {
             dispatch(setError(error));   
        }
    }
    
    //delete a parent
    export const deleteAParent=(deleteId)=>async(dispatch)=>{
        try{
            const response=await axios.delete(`${baseUrl}/teacher/${deleteId}`)
            console.log(response,"response..");
            if(response.data){
                dispatch(setDeleteParent(response.data))
            }
        }
        catch(error){
            dispatch(setError(error));
        }
    }

    //edited teacher posted
    export const postEditedTeacherDetails=({id,formData})=>async(dispatch)=>{
        try {
            console.log(id,"edit id in teacherslice");
            const response=await axios.put(`${baseUrl}/teacher/${id}`,formData)
            if(response.data)
               {
               
                  dispatch(setEditedTeacherData(response.data));
    
                 }
        } catch (error) {
           dispatch(setError(error));     
        }
    }

     //login
     export const loginTeacher=({inputtedEmail,inputtedPassword})=>async(dispatch)=>{
      console.log(inputtedEmail,"inputted email");
      try {
       
        const response=await axios.post(`${baseUrl}/teacher/login`,{email:inputtedEmail,password:inputtedPassword}) 
        console.log(response," login response");
          console.log(response?.data?.data,"response in teacher slice");
        if (response.data.message === "Login Successful") {
         
            dispatch(setTeacherLogin(response.data.data));
    
            return {
              success: true,
              message: "Login Successful",
              data:response?.data?.data
             
            };
            
        }
      } catch (error) {
         dispatch(setError(error)); 
      }
     }

 export const{setError,setTeacherData,setMessage,setOneTeacherData,setAddNewTeacherDb,setEditedTeacherData,setTeacherLogin}=TeacherSlice.actions;
 export default TeacherSlice.reducer;