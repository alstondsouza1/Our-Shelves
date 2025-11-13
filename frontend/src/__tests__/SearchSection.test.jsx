import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import SearchSection from "../components/SearchSection";

const renderWithRouter = (ui, options) => {
   return render(ui, { wrapper: BrowserRouter, ...options });
};

vi.stubGlobal("fetch", vi.fn());

describe("SearchSection Component", () => {
   const user = userEvent.setup();

   beforeEach(() => {
      vi.clearAllMocks();
   });

   it("Should show an error if search is clicked with no input", async () => {
      renderWithRouter(<SearchSection setSelectedBook={() => {}} />);

      const searchButton = screen.getByRole("button", { name: /Search/i });
      await user.click(searchButton);

      expect(
         await screen.findByText(/Please enter a search term/i)
      ).toBeInTheDocument();

      expect(fetch).not.toHaveBeenCalled();
   });

   it("Should perform a search, show loading, and display results", async () => {
      const mockResults = {
         searchTerm: "dragons",
         totalResults: 1,
         books: [
            { title: "Dragons", author: "Hiccup" },
         ],
      };

      fetch.mockResolvedValue({
         ok: true,
         json: async () => mockResults,
      });

      renderWithRouter(<SearchSection setSelectedBook={() => {}} />);

      const input = screen.getByPlaceholderText(/Search by title/i);
      const searchButton = screen.getByRole("button", { name: /Search/i });

      await user.type(input, "dragons");
      await user.click(searchButton);

      await waitFor(() => {
         expect(
            screen.getByText(/Search Results for "dragons"/i)
         ).toBeInTheDocument();
         expect(screen.getByText("Dragons")).toBeInTheDocument();
         expect(screen.getByText(/by Hiccup/i)).toBeInTheDocument();
      });
   });
});