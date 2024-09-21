import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AppliedToInternship = () => {
  const [applications, setApplications] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsSnapshot = await getDocs(collection(db, "AppliedToInternship"));
        const applicationsData = applicationsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const studentsSnapshot = await getDocs(collection(db, "Student"));
        const students = studentsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});

        const internshipsSnapshot = await getDocs(collection(db, "InternshipListings"));
        const internships = internshipsSnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().title;
          return acc;
        }, {});

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
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center pt-8">
      <div className="p-6 w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl sm:text-5xl text-center font-bold text-blue-800 mb-8 shadow-md p-4 rounded-lg">
          Applied Internships
        </h2>
        <hr className="border-t-2 border-blue-900 mb-9" />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-blue-300">
            <thead className="bg-blue-200">
              <tr>
                <th className="border border-blue-300 px-4 py-2 text-left text-blue-800 font-semibold">Student Name</th>
                <th className="border border-blue-300 px-4 py-2 text-left text-blue-800 font-semibold">Internship Title</th>
                <th className="border border-blue-300 px-4 py-2 text-left text-blue-800 font-semibold">Resume</th>
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
                      className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
                    >
                      View Resume
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppliedToInternship;
