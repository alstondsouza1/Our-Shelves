import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Library from "../pages/Library";

vi.stubGlobal("fetch", vi.fn());
vi.stubGlobal("alert", vi.fn());

const mockBooks = [
   { id: 1, title: "Book One", author: "Author One" },
   { id: 2, title: "Book Two", author: "Author Two" },
];

describe("Library Component", () => {
   const user = userEvent.setup();

   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("Fetches and displays a list of books on render", async () => {

      fetch.mockResolvedValue({
         ok: true,
         json: async () => mockBooks,
      });

      render(<Library />);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/books"));

      await waitFor(() => {
         expect(screen.getByText("Book One")).toBeInTheDocument();
         expect(screen.getByText("Book Two")).toBeInTheDocument();
      });
   });

   it("Removes a book from the list when its delete button is clicked", async () => {

      fetch.mockResolvedValueOnce({
         ok: true,
         json: async () => mockBooks,
      });

      fetch.mockResolvedValueOnce({ ok: true });

      render(<Library />);

      await waitFor(() => {
         expect(screen.getByText("Book One")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", {
         name: /Delete Book/i,
      });
      await user.click(deleteButtons[0]);

      await waitFor(() => {

         expect(alert).toHaveBeenCalledWith(
            expect.stringContaining("Successfully deleted")
         );
      });

      expect(screen.queryByText("Book One")).not.toBeInTheDocument();
      expect(screen.getByText("Book Two")).toBeInTheDocument();
   });
});