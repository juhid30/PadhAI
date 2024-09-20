import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Your Firebase config file
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const BorrowedBooksPage = () => {
  const [students, setStudents] = useState([]);
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch students and filter out those with no borrowed books
  const fetchStudents = async () => {
    const studentsCollection = collection(db, "Student");
    const studentsSnapshot = await getDocs(studentsCollection);
    const studentsList = await Promise.all(
      studentsSnapshot.docs.map(async (studentDoc) => {
        const studentData = studentDoc.data();
        const borrowedBooks = studentData.booksBorrowed || [];
        return borrowedBooks.length > 0
          ? {
              id: studentDoc.id,
              name: studentData.name || "Unknown Student",
              books: borrowedBooks,
            }
          : null;
      })
    );
    setStudents(studentsList.filter((student) => student !== null)); // Only include students with borrowed books
  };

  // Return book function and remove student if no books left
  const returnBook = async (studentId, bookId) => {
    const studentRef = doc(db, "Student", studentId);
    const studentSnap = await getDoc(studentRef);
    if (studentSnap.exists()) {
      const data = studentSnap.data();
      const updatedBooks = data.booksBorrowed.filter(
        (book) => book.bookId !== bookId
      );

      await updateDoc(studentRef, { booksBorrowed: updatedBooks });

      // Update UI after returning the book
      setStudents(
        (prevStudents) =>
          prevStudents
            .map((student) =>
              student.id === studentId
                ? { ...student, books: updatedBooks }
                : student
            )
            .filter((student) => student.books.length > 0) // Remove student from list if no books are left
      );

      alert("Book has been returned.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search filter for student names
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="border-b">
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-200"
                onClick={() =>
                  setExpandedStudentId(
                    expandedStudentId === student.id ? null : student.id
                  )
                }
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {student.name}
                </h2>
                {student.books.length > 0 && (
                  <button className="text-blue-500">
                    {expandedStudentId === student.id
                      ? "Hide Books"
                      : "Show Books"}
                  </button>
                )}
              </div>
              {expandedStudentId === student.id && student.books.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  {student.books.map((book) => (
                    <div
                      key={book.bookId}
                      className="flex items-center justify-between p-2 border-b"
                    >
                      <div className="flex items-center">
                        <img
                          src={book.bookImage}
                          alt={book.bookName}
                          className="w-10 h-14 object-cover mr-2"
                        />
                        <div>
                          <p className="text-gray-800">{book.bookName}</p>
                          <p className="text-gray-600 text-sm">
                            Issued on: {book.dateOfIssue}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Due: {book.dueDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => returnBook(student.id, book.bookId)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Return
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No students found.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooksPage;
