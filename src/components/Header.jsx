import React from "react";
import HeaderImage from "../assets/HeaderImage.png";
import Emblem from "../assets/emblem.png";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("teacherId");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("adminEmail");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header
      className="relative w-full bg-cover bg-center border-b border-amber-200 shadow-sm"
      style={{ backgroundImage: `url(${HeaderImage})` }}
    >
      {/* Warm amber translucent tint overlay for enhanced readability */}
      <div className="bg-amber-950/20 backdrop-blur-[2px] w-full py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: School Branding & Emblem */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="h-14 w-14 rounded-full bg-white/90 p-1 shadow-md border border-amber-200 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={Emblem} alt="School Emblem" className="h-full w-full object-contain" />
            </div>
            <div className="text-left">
              <h1 className="font-serif font-extrabold text-xl md:text-2xl text-amber-950 tracking-wide drop-shadow-sm">
                CENTRAL PUBLIC SCHOOL
              </h1>
              <p className="text-xs font-medium text-amber-900/80 tracking-wider uppercase">
                Excellence • Integrity • Innovation
              </p>
            </div>
          </Link>

          {/* Right: User Status & Session Actions */}
          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block leading-tight">
                      Signed in as
                    </span>
                    <span className="text-xs font-bold text-amber-950 truncate max-w-[120px] sm:max-w-[180px] block leading-tight">
                      {name || "User"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-sm transition-all hover:scale-105"
                  title="Sign out of system"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold px-5 py-2 rounded-full shadow-md transition-all hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

