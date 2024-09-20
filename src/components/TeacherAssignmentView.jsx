import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const TeacherAssignmentView = () => {
  const [assignments, setAssignments] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        // Fetch all submitted assignments
        const submittedAssignmentsSnapshot = await getDocs(collection(db, 'SubmittedAssignments'));
        const submittedAssignments = submittedAssignmentsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Fetch all assignment records
        const assignmentRecordsSnapshot = await getDocs(collection(db, 'AssignmentRecord'));
        const assignmentRecords = assignmentRecordsSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Map through submitted assignments and match with assignment records
        const assignmentsData = submittedAssignments.map(submittedAssignment => {
          const assignmentRecord = assignmentRecords.find(record => record.id === submittedAssignment.assignmentId);
          const isLate = new Date(submittedAssignment.submissionDate) > new Date(assignmentRecord.dueDate);

          return {
            subject: assignmentRecord.subject,
            topic: assignmentRecord.topic,
            isLate,
            docURL: submittedAssignment.docURL,
          };
        });

        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [db]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submitted Assignments</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Subject</th>
            <th className="border border-gray-300 px-4 py-2">Topic</th>
            <th className="border border-gray-300 px-4 py-2">Late Submission</th>
            <th className="border border-gray-300 px-4 py-2">Document</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{assignment.subject}</td>
              <td className="border border-gray-300 px-4 py-2">{assignment.topic}</td>
              <td className="border border-gray-300 px-4 py-2">{assignment.isLate ? 'Yes' : 'No'}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={assignment.docURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
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
