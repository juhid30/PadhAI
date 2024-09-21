import React from "react";
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
  // Sample data for the Line chart (Attendance)
  const attendanceData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Attendance (%)",
        data: [80, 85, 90, 95],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Sample data for the Doughnut chart (Resume)
  const resumeData = {
    labels: ["ATS Score"],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ["#FF6384", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#4BC0C0"],
      },
    ],
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio maintenance
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Example Card 1 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Assignments</h2>

            {/* Three horizontal rectangles */}
            <div className="flex flex-col space-y-2 mb-4 pt-4">
              <div className="h-[4rem] text-white bg-blue-500 rounded-lg flex items-center justify-center">
                Pending Assignments
              </div>{" "}
              {/* 5vh height */}
              <div className="h-[4rem] text-white bg-blue-500 rounded-lg flex items-center justify-center">
                Due Assignments
              </div>{" "}
              {/* 5vh height */}
              <div className="h-[4rem] text-white bg-blue-500 rounded-lg flex items-center justify-center">
                Submitted Assignments
              </div>{" "}
              {/* 5vh height */}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Click here to see assignments
            </p>
          </div>

          {/* Example Card 2 with Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Attendance</h2>
            <div className="h-48">
              <Line data={attendanceData} options={attendanceOptions} />
            </div>
          </div>

          {/* Example Card 3 with Doughnut Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Resume</h2>
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
              srcset=""
              className="flex items-center justify-center h-[250px] w-[250px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
