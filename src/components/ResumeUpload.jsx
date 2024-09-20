import React, { useState } from 'react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Failed to upload the file.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred during upload.');
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
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default ResumeUpload;
