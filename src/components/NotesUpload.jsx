import React, { useState } from 'react';
import { db } from '../../firebase'; // Ensure the path to your firebase file is correct
import { collection, addDoc } from 'firebase/firestore';

const NotesUpload = () => {
  const [docURL, setDocURL] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherID, setTeacherID] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, 'Notes'), {
        docURL,
        dou: new Date(), // Current timestamp
        subject,
        teacherID,
        topic,
      });
      setDocURL('');
      setSubject('');
      setTeacherID('');
      setTopic('');
      alert('Note uploaded successfully!');
    } catch (err) {
      setError('Failed to upload note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-light rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-primary">Upload Note</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Document URL"
          value={docURL}
          onChange={(e) => setDocURL(e.target.value)}
          required
          className="mb-3 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="mb-3 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Teacher ID"
          value={teacherID}
          onChange={(e) => setTeacherID(e.target.value)}
          required
          className="mb-3 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="mb-3 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-primary text-light rounded hover:bg-primaryDark transition duration-200"
        >
          {loading ? 'Uploading...' : 'Upload Note'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default NotesUpload;
