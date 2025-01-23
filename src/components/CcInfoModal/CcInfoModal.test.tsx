import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { CcInfoModal } from "./CcInfoModal";
import { useDispatch } from "react-redux";
import { setCreditCard } from "../../store/creditCardReducer";
import {
  playAcceptCursorSfx,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions";
import { CreditCardCompany } from "../../utils/models";

jest.mock("react-redux", () => {
  const actual = jest.requireActual("react-redux");
  return {
    ...actual,
    useDispatch: jest.fn(),
  };
});

jest.mock("../../store/creditCardReducer", () => ({
  ...jest.requireActual("../../store/creditCardReducer"),
  setCreditCard: jest.fn(),
}));

jest.mock("../../utils/utilityFunctions", () => ({
  ...jest.requireActual("../../utils/utilityFunctions"),
  playAcceptCursorSfx: jest.fn(),
  playCancelCursorSfx: jest.fn(),
}));

const mockUUID = "1234-uuid-mock";
Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => mockUUID,
  },
});

describe("CcInfoModal", () => {
  const mockDispatch = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSubmitCreditCard = jest.fn();
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterAll(() => {
    alertSpy.mockRestore();
  });

  const renderComponent = () =>
    render(
      <CcInfoModal
        onClose={mockOnClose}
        onSubmitCreditCard={mockOnSubmitCreditCard}
      />,
    );

  test("renders correctly and displays form elements", () => {
    renderComponent();

    expect(screen.getByLabelText("Credit Card Holder")).toBeInTheDocument();
    expect(screen.getByLabelText("Card Number")).toBeInTheDocument();
    expect(screen.getByLabelText("CVV")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiration Date")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Credit Card Holder"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("1234 5678 9012 3456"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("1234")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/YY")).toBeInTheDocument();

    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.getByText("Save Credit Card")).toBeInTheDocument();
  });

  test("closes modal on 'Close' button click", () => {
    renderComponent();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(playCancelCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("shows alert if required fields are empty on submit", () => {
    renderComponent();

    const saveButton = screen.getByText("Save Credit Card");
    fireEvent.click(saveButton);

    expect(alertSpy).toHaveBeenCalledWith("Please fill up the form correctly.");
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnSubmitCreditCard).not.toHaveBeenCalled();
  });

  test("formats card number into groups of 4 digits", () => {
    renderComponent();

    const cardNumberInput = screen.getByLabelText(
      /Card Number/i,
    ) as HTMLInputElement;

    fireEvent.change(cardNumberInput, {
      target: { value: "1234567890123456" },
    });
    expect(cardNumberInput.value).toBe("1234 5678 9012 3456");

    fireEvent.change(cardNumberInput, {
      target: { value: "1234567890123456789" },
    });
    expect(cardNumberInput.value).toBe("1234 5678 9012 3456");
  });

  test("maintains CVV limit of 4 digits", () => {
    renderComponent();

    const cvvInput = screen.getByLabelText(/CVV/i) as HTMLInputElement;
    fireEvent.change(cvvInput, { target: { value: "12345" } });
    expect(cvvInput.value).toBe("1234");
  });

  test("formats expiration date with MM/YY when typed", () => {
    renderComponent();

    const expInput = screen.getByLabelText(
      /Expiration Date/i,
    ) as HTMLInputElement;

    fireEvent.change(expInput, { target: { value: "1" } });
    expect(expInput.value).toBe("1");

    fireEvent.change(expInput, { target: { value: "12" } });
    expect(expInput.value).toBe("12");

    fireEvent.change(expInput, { target: { value: "123" } });
    expect(expInput.value).toBe("12/3");

    fireEvent.change(expInput, { target: { value: "1234" } });
    expect(expInput.value).toBe("12/34");
  });

  test("alerts if card number is less than 12 digits on submit", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText("Credit Card Holder"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Card Number"), {
      target: { value: "1234 4561 5124 125" },
    });
    fireEvent.change(screen.getByLabelText("CVV"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText("Expiration Date"), {
      target: { value: "12/34" },
    });

    fireEvent.click(screen.getByText("Save Credit Card"));

    expect(alertSpy).toHaveBeenCalledWith("Please fill up the form correctly.");
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnSubmitCreditCard).not.toHaveBeenCalled();
  });

  test("submits valid data and dispatches setCreditCard", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Credit Card Holder/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "4111 1111 1111 1111" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), {
      target: { value: "12/34" },
    });

    fireEvent.click(screen.getByText("Save Credit Card"));

    expect(alertSpy).not.toHaveBeenCalled();

    expect(setCreditCard).toHaveBeenCalledTimes(1);
    const dispatchedArg = (setCreditCard as unknown as jest.Mock).mock
      .calls[0][0];
    expect(dispatchedArg.id).toBe(mockUUID);
    expect(dispatchedArg.company).toBe(CreditCardCompany.VISA);
    expect(dispatchedArg.last_four_digits).toBe("1111");
    expect(dispatchedArg.sensitive_data).toEqual({
      company: CreditCardCompany.VISA,
      number: "4111111111111111",
      exp_month: "12",
      exp_year: "34",
      secret_code: "123",
      holder_name: "John Doe",
    });

    expect(screen.getByLabelText(/Credit Card Holder/i)).toHaveValue("");
    expect(screen.getByLabelText(/Card Number/i)).toHaveValue("");
    expect(screen.getByLabelText(/CVV/i)).toHaveValue("");
    expect(screen.getByLabelText(/Expiration Date/i)).toHaveValue("");

    expect(mockOnSubmitCreditCard).toHaveBeenCalledTimes(1);

    expect(playAcceptCursorSfx).toHaveBeenCalledTimes(1);
  });

  test("shows alert if CVV is less than 3 digits", () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Credit Card Holder/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Card Number/i), {
      target: { value: "4111 1111 1111 1111" },
    });
    fireEvent.change(screen.getByLabelText(/CVV/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), {
      target: { value: "12/34" },
    });

    fireEvent.click(screen.getByText("Save Credit Card"));

    expect(alertSpy).toHaveBeenCalledWith("Please fill up the form correctly.");
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnSubmitCreditCard).not.toHaveBeenCalled();
  });
});
