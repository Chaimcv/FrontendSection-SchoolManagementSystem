import React, { useState } from "react";
import axios from "axios";

const AddTeacherForm = ({ OnAddTeacherClick }) => {
  const SchoolUrl = process.env.REACT_APP_API_SCHOOL;

  const [tname, setTname] = useState("");
  const [tage, setTage] = useState("");
  const [temail, setTemail] = useState("");
  const [tcity, setTcity] = useState("");
  const [tpin, setTpin] = useState("");
  const [tsubject, setTsubject] = useState("");
  const [tphoneNumber, setTphonenumber] = useState("");
  const [tstandard, setTstandard] = useState("");
  const [tdivision, setTdivision] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!tname || !temail) {
      setErrorMsg("Please fill in at least the faculty member's name and email.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const data = {
      name: tname,
      age: tage,
      email: temail,
      city: tcity,
      pin: tpin,
      subject: tsubject,
      phonenumber: tphoneNumber,
      standard: tstandard,
      division: tdivision,
    };

    try {
      const res = await axios.post(`${SchoolUrl}/teacher`, data);
      if (res.data) {
        if (OnAddTeacherClick) OnAddTeacherClick();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to register faculty member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-100 p-6 bg-linear-to-r from-amber-50/80 via-white to-amber-50/40">
          <div>
            <h2 className="text-xl font-extrabold text-amber-950 font-serif">
              Register New Faculty Member
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Enter academic qualifications, assigned class in-charge, and contact info.
            </p>
          </div>
          <button
            type="button"
            onClick={OnAddTeacherClick}
            className="rounded-xl p-2 text-stone-400 hover:bg-amber-100 hover:text-stone-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Sharma"
                value={tname}
                onChange={(e) => setTname(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                placeholder="rajesh@centralpublicschool.edu"
                value={temail}
                onChange={(e) => setTemail(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Primary Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Mathematics, Science"
                value={tsubject}
                onChange={(e) => setTsubject(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={tphoneNumber}
                onChange={(e) => setTphonenumber(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Class In-Charge (Standard)
              </label>
              <input
                type="text"
                placeholder="e.g. 7 or 8"
                value={tstandard}
                onChange={(e) => setTstandard(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Class Division
              </label>
              <input
                type="text"
                placeholder="e.g. A, B or C"
                value={tdivision}
                onChange={(e) => setTdivision(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={tcity}
                onChange={(e) => setTcity(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                Pincode
              </label>
              <input
                type="text"
                placeholder="e.g. 400001"
                value={tpin}
                onChange={(e) => setTpin(e.target.value)}
                className="w-full rounded-xl border border-amber-200 bg-amber-50/20 px-3.5 py-2 text-xs text-stone-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-amber-100">
            <button
              type="button"
              onClick={OnAddTeacherClick}
              className="px-5 py-2.5 rounded-xl border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-xs font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Save Faculty Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacherForm;

