import React, { useEffect, useState } from "react";
import {
  getStudentAssignments,
  submitAssignmentAnswer,
} from "../utils/firestoreUtils";
import { uploadAnswerFile } from "../utils/storageUtils";

const AssignmentSubmission = ({ studentId }) => {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [pastDueAssignments, setPastDueAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null); // State for managing expanded sections

  useEffect(() => {
    const fetchAssignments = async () => {
      const allAssignments = await getStudentAssignments(studentId);

      const currentDate = new Date();
      const pending = [];
      const pastDue = [];
      const submitted = [];

      allAssignments.forEach((assignment) => {
        if (assignment.hasSubmitted) {
          submitted.push(assignment);
        } else if (assignment.dos && new Date(assignment.dos) < currentDate) {
          pastDue.push(assignment);
        } else {
          pending.push(assignment);
        }
      });

      setPendingAssignments(pending);
      setPastDueAssignments(pastDue);
      setSubmittedAssignments(submitted);
    };

    fetchAssignments();
  }, [studentId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitAnswer = async (index) => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const answerDocURL = await uploadAnswerFile(selectedFile);
    await submitAssignmentAnswer(studentId, index, answerDocURL);

    const updatedAssignments = await getStudentAssignments(studentId);
    categorizeAssignments(updatedAssignments);
  };

  const categorizeAssignments = (assignments) => {
    const currentDate = new Date();
    const pending = [];
    const pastDue = [];
    const submitted = [];

    assignments.forEach((assignment) => {
      if (assignment.hasSubmitted) {
        submitted.push(assignment);
      } else if (assignment.dos && new Date(assignment.dos) < currentDate) {
        pastDue.push(assignment);
      } else {
        pending.push(assignment);
      }
    });

    setPendingAssignments(pending);
    setPastDueAssignments(pastDue);
    setSubmittedAssignments(submitted);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>

      {/* Pending Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-blue-600 text-white p-4 rounded-lg mb-2"
          onClick={() => toggleSection("pending")}
        >
          <h2 className="text-2xl font-semibold">Pending Assignments</h2>
          <span>{expandedSection === "pending" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pending" && (
          <ul>
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((assignment, index) => (
                <li
                  key={index}
                  className="p-4 mb-2 bg-white shadow-md rounded-lg"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(assignment.dos).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="my-3"
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => handleSubmitAnswer(index)}
                  >
                    Submit Answer
                  </button>
                </li>
              ))
            ) : (
              <p>No pending assignments.</p>
            )}
          </ul>
        )}
      </section>

      {/* Past Due Assignments */}
      <section className="mb-6">
        <div
          className="flex justify-between items-center cursor-pointer bg-red-600 text-white p-4 rounded-lg mb-2"
          onClick={() => toggleSection("pastDue")}
        >
          <h2 className="text-2xl font-semibold">Past Due Assignments</h2>
          <span>{expandedSection === "pastDue" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "pastDue" && (
          <ul>
            {pastDueAssignments.length > 0 ? (
              pastDueAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="p-4 mb-2 bg-white shadow-md rounded-lg"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(assignment.dos).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <p className="text-red-500 font-bold">Past Due!</p>
                </li>
              ))
            ) : (
              <p>No past due assignments.</p>
            )}
          </ul>
        )}
      </section>

      {/* Submitted Assignments */}
      <section>
        <div
          className="flex justify-between items-center cursor-pointer bg-green-600 text-white p-4 rounded-lg mb-2"
          onClick={() => toggleSection("submitted")}
        >
          <h2 className="text-2xl font-semibold">Submitted Assignments</h2>
          <span>{expandedSection === "submitted" ? "▲" : "▼"}</span>
        </div>
        {expandedSection === "submitted" && (
          <ul>
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((assignment, index) => (
                <li
                  key={index}
                  className="p-4 mb-2 bg-white shadow-md rounded-lg"
                >
                  <h3 className="text-xl font-semibold">{assignment.topic}</h3>
                  <p>Subject: {assignment.subject}</p>
                  <p>
                    Date of Assignment:{" "}
                    {new Date(assignment.doa).toLocaleDateString()}
                  </p>
                  <p>
                    Due Date:{" "}
                    {assignment.dos
                      ? new Date(assignment.dos).toLocaleDateString()
                      : "No due date"}
                  </p>
                  <p>
                    Submitted Answer:{" "}
                    <a
                      href={assignment.ansDocURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Submission
                    </a>
                  </p>
                </li>
              ))
            ) : (
              <p>No submitted assignments.</p>
            )}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AssignmentSubmission;
