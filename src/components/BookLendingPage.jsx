import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const BookLendingPage = () => {
  const [student, setStudent] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const studentId = "library-test-student"; // Replace with localStorage.getItem("studentId");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentDoc = await getDoc(doc(db, "Student", studentId));
        if (studentDoc.exists()) {
          const studentData = studentDoc.data();
          setStudent(studentData);
        } else {
          console.error("No such student document!");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const handleAddToCart = (book) => {
    if (!cart.includes(book)) {
      setCart([...cart, book]);
    }
  };

  const handleIssueBooks = async () => {
    if (studentId) {
      try {
        await updateDoc(doc(db, "Student", studentId), {
          booksBorrowed: [...(student.booksBorrowed || []), ...cart],
        });
        alert("Books issued successfully!");
        setCart([]);
        setShowCart(false);
      } catch (error) {
        console.error("Error issuing books:", error);
      }
    }
  };

  const handleCancel = () => {
    setCart([]);
    setShowCart(false);
  };

  if (!student) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-purple-200 to-purple-300 min-h-screen p-8 text-gray-800">
      <div className="container mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-6xl font-bold text-center text-purple-800 mb-6">
          Welcome to the Library System!
        </h1>
        <h2 className="text-4xl font-bold text-center text-purple-800 mb-4">
          Hello, {student.name}
        </h2>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Your Technical Skills:
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {student.resume_analysis?.response?.resume_evaluation?.key_qualifications_and_experience?.technical_skills.map(
            (skill, index) => (
              <span
                key={index}
                className="bg-purple-300 text-gray-800 px-4 py-2 rounded-full text-sm"
              >
                {skill}
              </span>
            )
          )}
        </div>

        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Recommended Books:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {student.recommendedBooks?.map((book, index) => (
            <div
              key={index}
              className="bg-purple-100 rounded-lg shadow-lg p-4 flex transition-transform transform hover:scale-105"
            >
              {book.bookImage && (
                <div className="flex-shrink-0 h-48 w-32 overflow-hidden mr-4">
                  <img
                    src={book.bookImage}
                    alt={book.bookName}
                    className="h-full w-full object-fit rounded-lg"
                  />
                </div>
              )}
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {book.bookName}
                </h3>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600">
                  Available: {book.quantityAvailable}
                </p>
                <button
                  onClick={() => handleAddToCart(book)}
                  className="mt-2 bg-purple-300 text-gray-800 px-4 py-2 rounded hover:bg-purple-400 transition absolute bottom-4 right-4"
                >
                  Borrow
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="mt-4 bg-green-300 text-gray-800 px-4 py-2 rounded hover:bg-green-400 transition"
        >
          View Cart ({cart.length})
        </button>

        {showCart && (
          <div className="mt-4 border p-4 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Your Cart:</h2>
            <ul className="mt-2">
              {cart.map((book, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-gray-700"
                >
                  <span>{book.bookName}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleCancel}
                className="bg-red-300 text-gray-800 px-4 py-2 rounded hover:bg-red-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueBooks}
                className="bg-purple-300 text-gray-800 px-4 py-2 rounded hover:bg-purple-400 transition"
              >
                Issue Books
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookLendingPage;
