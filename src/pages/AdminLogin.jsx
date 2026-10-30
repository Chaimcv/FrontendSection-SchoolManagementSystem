import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SchoolImage from "../assets/SchoolImage.png"

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminemail] = useState();
  const [adminPassword, setAdminPassword] = useState();

  const adminEmailSaved = process.env.REACT_APP_API_ADMIN_EMAILS.split(',');
  const adminPasswordSaved = process.env.REACT_APP_API_ADMIN_PASSWORDS.split(',');
  console.log(adminEmailSaved, "admin emails");
  console.log(adminEmail);
  console.log(adminPassword);
  const token = Math.random().toString(36).substr(2); // remove `0.`
  //console.log(adminToken,"admin token");
  const Admin = "Principal";
  const checkValidAdmin = () => {
    if (adminEmailSaved.includes(adminEmail) && adminPasswordSaved.includes(adminPassword)) {
      alert("Login Successfull");
      navigate("/admin/dashboard");
      localStorage.setItem("token", token);
      localStorage.setItem("name", Admin);
      window.location.reload();
    }
    else {

      alert("Invalid Credentials");
    }
  }
  const BackToLogin = () => {
    navigate("/login");
  }
  return (
    <>
      {/* large screen */}
      <div className='hidden lg:flex'>

        <div className='flex rounded-lg w-screen m-2 h-screen shadow-2xl mt-[3%]'>
          <div className='w-[55%] ml-[3%] h-[55.3%]'>
            <img src={SchoolImage} alt='image' className='h-[100%] w-[100%] ml-52 border rounded-l-xl ' />
          </div>
          <div className=' bg-amber-400  p-1 w-[40%] space-y-3 mr-[15%] pb-[5%] flex-row h-[55.3%] border rounded-r-xl'>
            <h2 className='font-bold text-amber-800 pt-2'>ADMIN LOGIN</h2>
            <br />
            <label>Email <input className='p-1 mx-1 mt-20 rounded-lg w-[85%] ' type='email' placeholder='Enter  registered email' value={adminEmail} onChange={(e) => setAdminemail(e.target.value)} /></label><br />
            <label>Password <input className='p-1 m-1 rounded-lg w-[75%]' type='password' placeholder='Enter password' value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} /></label><br />
            <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={checkValidAdmin}>Login</button> <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={BackToLogin}>BACK</button>
          </div>
          {/* <div><h5>New Admin? Register here</h5><button onClick={navigateToRegistration()}>SignUp</button></div> */}
        </div>

      </div>

      {/* small screen */}
      <div className='flex lg:hidden'>

        <div className='flex rounded-lg  w-screen  h-screen '>
          <div className=' bg-amber-400  p-1 w-[100%] space-y-4 pb-[5%] flex-row h-fit mx-[3%] rounded-md'>
            <h1 className='font-bold text-amber-800 pt-2'>ADMIN LOGIN</h1>
            <br />
            <label>Email <input className='p-1 mx-1 mt-20 rounded-lg w-[85%] ' type='email' placeholder='Enter  registered email' value={adminEmail} onChange={(e) => setAdminemail(e.target.value)} /></label><br />
            <label>Password <input className='p-1 m-1 rounded-lg w-[75%]' type='password' placeholder='Enter password' value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} /></label><br />
            <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={checkValidAdmin}>Login</button> <br />
            <button className="bg-amber-100 rounded-lg p-1 w-full shadow-lg hover:bg-amber-600 hover:text-white hover:font-bold" onClick={BackToLogin}>BACK</button>
          </div>
        </div>

      </div>
    </>
  )
}

export default AdminLogin