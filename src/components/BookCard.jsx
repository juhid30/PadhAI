import React from "react";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2">
      <img
        src={book.bookImage}
        alt={book.bookName}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <h3 className="text-lg font-bold mt-2">{book.bookName}</h3>
      <p className="text-gray-600">Author: {book.author}</p>
      <p className="text-gray-600">Available: {book.quantityAvailable}</p>
    </div>
  );
};

export default BookCard;
