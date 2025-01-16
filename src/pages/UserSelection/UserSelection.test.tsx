// UserSelection.test.tsx
import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { UserSelection } from "./UserSelection";
import { useQuery } from "react-query";
import { playCancelCursorSfx } from "../../utils/utilityFunctions";
import { setUser } from "../../store/userReducer";
import { clearCartContent } from "../../store/cartReducer";
import { clearCreditCard } from "../../store/creditCardReducer";
import { clearOrder } from "../../store/orderReducer";
import { UserModel } from "../../utils/models";

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    ...originalModule,
    useDispatch: jest.fn(),
  };
});

jest.mock("../../utils/utilityFunctions", () => ({
  getAllUsers: jest.fn(),
  playCancelCursorSfx: jest.fn(),
  playAcceptCursorSfx: jest.fn(),
  playMoveCursorSfx: jest.fn(),
  playBuzzerCursorSfx: jest.fn(),
}));

Object.defineProperty(window, "localStorage", {
  value: {
    clear: jest.fn(),
    setItem: jest.fn(),
  },
  writable: true,
});

describe("UserSelection Component", () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  const mockCharacters: UserModel[] = [
    {
      id: "1",
      name: "Cloud",
      portrait: "cloud.png",
      email: "cloud@example.com",
    },
    { id: "2", name: "Tifa", portrait: "tifa.png", email: "tifa@example.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    const { useNavigate } = require("react-router-dom");
    useNavigate.mockImplementation(() => mockNavigate);

    const { useDispatch } = require("react-redux");
    useDispatch.mockImplementation(() => mockDispatch);

    (useQuery as jest.Mock).mockReturnValue({
      data: mockCharacters,
      isLoading: false,
    });
  });

  test("renders without crashing", () => {
    render(<UserSelection />);
    expect(screen.getByText("Return")).toBeInTheDocument();
  });

  test("displays loading spinner (LoadingChocobo) if isLoading is true", () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<UserSelection />);

    expect(screen.getByTestId("loading-chocobo")).toBeInTheDocument();
  });

  test("displays a list of characters when not loading", () => {
    render(<UserSelection />);

    mockCharacters.forEach((character) => {
      expect(screen.getByText(character.name)).toBeInTheDocument();
    });
  });

  test("clicking on Return button triggers navigation to '/'", () => {
    render(<UserSelection />);

    const returnButton = screen.getByText("Return");
    fireEvent.click(returnButton);

    expect(playCancelCursorSfx).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("selecting a character dispatches correct actions and navigates to '/'", async () => {
    render(<UserSelection />);

    const cloudOption = screen.getByText("Cloud");
    fireEvent.click(cloudOption);

    expect(mockDispatch).toHaveBeenCalledWith(setUser(mockCharacters[0]));
    expect(mockDispatch).toHaveBeenCalledWith(clearCartContent());
    expect(mockDispatch).toHaveBeenCalledWith(clearCreditCard());
    expect(mockDispatch).toHaveBeenCalledWith(clearOrder());

    expect(window.localStorage.clear).toHaveBeenCalled();
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(mockCharacters[0]),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
