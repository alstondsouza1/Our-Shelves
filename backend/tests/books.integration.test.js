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