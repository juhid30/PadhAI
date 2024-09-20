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
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">
          Add Assignment
        </h2>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
          className="w-full p-4 mb-4 text-indigo-600 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="text"
          value={assignmentTopic}
          onChange={(e) => setAssignmentTopic(e.target.value)}
          placeholder="Assignment Topic"
          required
          className="w-full p-4 mb-4 text-indigo-600 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full p-4 mb-4 text-indigo-600 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Enhanced Custom File Upload Button */}
        <div className="mb-4">
          <label
            className="w-full p-4 flex items-center justify-center bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-lg cursor-pointer hover:bg-indigo-200 hover:text-indigo-900 transition-all duration-200"
            htmlFor="file-upload"
          >
            {file ? file.name : "Upload File"}
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full p-4 mb-6 text-indigo-600 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
          className="w-full p-4 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 transition duration-200"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
};

export default AddAssignmentForm;
