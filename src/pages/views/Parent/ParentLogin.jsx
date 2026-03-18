import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginParent } from '../../../Redux/Slices/ParentSlice';
import SchoolImage from "../../../assets/SchoolImage.png";

const ParentLogin = () => {
                                                   //  email: 'sonumom@gmail.com',
                                                   //   password: '5XVX1vSI1i'

    const[inputtedEmail,setInputtedEmail]=useState("");
    const[inputtedPassword,setInputtedPassword]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const LoginAsParent=async()=>{
     const result=await dispatch(loginParent({inputtedEmail,inputtedPassword}));

//  console.log(result,"result testing");
//   console.log(result?.data.id,"data");
 const{id,token,name}=result?.data;
//  console.log(id,"login id");
      if (result.success) {
         localStorage.setItem("token",token);
         localStorage.setItem("name",name);
    navigate(`/viewParentProfile/${id}`);  //if success
  } else {
    alert(result.message);          // show error
  }
}
  
//  try {
//  const payload = await dispatch(
//    loginParent({inputtedEmail,inputtedPassword})
//  ).unwrap();                                                      //edit this

//  localStorage.setItem("token", payload.token);

//  navigate(`/viewParentProfile/${payload.id}`);

// } catch(error) {

//  alert(error.message || "Login failed");
// }
// }



    
    const BackToLogin=()=>{
   navigate("/login");
    }
  return (
     <div className='flex rounded-lg h-80 w-[90%] m-2'>
      <div className='w-[40%] ml-20'>
         <img src={SchoolImage} alt='imageOf' className='h-[100%] w-[100%] ml-52 ' />
                     </div>
         
            <div className=' bg-amber-400  p-1 w-[30%] space-y-5'>
              <h2>PARENT LOGIN</h2>
               <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginAsParent}>LOGIN</button><br />
            <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={BackToLogin}>BACK</button>
        </div>
    </div>
  )
}

export default ParentLogin