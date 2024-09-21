import React from 'react';
import './Dashboard.css';

const DashboardPage = () => {
  // Sample data for dashboard sections
  const studentMetrics = {
    attendance: 85, // Attendance percentage
    totalAssignments: 10,
    completedAssignments: 8,
    upcomingExams: 3,
    skillsProgress: 70, // Skills progress percentage
    codingPractice: {
      completedChallenges: 45,
      totalChallenges: 50,
    },
  };

  return (
    <div className="dashboard-page container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome Back, Atharva!</h1>

      {/* Overview Cards */}
      <div className="overview-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="text-2xl font-bold text-green-600">{studentMetrics.attendance}%</p>
          <p className="text-gray-500">Overall Attendance</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-2xl font-bold text-blue-600">
            {studentMetrics.completedAssignments}/{studentMetrics.totalAssignments}
          </p>
          <p className="text-gray-500">Completed Assignments</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Upcoming Exams</h2>
          <p className="text-2xl font-bold text-red-600">{studentMetrics.upcomingExams}</p>
          <p className="text-gray-500">Exams This Month</p>
        </div>
        <div className="card bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Skills Progress</h2>
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${studentMetrics.skillsProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-500 mt-2">{studentMetrics.skillsProgress}% progress</p>
        </div>
      </div>

      {/* Coding Practice Section */}
      <div className="coding-practice-section card p-6 bg-white rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Coding Practice</h2>
        <p className="text-xl">
          {studentMetrics.codingPractice.completedChallenges}/{studentMetrics.codingPractice.totalChallenges} challenges completed
        </p>
        <p className="text-gray-500">Keep practicing to improve your coding skills!</p>
      </div>

      {/* Interview Prep Section */}
      <div className="interview-prep-section card p-6 bg-white rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Interview Preparation</h2>
        <p>Prepare for your upcoming interviews with mock tests, coding problems, and quizzes.</p>
        <button className="btn bg-blue-600 text-white px-4 py-2 mt-4 rounded-lg">
          Start Interview Prep
        </button>
      </div>

      {/* Exam Scheduler Section */}
      <div className="exam-scheduler card p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Exam Scheduler</h2>
        <p>Track and manage your upcoming exams.</p>
        <button className="btn bg-green-600 text-white px-4 py-2 mt-4 rounded-lg">
          View Exam Schedule
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
