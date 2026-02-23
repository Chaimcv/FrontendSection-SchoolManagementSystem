import React from 'react'
import PostsSection from './PostsSection'
import Announcements from './Announcements'

const Homepage = () => {
  return (
    <div>
        <div><Announcements /></div>
         <div><PostsSection /></div>
    </div>
  )
}

export default Homepage