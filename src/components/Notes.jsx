import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, 'Notes'); // Adjust 'notes' to your collection name
      const notesSnapshot = await getDocs(notesCollection);
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    };

    fetchNotes();
  }, []);

  return (
    <div className="bg-light min-h-screen p-4">
      <h1 className="text-3xl font-bold text-primary mb-4">Student Notes</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-primary text-light">
            <tr>
              <th className="py-2 px-4 text-left">Topic</th>
              <th className="py-2 px-4 text-left">Subject</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-300">{note.topic}</td>
                <td className="py-2 px-4 border-b border-gray-300">{note.subject}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notes;
