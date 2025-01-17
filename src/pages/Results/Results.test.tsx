import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { Results } from "./Results";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  playCancelCursorSfx,
  playChocoboCry,
  playChocoboDance,
} from "../../utils/utilityFunctions";
import { clearCartContent } from "../../store/cartReducer";
import { OrderStatus } from "../../utils/models";

jest.mock("react-redux", () => {
  const originalModule = jest.requireActual("react-redux");
  return {
    ...originalModule,
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
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
  playCancelCursorSfx: jest.fn(),
  playChocoboCry: jest.fn(),
  playChocoboDance: jest.fn(),
}));

jest.mock("../../store/cartReducer", () => ({
  ...jest.requireActual("../../store/cartReducer"),
  clearCartContent: jest.fn(),
}));

describe("Results Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const mockUseSelector = (status: OrderStatus | null) => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {
          currentOrder: status
            ? {
                order_status: status,
              }
            : null,
        },
      });
    });
  };

  test("displays successful purchase text and dancing chocobo image when order is COMPLETED", () => {
    mockUseSelector(OrderStatus.COMPLETED);
    render(<Results />);

    expect(screen.getByText("Congratulations!")).toBeInTheDocument();
    expect(
      screen.getByText("Your payment was successful."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Our fastest Chocobo is on its way with your new Materia.",
      ),
    ).toBeInTheDocument();

    const chocoboImage = screen.getByAltText("chocobo") as HTMLImageElement;
    expect(chocoboImage).toBeInTheDocument();
    expect(chocoboImage.className).toContain("chocoboDancing");
  });

  test("displays fail text and fat chocobo image when order is NOT COMPLETED", () => {
    mockUseSelector(OrderStatus.FAILED);
    render(<Results />);

    expect(
      screen.getByText("Uh-oh, something went wrong!"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Either your payment failed or our Chocobo got too chonky to deliver.",
      ),
    ).toBeInTheDocument();

    const chocoboImage = screen.getByAltText("chocobo") as HTMLImageElement;
    expect(chocoboImage).toBeInTheDocument();
    expect(chocoboImage.className).toContain("fatChocobo");
  });

  test("useEffect calls playChocoboDance and dispatch(clearCartContent) when order is COMPLETED", () => {
    mockUseSelector(OrderStatus.COMPLETED);
    render(<Results />);

    expect(playChocoboDance).toHaveBeenCalledTimes(1);
    expect(playChocoboCry).not.toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalledWith(clearCartContent());
  });

  test("useEffect calls playChocoboCry when order is not COMPLETED", () => {
    mockUseSelector(OrderStatus.FAILED);
    render(<Results />);

    expect(playChocoboCry).toHaveBeenCalledTimes(1);
    expect(playChocoboDance).not.toHaveBeenCalled();

    expect(mockDispatch).not.toHaveBeenCalledWith(clearCartContent());
  });

  test("clicking the Return button navigates to '/' if COMPLETED", () => {
    mockUseSelector(OrderStatus.COMPLETED);
    render(<Results />);

    const returnButton = screen.getByText("Return to the Homepage");
    expect(returnButton).toBeInTheDocument();

    fireEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("clicking the Return button navigates to '/summary' if not COMPLETED", () => {
    mockUseSelector(OrderStatus.FAILED);
    render(<Results />);

    const returnButton = screen.getByText("Return to Order Summary");
    expect(returnButton).toBeInTheDocument();

    fireEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith("/summary");
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("renders default fail screen if currentOrder is null (e.g., no order)", () => {
    (useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return selectorFn({
        order: {},
      });
    });
    render(<Results />);

    expect(
      screen.getByText("Uh-oh, something went wrong!"),
    ).toBeInTheDocument();
    expect(playChocoboCry).toHaveBeenCalledTimes(1);
  });
});
