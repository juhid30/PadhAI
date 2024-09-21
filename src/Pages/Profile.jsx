import React from 'react';
import './Profile.css';

const ProfilePage = () => {
  // Sample data (can be fetched from an API)
  const studentData = {
    name: 'Atharva Khewle',
    email: 'atharva.khewle@example.com',
    profilePicture:
      'https://via.placeholder.com/150', // Replace with student's image URL
    year: 'Final Year',
    course: 'B.Tech in AI & Data Science',
    CGPA: 9.57,
    attendance: 85, // Attendance in percentage
    skills: ['React', 'Flutter', 'Node.js', 'Django'],
    certifications: ['Google Cloud Certified', 'AWS Certified'],
    extracurricular: ['Member of Coding Club', 'Volunteer at Hackathon'],
    interviewPrepProgress: 75, // percentage
  };

  return (
    <div className="profile-page container mx-auto p-8">
      <div className="profile-header flex items-center justify-center gap-8">
        {/* Profile Image */}
        <div className="profile-img w-40 h-40">
          <img
            src={studentData.profilePicture}
            alt="Profile"
            className="rounded-full object-cover shadow-lg border-4 border-white"
          />
        </div>

        {/* Basic Info */}
        <div className="profile-info">
          <h1 className="text-3xl font-bold">{studentData.name}</h1>
          <p className="text-lg text-gray-600">{studentData.email}</p>
          <p className="text-md text-gray-600">
            {studentData.year}, {studentData.course}
          </p>
          <p className="text-md text-gray-600">CGPA: {studentData.CGPA}</p>
        </div>
      </div>

      {/* Attendance and Interview Prep Progress */}
      <div className="progress-section my-8 grid grid-cols-2 gap-4">
        <div className="attendance card p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="text-2xl font-bold text-green-600">
            {studentData.attendance}%
          </p>
          <p className="text-gray-500">Overall attendance</p>
        </div>
        <div className="interview-prep card p-4 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Interview Prep Progress</h2>
          <div className="w-full bg-gray-300 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${studentData.interviewPrepProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-500 mt-2">
            {studentData.interviewPrepProgress}% completed
          </p>
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="skills-certifications-section grid grid-cols-2 gap-4">
        <div className="skills card p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Skills</h2>
          <ul className="list-disc ml-4">
            {studentData.skills.map((skill, index) => (
              <li key={index} className="text-gray-600">
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className="certifications card p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Certifications</h2>
          <ul className="list-disc ml-4">
            {studentData.certifications.map((certification, index) => (
              <li key={index} className="text-gray-600">
                {certification}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Extracurricular Activities */}
      <div className="extracurricular-section my-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Extracurricular Activities</h2>
        <ul className="list-disc ml-4">
          {studentData.extracurricular.map((activity, index) => (
            <li key={index} className="text-gray-600">
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
