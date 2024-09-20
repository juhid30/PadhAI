import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Import Firestore

const TeacherAssignmentView = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState({});

  useEffect(() => {
    // Fetch the single AssignmentRecord document from Firestore
    const fetchAssignmentRecord = async () => {
      const docRef = doc(db, "AssignmentRecord", "LxK4DMA7H48z4mrND6zQ"); // Replace with actual document ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const assignmentData = docSnap.data();
        const studentAssignments = assignmentData.students;

        // Collect all assignments for dropdown selection
        const fetchedAssignments = [];
        const studentIds = Object.keys(studentAssignments);

        // Gather all assignments from all students
        studentIds.forEach((studentId) => {
          studentAssignments[studentId].forEach((assignment) => {
            // Check if the assignment topic matches the selected assignment's topic
            // if (assignment.topic === selectedAssignmentId) {
            fetchedAssignments.push({
              ...assignment,
              studentId,
            });
            // }
          });
        });

        // Remove duplicates (assuming topics are unique across students)
        const uniqueAssignments = [
          ...new Map(
            fetchedAssignments.map((item) => [item.topic, item])
          ).values(),
        ];

        setAssignments(uniqueAssignments);
        setStudents(studentAssignments); // Keep the student data for future lookups
      } else {
        console.log("No such document!");
      }
    };

    fetchAssignmentRecord();
  }, []);

  const handleAssignmentChange = (assignmentTopic) => {
    setSelectedAssignmentId(assignmentTopic);

    // Filter submissions where the topic matches
    const filteredSubmissions = [];

    Object.keys(students).forEach((studentId) => {
      const studentAssignments = students[studentId];
      studentAssignments.forEach((assignment) => {
        if (assignment.topic === assignmentTopic) {
          filteredSubmissions.push({
            ...assignment,
            studentId,
          });
        }
      });
    });

    setSubmissions(filteredSubmissions);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">View Student Submissions</h1>

      <div className="mb-6">
        <label htmlFor="assignments" className="block mb-2">
          Select Assignment:
        </label>
        <select
          id="assignments"
          className="p-2 border rounded"
          onChange={(e) => handleAssignmentChange(e.target.value)}
        >
          <option value="">Select an assignment</option>
          {assignments.map((assignment, index) => (
            <option key={index} value={assignment.topic}>
              {assignment.topic}
            </option>
          ))}
        </select>
      </div>

      {selectedAssignmentId && submissions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Student Submissions</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 border">Student ID</th>
                <th className="py-2 border">Date of Submission</th>
                <th className="py-2 border">Document</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.studentId}>
                  <td className="py-2 border">{submission.studentId}</td>
                  <td className="py-2 border">
                    {new Date(submission.dateOfSubmission).toLocaleDateString()}
                  </td>
                  <td className="py-2 border">
                    <a
                      href={submission.ansDocURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Document
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentView;
