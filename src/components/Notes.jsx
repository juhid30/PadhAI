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
    <div className="flex flex-col h-screen w-full">
      {/* Upper Section */}
      <div className="flex h-[35%] w-full items-center justify-center bg-purple-50 flex-grow">
        <h1 className="text-[5rem] font-bold text-purple-900 text-center">
          Student Notes
        </h1>
      </div>

      {/* Lower Section */}
      <div className="overflow-x-auto bg-white flex-grow rounded-lg border border-purple-300 shadow-lg p-6 h-[65%] w-full m-2">
        <table className="min-w-full">
          <thead className="bg-purple-700 text-white">
            <tr className="border-b">
              <th className="py-4 font-bold px-5 text-left rounded-tl-lg">Subject</th>
              <th className="py-4 font-bold px-5 text-left">Topic</th>
              <th className="py-4 font-bold px-5 text-left">Accuracy</th>
              <th className="py-4 font-bold px-5 text-left rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-b hover:bg-purple-100 transition duration-200">
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
