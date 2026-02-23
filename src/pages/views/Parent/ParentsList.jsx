import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ParentsList = () => {
   const dispatch=useDispatch();
        const navigate=useNavigate();
   
        const AllParents=useSelector((state)=>state.student.parentData)||[]; 
        console.log(AllParents,"All");
  
        useEffect(()=>{
          dispatch(fetchParentsData());
        },[]);
  
        const viewParentDetails=(parenttID)=>{
          navigate(`//${parentID}`);
        }
  
        const deleteParent = async (parententIdToDelete) => {
    await dispatch(deleteParent(parentIdToDelete));
    dispatch(fetchParentsData());
  };
  
        const AddParent=()=>{
          navigate("/addingParent");
        }
  return (
    <div className='bg-amber-100'>
        
         <div >
        
         <h3>Add Parent  <button className='rounded-md bg-amber-500 px-7 ml-14 mt-1' onClick={AddParent}>+</button></h3></div>
      <div>
        <h3 className='font-semibold p-3'>Parents</h3>
          <table className='auto p-2 mx-10'>
            <thead className='bg-amber-700'>
              <tr className='p-5'>
                <th className='p-5'> NAME </th>
                <th className='p-5'> EMAIL </th>
                  <th className='p-5'>STUDENT NAME </th>
                  <th className='p-5'> STUDENT ID </th>
                <th className='p-5'> PHONENUMBER </th> 
                <th className='p-5'>ADDRESS </th>
                <th className='p-5'>PINCODE </th>
               
                  <th></th>
                   <th></th>
                <th></th>
              </tr>
            </thead>
            
            <tbody  className='bg-amber-200' >
               {AllParents?.map((item)=>(
              <tr key={item._id}>
                <td>{item?.Name}</td>
                 <td>{item?.email}</td>
                  <td>{item?.Student_name}</td>
                   <td>{item?.student_id}</td>
                    <td>{item?.phonenumber}</td>
                      <td>{item?.address}</td>
                        <td>{item?.pincode}</td>
                      {/* <td><button className='bg-amber-500 rounded-lg m-2 p-2' onClick={ ()=> viewParentDetails(item?._id)}>View Details</button></td> */}
                         <td><button className='bg-amber-500 rounded-lg m-2 p-2' onClick={ ()=> deleteParent(item?._id)}>Delete</button></td>
              </tr>
               ))}
            </tbody>
            
          </table>
          
      </div>
    </div>
  )
}

export default ParentsList