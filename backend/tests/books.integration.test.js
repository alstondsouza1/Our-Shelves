import request from "supertest";
import { afterAll, beforeAll, jest } from "@jest/globals";
import app from "../app.js";
import db from "../db.js";

const mockApiResponse = {
    numFound: 1,
    docs: [
        {
            title: 'The Hitchhikers Guide to the Galaxy',
            author_name: ['Douglas Adams'],
            first_publish_year: 1979,
            cover_i: 12345,
            number_of_pages_median: 224,
        },
    ],
};

global.fetch = jest.fn(() =>
    promises.resolve({
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
    await db.execute('TRUNCATE TABLE books');
    await db.end();
});

describe('App & General Routes Integration Tests', () => {

  test('GET / - Should return the welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Welcome to Our Shelves API!');
  });

  test('GET /db-test - Should return database connection success and books array', async () => {
    const response = await request(app).get('/db-test');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Database connected');
    expect(Array.isArray(response.body.books)).toBe(true);
  });
});

describe('External API Search Integration Tests (bookController.js)', () => {

  test('GET /books/search/:bookName - Should fetch and format books from Open Library API', async () => {
    const searchTerm = 'hitchhiker';
    const response = await request(app).get(`/books/search/${searchTerm}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.searchTerm).toBe(searchTerm);
    expect(response.body.totalResults).toBe(1);
    expect(response.body.books).toHaveLength(1);

    const book = response.body.books[0];
    expect(book.title).toBe('The Hitchhikers Guide to the Galaxy');
    expect(book.author).toBe('Douglas Adams');
    expect(book.year).toBe(1979);
    expect(book.cover).not.toBeNull();

    // Verify the mock was called correctly
    const expectedUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchTerm)}`;
    expect(global.fetch).toHaveBeenCalledWith(expectedUrl);
  });

  test('GET /books/search/:bookName - Should handle an empty search result', async () => {
    // Override the mock response for this test
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ numFound: 0, docs: [] }),
      })
    );

    const searchTerm = 'nonexistentbook';
    const response = await request(app).get(`/books/search/${searchTerm}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.totalResults).toBe(0);
    expect(response.body.books).toHaveLength(0);
  });
});