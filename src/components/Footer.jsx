import React from 'react'
import facebook from "../assets/facebook.jpg";
import instagram from "../assets/instagram.png";
import youtube from "../assets/youTube.png";

const Footer = () => {
  return (
    <div className='bg-amber-700 w-full b-0'>
      <div className='flex' >
         <div className='m-5 w-[50%]'>
          <ul className='font-semibold list-disc ml-32'>
            <li>Online Admission</li>
            <li>Fee Collection</li>
            <li>Cyber Security Awareness </li>
            <li>Right to Information</li>
          </ul>
         </div>
          <div className='w-[50%]'>
            <h3>Follow us</h3>
             <div className='flex justify-evenly py-2'>
               <img src={facebook} alt='facebook.'/>
               <img src={instagram} alt='instagram'/>
               <img src={youtube} alt='youtube'/>
             </div>
          </div>
      </div>
      <div> </div>
    </div>
  )
}

export default Footer
