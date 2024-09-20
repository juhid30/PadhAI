import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddAssignmentForm = () => {
  const [subject, setSubject] = useState("");
  const [assignmentTopic, setAssignmentTopic] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [teacherId, setTeacherId] = useState(""); // Teacher ID
  const [year, setYear] = useState(""); // Year for the assignment

  // Today's date as date of assignment
  const dateOfAssignment = new Date().toISOString().split("T")[0];

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create Date object for due date
    const dos = dueDate ? new Date(dueDate) : null;

    // Ensure the due date is valid
    if (dos && isNaN(dos.getTime())) {
      console.error("Invalid due date:", dueDate);
      return;
    }

    const assignmentData = {
      doa: dateOfAssignment, // Date of assignment
      dos, // Due date
      subject, // Subject of the assignment
      teacherId, // Teacher ID
      topic: assignmentTopic, // Assignment topic
      year, // Year of the student
    };

    try {
      // Add assignmentData to "AssignmentRecord" collection in Firestore
      await addDoc(collection(db, "AssignmentRecord"), assignmentData);

      // Reset form fields
      setSubject("");
      setAssignmentTopic("");
      setDueDate("");
      setFile(null);
      setYear("");
    } catch (error) {
      console.error("Error adding assignment: ", error);
    }
  };

  return (
    <form
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Add Assignment</h2>

      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        value={assignmentTopic}
        onChange={(e) => setAssignmentTopic(e.target.value)}
        placeholder="Assignment Topic"
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="w-full mb-4 text-gray-700"
      />

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select Year
        </option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>

      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Add Assignment
      </button>
    </form>
  );
};

export default AddAssignmentForm;
