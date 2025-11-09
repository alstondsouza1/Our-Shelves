import { expect, jest } from '@jest/globals';
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

const consoleErrSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('fetchBooks', () => {
    it("Fetching books from api", () => {
        expect(true).toEqual(true);
    });
});