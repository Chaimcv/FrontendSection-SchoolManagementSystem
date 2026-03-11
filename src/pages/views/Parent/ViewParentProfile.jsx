import React from 'react'
import { useParams } from 'react-router-dom'

const ViewParentProfile = () => {
  const{id}=useParams();
  console.log(id,"parent id");
  return (
    <div>ViewParentProfile</div>
  )
}

export default ViewParentProfile