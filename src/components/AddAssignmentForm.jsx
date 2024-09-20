// src/components/AddAssignmentForm.jsx
import React, { useState } from "react";
import { addAssignmentForStudent } from "../utils/firestoreUtils";
import { uploadAssignmentFile } from "../utils/storageUtils";

const AddAssignmentForm = ({ studentId }) => {
  const [subject, setSubject] = useState("");
  const [assignmentTopic, setAssignmentTopic] = useState("");
  const [dateOfAssignment, setDateOfAssignment] = useState("");
  const [dateOfSubmission, setDateOfSubmission] = useState("");
  const [file, setFile] = useState(null);
  const [teacherId, setTeacherId] = useState(""); // Fetch or input the teacher ID

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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
      />
      <input
        type="text"
        value={assignmentTopic}
        onChange={(e) => setAssignmentTopic(e.target.value)}
        placeholder="Assignment Topic"
        required
      />
      <input
        type="date"
        value={dateOfAssignment}
        onChange={(e) => setDateOfAssignment(e.target.value)}
        required
      />
      <input
        type="date"
        value={dateOfSubmission}
        onChange={(e) => setDateOfSubmission(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Add Assignment</button>
    </form>
  );
};

export default AddAssignmentForm;
