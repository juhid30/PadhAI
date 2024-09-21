import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AppliedToInternship = () => {
  const [applications, setApplications] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Fetch all applied internships
        const applicationsSnapshot = await getDocs(
          collection(db, "AppliedToInternship")
        );
        const applicationsData = applicationsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Fetch all students
        const studentsSnapshot = await getDocs(
          collection(db, "Student")
        );
        const students = studentsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name; // Assuming each student document has a 'name' field
          return acc;
        }, {});

        // Fetch all internships
        const internshipsSnapshot = await getDocs(
          collection(db, "InternshipListings")
        );
        const internships = internshipsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().title; // Assuming each internship document has a 'title' field
          return acc;
        }, {});

        // Map through applications and match with student names and internship titles
        const applicationRecords = applicationsData.map((application) => ({
          studentName: students[application.studentId] || "Unknown",
          internshipTitle: internships[application.internshipId] || "Unknown",
          resumeURL: application.resumeLink,
        }));

        setApplications(applicationRecords);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [db]);

  return (
    <div className="p-6">
      <h2 className="text-5xl text-center font-bold text-blue-700 mb-8">Applied Internships</h2>
      <hr className="border-t-1 border-blue-900 mb-9" />
      <table className="min-w-full border-collapse border border-blue-300">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-blue-300 px-4 py-2">Student Name</th>
            <th className="border border-blue-300 px-4 py-2">Internship Title</th>
            <th className="border border-blue-300 px-4 py-2">Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application, index) => (
            <tr key={index} className="hover:bg-blue-50 transition duration-200">
              <td className="border border-blue-300 px-4 py-2">{application.studentName}</td>
              <td className="border border-blue-300 px-4 py-2">{application.internshipTitle}</td>
              <td className="border border-blue-300 px-4 py-2">
                <a
                  href={application.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline transition duration-200"
                >
                  View Resume
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedToInternship;
