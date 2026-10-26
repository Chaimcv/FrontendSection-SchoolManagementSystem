import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchParentsData, deleteParent, deleteAParent } from '../../../Redux/Slices/ParentSlice';

const ParentsList = () => {
  const { loggedteacherId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const AllParents = useSelector((state) => state.parent.parentData) || [];
  console.log(AllParents, "All");

  useEffect(() => {
    dispatch(fetchParentsData());
  }, []);

  // const viewParentDetails=(parenttID)=>{
  //   navigate(`//${parentID}`);
  // }

  const deleteParent = async (parentIdToDelete) => {
    await dispatch(deleteAParent(parentIdToDelete));
    dispatch(fetchParentsData());
  };
  const BackToDashboard = () => {
    navigate(-1);
  }

  const AddParent = () => navigate(`/addingParent/${loggedteacherId}`);
  return (
    <div className='bg-white '>
      <div>{loggedteacherId && <button
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
        <h1 className="text-2xl  text-left pl-[5%] pt-[2%] font-bold tracking-tight text-slate-900 md:text-3xl">Parents List</h1>
        <p className="text-left pl-[5%] text-sm text-slate-500 pb-[2%]">List all parents</p>
        {/* <button className="text-black bg-amber-300  p-2 rounded-lg px-4 shadow-lg m-[1%] ml-[80%] hover:transition ease-out" onClick={BackToDashboard}> BACK </button> */}
        <div>

        </div>

        <table className='auto p-2 mx-[5%] shadow-md rounded-3xl mb-[1%] '>
          <thead className='bg-amber-100 text-amber-700 border rounded-3xl'>
            <tr className='p-5'>
              <th className='p-5 '> NAME </th>
              <th className='p-5'> EMAIL </th>
              <th className='p-5'>STUDENT NAME </th>
              <th className='p-5'> STUDENT ID </th>
              <th className='p-5'> PHONENUMBER </th>
              <th className='p-5'>ADDRESS </th>
              <th className='p-5'>PINCODE </th>

              <th className='p-5'> ACTION </th>
              <th></th>
              <th></th>
            </tr>
          </thead>

          <tbody className='bg-amber-50 text-amber-500' >
            {AllParents?.map((item) => (
              <tr className="hover:bg-amber-100" key={item._id}>
                <td>{item?.Name}</td>
                <td>{item?.email}</td>
                <td>{item?.Student_name}</td>
                <td>{item?.student_id}</td>
                <td>{item?.phonenumber}</td>
                <td>{item?.address}</td>
                <td>{item?.pincode}</td>
                {/* <td><button className='bg-amber-500 rounded-lg m-2 p-2' onClick={ ()=> viewParentDetails(item?._id)}>View Details</button></td> */}
                <td><button className='bg-amber-400 rounded-lg m-2 p-2 text-white  shadow-lg' onClick={() => deleteParent(item?._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default ParentsList