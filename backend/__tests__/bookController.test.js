import { afterAll, beforeEach, expect, jest } from '@jest/globals';
import { fetchBooks } from '../controllers/bookController';
import { describe } from 'pm2';

const ogFetch = global.fetch;
global.fetch = jest.fn();

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
}

const consoleErrSpy = jest.spyOn(console, "error").mockImplementation(() => { });

describe("fetchBooks", () => {
    beforeEach(() => {
        fetch.mockClear();
        consoleErrSpy.mockClear();
    });

    afterAll(() => {
        global.fetch = ogFetch;
        consoleErrSpy.mockRestore();
    });

    it("should fetch books, encode URL, and map data correctly", () => {
        const bookName = "Moby Dick";
        const mockData = {
            numFound: 1,
            docs: [{
                title: 'Moby Dick',
                author_name: ['Herman Melville'],
                first_publish_year: 1851,
                cover_i: 98765,
                number_of_pages_median: 634
            }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => mockData,
        });
    });
});