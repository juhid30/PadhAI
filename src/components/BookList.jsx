import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Your Firebase config file
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const BookCard = ({ book, onAddToCart, onRemoveFromCart, isInCart }) => {
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
      <button
        onClick={isInCart ? onRemoveFromCart : onAddToCart}
        className={`mt-4 py-2 px-4 rounded-full transition ${
          isInCart
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-black hover:bg-gray-800 text-white"
        }`}
      >
        {isInCart ? "Remove from Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = "library-test-student";
  // localStorage.getItem("studentId");

  useEffect(() => {
    //   const fetchBooks = async () => {
    //     setLoading(true);
    //     try {
    //       const booksCollection = collection(db, "Library");
    //       const booksSnapshot = await getDocs(booksCollection);
    //       const booksList = booksSnapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //       }));
    //       setBooks(booksList);
    //     } catch (error) {
    //       console.error("Error fetching books:", error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const fetchStudentData = async () => {
      if (studentId) {
        const studentRef = doc(db, "Student", studentId);
        const studentSnapshot = await getDoc(studentRef);
        if (studentSnapshot.exists()) {
          const data = studentSnapshot.data();

          // Fetch recommended books from the student document
          const recommendedBooks = data.recommendedBooks || [];

          // // Fetch the existing books from Firestore to ensure they're available
          // const booksCollection = collection(db, "Library");
          // const booksSnapshot = await getDocs(booksCollection);
          // const allBooks = booksSnapshot.docs.map((doc) => ({
          //   id: doc.id,
          //   ...doc.data(),
          // }));

          // // Filter recommended books that are available in the library
          // const availableRecommendedBooks = recommendedBooks.filter((recBook) =>
          //   allBooks.some((libBook) => libBook.id === recBook.id)
          // );

          // setBooks((prevBooks) => [...prevBooks, ...availableRecommendedBooks]);

          setSkills(
            data.resume_analysis?.response?.resume_evaluation
              ?.key_qualifications_and_experience?.technical_skills || []
          );
        }
      }
    };

    // fetchBooks();
    fetchStudentData();
  }, [studentId]);

  const addToCart = (book) => {
    if (cart.length < 4 && !cart.some((item) => item.id === book.id)) {
      setCart([...cart, book]);
    } else {
      alert(
        cart.length >= 4
          ? "You can only borrow up to 4 books."
          : `"${book.bookName}" is already in your cart.`
      );
    }
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter((item) => item.id !== bookId));
  };

  const issueBooks = async () => {
    if (!studentId) return alert("Student ID not found.");
    const studentRef = doc(db, "Student", studentId);
    const studentSnapshot = await getDoc(studentRef);
    if (studentSnapshot.exists()) {
      const data = studentSnapshot.data();
      const currentBooksBorrowed = data.booksBorrowed || [];
      if (currentBooksBorrowed.length + cart.length > 4) {
        return alert(
          `You can only borrow ${4 - currentBooksBorrowed.length} more book(s).`
        );
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

      await updateDoc(studentRef, { booksBorrowed: newBooksBorrowed });
      alert("Books have been issued!");
      setCart([]);
      setShowModal(false);
    } else {
      alert("Student data not found.");
    }
  };

  return (
    <div className="container mx-auto mt-8 w-[100%]">
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
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                  onAddToCart={() => addToCart(book)}
                  onRemoveFromCart={() => removeFromCart(book.id)}
                  isInCart={cart.some((item) => item.id === book.id)}
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
