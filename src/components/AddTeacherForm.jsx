import React, { useState } from 'react'
import axios from "axios";

const AddTeacherForm = ({ OnAddTeacherClick }) => {

  const SchoolUrl = process.env.REACT_APP_API_SCHOOL;

  const [tname, setTname] = useState("");
  const [tage, setTage] = useState("");
  const [temail, setTemail] = useState("");
  // const [tpassword, setTpassword] = useState("");
  const [tcity, setTcity] = useState("");
  const [tpin, setTpin] = useState("");
  const [tsubject, setTsubjectata] = useState("");
  const [tphoneNumber, setTphonenumber] = useState("");
  const [tstandard, setTstandard] = useState("");

//    const generatePassword=()=> {
//     var length = 8,
//         charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//         retVal = "";
//     for (var i = 0, n = charset.length; i < length; ++i) {
//         retVal += charset.charAt(Math.floor(Math.random() * n));
//     }
//     setTpassword(retVal);
//     console.log(tpassword,"password generated");
// }
  const AddNewTeacher = async () => {

  
    const Data = {      //backend:frontend
      name: tname,
     age: tage,
     email: temail,
    //  password: tpassword,
     city: tcity,
     pin: tpin,
     subject: tsubject,
     phonenumber: tphoneNumber,
     standard: tstandard
    };

   


 //generatePassword();


    try {
     
      const res = await axios.post(`${SchoolUrl}/teacher`, Data);
      console.log(res.data, "added");

      if (res.data) OnAddTeacherClick();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {OnAddTeacherClick && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 z-50">
     
      <form onSubmit={AddNewTeacher}>
        <div className='border border-black flex flex-col m-5 p-5 space-y-5'>

          <label>NAME: <input type='text' value={tname} onChange={(e)=>setTname(e.target.value)} /></label>
          <label>EMAIL: <input type='text' value={temail} onChange={(e)=>setTemail(e.target.value)} /></label>
          {/* <label>PASSWORD: <input type='text' value={tpassword} onChange={(e)=>setTpassword(e.target.value)} /></label> */}
          <label>PINCODE: <input type='text' value={tpin} onChange={(e)=>setTpin(e.target.value)} /></label>
          <label>CITY: <input type='text' value={tcity} onChange={(e)=>setTcity(e.target.value)} /></label>
          <label>SUBJECT: <input type='text' value={tsubject} onChange={(e)=>setTsubjectata(e.target.value)} /></label>
          <label>PHONE: <input type='number' value={tphoneNumber} onChange={(e)=>setTphonenumber(e.target.value)} /></label>
          <label>STANDARD: <input type='text' value={tstandard} onChange={(e)=>setTstandard(e.target.value)} /></label>

          <button type='submit'>SUBMIT</button>

        </div>
      </form>
        </div>
       )}
    </div>
  )
}

export default AddTeacherForm;
