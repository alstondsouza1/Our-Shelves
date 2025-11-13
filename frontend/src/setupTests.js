// src/setupTests.js

import "@testing-library/jest-dom";

import { vi } from "vitest";

vi.stubGlobal("import", {
   meta: {
      env: {
         VITE_API_URL: "http://localhost:3000",
      },
   },
});
