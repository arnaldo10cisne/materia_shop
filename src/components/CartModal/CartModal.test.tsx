import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { CartModal } from "./CartModal";
import { useDispatch, useSelector } from "react-redux";
import { clearCartContent } from "../../store/cartReducer";
import { playCancelCursorSfx, playErase } from "../../utils/utilityFunctions";
import { RootState } from "../../store/store";

jest.mock("react-redux", () => {
  const original = jest.requireActual("react-redux");
  return {
    ...original,
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock("../../store/cartReducer", () => ({
  ...jest.requireActual("../../store/cartReducer"),
  clearCartContent: jest.fn(),
}));

jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  playCancelCursorSfx: jest.fn(),
  playErase: jest.fn(),
}));

describe("CartModal Component", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  const renderWithState = (cartItems: any[]) => {
    (useSelector as jest.Mock).mockImplementation((selectorFn: any) => {
      const mockState: Partial<RootState> = {
        cart: {
          currentCart: cartItems,
        },
      };
      return selectorFn(mockState);
    });

    return render(<CartModal onClose={mockOnClose} />);
  };

  test("renders Close button and triggers onClose when clicked", () => {
    renderWithState([]);

    const closeButton = screen.getByText("Close");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("displays 'CART IS EMPTY' when cart content is empty", () => {
    renderWithState([]);

    expect(screen.getByText("CART IS EMPTY")).toBeInTheDocument();

    expect(screen.queryByText("Empty Cart")).not.toBeInTheDocument();
  });

  test("renders ShoppingCartList and PriceSummary if cart has items", () => {
    const mockItems = [
      {
        product: { id: "001", name: "Potion", price: 100, materia_type: "" },
        amount: 1,
        total_price: 100,
      },
    ];

    renderWithState(mockItems);

    expect(screen.queryByText("CART IS EMPTY")).not.toBeInTheDocument();

    expect(screen.getByText("Remove Item")).toBeInTheDocument();

    expect(screen.getByText(/Total:/i)).toBeInTheDocument();

    expect(screen.getByText("Empty Cart")).toBeInTheDocument();
  });

  test("clicking 'Empty Cart' dispatches clearCartContent", () => {
    const mockItems = [
      {
        product: { id: "001", name: "Potion", price: 100, materia_type: "" },
        amount: 2,
        total_price: 200,
      },
    ];

    renderWithState(mockItems);

    const emptyCartButton = screen.getByText("Empty Cart");
    fireEvent.click(emptyCartButton);

    expect(clearCartContent).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(clearCartContent());
    expect(playErase).toHaveBeenCalled();
  });

  test("onClose is not called if we only click 'Empty Cart'", () => {
    const mockItems = [
      {
        product: { id: "001", name: "Potion", price: 100, materia_type: "" },
        amount: 2,
        total_price: 200,
      },
    ];
    renderWithState(mockItems);

    fireEvent.click(screen.getByText("Empty Cart"));

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
