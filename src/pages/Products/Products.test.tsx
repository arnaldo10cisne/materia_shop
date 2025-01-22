import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { Products } from "./Products";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import {
  disableScroll,
  getStylizedNumber,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions";
import { RootState } from "../../store/store";
import { MateriaTypes, ProductModel } from "../../utils/models";

jest.mock("react-query", () => ({
  ...jest.requireActual("react-query"),
  useQuery: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
}));
jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  disableScroll: jest.fn(),
  enableScroll: jest.fn(),
  playCancelCursorSfx: jest.fn(),
  getAllProducts: jest.fn(),
  getStylizedNumber: jest.fn(),
}));

describe("Products Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getStylizedNumber as unknown as jest.Mock).mockImplementation(
      (number: string) => {
        return `${number}`;
      },
    );
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useQuery as unknown as jest.Mock).mockImplementation((_, __, ___) => ({
      data: [],
      isLoading: false,
    }));
    (useSelector as unknown as jest.Mock).mockImplementation(
      (selectorFn: any) => {
        const mockState: Partial<RootState> = {
          user: {
            selectedUser: {
              id: "1",
              name: "Cloud Strife",
              portrait: "cloud.png",
              email: "cloud@example.com",
            },
          },
          cart: {
            currentCart: [],
          },
        };
        return selectorFn(mockState);
      },
    );
  });

  test("renders 'Return' button and navigates to '/' when clicked", () => {
    render(<Products />);

    const returnButton = screen.getByText("Return");
    expect(returnButton).toBeInTheDocument();

    fireEvent.click(returnButton);
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("enables 'Pay with Credit card' button if cart has items", () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) => {
      const mockState: Partial<RootState> = {
        user: {
          selectedUser: {
            id: "1",
            name: "Cloud",
            portrait: "cloud.png",
            email: "cloud@example.com",
          },
        },
        cart: {
          currentCart: [
            {
              product: {
                id: "potion001",
                name: "Potion",
                price: 50,
                stock_amount: 10,
                materia_type: MateriaTypes.MAGIC,
                description: "ItemDescription",
                picture: "picture.png",
              },
              amount: 1,
              total_price: 50,
            },
          ],
        },
      };
      return selectorFn(mockState);
    });

    render(<Products />);

    const payWithCcButton = screen.getByText("Pay with Credit card");
    expect(payWithCcButton).not.toBeDisabled();

    fireEvent.click(payWithCcButton);
    expect(mockNavigate).toHaveBeenCalledWith("/order");
  });

  test("shows loading spinner when isLoading = true", () => {
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<Products />);

    const loadingElement = screen.getByTestId("loading-chocobo");
    expect(loadingElement).toBeInTheDocument();
  });

  test("displays products list when not loading", () => {
    const mockProducts: ProductModel[] = [
      {
        id: "fire001",
        name: "Fire Materia",
        description: "Casts Fire",
        picture: "fire.png",
        price: 300,
        stock_amount: 5,
        materia_type: MateriaTypes.MAGIC,
      },
      {
        id: "ice002",
        name: "Ice Materia",
        description: "Casts Ice",
        picture: "ice.png",
        price: 250,
        stock_amount: 0,
        materia_type: MateriaTypes.MAGIC,
      },
    ];
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });

    render(<Products />);

    expect(screen.getByText("Fire Materia")).toBeInTheDocument();
    expect(screen.getByText("Ice Materia")).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("clicking on a product with stock > 0 opens the ProductInfoModal", () => {
    const mockProducts: ProductModel[] = [
      {
        id: "fire001",
        name: "Fire Materia",
        description: "Casts Fire",
        picture: "fire.png",
        price: 300,
        stock_amount: 5,
        materia_type: MateriaTypes.MAGIC,
      },
    ];
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });

    render(<Products />);

    expect(screen.queryByText("Add to cart")).not.toBeInTheDocument();

    const productButton = screen.getByText("Fire Materia");
    fireEvent.click(productButton);

    expect(screen.getByText("Add to cart")).toBeInTheDocument();

    expect(disableScroll).toHaveBeenCalledTimes(1);
  });

  test("clicking on a product with stock <= 0 is disabled (cannot open the modal)", () => {
    const mockProducts: ProductModel[] = [
      {
        id: "ice002",
        name: "Ice Materia",
        description: "Casts Ice",
        picture: "ice.png",
        price: 250,
        stock_amount: 0,
        materia_type: MateriaTypes.MAGIC,
      },
    ];
    (useQuery as unknown as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });

    render(<Products />);

    const disabledProductButton = screen.getByText("Ice Materia");

    fireEvent.click(disabledProductButton);
    expect(screen.queryByText("Add to cart")).not.toBeInTheDocument();
    expect(disableScroll).not.toHaveBeenCalled();
  });

  test("clicking 'Open Shopping Cart' opens the CartModal", () => {
    render(<Products />);

    const openCartButton = screen.getByText("Open Shopping Cart");
    fireEvent.click(openCartButton);

    expect(screen.getByText("CART IS EMPTY")).toBeInTheDocument();
    expect(disableScroll).toHaveBeenCalledTimes(1);
  });

  test("updates local storage whenever cartContent changes", () => {
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        user: { selectedUser: null },
        cart: { currentCart: [] },
      });
    });
    render(<Products />);
    expect(setItemSpy).toHaveBeenLastCalledWith("cart", JSON.stringify([]));

    (useSelector as unknown as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        user: { selectedUser: null },
        cart: {
          currentCart: [
            {
              product: {
                id: "thunder001",
                name: "Thunder Materia",
                description: "Casts Thunder",
                picture: "thunder.png",
                price: 300,
                stock_amount: 2,
                materia_type: MateriaTypes.MAGIC,
              },
              amount: 1,
              total_price: 300,
            },
          ],
        },
      });
    });

    render(<Products />);

    expect(setItemSpy).toHaveBeenLastCalledWith(
      "cart",
      JSON.stringify([
        {
          product: {
            id: "thunder001",
            name: "Thunder Materia",
            description: "Casts Thunder",
            picture: "thunder.png",
            price: 300,
            stock_amount: 2,
            materia_type: MateriaTypes.MAGIC,
          },
          amount: 1,
          total_price: 300,
        },
      ]),
    );
  });
});
