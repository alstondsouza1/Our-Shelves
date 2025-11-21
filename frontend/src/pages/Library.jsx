import React from "react";
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import "./css/Library.css";

// Library component to fetch and display all books
const Library = () => {

    const [books, setBooks] = useState([]);

    {Array.isArray(books) && books.length > 0 ? (
      books.map(book => (
        <BookCard key={book.id} book={book} />
      ))
    ) : (
      <p>No books found.</p>
    )}
      
    // Function to fetch all books from the backend API
    const getBooks = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/books`);
        const data = await response.json();
        setBooks(data);
    }

      const handleDelete = (deletedBookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedBookId));
  };

    // Load all books when the component mounts
    useEffect(() => {
        getBooks();
    }, []);

    return (
        <div className="library-container">
            <h1 className="library-heading">My Library</h1>
            {books.map((book) => (
                <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
        </div>
    )
}

export default Library;