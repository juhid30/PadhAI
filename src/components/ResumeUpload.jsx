import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase";
import React, { useState } from "react";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve student ID from local storage
    const studentId = "library-test-student";
    // localStorage.getItem("studentId");

    if (!studentId) {
      setMessage("Student ID not found in local storage.");
      return;
    }

    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Assuming the response contains some resume analysis data
        const resumeAnalysis = await response.json();

        console.log(resumeAnalysis);
        // Update the resume_analysis field in the Students collection
        const studentRef = doc(db, "Student", studentId);
        await updateDoc(studentRef, {
          resume_analysis: resumeAnalysis, // Update with the actual data
        });

        setMessage("File uploaded and resume analysis updated successfully!");
      } else {
        setMessage("Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during upload.");
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-xl font-semibold mb-4">Upload Your Resume</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          className="border p-2 rounded"
          onChange={handleFileChange}
          required
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default ResumeUpload;
