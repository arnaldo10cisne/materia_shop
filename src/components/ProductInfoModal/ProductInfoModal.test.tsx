import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render"; // Adjust path if needed
import { ProductInfoModal } from "./ProductInfoModal";
import { useDispatch } from "react-redux";
import { addOrUpdateCartItem, removeCartItem } from "../../store/cartReducer";
import {
  playCancelCursorSfx,
  playPurchaseSfx,
} from "../../utils/utilityFunctions";
import { ProductModel, MateriaTypes } from "../../utils/models";

// Mock your dependencies
jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    ...originalModule,
    useDispatch: jest.fn(),
  };
});

jest.mock("../../store/cartReducer", () => ({
  ...jest.requireActual("../../store/cartReducer"),
  addOrUpdateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
}));

jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  playCancelCursorSfx: jest.fn(),
  playPurchaseSfx: jest.fn(),
}));

describe("ProductInfoModal", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnAddToCart = jest.fn();

  const mockProduct: ProductModel = {
    id: "potion001",
    name: "Potion",
    description: "Heals 100 HP",
    picture: "potion.png",
    price: 50,
    stock_amount: 5,
    materia_type: MateriaTypes.MAGIC,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  test("renders nothing and calls onClose if product is null", () => {
    render(
      <ProductInfoModal
        product={null}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    // The component should return null, hence nothing is rendered:
    expect(screen.queryByText("Add to cart")).not.toBeInTheDocument();
    // onClose is called immediately if product is null
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders correctly with a valid product", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    // Check essential text content
    expect(screen.getByText("Potion")).toBeInTheDocument();
    expect(screen.getByText("Heals 100 HP")).toBeInTheDocument();
    expect(screen.getByText("Price: 50 Gil")).toBeInTheDocument();
    expect(screen.getByText("Stock: 5")).toBeInTheDocument();

    // Initial amount should be 0 by default
    expect(screen.getByText("Cart: 0")).toBeInTheDocument();
    expect(screen.getByText("Total Price: 0 Gil")).toBeInTheDocument();

    // Button text should be 'Add to cart' if initial amount is 0
    expect(screen.getByText("Add to cart")).toBeInTheDocument();
  });

  test("renders initial amount if provided", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        initialAmount={2}
      />,
    );

    // Cart should display the initial amount passed in
    expect(screen.getByText("Cart: 2")).toBeInTheDocument();
    expect(screen.getByText("Total Price: 100 Gil")).toBeInTheDocument();

    // Button text should be 'Update cart' if initialAmount > 0
    expect(screen.getByText("Update cart")).toBeInTheDocument();
  });

  test("clicking on Close triggers onClose and calls playCancelCursorSfx", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(playCancelCursorSfx).toHaveBeenCalled();
  });

  test("increment amount in cart when + is clicked", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);

    // Now cart should be 1
    expect(screen.getByText("Cart: 1")).toBeInTheDocument();
    // Price changes to 50
    expect(screen.getByText("Total Price: 50 Gil")).toBeInTheDocument();
  });

  test("decrement amount in cart when - is clicked", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        initialAmount={2}
      />,
    );

    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);

    // Now cart should be 1
    expect(screen.getByText("Cart: 1")).toBeInTheDocument();
    expect(screen.getByText("Total Price: 50 Gil")).toBeInTheDocument();
  });

  test("does not exceed product stock amount when + is clicked", () => {
    render(
      <ProductInfoModal
        product={{ ...mockProduct, stock_amount: 2 }}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        initialAmount={2}
      />,
    );

    const incrementButton = screen.getByText("+");
    // Already at max (2)
    fireEvent.click(incrementButton);

    // Should remain at 2
    expect(screen.getByText("Cart: 2")).toBeInTheDocument();
    expect(screen.getByText("Total Price: 100 Gil")).toBeInTheDocument();
  });

  test("does not go below 0 when - is clicked", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    const decrementButton = screen.getByText("-");
    // Already at 0, click should do nothing
    fireEvent.click(decrementButton);

    expect(screen.getByText("Cart: 0")).toBeInTheDocument();
    expect(screen.getByText("Total Price: 0 Gil")).toBeInTheDocument();
  });

  test("dispatches removeCartItem if cart amount is 0 on submit (and initialAmount > 0)", () => {
    // Simulate initially in cart, then removing (i.e. end up at 0)
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        initialAmount={2}
      />,
    );

    // Decrement to 0
    const decrementButton = screen.getByText("-");
    fireEvent.click(decrementButton);
    fireEvent.click(decrementButton);
    expect(screen.getByText("Cart: 0")).toBeInTheDocument();

    // Submit
    fireEvent.click(screen.getByText("Remove from cart"));
    expect(removeCartItem).toHaveBeenCalledWith({
      product: mockProduct,
      amount: 0,
    });
    expect(addOrUpdateCartItem).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Ensures onAddToCart is called
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    // playPurchaseSfx is triggered because the button has sfxOnClick
    expect(playPurchaseSfx).toHaveBeenCalled();
  });

  test("dispatches addOrUpdateCartItem if cart amount is > 0 on submit", () => {
    render(
      <ProductInfoModal
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    // Increment to 1
    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);
    expect(screen.getByText("Cart: 1")).toBeInTheDocument();

    // Submit
    fireEvent.click(screen.getByText("Add to cart"));

    expect(addOrUpdateCartItem).toHaveBeenCalledWith({
      product: mockProduct,
      amount: 1,
      total_price: mockProduct.price * 1,
    });
    expect(removeCartItem).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Ensures onAddToCart is called
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    // sfx is also triggered
    expect(playPurchaseSfx).toHaveBeenCalled();
  });
});
