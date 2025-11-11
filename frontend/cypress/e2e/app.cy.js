describe('Search, Add, Check', () => {
   it("Allows a user to search for a book, add it, and see it in their library", () => {
      cy.intercept("GET", "**/books/search/K-Pop", {
         statusCode: 200,
         body: {
            searchTerm: "K-Pop",
            totalResults: 1,
            books: [
               {
                  title: "K-Pop Demon Hunters",
                  author: "Netflix",
                  year: 2025,
               },
            ],
         },
      }).as("searchK-Pop");

      const newBook = {
         title: "K-Pop Demon Hunters",
         author: "Netflix",
         year: 2025,
      };
      cy.intercept("POST", "**/books", {
         statusCode: 201,
         body: { id: 1, ...newBook },
      }).as("addBook");

      cy.intercept("GET", "**/books", {
         statusCode: 200,
         body: [{ id: 1, ...newBook }],
      }).as("getLibrary");

      cy.on("window:alert", (str) => {
         expect(str).to.contain("added to your library");
      });

      cy.visit("/");

      cy.get('[placeholder^="Search by title"]').type("K-Pop");

      cy.contains("button", "Search").click();

      cy.wait("@searchK-Pop");

      cy.contains("h4", "K-Pop").should("be.visible");

      cy.contains("a", "Open Book").click();

      cy.url().should("include", "/BookDetail");
      cy.contains("h1", "K-Pop").should("be.visible");

      cy.get("#add-book-button").click();

      cy.wait("@addBook");

      cy.get(".header-button.library").click();

      cy.url().should("include", "/Library");
      cy.wait("@getLibrary");

      cy.get(".book-card").contains("K-Pop").should("be.visible");
   });
});

describe('Delete Book', () => {
   it("Allows a user to delete a book from their library", () => {
      cy.intercept("GET", "**/books", {
         statusCode: 200,
         body: [
            {
               id: 123,
               title: "Delete Me",
               author: "Not Important",
               year: 2019,
            },
         ],
      }).as("getLibrary");

      cy.intercept("DELETE", "**/books/123", {
         statusCode: 200,
         body: { message: "Book deleted successfully" },
      }).as("deleteBook");

      cy.on("window:alert", (str) => {
         expect(str).to.contain("Successfully deleted");
      });

      cy.visit("/Library");

      cy.wait("@getLibrary");

      cy.get(".book-card").contains("Delete Me").should("be.visible");

      cy.contains(".book-card", "Delete Me")
         .find(".delete-book-button")
         .click();

      cy.wait("@deleteBook");

      cy.contains(".book-card", "Delete Me").should("not.exist");
   });
});

describe('Header Navigation', () => {
   it("Navigates between Home and Library pages using the header", () => {
      cy.visit("/");

      cy.get("h1").contains("Welcome to Our Shelves").should("be.visible");

      cy.get(".header-button.library").click();

      cy.url().should("include", "/Library");
      cy.get("h1.library-heading").contains("My Library").should("be.visible");

      cy.get(".header-button.home").click();

      cy.url().should("not.include", "/Library");
      cy.get("h1").contains("Welcome to Our Shelves").should("be.visible");
   });
});

describe('Invalid Search', () => {
   it("Shows an error message if search is clicked with no input", () => {
      cy.visit("/");

      cy.contains("button", "Search").click();

      cy.get(".error-message")
         .contains("Please enter a search term")
         .should("be.visible");
   });
});