import React from 'react'
import PostsSection from './PostsSection'
import Announcements from './views/announcements/Announcements'
import Navbar from '../components/Navbar';


const Homepage = () => {

  return (
    <div>
  
        <div><Announcements /></div>
         <div><PostsSection /></div>
    </div>
  )
}

export default Homepage