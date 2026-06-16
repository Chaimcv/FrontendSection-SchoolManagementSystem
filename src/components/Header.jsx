import React from "react";
import HeaderImage from "../assets/HeaderImage.png";
import Emblem from "../assets/emblem.png";
import { Link, redirect, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const LoginPage = () => {
    navigate("/login");
  };
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    localStorage.removeItem("studentId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    navigate("/login"); // redirect to login page
    window.location.reload();    //check this
  };
  // const redirectToHome = () => {
  //   navigate("/");
  // };
  return (
    <div
      className="h-[100px] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${HeaderImage})` }}
    >
      {/* <div className="bg-black/50 w-full h-full flex items-center justify-center">
      </div> */}

      <div className=" flex justify-around w-full">
        <div className="w-[30%]">
          <img src={Emblem} alt="emblem" className="h-[80%] w-[20%] ml-[3%] mt-[3%]" />
        </div>
        <div className=" w-[50%]">
          <h2 className="font-serif font-semibold mt-[5%] text-red-900 text-start text-2xl ml-[10%]">
            CENTRAL PUBLIC SCHOOL
          </h2>
          <h6 className="pr-[30%]">
            {/* <button onClick={redirectToHome}>Home</button> */}
          </h6>
        </div>
        {/* <div><input type="text" className="rounded-3xl py-1 px-3 m-6" placeholder="search" /></div> */}

        {token ? (
          <div className="w-[20%]">
            <button
              className="rounded-3xl  border border-amber-300 bg-amber-100 font-semibold text-amber-950 p-1 m-5  shadow-xl"
              onClick={handleLogout}
            >
              Logout
            </button>
            <h5 className="font-bold text-red-900">WELCOME, {name}</h5>
          </div>
        ) : (
          <div className="w-[20%]">
            <button
             className="rounded-3xl border border-amber-300 bg-amber-100 font-semibold text-amber-950 p-[2%] mt-[10%] shadow-xl transition hover:scale-110 duration-300 ease-in-out"
             >
              <Link to="/login">Login</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
