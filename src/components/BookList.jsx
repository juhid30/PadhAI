import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Your Firebase config file
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import axios from "axios"; // Use axios for making HTTP requests

const BookCard = ({ book, addToCart, removeFromCart, inCart }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center text-center">
      <img
        src={book.bookImage}
        alt={book.bookName}
        className="w-24 h-36 object-cover mb-3"
      />
      <h2 className="text-lg font-semibold text-gray-800">{book.bookName}</h2>
      <p className="text-sm text-gray-600">by {book.author}</p>
      <p className="text-sm text-gray-600">
        Quantity: {book.quantityAvailable}
      </p>
      {inCart ? (
        <button
          onClick={removeFromCart}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition"
        >
          Remove from Cart
        </button>
      ) : (
        <button
          onClick={addToCart}
          className="mt-4 bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [studentBooksBorrowed, setStudentBooksBorrowed] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsFetched, setRecommendationsFetched] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const booksCollection = collection(db, "Library");
        const booksSnapshot = await getDocs(booksCollection);
        const booksList = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getSkillsAndFetchSuggestions = async () => {
    try {
      const studentId = "library-test-student"; // Replace with actual student ID
      const docRef = doc(db, "Student", studentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const skills =
          docSnap.data()?.resume_analysis?.response?.resume_evaluation
            ?.key_qualifications_and_experience?.technical_skills || [];
        setSkills(skills);

        // Call the Flask API here to get recommendations (not shown)
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching skills or calling API:", error);
    }
  };

  const fetchStudentData = async () => {
    const studentId = "library-test-student";
    // localStorage.getItem("studentId");
    if (studentId) {
      const studentRef = doc(db, "Student", studentId);
      const studentSnapshot = await getDoc(studentRef);
      if (studentSnapshot.exists()) {
        const data = studentSnapshot.data();
        setStudentBooksBorrowed(data.booksBorrowed || []);

        // Fetch recommended books from the student document
        const recommendedBooks = data.recommendedBooks || [];

        // Combine current books with recommended books, ensuring no duplicates
        setBooks((prevBooks) => {
          const existingIds = new Set(prevBooks.map((book) => book.id));
          const uniqueRecommendedBooks = recommendedBooks.filter(
            (book) => !existingIds.has(book.id)
          );
          return [...prevBooks, ...uniqueRecommendedBooks];
        });
      }
    }
  };

  useEffect(() => {
    getSkillsAndFetchSuggestions();
    fetchStudentData();
  }, []);

  const addToCart = (book) => {
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

  const removeFromCart = (bookId) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

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
          dateOfIssue: new Date().toLocaleDateString("en-GB"),
          dueDate: new Date(
            new Date().setDate(new Date().getDate() + 7)
          ).toLocaleDateString("en-GB"),
        })),
      ];

      await updateDoc(studentRef, {
        booksBorrowed: newBooksBorrowed,
      });

      alert("Books have been issued!");
      setCart([]);
      setShowModal(false);
    } else {
      alert("Student data not found.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Library Books
      </h1>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <>
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

          <div className="mb-6">
            <h2 className="text-xl text-gray-700">Recommended Books:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.length === 0 && <p>No recommended books found.</p>}
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  addToCart={() => addToCart(book)}
                  removeFromCart={() => removeFromCart(book.id)}
                  inCart={cart.some((item) => item.id === book.id)}
                />
              ))}
            </div>
          </div>

          <div className="fixed bottom-5 right-5">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 transition"
            >
              View Cart ({cart.length})
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
              <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-1/2">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Your Cart
                </h2>
                {cart.length > 0 ? (
                  <ul className="mb-6">
                    {cart.map((book) => (
                      <li key={book.id} className="flex justify-between mb-2">
                        <span>{book.bookName}</span>
                        <button
                          onClick={() => removeFromCart(book.id)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Your cart is empty.</p>
                )}
                <button
                  onClick={issueBooks}
                  className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
                >
                  Issue Books
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="ml-4 bg-gray-400 text-white py-2 px-4 rounded-full hover:bg-gray-500 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
