import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addNewPost } from '../Redux/Slices/PostSlice';


const AddPostForm = () => {
    const[text,setText]=useState();
    const[image,setImage]=useState();
    const dispatch=useDispatch();
    const handlechange=()=>{
        //dispatch(addNewPost(formdata));
    }
  return (
    <div>AddPostForm
        <div>
        <label>Text<input type='text' onChange={handlechange} value={text}></input></label>
        <label>File Upload<input type='file' onChange={handlechange} value={image} accept='image/*'></input></label>
        <button >Submit</button>
        </div>
    </div>
  )
}

export default AddPostForm