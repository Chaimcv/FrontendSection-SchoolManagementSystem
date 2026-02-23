import React from "react";
import HeaderImage from "../assets/HeaderImage.png";
import Emblem from "../assets/central_school_emblem.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
const navigate=useNavigate();
  const LoginPage=()=>{
    navigate("/login");
  }
  return (
    <div
      className="h-[100px] w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${HeaderImage})` }}
    >
      {/* <div className="bg-black/50 w-full h-full flex items-center justify-center">
      </div> */}

      <div className=" flex justify-around w-full">
         <div><img src={Emblem} alt="emblem" className="h-[20%] w-[10%] " /></div>
          {/* <div><input type="text" className="rounded-3xl py-1 px-3 m-6" placeholder="search" /></div> */}
           <div><button className="rounded-3xl bg-amber-600 p-2 m-5"><Link to="/login">Login</Link></button></div>
      </div>
    </div>
  );
};

export default Header;