import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import Sidebar from "./Sidebar";
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
import AssignmentSubmission from "./AssignmentSubmission";
import CalenderComponent, { CalendarComponent } from "./Calendar";
import Calendar from "./Calendar";

// Register Chart.js components
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
  const studId = "library-test-student"
  console.log(studId);

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
  }, []
  )  

  console.log(student);
  const ATSRating = student.resume_analysis.response.rating.max_score;

  // Sample data for the Line chart (Attendance)
  const attendanceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance (%)",
        data: [80, 85, 90, 95],
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Light purple background
        borderColor: "rgba(153, 102, 255, 1)", // Purple border
        borderWidth: 2,
      },
    ],
  };

  // Sample data for the Doughnut chart (Resume)
  const resumeData = {
    labels: ["ATS Score"],
    datasets: [
      {
        data: [ATSRating, 100-ATSRating],
        backgroundColor: ["#9F7AEA", "#E9D8FD"], // Purple and light lavender
        hoverBackgroundColor: ["#9F7AEA", "#E9D8FD"], // Hover colors
      },
    ],
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <div className="flex">
        {/* Main Dashboard Content */}
        <div className="flex-1 bg-purple-50 p-6">
          {" "}
          {/* Light purple background */}
          <h1 className="text-3xl font-semibold mb-6 text-purple-700">
            Dashboard
          </h1>{" "}
          {/* Purple text */}
          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Example Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden h-[400px]">
              {" "}
              {/* Set a specific height */}
              <h2 className="text-lg font-semibold mb-4 text-purple-700">
                Assignments
              </h2>
              {/* Render the AssignmentSubmission component here */}
              <div className="overflow-hidden h-full">
                <AssignmentSubmission />
              </div>
            </div>
            {/* Example Card 2 with Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-purple-700">
                Attendance
              </h2>{" "}
              {/* Purple text */}
              <div className="h-48">
                <Line data={attendanceData} options={attendanceOptions} />
              </div>
            </div>

            {/* Example Card 3 with Doughnut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4 text-purple-700">
                Resume
              </h2>{" "}
              {/* Purple text */}
              <Doughnut data={resumeData} />
            </div>
          </div>
          {/* Projects & Orders Overview */}
          <div className="flex h-[55vh] gap-6 mt-6">
            {/* Projects Section */}
            <div className="bg-white p-6 h-full w-[70%] rounded-lg shadow-md">
              <CalendarComponent />
            </div>

            {/* Orders Overview Section */}
            <div className="bg-white p-6 w-[30%] rounded-lg shadow-md flex items-center justify-center">
              <img
                src={`https://firebasestorage.googleapis.com/v0/b/webcade2024.appspot.com/o/hr-sim.png?alt=media&token=a753ade0-891c-4352-954d-18c5362df112`}
                alt=""
                className="flex items-center justify-center h-[250px] w-[250px]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
