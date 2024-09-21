import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const navigate = useNavigate(); // Use the navigate hook

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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userRole"); // Remove selectedRole from localStorage
    navigate("/"); // Navigate to the login page
    window.location.reload(); // Reload the page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6 w-full">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-shadow"
          style={{ padding: "0.5rem 1rem" }} // Added padding
        >
          Logout
        </button>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Borrowed Books
        </h1>

        <input
          type="text"
          placeholder="Search by student name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.id} className="border-b mb-4">
              <div
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-200 transition"
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
                  <button className="text-blue-600 font-medium hover:underline">
                    {expandedStudentId === student.id
                      ? "Hide Books"
                      : "Show Books"}
                  </button>
                )}
              </div>
              {expandedStudentId === student.id && student.books.length > 0 && (
                <div className="p-4 bg-gray-100 rounded-b-lg">
                  {student.books.map((book) => (
                    <div
                      key={book.bookId}
                      className="flex items-center justify-between p-2 border-b border-gray-300"
                    >
                      <div className="flex items-center">
                        <img
                          src={book.bookImage}
                          alt={book.bookName}
                          className="w-12 h-16 object-cover mr-3 rounded shadow"
                        />
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {book.bookName}
                          </p>
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
                        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
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
