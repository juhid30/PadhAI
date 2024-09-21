import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../firebase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    // Retrieve student ID from local storage
    const studentId = "library-test-student"; // localStorage.getItem("studentId");

    if (!studentId) {
      setMessage("Student ID not found in local storage.");
      setLoading(false); // Reset loading
      return;
    }

    if (!file) {
      setMessage("Please select a file first.");
      setLoading(false); // Reset loading
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
        const resumeAnalysis = await response.json();

        console.log(resumeAnalysis);
        const studentRef = doc(db, "Student", studentId);
        await updateDoc(studentRef, {
          resume_analysis: resumeAnalysis,
        });

        setMessage("File uploaded and resume analysis updated successfully!");
        navigate("/student-dashboard");
      } else {
        setMessage("Failed to upload the file.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during upload.");
    } finally {
      setLoading(false); // Reset loading at the end
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Upload Your Resume
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            className="border border-gray-300 rounded-lg p-2 w-full transition duration-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            onChange={handleFileChange}
            required
          />
          <button
            type="submit"
            className={`mt-4 px-4 py-2 rounded-lg text-white w-full transition duration-200 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ResumeUpload;
