import React, { useState } from "react";
import axios from "axios";

const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    const options = {
      method: 'POST',
      url: 'https://plagiarism-source-checker-with-links.p.rapidapi.com/data',
      headers: {
        'x-rapidapi-key': 'fe28f1f18dmshef00579f4c1b0f6p10bd25jsne8944f566fff', // Replace with your actual API key
        'x-rapidapi-host': 'plagiarism-source-checker-with-links.p.rapidapi.com',
        'Content-Type': 'application/json' // Ensure the content type is set correctly
      },
      data: JSON.stringify({ text }) // Sending text as JSON
    };

    try {
      const response = await axios.request(options);
      setResult(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      setError("Error checking plagiarism. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-lg">
      <form onSubmit={handleSubmit}>
        <textarea 
          value={text} 
          onChange={handleTextChange} 
          rows="10" 
          className="w-full p-2 border rounded"
          placeholder="Enter text to check for plagiarism"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Check Plagiarism
        </button>
      </form>
      {result && (
        <div className="mt-4">
          <h3>Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  );
};

export default PlagiarismChecker;
