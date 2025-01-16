import React from "react";
import { render, screen } from "../../utils/test-utils/custom-render";
import { LoadingChocobo } from "./LoadingChocobo";
import { CHOCOBO_WALKING } from "../../utils/constants.ts";

describe("LoadingChocobo Component", () => {
  test("renders without crashing", () => {
    render(<LoadingChocobo />);
    const chocoboImage = screen.getByTestId("loading-chocobo");
    expect(chocoboImage).toBeInTheDocument();
  });

  test("displays the loading image with correct src and alt attributes", () => {
    render(<LoadingChocobo />);
    const chocoboImage = screen.getByTestId("loading-chocobo");

    expect(chocoboImage).toBeInTheDocument();

    expect(chocoboImage).toHaveAttribute("src", CHOCOBO_WALKING);

    expect(chocoboImage).toHaveAttribute("alt", "loading");
  });

  test("displays the correct loading text", () => {
    render(<LoadingChocobo />);
    const loadingText = screen.getByText("...Loading...");
    expect(loadingText).toBeInTheDocument();
  });
});
