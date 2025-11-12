import request from "supertest";
import { jest } from "@jest/globals";
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