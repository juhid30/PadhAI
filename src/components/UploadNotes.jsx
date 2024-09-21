import React, { useState } from "react";
import { db, storage } from "../../firebase"; // Make sure to import storage from your Firebase configuration
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const UploadNotes = () => {
  const [documentName, setDocumentName] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [year, setYear] = useState("");
  const [responseText, setResponseText] = useState(""); // For API response
  const [teacherId, setTeacherId] = useState("example"); // Assuming you have a teacherId state

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Function to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract base64
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      // Convert file to base64 for AI analysis
      const base64Image = await toBase64(file);
      const API_KEY = "AIzaSyCVOV_MuOdKNFYVTQOzjtjpSDqL73FspW8 "; // Replace with your actual API key
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt =
        "Tell me how accurate this information is on a scale of 1 to 100. Give me only a number and nothing else.";
      const image = {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      };

      // Get AI response
      const result = await model.generateContent([prompt, image]);
      const accuracy = result.response.text(); // Assuming this is the accuracy response

      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `notes/${file.name}`);
      await uploadString(storageRef, base64Image, "base64");

      // Get the download URL
      const docURL = await getDownloadURL(storageRef);

      // Upload metadata to Firestore
      await addDoc(collection(db, "Notes"), {
        topic: documentName,
        subject,
        year,
        docURL,
        accuracy,
        teacherId, // Make sure to set this appropriately
      });

      setResponseText(`Document uploaded successfully! Accuracy: ${accuracy}`);
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-[100%]">
      <form
        className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-purple-700 mb-6">
          Upload Document
        </h2>

        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Document Name"
          required
          className="w-full p-4 mb-4 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          required
          className="w-full p-4 mb-4 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Custom File Upload Button */}
        <div className="mb-4">
          <label
            className="w-full p-4 flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-400 rounded-lg cursor-pointer hover:bg-purple-500 hover:text-white transition-all duration-200"
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
          className="w-full p-4 mb-6 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="w-full p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-200"
        >
          Upload Document
        </button>

        {/* Display the API response */}
        {responseText && (
          <div className="mt-6 p-4 bg-purple-100 text-purple-800 rounded-lg">
            <p>{responseText}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadNotes;
