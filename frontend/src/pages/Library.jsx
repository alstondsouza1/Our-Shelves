import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import "./css/Library.css";

const Library = () => {
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/books`);
      const data = await response.json();

      // Ensure it's always an array
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    }
  };

  const handleDelete = (deletedBookId) => {
    setBooks((prevBooks) =>
      prevBooks.filter((book) => book.id !== deletedBookId)
    );
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="library-container">
      <h1 className="library-heading">My Library</h1>

      {!Array.isArray(books) ? (
        <p>Loading...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
};

export default Library;
