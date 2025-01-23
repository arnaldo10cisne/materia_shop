import { App } from "./App";
import { render } from "./utils/test-utils/custom-render";
import { screen } from "@testing-library/react";

describe("Hero", () => {
  test("renders App component without crashing", () => {
    render(<App />);
  });

  test("renders HomePage at root path", () => {
    render(<App />);
    expect(screen.getByText("Welcome to the Materia Shop")).toBeInTheDocument();
    expect(screen.getByText("Select Character")).toBeInTheDocument();
    expect(screen.getByText("Buy Materia")).toBeInTheDocument();
  });

  test("BUY MATERIA disabled if no character if selected", () => {
    render(<App />);
  });
});
