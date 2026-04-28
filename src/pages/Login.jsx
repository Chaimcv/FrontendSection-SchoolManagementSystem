import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachersData } from '../Redux/Slices/TeacherSlice';
import { useNavigate } from 'react-router-dom';
import SchoolImage from "../assets/SchoolImage.png";
import { LoginStudent } from '../Redux/Slices/StudentSlice';

const Login = () => {
  const [inputtedEmail, setInputtedEmail] = useState("");
  const [inputtedPassword, setInputtedPassword] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const LoginFunction = async () => {
    const result = await dispatch(
      LoginStudent({ inputtedEmail, inputtedPassword })
    );
    if (result.success) {
      const token = result.data.token;
      const studentId = result.data.id;
      const name = result.data.name;
      localStorage.setItem("token", token);
      localStorage.setItem("studentId", studentId);
      localStorage.setItem("name", name);
      // console.log(token, "TOKEN");
      // console.log(studentId, "ID");
      // console.log(name, "NAME");

      navigate(`/studentDashboard/${studentId}`);
    }

  }
  const TeacherLoginPage = () => {
    navigate("/teacher/login");
  }
  const PrincipalLoginPage = () => {
    navigate("/admin");
  }
  const ParentLoginPage = () => {
    navigate("/parentLogin");
  }
  return (
    <>
    {/* large screen */}
     <div className='hidden lg:flex '>

    <div className='flex rounded-lg  w-[100%] m-2 h-screen '>
      <div className='w-[50%] ml-[10%] h-[55.3%]'>
        <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-[15%] ' />
      </div>
      <div className=' bg-amber-400  p-1 w-[50%] space-y-4 mr-[15%] pb-[5%] flex-row h-fit'>
        <button className="bg-amber-100 rounded-lg w-full p-1" onClick={TeacherLoginPage}>LOGIN AS TEACHER</button>
        <button className="bg-amber-100 rounded-lg  w-full p-1" onClick={PrincipalLoginPage}>LOGIN AS PRINCIPAL</button>
        <button className="bg-amber-100 rounded-lg w-full p-1" onClick={ParentLoginPage}>LOGIN AS PARENT</button>
        <br />
        <h2>STUDENT LOGIN</h2>
        <label >Email:  <input className='p-1 my-1 w-[85%] rounded-lg' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label>
        <label >Password: <input className='p-1 rounded-lg w-[76%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label>
        <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginFunction}>LOGIN</button>
      </div>
    </div>
</div>
    {/* small screen */}
<div className='flex lg:hidden'>
    {/* lg-hidden */}
     <div className='flex rounded-lg  w-screen  h-screen '>
      {/* <div className='w-[50%] ml-[10%]'>
        <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-[15%] ' />
      </div> */}
      <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit'>
        <button className="bg-amber-100 rounded-lg w-full p-1" onClick={TeacherLoginPage}>LOGIN AS TEACHER</button>
        <button className="bg-amber-100 rounded-lg  w-full p-1" onClick={PrincipalLoginPage}>LOGIN AS PRINCIPAL</button>
        <button className="bg-amber-100 rounded-lg w-full p-1" onClick={ParentLoginPage}>LOGIN AS PARENT</button>
        <br />
        <h2>STUDENT LOGIN</h2>
        <label >Email:  <input className='p-1 my-1 w-[85%] rounded-lg' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label>
        <label >Password: <input className='p-1 rounded-lg w-[76%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label>
        <button className="bg-amber-100 rounded-lg p-1 w-full" onClick={LoginFunction}>LOGIN</button>
      </div>
    </div>
    </div>
    </>
  )
}

export default Login