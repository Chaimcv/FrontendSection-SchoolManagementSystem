import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Emblem from "../assets/emblem.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const adminEmailSaved = (process.env.REACT_APP_API_ADMIN_EMAILS || "").split(",");
  const adminPasswordSaved = (process.env.REACT_APP_API_ADMIN_PASSWORDS || "").split(",");
  const Admin = "Principal";

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const token = Math.random().toString(36).substring(2);

    setTimeout(() => {
      if (
        adminEmailSaved.map((s) => s.trim().toLowerCase()).includes(adminEmail.trim().toLowerCase()) &&
        adminPasswordSaved.map((s) => s.trim()).includes(adminPassword.trim())
      ) {
        localStorage.setItem("token", token);
        localStorage.setItem("name", Admin);
        localStorage.setItem("adminEmail", adminEmail.trim());
        navigate("/admin/dashboard");
        window.location.reload();
      } else {
        setErrorMessage("Invalid administrator email or password. Please check your credentials.");
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/80 via-amber-50/30 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8 text-stone-800">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Branding & Welcome Hero Panel */}
        <div className="bg-linear-to-br from-amber-700 via-amber-600 to-amber-500 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Ambient decorative glow */}
          <div className="absolute -right-16 -top-16 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-amber-400/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/90 p-2 shadow-lg border border-amber-300/40 flex items-center justify-center mb-6">
              <img src={Emblem} alt="School Emblem" className="w-full h-full object-contain" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-50 text-xs font-bold uppercase tracking-wider mb-3">
              Central Public School
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight font-serif">
              Administrative Command Portal
            </h1>
            <p className="mt-3 text-amber-100 text-xs sm:text-sm leading-relaxed">
              Secure institutional access for the Head Principal and Administrative Officers.
              Manage faculty, attendance registers, parent linkages, and official notices.
            </p>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-white/20 flex items-center justify-between text-xs text-amber-100">
            <span>🔒 Encrypted TLS Session</span>
            <span>2026-2027 Academic Year</span>
          </div>
        </div>

        {/* Right: Login Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Authorized Personnel Only
            </span>
            <h2 className="text-2xl font-extrabold text-amber-950 font-serif">
              Sign In to Admin Portal
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Enter registered administrator credentials to proceed.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                Administrator Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="principal@centralpublicschool.edu"
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                Security Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-4 py-2.5 text-xs sm:text-sm text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </>
                ) : (
                  "Log In as Administrator →"
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
              >
                ← Back to General Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;