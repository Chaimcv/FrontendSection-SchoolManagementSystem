import React from "react";
import HeaderImage from "../assets/HeaderImage.png";
import Emblem from "../assets/emblem.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
const navigate=useNavigate();
  const LoginPage=()=>{
    navigate("/login");
  }
    const token = localStorage.getItem("token");
    const name=localStorage.getItem("name");
const handleLogout = () => {
  localStorage.removeItem("token");   // remove token
  navigate("/login");                 // redirect to login page
};
  return (
    <div
      className="h-[100px] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${HeaderImage})` }}
    >
      {/* <div className="bg-black/50 w-full h-full flex items-center justify-center">
      </div> */}

      <div className=" flex justify-around w-full">
         <div className="w-[30%]"><img src={Emblem} alt="emblem" className="h-[100%] w-[25%] ml-3" /></div>
         <div className=" w-[50%]"><h2 className="font-serif font-semibold mt-9 text-red-950 text-start text-3xl">CENTRAL  PUBLIC  SCHOOL</h2></div>
          {/* <div><input type="text" className="rounded-3xl py-1 px-3 m-6" placeholder="search" /></div> */}
          
{token ? (
  <div className="w-[20%]">
    <button className="rounded-3xl bg-amber-600 p-1 m-5" onClick={handleLogout}>Logout</button>
    <h5 className="font-bold text-red-950">WELCOME,  {name}</h5>
  </div>
) : (
<div className="w-[20%]"><button className="rounded-3xl bg-amber-600 p-2 m-5"><Link to="/login">Login</Link></button></div>
    
)}
  </div>
           
    </div>
  );
};

export default Header;