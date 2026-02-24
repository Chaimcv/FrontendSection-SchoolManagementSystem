import React from 'react'
import facebook from "../assets/facebook.jpg";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youTube.png";

const Footer = () => {
  return (
    <div className='bg-amber-700 w-full'>
      <div className='flex'>
         <div className='m-5'>
          <ul className='font-semibold list-disc pl-4'>
            <li>Online Admission</li>
            <li>Fee Collection</li>
            <li>Cyber Security Awareness</li>
            <li>Right to Information</li>
          </ul>
         </div>
          <div>
            <h3>Follow us</h3>
             <div className='flex justify-around p-2'>
               <img src={facebook} alt='facebook'/>
               <img src={instagram}/>
               <img src={youtube}/>
             </div>
          </div>
      </div>
      <div></div>
    </div>
  )
}

export default Footer