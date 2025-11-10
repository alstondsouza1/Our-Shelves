import { jest, beforeEach, describe, it, expect } from "@jest/globals";

const mockDb = {
   query: jest.fn(),
   execute: jest.fn(),
};

await jest.unstable_mockModule("../db.js", () => ({
   __esModule: true,
   default: mockDb,
}));

const { listBooks, getBookById, createBook, updateBook, deleteBook } =
   await import("../controllers/booksDbController.js");

const db = (await import("../db.js")).default;

const getMockRes = () => {

   const res = {};

   res.status = jest.fn().mockReturnValue(res);
   res.json = jest.fn().mockReturnValue(res);
   
   return res;
};

beforeEach(() => {
   db.query.mockReset();
   db.execute.mockReset();
});

describe("listBooks", () => {
   it("Should fetch all books and return them as JSON", async () => {

      const mockBooks = [{ id: 1, title: "Test Book" }];

      db.query.mockResolvedValue([mockBooks]);

      const req = {};
      const res = getMockRes();

      await listBooks(req, res);

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
      expect(res.json).toHaveBeenCalledWith(mockBooks);
   });
});

describe("getBookById", () => {
   it("Should return a single book if found", async () => {

      const mockBook = { id: 1, title: "Test Book" };

      db.query.mockResolvedValue([[mockBook]]);

      const req = { params: { id: 1 } };
      const res = getMockRes();

      await getBookById(req, res);

      expect(db.query).toHaveBeenCalledWith(
         expect.stringContaining("WHERE id = ?"),
         [1]
      );
      expect(res.json).toHaveBeenCalledWith(mockBook);
   });

   it("Should return 404 if book is not found", async () => {

      db.query.mockResolvedValue([[]]);

      const req = { params: { id: 999 } };
      const res = getMockRes();

      await getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
   });
});

describe("createBook", () => {
   it("Should create a new book and return it", async () => {

      const newBook = {
         title: "Twerking while Coding",
         author: "Amazon Web Services",
         year: 2025,
      };

      db.execute.mockResolvedValue([{ insertId: 42 }]);

      const req = { body: newBook };
      const res = getMockRes();

      await createBook(req, res);

      expect(db.execute).toHaveBeenCalledWith(
         expect.stringContaining("INSERT INTO books"),
         [
            "Twerking while Coding",
            "Amazon Web Services",
            null,
            null,
            2025,
            null,
         ]
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
         expect.objectContaining({
            id: 42,
            title: "Twerking while Coding",
         })
      );
   });

   it("Should return 400 if title is missing", async () => {

      const noTitleBook = { author: "Bruh" };
      const req = { body: noTitleBook };
      const res = getMockRes();

      await createBook(req, res);

      expect(db.execute).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Title is required" });
   });
});

describe("updateBook", () => {
   it("Should update an existing book and return success", async () => {

      const bookId = 1;
      const updatedData = {
         title: "Updated Title",
         author: "Updated Author",
         genre: "Sci-Fi",
         description: "Updated Desc",
         year: 2039,
         cover: "new-cover.jpg",
      };

      db.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const req = { params: { id: bookId }, body: updatedData };
      const res = getMockRes();

      await updateBook(req, res);

      expect(db.execute).toHaveBeenCalledTimes(1);

      const [sql, params] = db.execute.mock.calls[0];

      expect(sql).toEqual(expect.stringContaining("UPDATE books"));
      expect(params).toEqual([
         "Updated Title",
         "Updated Author",
         "Sci-Fi",
         "Updated Desc",
         2039,
         "new-cover.jpg",
         bookId,
      ]);
      expect(res.json).toHaveBeenCalledWith({
         message: "Book updated successfully",
      });
   });

   it("Should return 404 if book to update is not found", async () => {

      const bookId = 1234;
      const updatedData = { title: "Won't work" };

      db.execute.mockResolvedValue([{ affectedRows: 0 }]);

      const req = { params: { id: bookId }, body: updatedData };
      const res = getMockRes();

      await updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
   });
});

describe("deleteBook", () => {
   it("Should delete a book and return success", async () => {

      const bookId = 1;

      db.execute.mockResolvedValue([{ affectedRows: 1 }]);

      const req = { params: { id: bookId } };
      const res = getMockRes();

      await deleteBook(req, res);

      expect(db.execute).toHaveBeenCalledWith(
         "DELETE FROM books WHERE id = ?",
         [bookId]
      );
      expect(res.json).toHaveBeenCalledWith({
         message: "Book deleted successfully",
      });
   });

   it("Should return 404 if book to delete is not found", async () => {

      const bookId = 5678;

      db.execute.mockResolvedValue([{ affectedRows: 0 }]);

      const req = { params: { id: bookId } };
      const res = getMockRes();

      await deleteBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Book not found" });
   });
});
