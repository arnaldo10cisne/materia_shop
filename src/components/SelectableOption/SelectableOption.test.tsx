import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SelectableOption } from "./SelectableOption";
import {
  playAcceptCursorSfx,
  playBuzzerCursorSfx,
  playMoveCursorSfx,
} from "../../utils/utilityFunctions";
import { MateriaIconModel, MateriaTypes } from "../../utils/models";
import { CURSOR_POINTER } from "../../utils/constants";

jest.mock("../../utils/utilityFunctions", () => ({
  playAcceptCursorSfx: jest.fn(),
  playBuzzerCursorSfx: jest.fn(),
  playMoveCursorSfx: jest.fn(),
}));

describe("SelectableOption Component", () => {
  const defaultText = "Option Label";
  const defaultIcon: MateriaIconModel = {
    type: MateriaTypes.MAGIC,
    src: "/path/to/icon.png",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders children content", () => {
    render(<SelectableOption>{defaultText}</SelectableOption>);

    expect(screen.getByText(defaultText)).toBeInTheDocument();
  });

  test("renders an icon if provided", () => {
    render(
      <SelectableOption icon={defaultIcon}>{defaultText}</SelectableOption>,
    );

    const iconElement = screen.getByAltText("optionIcon");
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute("src", defaultIcon.src);

    expect(screen.getByText(defaultText)).toBeInTheDocument();
  });

  test("calls onClickHandler and sfxOnClick when clicked (enabled)", () => {
    const mockOnClickHandler = jest.fn();
    const mockSfxOnClick = jest.fn();

    render(
      <SelectableOption
        onClickHandler={mockOnClickHandler}
        sfxOnClick={mockSfxOnClick}
      >
        {defaultText}
      </SelectableOption>,
    );

    fireEvent.click(screen.getByText(defaultText));

    expect(mockOnClickHandler).toHaveBeenCalledTimes(1);
    expect(mockSfxOnClick).toHaveBeenCalledTimes(1);
  });

  test("uses default sfxOnClick = playAcceptCursorSfx if none provided", () => {
    const mockOnClickHandler = jest.fn();

    render(
      <SelectableOption onClickHandler={mockOnClickHandler}>
        {defaultText}
      </SelectableOption>,
    );

    fireEvent.click(screen.getByText(defaultText));

    expect(mockOnClickHandler).toHaveBeenCalledTimes(1);
    expect(playAcceptCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("calls playBuzzerCursorSfx if disabled and clicked", () => {
    const mockOnClickHandler = jest.fn();

    render(
      <SelectableOption disabled onClickHandler={mockOnClickHandler}>
        {defaultText}
      </SelectableOption>,
    );

    fireEvent.click(screen.getByText(defaultText));

    expect(mockOnClickHandler).not.toHaveBeenCalled();
    expect(playBuzzerCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("displays the cursor pointer image on mouse enter (if not disabled)", () => {
    render(<SelectableOption>{defaultText}</SelectableOption>);

    fireEvent.mouseEnter(screen.getByText(defaultText));

    const cursorImage = screen.getByAltText("cursor_pointer");
    expect(cursorImage).toBeInTheDocument();
    expect(cursorImage).toHaveAttribute("src", CURSOR_POINTER);
  });

  test("does not display the cursor pointer image if disabled", () => {
    render(<SelectableOption disabled>{defaultText}</SelectableOption>);

    fireEvent.mouseEnter(screen.getByText(defaultText));

    const cursorImage = screen.queryByAltText("cursor_pointer");
    expect(cursorImage).not.toBeInTheDocument();
  });

  test("calls playMoveCursorSfx on mouse enter if not disabled", () => {
    render(<SelectableOption>{defaultText}</SelectableOption>);

    fireEvent.mouseEnter(screen.getByText(defaultText));
    expect(playMoveCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("does not call playMoveCursorSfx on mouse enter if disabled", () => {
    render(<SelectableOption disabled>{defaultText}</SelectableOption>);

    fireEvent.mouseEnter(screen.getByText(defaultText));
    expect(playMoveCursorSfx).not.toHaveBeenCalled();
  });

  test("cursor pointer image disappears on mouse leave", () => {
    render(<SelectableOption>{defaultText}</SelectableOption>);

    const optionElement = screen.getByText(defaultText);

    // Mouse Enter => image appears
    fireEvent.mouseEnter(optionElement);
    expect(screen.getByAltText("cursor_pointer")).toBeInTheDocument();

    // Mouse Leave => image disappears
    fireEvent.mouseLeave(optionElement);
    const cursorImage = screen.queryByAltText("cursor_pointer");
    expect(cursorImage).not.toBeInTheDocument();
  });
});
