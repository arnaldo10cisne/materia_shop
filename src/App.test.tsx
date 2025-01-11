import React from "react";
import { render } from "@testing-library/react";

import App from "./App.tsx";

describe("Hero", () => {
  test("renders App component without crashing", () => {
    render(<App />);
  });
});
