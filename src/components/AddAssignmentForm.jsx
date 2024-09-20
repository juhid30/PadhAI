import React, { useState } from "react";
import { addAssignmentForStudent } from "../utils/firestoreUtils";
import { uploadAssignmentFile } from "../utils/storageUtils";

const AddAssignmentForm = ({ studentId }) => {
  const [subject, setSubject] = useState("");
  const [assignmentTopic, setAssignmentTopic] = useState("");
  const [dateOfAssignment, setDateOfAssignment] = useState("");
  const [dateOfSubmission, setDateOfSubmission] = useState("");
  const [file, setFile] = useState(null); // File state
  const [teacherId, setTeacherId] = useState(""); // Fetch or input the teacher ID

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      console.log("Selected file:", e.target.files[0]); // Check if file is being captured
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docURL = file ? await uploadAssignmentFile(file) : null;

    const assignmentData = {
      doa: new Date(dateOfAssignment),
      docURL,
      dos: dateOfSubmission ? new Date(dateOfSubmission) : null,
      subject,
      teacherId,
      topic: assignmentTopic,
    };

    await addAssignmentForStudent(assignmentData, studentId);
    // Reset form
    setSubject("");
    setAssignmentTopic("");
    setDateOfAssignment("");
    setDateOfSubmission("");
    setFile(null);
  };

  return (
    <form
      className="max-w-md mx-auto p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg text-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        Add Assignment
      </h2>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        value={assignmentTopic}
        onChange={(e) => setAssignmentTopic(e.target.value)}
        placeholder="Assignment Topic"
        required
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="date"
        value={dateOfAssignment}
        onChange={(e) => setDateOfAssignment(e.target.value)}
        required
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="date"
        value={dateOfSubmission}
        onChange={(e) => setDateOfSubmission(e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="w-full mb-4 text-gray-700"
      />
      <button
        type="submit"
        className="w-full p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Assignment
      </button>
    </form>
  );
};

export default AddAssignmentForm;
