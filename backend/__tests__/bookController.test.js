import { expect, jest } from '@jest/globals';
import { fetchBooks } from '../controllers/bookController';
import { describe } from 'pm2';

describe('fetchBooks', () => {
    it("Fetching books from api", () => {
        expect(true).toEqual(true);
    });
});