import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginParent } from '../../../Redux/Slices/ParentSlice';
import SchoolImage from "../../../assets/SchoolImage.png";

const ParentLogin = () => {
                                                   //  email: 'sonumom@gmail.com',
                                                   //   password: '5XVX1vSI1i'
                //email: 'ch@gmail.com',
               // password: 'OiwD1XKm5k'
  //              name: 'Fmother',
  // student_name: 'Fmmmm',
  // email: 'fm@gmail.com',
  // password: '8IGLRKyPhx'
    const[inputtedEmail,setInputtedEmail]=useState("");
    const[inputtedPassword,setInputtedPassword]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const LoginAsParent=async()=>{
     const result=await dispatch(loginParent({inputtedEmail,inputtedPassword}));

 console.log(result,"result testing");
  console.log(result?.data.id,"data");
 const{token,name}=result?.data;
  const{id}=result?.data;
//  console.log(id,"login id");
      if (result.success) {
         localStorage.setItem("token",token);
         localStorage.setItem("name",name);
    navigate(`/parentDashboard/${id}`);  //if success
     window.location.reload();
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
    <>
    {/* large screen */}
    <div className='hidden lg:flex'>
     <div className='flex rounded-lg  w-[90%] m-2 h-screen'>
      <div className='w-[40%] ml-20'>
         <img src={SchoolImage} alt='imageOf' className='h-[100%] w-[100%] ml-52 ' />
                     </div>
         
            <div className=' bg-amber-400  p-1 w-[30%] space-y-5'>
              <h2>PARENT LOGIN</h2>
              <br />
               <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
               <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
               <br />
               <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={LoginAsParent}>LOGIN</button><br />
               <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={BackToLogin}>BACK</button>
           </div>
      </div>
    </div>
    {/* small screen */}
    <div>
        <div className='flex rounded-lg  w-screen m-2 h-screen'>
         
            <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit mx-[3%] rounded-md'>
               <h1>PARENT LOGIN</h1>
                 <br />
               <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text'value={inputtedEmail} onChange={(e)=>setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br/> 
               <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e)=>setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
                 <br />
               <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={LoginAsParent}>LOGIN</button><br />
               <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg" onClick={BackToLogin}>BACK</button>
           </div>
        </div>
    </div>
    </>
  )
}

export default ParentLogin