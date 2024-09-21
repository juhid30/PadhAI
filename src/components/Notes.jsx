import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(db, "Notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesData = notesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  const handleViewDocument = (docURL) => {
    window.open(docURL, "_blank");
  };

  return (
    <div className="p-6 w-full bg-purple-50">
      <h1 className="text-3xl font-bold mb-6 text-purple-900 text-center">
        Student Notes
      </h1>
      <div className="overflow-x-auto rounded-lg border border-purple-300 shadow-lg">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-purple-700 text-white rounded-t-lg">
            <tr className="border-b">
              <th className="py-4 font-bold px-5 text-left rounded-tl-lg">
                Subject
              </th>
              <th className="py-4 font-bold px-5 text-left">Topic</th>
              <th className="py-4 font-bold px-5 text-left">Accuracy</th>
              <th className="py-4 font-bold px-5 text-left rounded-tr-lg">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr
                key={note.id}
                className="border-b hover:bg-purple-100 transition duration-200"
              >
                <td className="py-4 px-5 text-purple-800">{note.subject}</td>
                <td className="py-4 px-5 text-purple-800">{note.topic}</td>
                <td className="py-4 px-5 text-purple-800">{note.accuracy}</td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => handleViewDocument(note.docURL)}
                    className="text-purple-600 hover:underline font-semibold"
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
