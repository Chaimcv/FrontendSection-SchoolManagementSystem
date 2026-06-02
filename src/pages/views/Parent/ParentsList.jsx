import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchParentsData,deleteParent } from '../../../Redux/Slices/ParentSlice';

const ParentsList = () => {
    const { loggedteacherId } = useParams();
   const dispatch=useDispatch();
        const navigate=useNavigate();
   
        const AllParents=useSelector((state)=>state.parent.parentData)||[]; 
        console.log(AllParents,"All");
  
        useEffect(()=>{
          dispatch(fetchParentsData());
        },[]);
  
        // const viewParentDetails=(parenttID)=>{
        //   navigate(`//${parentID}`);
        // }
  
        const deleteParent = async(parentIdToDelete) => {
    await dispatch(deleteParent(parentIdToDelete));
    dispatch(fetchParentsData());
  };
  
       const AddParent = () => navigate(`/addingParent/${loggedteacherId}`);
  return (
    <div className='bg-amber-100 '>
      <div>{loggedteacherId&& <button 
                            className='bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2'
                            onClick={AddParent}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Parent
                        </button>}</div>
{/*         
         <div >
        
         <h3>Add Parent  <button className='rounded-md bg-amber-500 px-7 ml-14 mt-1' onClick={AddParent}>+</button></h3></div> */}
      <div>
        <h3 className='font-semibold p-3'>Parents</h3>
          <table className='auto p-2 mx-15 shadow-md rounded-md mb-[50%]'>
            <thead className='bg-amber-200 border rounded-md'>
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
            
            <tbody  className='bg-amber-50' >
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