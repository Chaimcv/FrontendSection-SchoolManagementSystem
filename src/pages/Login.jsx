import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
      window.location.reload();
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

        <div className='flex rounded-lg w-screen m-2 h-screen shadow-2xl mt-[3%]'>
          <div className='w-[55%] ml-[3%] h-[55.3%]'>
            <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 border rounded-l-xl ' />
          </div>
          <div className=' bg-amber-400  p-1 w-[40%] space-y-3 mr-[15%] pb-[5%] flex-row h-[55.3%] border rounded-r-xl'>
            <button className="bg-amber-100 rounded-lg w-full p-1 hover:bg-amber-600 hover:text-white hover:font-bold mt-3" onClick={TeacherLoginPage}>LOGIN AS TEACHER</button>
            <button className="bg-amber-100 rounded-lg  w-full p-1 hover:bg-amber-600 hover:text-white hover:font-bold" onClick={PrincipalLoginPage}>LOGIN AS PRINCIPAL</button>
            <button className="bg-amber-100 rounded-lg w-full p-1 hover:bg-amber-600 hover:text-white hover:font-bold" onClick={ParentLoginPage}>LOGIN AS PARENT</button>
            <br />
            <h2 className='font-bold text-amber-800 pt-2'>STUDENT LOGIN</h2>
            <label >Email:  <input className='p-1 my-1 w-[85%] rounded-lg' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter email'></input></label>
            <label >Password: <input className='p-1 rounded-lg w-[76%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter password'></input></label>
            <button className="bg-amber-100 rounded-lg  p-1 w-full hover:bg-amber-600 hover:text-white hover:font-bold" onClick={LoginFunction}>LOGIN</button>
          </div>
        </div>
      </div>
      {/* small screen */}
      <div className='flex lg:hidden'>

        <div className='flex rounded-lg  w-screen  h-screen '>
          {/* <div className='w-[50%] ml-[10%]'>
        <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-[15%] ' />
      </div> */}
          <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit mx-[3%] rounded-md'>
            <button className="bg-amber-100 rounded-lg w-full p-1 shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold mt-3" onClick={TeacherLoginPage}>LOGIN AS TEACHER</button>
            <button className="bg-amber-100 rounded-lg  w-full p-1 shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={PrincipalLoginPage}>LOGIN AS PRINCIPAL</button>
            <button className="bg-amber-100 rounded-lg w-full p-1 shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={ParentLoginPage}>LOGIN AS PARENT</button>
            <br />
            <h2 className='font-bold text-amber-800 pt-2'>STUDENT LOGIN</h2>
            <label >Email:  <input className='p-1 my-1 w-[85%] rounded-lg' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label>
            <label >Password: <input className='p-1 rounded-lg w-[76%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label>
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={LoginFunction}>LOGIN</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login