import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl=process.env.REACT_APP_API_SCHOOL

const initialState={
    errors:null,
    parentData:[],
    message:null,
    oneParentDetailsData:null

}
const ParentSlice=createSlice({
    name:"Parents",
    initialState,
    reducers:{
           setError:(state,action)=>{
              state.errors=action.payload;
            },
         
            setParentData:(state,action)=>{
                state.parentData=action.payload;
            },
            setMessage:(state,action)=>{
                state.message=action.payload;
            },
            setOneParentData:(state,action)=>{
                state.oneParentDetailsData=action.payload;
            },
            setAddNewParentToDb:(state,action)=>{
                state.addNewParentToDb=action.payload;
            },
            setPostEditedParentData:(state,action)=>{
                state.postEditedParentDetails=action.payload;
            },
            setDeleteParent:(state,action)=>{
                state.deleteparent=action.payload;
            },
            setParentLogin:(state,action)=>{
                state.loginParent=action.payload;
            }
         
    }
});
  
//Fetch all  parents
 export const fetchParentsData=()=>async(dispatch)=>{                   
        try{
           const response=await axios.get(`${baseUrl}/parent`)
           console.log(response.data,"response checked  at parentSlice");
           
             if(response.data)
               {
                const {data,message}=response.data;
                  dispatch(setParentData(data));
                  dispatch(setMessage(message));
                 }
           
        }catch(error){
            dispatch(setError(error));
        }
    }

    //fetch one parent
    export const fetchOneParentDetails=(id)=>async(dispatch)=>{
        try {
            console.log(id,"id");
              const response=await axios.get(`${baseUrl}/parent/${id}`)
              
             if(response.data)
               {
               
                  dispatch(setOneParentData(response.data.data));
    
                 }
           
        } catch (error) {
            dispatch(setError(error));  
        }
    }
    //add new parent  
    export const addNewParentToDb=(formData)=>async(dispatch)=>{
        try {
             const response=await axios.post(`${baseUrl}/parent`,formData)
            
        } catch (error) {
             dispatch(setError(error));   
        }
    }

    //edited parent posted
    export const postEditedParentDetails=({id,formData})=>async(dispatch)=>{
        try {
            console.log(id,"edit id in parentslice");
            const response=await axios.put(`${baseUrl}/parent/${id}`,formData)
            if(response.data)
               {
               
                  dispatch(setPostEditedParentData(response.data));
    
                 }
        } catch (error) {
           dispatch(setError(error));     
        }
    }

    //delete 
    export const deleteAParent=(deleteId)=>async(dispatch)=>{
         console.log(deleteId,"deletion id");
    try {
      const response=await axios.delete(`${baseUrl}/parent/${deleteId}`) 
      console.log(response,"response checking");
     
      if(response.data)
               {
               
                  dispatch(setDeleteParent(response.data));
    
                 }
    } catch (error) {
         dispatch(setError(error)); 
    }
    };
 //login
 export const loginParent=({inputtedEmail,inputtedPassword})=>async(dispatch)=>{
  console.log(inputtedEmail,"inputted email");
  try {
   
    const response=await axios.post(`${baseUrl}/parent/login`,{inputtedEmail,inputtedPassword}) 
    console.log(response," login response");
      console.log(response?.data,"response in parent slice");
    if (response.data.message === "Login successful") {
     
        dispatch(setParentLogin(response.data.data));

        return {
          success: true,
          message: "Login Successful",
          data:response.data
         
        };
    }
  } catch (error) {
     dispatch(setError(error)); 
  }
 }
 export const{setError,setParentData,setMessage,setOneParentData,setAddNewParentToDb,setPostEditedParentData,setDeleteParent,setParentLogin}=ParentSlice.actions;
export default ParentSlice.reducer;