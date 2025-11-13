import request from "supertest";
import { afterAll, beforeAll, jest } from "@jest/globals";
import app from "../app.js";
import db from "../db.js";

const mockApiResponse = {
    numFound: 1,
    docs: [
        {
            title: "The Hitchhikers Guide to the Galaxy",
            author_name: ["Douglas Adams"],
            first_publish_year: 1979,
            cover_i: 12345,
            number_of_pages_median: 224,
        },
    ],
};

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockApiResponse),
    })
);

let testBookId;

beforeAll(async () => {
    await db.execute("TRUNCATE Table books")
});

afterAll(async () => {
    await db.execute("TRUNCATE TABLE books");
});

describe("App & General Routes Integration Tests", () => {

  test("GET / - Should return the welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Welcome to Our Shelves API!");
  });

  test("GET /db-test - Should return database connection success and books array", async () => {
    const response = await request(app).get("/db-test");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Database connected");
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});

describe("External API Search Integration Tests (bookController.js)", () => {

  test("GET /books/search/:bookName - Should fetch and format books from Open Library API", async () => {
    const searchTerm = "hitchhiker";
    const response = await request(app).get(`/books/search/${searchTerm}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.searchTerm).toBe(searchTerm);
    expect(response.body.totalResults).toBe(1);
    expect(response.body.books).toHaveLength(1);

    const book = response.body.books[0];
    expect(book.title).toBe("The Hitchhikers Guide to the Galaxy");
    expect(book.author).toBe("Douglas Adams");
    expect(book.year).toBe(1979);
    expect(book.cover).not.toBeNull();

    const expectedUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchTerm)}`;
    expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
  });

  test("GET /books/search/:bookName - Should handle an empty search result", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ numFound: 0, docs: [] }),
      })
    );

    const searchTerm = "nonexistentbook";
    const response = await request(app).get(`/books/search/${searchTerm}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.totalResults).toBe(0);
    expect(response.body.books).toHaveLength(0);
  });
});

describe("Local Database CRUD Integration Tests (bookDbController.js)", () => {

  test("POST /books - Should successfully create a new book", async () => {
    const newBook = {
      title: "Test Book One",
      author: "Test Author",
      genre: "Test Genre",
      year: 2023,
      description: "A book for testing CRUD.",
      cover: "http://testcover.jpg"
    };

    const response = await request(app).post("/books").send(newBook);

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.title).toBe(newBook.title);
    
    testBookId = response.body.id;
  });

  test("POST /books - Should return 400 if title is missing", async () => {
    const response = await request(app).post("/books").send({ author: "No Title" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Title is required");
  });

  test("GET /books - Should retrieve the list of all books", async () => {
    const response = await request(app).get("/books");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some(book => book.id === testBookId)).toBe(true);
  });

  test("GET /books/id/:id - Should retrieve a single book by ID", async () => {
    const response = await request(app).get(`/books/id/${testBookId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testBookId);
    expect(response.body.title).toBe("Test Book One");
    expect(response.body.author).toBe("Test Author");
  });

  test("GET /books/id/:id - Should return 404 for a non-existent ID", async () => {
    const response = await request(app).get("/books/id/99999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Book not found");
  });

  test("PUT /books/:id - Should successfully update an existing book", async () => {
    const updatedDetails = {
      title: "Updated Test Book Title",
      author: "Updated Author",
      year: 2024,
      genre: "Updated Genre",
      description: "Updated description for testing.",
      cover: "http://updatedcover.jpg"
    };

    const response = await request(app)
      .put(`/books/${testBookId}`)
      .send(updatedDetails);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Book updated successfully");

    const fetchResponse = await request(app).get(`/books/id/${testBookId}`);
    expect(fetchResponse.body.title).toBe(updatedDetails.title);
    expect(fetchResponse.body.year).toBe(updatedDetails.year);
  });

  test("PUT /books/:id - Should return 404 for updating a non-existent book", async () => {
    const response = await request(app)
      .put("/books/99999")
      .send({ title: "Should Not Exist" });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Book not found");
  });

  test("DELETE /books/:id - Should successfully delete the test book", async () => {
    const response = await request(app).delete(`/books/${testBookId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Book deleted successfully");

    const fetchResponse = await request(app).get(`/books/id/${testBookId}`);
    expect(fetchResponse.statusCode).toBe(404);
  });

  test("DELETE /books/:id - Should return 404 for deleting a non-existent book", async () => {
    const response = await request(app).delete("/books/99999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Book not found");
  });
});