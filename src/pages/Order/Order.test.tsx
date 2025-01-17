import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { Order } from "./Order";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  disableScroll,
  playBuzzerCursorSfx,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions";
import { createOrder } from "../../store/orderReducer";
import { OrderStatus } from "../../utils/models";

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    ...originalModule,
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
  };
});

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  disableScroll: jest.fn(),
  enableScroll: jest.fn(),
  playCancelCursorSfx: jest.fn(),
  playBuzzerCursorSfx: jest.fn(),
}));

jest.mock("../../store/orderReducer", () => ({
  ...jest.requireActual("../../store/orderReducer"),
  createOrder: jest.fn(),
}));

describe("Order Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    (useSelector as jest.Mock).mockImplementation((selectorFn: any) => {
      return selectorFn({
        order: {
          currentOrder: null,
        },
        user: {
          selectedUser: {
            id: "user123",
            name: "Cloud Strife",
            email: "cloud@example.com",
            portrait: "cloud.png",
          },
        },
        creditCard: {
          creditCard: null,
        },
        cart: {
          currentCart: [],
        },
      });
    });
  });

  test("renders 'Return to Materia List' button and navigates on click", () => {
    render(<Order />);

    const returnButton = screen.getByText("Return to Materia List");
    expect(returnButton).toBeInTheDocument();

    fireEvent.click(returnButton);
    expect(mockNavigate).toHaveBeenCalledWith("/products");
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("displays user info (CharacterPortrait) with showName=true", () => {
    render(<Order />);

    expect(screen.getByText("Cloud Strife")).toBeInTheDocument();
  });

  test("address text area is initially empty if order.currentOrder?.address is null", () => {
    render(<Order />);

    const addressTextArea = screen.getByRole("textbox", {
      name: /Delivery Address/i,
    }) as HTMLTextAreaElement;
    expect(addressTextArea.value).toBe("");
  });

  test("displays address if order.currentOrder?.address is set", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {
          currentOrder: {
            address: "Mock Address",
            order_status: OrderStatus.PENDING,
          },
        },
        user: {
          selectedUser: {
            id: "user123",
            name: "Cloud Strife",
            portrait: "cloud.png",
            email: "cloud@example.com",
          },
        },
        creditCard: {
          creditCard: null,
        },
        cart: {
          currentCart: [],
        },
      });
    });

    render(<Order />);

    const addressTextArea = screen.getByRole("textbox", {
      name: /Delivery Address/i,
    }) as HTMLTextAreaElement;
    expect(addressTextArea.value).toBe("Mock Address");
  });

  test("typing into address updates the text area and shows remaining characters", () => {
    render(<Order />);

    const addressTextArea = screen.getByRole("textbox", {
      name: /Delivery Address/i,
    }) as HTMLTextAreaElement;

    fireEvent.change(addressTextArea, { target: { value: "12345" } });
    expect(addressTextArea.value).toBe("12345");

    expect(screen.getByText("195 characters remaining")).toBeInTheDocument();
  });

  test("shows 'Please Enter Credit Card Information' if creditCard is null", () => {
    render(<Order />);

    expect(
      screen.getByText("Please Enter Credit Card Information"),
    ).toBeInTheDocument();
  });

  test("if creditCard is not null, displays the CreditCardInfo component", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {
          currentOrder: null,
        },
        user: {
          selectedUser: null,
        },
        creditCard: {
          creditCard: {
            id: "test-cc-id",
            company: "VISA",
            last_four_digits: "1234",
          },
        },
        cart: {
          currentCart: [],
        },
      });
    });

    render(<Order />);

    expect(screen.getByText(/Credit Card Ending on 1234/i)).toBeInTheDocument();
  });

  test("clicking 'Enter Credit Card Information' opens CcInfoModal", () => {
    render(<Order />);

    const enterCcButton = screen.getByText("Enter Credit Card Information");
    expect(enterCcButton).toBeInTheDocument();

    fireEvent.click(enterCcButton);

    expect(disableScroll).toHaveBeenCalledTimes(1);
  });

  test("View Summary is disabled if address is empty or creditCard is null", () => {
    render(<Order />);

    const viewSummaryButton = screen.getByText("View Summary");
    fireEvent.click(viewSummaryButton);
    expect(playBuzzerCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("View Summary is enabled if address is present and creditCard is not null, then dispatches createOrder", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {
          currentOrder: null,
        },
        user: {
          selectedUser: {
            id: "user123",
            name: "Cloud Strife",
            email: "cloud@example.com",
            portrait: "cloud.png",
          },
        },
        creditCard: {
          creditCard: {
            id: "visa-id",
            company: "VISA",
            last_four_digits: "9999",
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
                materia_type: "MAGIC",
              },
              amount: 1,
              total_price: 50,
            },
          ],
        },
      });
    });

    render(<Order />);

    const addressTextArea = screen.getByRole("textbox", {
      name: /Delivery Address/i,
    }) as HTMLTextAreaElement;
    fireEvent.change(addressTextArea, { target: { value: "Midgar Sector 7" } });

    const viewSummaryButton = screen.getByText("View Summary");
    expect(viewSummaryButton).not.toBeDisabled();

    fireEvent.click(viewSummaryButton);

    expect(createOrder).toHaveBeenCalledTimes(1);
    const createOrderPayload = (createOrder as jest.Mock).mock.calls[0][0];
    expect(createOrderPayload.user.name).toBe("Cloud Strife");
    expect(createOrderPayload.address).toBe("Midgar Sector 7");
    expect(createOrderPayload.credit_card.last_four_digits).toBe("9999");
    expect(createOrderPayload.content).toEqual([
      {
        product: {
          id: "potion001",
          name: "Potion",
          price: 50,
          stock_amount: 10,
          materia_type: "MAGIC",
        },
        amount: 1,
        total_price: 50,
      },
    ]);

    expect(mockNavigate).toHaveBeenCalledWith("/summary");
  });

  test("local storage updates whenever creditCard changes", () => {
    const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");

    render(<Order />);
    expect(setItemSpy).toHaveBeenLastCalledWith(
      "creditCard",
      JSON.stringify(null),
    );

    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {
          currentOrder: null,
        },
        user: {
          selectedUser: null,
        },
        creditCard: {
          creditCard: {
            id: "test-visa",
            company: "VISA",
            last_four_digits: "1111",
          },
        },
        cart: {
          currentCart: [],
        },
      });
    });

    render(<Order />);

    expect(setItemSpy).toHaveBeenLastCalledWith(
      "creditCard",
      JSON.stringify({
        id: "test-visa",
        company: "VISA",
        last_four_digits: "1111",
      }),
    );
  });
});
