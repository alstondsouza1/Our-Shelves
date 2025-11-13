import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookDetail from "../pages/BookDetail";

vi.stubGlobal("fetch", vi.fn());
vi.stubGlobal("alert", vi.fn());

const mockBook = {
   title: "How to survive Cohort 20",
   author: "Tav and Tia",
   year: 2025
};

describe("BookDetail Component", () => {
   const user = userEvent.setup();

   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("renders book details from props", () => {
      render(<BookDetail book={mockBook} />);

      expect(screen.getByRole("heading", { name: /How to survive Cohort 20/ })).toBeInTheDocument();
      expect(screen.getByText(/Author: Tav and Tia/i)).toBeInTheDocument();
      expect(screen.getByText(/Year: 2025/i)).toBeInTheDocument();
   });

   it('calls fetch with POST when "Add book to library" is clicked', async () => {

      fetch.mockResolvedValue({ ok: true });

      render(<BookDetail book={mockBook} />);

      const addButton = screen.getByRole("button", {
         name: /Add book to library/i,
      });
      await user.click(addButton);

      await waitFor(() => {

         expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/books"),
            expect.objectContaining({
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(mockBook),
            })
         );

         expect(alert).toHaveBeenCalledWith(
            `${mockBook.title} added to your library!`
         );
      });
   });

   it("shows an error alert if the fetch call fails", async () => {

      fetch.mockResolvedValue({ ok: false, status: 500 });

      render(<BookDetail book={mockBook} />);

      const addButton = screen.getByRole("button", {
         name: /Add book to library/i,
      });
      await user.click(addButton);

      await waitFor(() => {

         expect(alert).toHaveBeenCalledWith(
            `Failed to add ${mockBook.title} to your library.`
         );
      });
   });
});
