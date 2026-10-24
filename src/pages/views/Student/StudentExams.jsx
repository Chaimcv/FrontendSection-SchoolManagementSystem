import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOneStudentDetails } from "../../../Redux/Slices/StudentSlice";

const StudentExams = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector((state) => state.student.oneStudentDetailsData);
  const [activeTab, setActiveTab] = useState("timetable");

  useEffect(() => {
    if (id) {
      dispatch(fetchOneStudentDetails(id));
    }
  }, [id, dispatch]);



};

export default StudentExams;
