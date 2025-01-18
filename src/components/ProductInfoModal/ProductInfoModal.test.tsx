import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { ProductInfoModal } from "./ProductInfoModal";
import { useDispatch } from "react-redux";
import { addOrUpdateCartItem, removeCartItem } from "../../store/cartReducer";
import {
  getStylizedNumber,
  playCancelCursorSfx,
  playPurchaseSfx,
} from "../../utils/utilityFunctions";
import { ProductModel, MateriaTypes } from "../../utils/models";

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
  getStylizedNumber: jest.fn(),
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
    price: 70,
    stock_amount: 6,
    materia_type: MateriaTypes.MAGIC,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (getStylizedNumber as jest.Mock).mockImplementation((number: string) => {
      return `${number}`;
    });
  });

  test("renders nothing and calls onClose if product is null", () => {
    render(
      <ProductInfoModal
        product={null}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
      />,
    );

    expect(screen.queryByText("Add to cart")).not.toBeInTheDocument();
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

    expect(screen.getByText("Potion")).toBeInTheDocument();
    expect(screen.getByText("Heals 100 HP")).toBeInTheDocument();
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("Stock:")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();

    expect(screen.getByText("Cart: 0")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();

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

    expect(screen.getByText("Cart: 2")).toBeInTheDocument();
    expect(screen.getByText("140")).toBeInTheDocument();

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

    expect(screen.getByText("Cart: 1")).toBeInTheDocument();

    expect(screen.getAllByText("70")).toHaveLength(2);
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

    expect(screen.getByText("Cart: 1")).toBeInTheDocument();

    expect(screen.getAllByText("70")).toHaveLength(2);
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
    fireEvent.click(incrementButton);

    expect(screen.getByText("Cart: 2")).toBeInTheDocument();

    expect(screen.getByText("140")).toBeInTheDocument();
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
    fireEvent.click(decrementButton);

    expect(screen.getByText("Cart: 0")).toBeInTheDocument();

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("dispatches removeCartItem if cart amount is 0 on submit (and initialAmount > 0)", () => {
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
    fireEvent.click(decrementButton);
    expect(screen.getByText("Cart: 0")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove from cart"));
    expect(removeCartItem).toHaveBeenCalledWith({
      product: mockProduct,
      amount: 0,
    });
    expect(addOrUpdateCartItem).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
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

    const incrementButton = screen.getByText("+");
    fireEvent.click(incrementButton);
    expect(screen.getByText("Cart: 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add to cart"));

    expect(addOrUpdateCartItem).toHaveBeenCalledWith({
      product: mockProduct,
      amount: 1,
      total_price: mockProduct.price * 1,
    });
    expect(removeCartItem).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(playPurchaseSfx).toHaveBeenCalled();
  });
});
