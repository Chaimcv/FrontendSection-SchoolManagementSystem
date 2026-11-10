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
  const [inputtedEmail, setInputtedEmail] = useState("");
  const [inputtedPassword, setInputtedPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeParentId = localStorage.getItem("parentId");

  const LoginAsParent = async () => {
    if (!inputtedEmail || !inputtedPassword) {
      alert("Please enter both email and password.");
      return;
    }
    const result = await dispatch(loginParent({ inputtedEmail, inputtedPassword }));

    if (result?.success && result.data?.id) {
      const { token, name, id } = result.data;
      localStorage.removeItem("studentId");
      localStorage.removeItem("id");
      localStorage.removeItem("teacherId");
      localStorage.removeItem("adminEmail");
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("parentId", id);
      // navigate(`/parentDashboard/${id}`);
      // window.location.reload();
      window.location.href = `/parentDashboard/${id}`;
    } else {
      alert("Invalid email or password");
    }
  };

  const BackToLogin = () => {
    navigate("/login");
  };

  const GoToParentDashboard = () => {
    if (activeParentId) {
      navigate(`/parentDashboard/${activeParentId}`);
    }
  };

  return (
    <>
      {/* large screen */}
      <div className='hidden lg:flex'>
        <div className='flex rounded-lg w-screen m-2 h-screen shadow-2xl mt-[3%]'>
          <div className='w-[55%] ml-[3%] h-[55.3%]'>
            <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 border rounded-l-xl ' />
          </div>
          <div className=' bg-amber-400  p-1 w-[40%] space-y-3 mr-[15%] pb-[5%] flex-row h-[55.3%] border rounded-r-xl'>
            <h2 className='font-bold text-amber-800 pt-2'>PARENT LOGIN</h2>
            <br />
            <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br />
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
            <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={LoginAsParent}>LOGIN</button><br />
            {activeParentId && (
              <button
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs p-1.5 rounded-lg w-full shadow-md transition-all mt-1"
                onClick={GoToParentDashboard}
              >
                PARENT DASHBOARD
              </button>
            )}
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={BackToLogin}>BACK</button>
          </div>
        </div>
      </div>
      {/* small screen */}
      <div className='flex lg:hidden'>
        <div className='flex rounded-lg  w-screen m-2 h-screen'>

          <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit mx-[3%] rounded-md'>
            <h1 className='font-bold text-amber-800 pt-2'>PARENT LOGIN</h1>
            <br />
            <label >Email:<input className='p-1 mx-1 mt-10 rounded-lg w-[85%] ' type='text' value={inputtedEmail} onChange={(e) => setInputtedEmail(e.target.value)} placeholder='Enter your email'></input></label><br />
            <label >Password: <input className='p-1 m-1 rounded-lg w-[75%]' type='password' value={inputtedPassword} onChange={(e) => setInputtedPassword(e.target.value)} placeholder='Enter your password'></input></label> <br />
            <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={LoginAsParent}>LOGIN</button><br />
            {activeParentId && (
              <button
                className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs p-2 rounded-lg w-full shadow-md transition-all"
                onClick={GoToParentDashboard}
              >
                PARENT DASHBOARD
              </button>
            )}
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={BackToLogin}>BACK</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentLogin