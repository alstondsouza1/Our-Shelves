import { afterAll, afterEach, beforeEach, describe, expect, jest, it } from '@jest/globals';
import { fetchBooks } from '../controllers/bookController';

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

    it("should fetch books, encode URL, and map data correctly", async () => {
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

        const req = { params: { bookName } };
        const res = mockResponse();

        await fetchBooks(req, res);

        const expectedUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookName)}`;
        expect(fetch).toHaveBeenCalledWith(expectedUrl);

        expect(res.json).toHaveBeenCalledWith({
            searchTerm: bookName,
            totalResults: 1,
            books: [{
                title: 'Moby Dick',
                author: 'Herman Melville',
                year: 1851,
                cover: 'https://covers.openlibrary.org/b/id/98765-M.jpg',
                pages: 634
            }]
        });
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 500 status if Open Library API returns a non-OK response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 403,
        });

        const req = { params: { bookName: 'Error Test' } };
        const res = mockResponse();

        await fetchBooks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Failed to fetch books',
            message: 'Open Library API error: 403',
        });
    });

    it('should return 500 status if fetch throws a network error', async () => {
        const networkError = new Error('DNS lookup failed');
        fetch.mockRejectedValueOnce(networkError);

        const req = { params: { bookName: 'Network Error' } };
        const res = mockResponse();

        await fetchBooks(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Failed to fetch books',
            message: 'DNS lookup failed',
        });
        expect(consoleErrSpy).toHaveBeenCalled();
    });
});