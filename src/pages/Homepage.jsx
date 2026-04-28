import React from 'react'
import PostsSection from './PostsSection'
import Announcements from './views/announcements/Announcements'
import Navbar from '../components/Navbar';


const Homepage = () => {
  const token=localStorage.getItem("token");
  return (
    <div>
     {token&&<div><Navbar /></div>}
        <div><Announcements /></div>
         <div><PostsSection /></div>
    </div>
  )
}

export default Homepage