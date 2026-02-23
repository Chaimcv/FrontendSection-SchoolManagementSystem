import React from 'react'

const PostsSection = () => {
  return (
    <div className='bg-amber-300'>
        <div>
            <div className='bg-white rounded-md mx-20 h-[200px] my-2'>
                <h3>Name</h3>
                <img />
                <div className='flex'>
                   <img src={require("../assets/icon/24x24/heart.png")} />
                    <img src={require("../assets/icon/24x24/comments.png")} />
                      <img />
                      </div> 
                </div>
                <div>comments</div>
            </div>
        </div>
  
  )
}

export default PostsSection