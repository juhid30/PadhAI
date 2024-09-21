import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const TeacherAssignmentView = () => {
  const [assignments, setAssignments] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Fetch all submitted assignments
        const submittedAssignmentsSnapshot = await getDocs(
          collection(db, "SubmittedAssignments")
        );
        const submittedAssignments = submittedAssignmentsSnapshot.docs.map(
          (doc) => ({
            ...doc.data(),
            id: doc.id,
          })
        );

        // Fetch all assignment records
        const assignmentRecordsSnapshot = await getDocs(
          collection(db, "AssignmentRecord")
        );
        const assignmentRecords = assignmentRecordsSnapshot.docs.map((doc) => ({
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

        // Map through submitted assignments and match with assignment records
        const assignmentsData = submittedAssignments.map(
          (submittedAssignment) => {
            const assignmentRecord = assignmentRecords.find(
              (record) => record.id === submittedAssignment.assignmentId
            );
            const isLate =
              new Date(submittedAssignment.submissionDate) >
              new Date(assignmentRecord.dueDate);

            return {
              subject: assignmentRecord.subject,
              topic: assignmentRecord.topic,
              isLate,
              docURL: submittedAssignment.docURL,
              studentName: students[submittedAssignment.studentId] || "Unknown", // Get student name
            };
          } 
        );

        setAssignments(assignmentsData);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [db]);

  return (
    <div className="p-6 w-[100%]">
      <h2 className="text-5xl text-center font-bold text-blue-700 mb-8">Submitted Assignments</h2>
      <hr className="border-t-1 border-blue-900 mb-9" />
      <table className="min-w-full border-collapse border border-blue-300">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-blue-300 px-4 py-2">Subject</th>
            <th className="border border-blue-300 px-4 py-2">Topic</th>
            <th className="border border-blue-300 px-4 py-2">Student Name</th> {/* New column */}
            <th className="border border-blue-300 px-4 py-2">Late Submission</th>
            <th className="border border-blue-300 px-4 py-2">Document</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index} className="hover:bg-blue-50 transition duration-200">
              <td className="border border-blue-300 px-4 py-2">{assignment.subject}</td>
              <td className="border border-blue-300 px-4 py-2">{assignment.topic}</td>
              <td className="border border-blue-300 px-4 py-2">{assignment.studentName}</td> {/* Display student name */}
              <td className="border border-blue-300 px-4 py-2">{assignment.isLate ? "Yes" : "No"}</td>
              <td className="border border-blue-300 px-4 py-2">
                <a
                  href={assignment.docURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline transition duration-200"
                >
                  View Document
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherAssignmentView;
