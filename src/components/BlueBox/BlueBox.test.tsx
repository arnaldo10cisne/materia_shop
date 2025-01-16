import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { BlueBox } from "./BlueBox";

jest.mock("./BlueBox.module.scss", () => ({
  ExternalBorder: "ExternalBorder",
  MiddleBorder: "MiddleBorder",
  BlueBox: "BlueBox",
  InternalBorder: "InternalBorder",
}));

jest.mock("classnames", () => {
  return (...classes: (string | undefined | null)[]) =>
    classes.filter(Boolean).join(" ");
});

describe("BlueBox Component", () => {
  test("renders children correctly", () => {
    render(
      <BlueBox>
        <div data-testid="child-element">Test Child</div>
      </BlueBox>,
    );

    const childElement = screen.getByTestId("child-element");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Test Child");
  });

  test("applies default class names correctly", () => {
    render(
      <BlueBox>
        <span>Another Test Child</span>
      </BlueBox>,
    );

    const externalBorderDiv = screen.getByTestId("bluebox-outer");
    expect(externalBorderDiv).toHaveClass("ExternalBorder");

    const middleBorderDiv = screen.getByTestId("bluebox-middle");
    expect(middleBorderDiv).toHaveClass("MiddleBorder");

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass("BlueBox InternalBorder");
  });

  test("applies customStyles correctly alongside default styles", () => {
    const customStyles = "CustomStyle1 CustomStyle2";
    render(
      <BlueBox customStyles={customStyles}>
        <p>Styled Child</p>
      </BlueBox>,
    );

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass(
      "BlueBox InternalBorder CustomStyle1 CustomStyle2",
    );
  });

  test("renders without crashing when no children are passed", () => {
    render(<BlueBox />);

    const externalBorderDiv = screen.getByTestId("bluebox-outer");
    expect(externalBorderDiv).toHaveClass("ExternalBorder");

    const middleBorderDiv = screen.getByTestId("bluebox-middle");
    expect(middleBorderDiv).toHaveClass("MiddleBorder");

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass("BlueBox InternalBorder");
    expect(blueBoxDiv).toBeEmptyDOMElement();
  });

  test("handles null or undefined children gracefully", () => {
    render(<BlueBox>{null}</BlueBox>);

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toBeInTheDocument();
    expect(blueBoxDiv).toBeEmptyDOMElement();
  });

  test("renders correctly with customStyles as a single class", () => {
    const customStyles = "SingleCustomStyle";
    render(
      <BlueBox customStyles={customStyles}>
        <span>Single Style Child</span>
      </BlueBox>,
    );

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass("BlueBox InternalBorder SingleCustomStyle");
  });

  test("ignores undefined customStyles", () => {
    render(
      <BlueBox customStyles={undefined}>
        <span>Undefined Style Child</span>
      </BlueBox>,
    );

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass("BlueBox InternalBorder");
    expect(blueBoxDiv).not.toHaveClass("undefined");
  });

  test("ignores null customStyles", () => {
    render(
      <BlueBox customStyles={null}>
        <span>Null Style Child</span>
      </BlueBox>,
    );

    const blueBoxDiv = screen.getByTestId("bluebox-inner");
    expect(blueBoxDiv).toHaveClass("BlueBox InternalBorder");
    expect(blueBoxDiv).not.toHaveClass("null");
  });
});
