import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, 'Notes');
      const notesSnapshot = await getDocs(notesCollection);
      const notesData = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  const handleViewDocument = (docURL) => {
    window.open(docURL, '_blank');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Student Notes</h1>
      <div className="overflow-x-auto rounded-t-xl border border-gray-300 ">
        <table className="min-w-full shadow-md">
          <thead className="bg-[#3e8efe]">
            <tr className="border-b">
              <th className="py-4 font-bold px-5 text-left text-gray-700 rounded-tl-lg">Subject</th>
              <th className="py-4 font-bold px-5 text-left text-gray-700">Topic</th>
              <th className="py-4 font-bold px-5 text-left text-gray-700">Accuracy</th>
              <th className="py-4 font-bold px-5 text-left text-gray-700 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-5">{note.subject}</td>
                <td className="py-4 px-5">{note.topic}</td>
                <td className="py-4 px-5">{note.accuracy}</td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => handleViewDocument(note.docURL)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notes;
