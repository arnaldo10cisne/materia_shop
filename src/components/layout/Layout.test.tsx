import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { Layout } from "./Layout";

jest.mock("../header/Header", () => ({
  Header: () => <div data-testid="mock-header">Mock Header</div>,
}));

describe("Layout Component", () => {
  test("renders the Header component", () => {
    render(
      <Layout>
        <div>Test Child</div>
      </Layout>,
    );

    const headerElement = screen.getByTestId("mock-header");
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveTextContent("Mock Header");
  });

  test("renders children correctly", () => {
    render(
      <Layout>
        <div data-testid="child-element">Test Child</div>
      </Layout>,
    );

    const childElement = screen.getByTestId("child-element");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Test Child");
  });

  test("renders multiple children correctly", () => {
    render(
      <Layout>
        <div data-testid="child-one">Child One</div>
        <div data-testid="child-two">Child Two</div>
      </Layout>,
    );

    const childOne = screen.getByTestId("child-one");
    const childTwo = screen.getByTestId("child-two");

    expect(childOne).toBeInTheDocument();
    expect(childOne).toHaveTextContent("Child One");

    expect(childTwo).toBeInTheDocument();
    expect(childTwo).toHaveTextContent("Child Two");
  });

  test("renders without crashing when no children are passed", () => {
    render(<Layout />);

    const headerElement = screen.getByTestId("mock-header");
    expect(headerElement).toBeInTheDocument();

    const childElements = screen.queryByTestId("child-element");
    expect(childElements).not.toBeInTheDocument();
  });
});
