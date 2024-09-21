import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { doc, getDoc } from "firebase/firestore"; // Import getDoc
import { db } from "../../firebase"; // Ensure you're importing your Firestore db
import Sidebar from "./Sidebar";
import AssignmentSubmission from "./AssignmentSubmission";
import CalendarComponent from "./Calendar";

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const studId = "library-test-student";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docRef = doc(db, "Student", studId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching student data: ", error);
      }
    };

    fetchStudent();
  }, []);

  // Check if student data is available before accessing properties
  const ATSRating =
    student?.resume_analysis?.response?.resume_evaluation?.rating?.score * 10 ||
    0; // Default to 0 if not available

  const attendanceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance (%)",
        data: [80, 85, 90, 95],
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  const resumeData = {
    labels: ["ATS Score"],
    datasets: [
      {
        data: [ATSRating, 100 - ATSRating],
        backgroundColor: ["#9F7AEA", "#E9D8FD"],
        hoverBackgroundColor: ["#9F7AEA", "#E9D8FD"],
      },
    ],
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  const handleHRSimulatorClick = () => {
    navigate("/hr"); // Redirect to /hr when the div is clicked
  };

  return (
    <div className="flex">
      <div className="flex-1 bg-purple-50 p-6">
        <h1 className="text-3xl font-semibold mb-6 text-purple-700">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden h-[400px]">
            <h2 className="text-lg font-semibold mb-4 text-purple-700">
              Assignments
            </h2>
            <div className="overflow-hidden h-full">
              <AssignmentSubmission />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-purple-700">
              Attendance
            </h2>
            <div className="h-48">
              <Line data={attendanceData} options={attendanceOptions} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-purple-700">
              Resume
            </h2>
            <Doughnut data={resumeData} />
          </div>
        </div>
        <div className="flex h-[55vh] gap-6 mt-6">
          <div className="bg-white p-6 h-full w-[70%] rounded-lg shadow-md">
            <CalendarComponent />
          </div>
          <div
            className="bg-white p-6 w-[30%] rounded-lg shadow-md flex items-center justify-center cursor-pointer"
            onClick={handleHRSimulatorClick} // Add click handler here
          >
            {" "}
            <img
              src={`https://firebasestorage.googleapis.com/v0/b/webcade2024.appspot.com/o/hr-sim.png?alt=media&token=a753ade0-891c-4352-954d-18c5362df112`}
              alt=""
              className="flex items-center justify-center h-[250px] w-[250px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
