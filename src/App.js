import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminRoutes from './Routes/AdminRoutes';
import Header from "./components/Header";
import Footer from "./components/Footer";
import TeacherRoutes from './Routes/TeacherRoutes';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import StudentListing from './pages/views/Student/StudentListing';
import AddNewStudent from './pages/views/Student/AddNewStudent';
import ViewStudentDetails from './pages/views/Student/ViewStudentDetails';
import AddParent from './pages/views/Parent/AddParent';
import ParentLogin from './pages/views/Parent/ParentLogin';
import ParentsList from './pages/views/Parent/ParentsList';

function App() {

  //  const[data,setData]=useState([]);
  
  //   useEffect(() => {
  //   fetch('http://127.0.0.1:8000/teacher')               //backend connection api
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message)
  //   );
  
  // }, []);
  // console.log(data,"data accessed from backend");
  
  
  return (
    <div className="App">
       
      <BrowserRouter>
      <Header />
      <Routes>
       
        <Route path="/admin/*" element={<AdminRoutes />}/>
        <Route path='/teacher/*' element={<TeacherRoutes />}/>

         
        <Route path='/' element={<Homepage />}/>
        <Route path='/login' element={<Login />}/>
        {/* student */}
         <Route path='/allStudentslisted' element={<StudentListing />}/>
          <Route path='/addNewStudent' element={<AddNewStudent />}/>
           <Route path='/viewAStudent/:id' element={<ViewStudentDetails />}/>

           {/* parent */}
            <Route path='/addingParent' element={<AddParent />}/>
            <Route path='/parentLogin' element={<ParentLogin />}/>
             <Route path='/parentslist' element={<ParentsList />}/>
      </Routes>
      </BrowserRouter>
         <Footer />
    </div>
  );
}

export default App;
