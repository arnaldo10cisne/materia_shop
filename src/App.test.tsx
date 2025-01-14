import React from "react";
import { App } from "./App.tsx";
import { render } from "./utils/test-utils/custom-render.tsx";

describe("Hero", () => {
  test("renders App component without crashing", () => {
    render(<App />);
  });
});
