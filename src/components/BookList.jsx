import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Your Firebase config file
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentBooksBorrowed, setStudentBooksBorrowed] = useState([]);
  const [skills, setSkills] = useState([]);

  // Fetch the books data from Firestore
  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, "Library");
      const booksSnapshot = await getDocs(booksCollection);
      const booksList = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksList);
    };

    fetchBooks();
  }, []);

  // Fetch the student's skills from Firestore
  async function getSkills() {
    const studentId = localStorage.getItem("studentId"); // Retrieve the doc ID
    const docRef = doc(db, "students", studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const skills =
        docSnap.data()?.resumeAnalysis?.response?.resume_evaluation
          ?.technical_skills || [];
      setSkills(skills); // Store skills in state
    } else {
      console.log("No such document!");
    }
  }

  // Fetch the student's borrowed books
  const fetchStudentData = async () => {
    const studentId = localStorage.getItem("studentId");
    if (studentId) {
      const studentRef = doc(db, "Student", studentId);
      const studentSnapshot = await getDoc(studentRef);
      if (studentSnapshot.exists()) {
        const data = studentSnapshot.data();
        setStudentBooksBorrowed(data.booksBorrowed || []);
      }
    }
  };

  // Call the getSkills and fetchStudentData when the component mounts
  useEffect(() => {
    getSkills(); // Fetch skills of the student
    fetchStudentData(); // Fetch books borrowed by the student
  }, []);

  // Add book to cart (Max 4, only one of each kind)
  const addToCart = (book) => {
    // Check if the book is already borrowed by the student
    if (
      studentBooksBorrowed.some(
        (borrowedBook) => borrowedBook.bookId === book.id
      )
    ) {
      alert(`You have already issued "${book.bookName}"`);
      return;
    }

    if (cart.length < 4) {
      if (!cart.some((item) => item.id === book.id)) {
        setCart([...cart, book]);
      }
    }
  };

  // Remove book from cart
  const removeFromCart = (bookId) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

  // Handle the "Issue Books" action
  const issueBooks = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      alert("Student ID not found.");
      return;
    }

    const studentRef = doc(db, "Student", studentId);
    const studentSnapshot = await getDoc(studentRef);
    if (studentSnapshot.exists()) {
      const data = studentSnapshot.data();
      const currentBooksBorrowed = data.booksBorrowed || [];

      if (currentBooksBorrowed.length >= 4) {
        alert(
          "You cannot borrow more than 4 books at a time. Please return some books."
        );
        return;
      }

      if (currentBooksBorrowed.length + cart.length > 4) {
        alert(
          `You can only borrow ${4 - currentBooksBorrowed.length} more book(s)`
        );
        return;
      }

      const newBooksBorrowed = [
        ...currentBooksBorrowed,
        ...cart.map((book) => ({
          bookId: book.id,
          bookName: book.bookName,
          dateOfIssue: new Date().toLocaleDateString("en-GB"), // format: DD/MM/YYYY
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 7)
          ).toLocaleDateString("en-GB"), // 7 days later
        })),
      ];

      await updateDoc(studentRef, {
        booksBorrowed: newBooksBorrowed,
      });

      alert("Books have been issued!");
      setCart([]); // Clear cart after issuing books
      setShowModal(false); // Close modal
    } else {
      alert("Student data not found.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Library Books
      </h1>

      {/* Display skills */}
      <div className="mb-6">
        <h2 className="text-xl text-gray-700">Your Skills:</h2>
        {skills.length > 0 ? (
          <ul>
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-600">
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No skills found</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center text-center"
          >
            <img
              src={book.bookImage}
              alt={book.bookName}
              className="w-24 h-36 object-cover mb-3"
            />

            <h2 className="text-lg font-semibold text-gray-800">
              {book.bookName}
            </h2>
            <p className="text-sm text-gray-600">by {book.author}</p>
            <p className="text-sm text-gray-600">
              Quantity: {book.quantityAvailable}
            </p>

            {cart.some((item) => item.id === book.id) ? (
              <button
                onClick={() => removeFromCart(book.id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition"
              >
                Remove from Cart
              </button>
            ) : (
              <button
                onClick={() => addToCart(book)}
                className="mt-4 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="fixed bottom-5 right-5">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition"
        >
          View Cart ({cart.length})
        </button>
      </div>

      {/* Modal for Cart */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-1/2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Cart</h2>
            {cart.length > 0 ? (
              <ul className="mb-6">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.bookImage}
                        alt={item.bookName}
                        className="w-12 h-16 object-cover mr-3"
                      />
                      <div>
                        <p className="text-lg text-gray-800">{item.bookName}</p>
                        <p className="text-sm text-gray-600">
                          by {item.author}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}

            <div className="flex justify-end">
              {cart.length > 0 && (
                <button
                  onClick={issueBooks}
                  className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition"
                >
                  Issue Books
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
