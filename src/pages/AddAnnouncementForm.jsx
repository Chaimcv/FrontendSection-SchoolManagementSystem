import React from 'react'

const AddAnnouncementForm = () => {
  return (
    <div>
        <h3>Title:<input type='text'/></h3>
        <p>Description:<input type='text'/></p>
        <h3>Upload file: <input type='file'/></h3>
        <button>Add</button>

    </div>
  )
}

export default AddAnnouncementForm