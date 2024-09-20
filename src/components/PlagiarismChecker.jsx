import React, { useState } from "react";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import getDownloadURL
import axios from "axios";

const PlagiarismChecker = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const storageRef = ref(storage, `plag/${file.name}`);
    await uploadBytes(storageRef, file);

    // Get the file URL
    const fileUrl = await getDownloadURL(storageRef); // Correctly call getDownloadURL

    // Call your backend to check plagiarism using the fileUrl
    try {
      const response = await axios.post(
        "http://localhost:5000/check_plagiarism",
        {
          fileUrl,
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-lg">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Check Plagiarism
        </button>
      </form>
      {result && <div className="mt-4">{JSON.stringify(result)}</div>}
    </div>
  );
};

export default PlagiarismChecker;
