import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { ShoppingCartList } from "./ShoppingCartList";
import { useSelector, useDispatch } from "react-redux";
import { removeCartItem } from "../../store/cartReducer";
import { playCancelCursorSfx } from "../../utils/utilityFunctions";
import { CartItem, MateriaTypes } from "../../utils/models";

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    ...originalModule,
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  };
});

jest.mock("../../store/cartReducer", () => ({
  ...jest.requireActual("../../store/cartReducer"),
  removeCartItem: jest.fn(),
}));

jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  playCancelCursorSfx: jest.fn(),
}));

describe("ShoppingCartList Component", () => {
  const mockDispatch = jest.fn();

  // Sample cart item(s) to test
  const mockCartItems: CartItem[] = [
    {
      product: {
        id: "materia123",
        name: "Fire Materia",
        description: "Casts Fire",
        picture: "fire.png",
        price: 500,
        stock_amount: 10,
        materia_type: MateriaTypes.MAGIC,
      },
      amount: 2,
      total_price: 1000,
    },
    {
      product: {
        id: "materia456",
        name: "Ice Materia",
        description: "Casts Ice",
        picture: "ice.png",
        price: 300,
        stock_amount: 5,
        materia_type: MateriaTypes.MAGIC,
      },
      amount: 1,
      total_price: 300,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        cart: {
          currentCart: mockCartItems, // Default mock
        },
      }),
    );
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test("renders cart items from Redux store", () => {
    render(<ShoppingCartList />);

    // Check if product names are rendered
    expect(screen.getByText("Fire Materia")).toBeInTheDocument();
    expect(screen.getByText("Ice Materia")).toBeInTheDocument();

    // Check the correct pricing info is displayed
    expect(screen.getByText("500 Gil * 2 units")).toBeInTheDocument();
    expect(screen.getByText("1000 Gil")).toBeInTheDocument();

    expect(screen.getByText("300 Gil * 1 units")).toBeInTheDocument();
    expect(screen.getByText("300 Gil")).toBeInTheDocument();
  });

  test("does not render remove button by default", () => {
    render(<ShoppingCartList />);

    // 'Remove Item' button should not be in the document by default
    const removeButtons = screen.queryAllByText(/Remove Item/i);
    expect(removeButtons).toHaveLength(0);
  });

  test("renders remove button if showRemoveButton is true", () => {
    render(<ShoppingCartList showRemoveButton={true} />);

    // Now the remove buttons should be visible
    const removeButtons = screen.getAllByText(/Remove Item/i);
    expect(removeButtons).toHaveLength(mockCartItems.length);
  });

  test("dispatches removeCartItem action when remove button is clicked", () => {
    render(<ShoppingCartList showRemoveButton={true} />);

    const removeButtons = screen.getAllByText(/Remove Item/i);

    // Simulate a click on the first remove button
    fireEvent.click(removeButtons[0]);

    // Verify dispatch is called with the correct payload
    expect(removeCartItem).toHaveBeenCalledWith({
      product: mockCartItems[0].product,
      amount: mockCartItems[0].amount,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Verify that SFX is played
    expect(playCancelCursorSfx).toHaveBeenCalled();
  });

  test("renders empty when there are no cart items", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        cart: {
          currentCart: [],
        },
      }),
    );

    render(<ShoppingCartList showRemoveButton={true} />);
    // Nothing should be in the document that matches these product names
    expect(screen.queryByText("Fire Materia")).not.toBeInTheDocument();
    expect(screen.queryByText("Ice Materia")).not.toBeInTheDocument();

    // No remove buttons either
    const removeButtons = screen.queryAllByText(/Remove Item/i);
    expect(removeButtons).toHaveLength(0);
  });
});
