import React from "react";
import { screen } from "@testing-library/react";
import { render } from "../../utils/test-utils/custom-render";
import { CreditCardInfo } from "./CreditCardInfo";
import { CreditCardModel, CreditCardCompany } from "../../utils/models";
import { CARD_COMPANY_LIST } from "../../utils/constants";

describe("CreditCardInfo Component", () => {
  const mockCreditCard: CreditCardModel = {
    id: "test-cc-id",
    company: CreditCardCompany.VISA,
    last_four_digits: "1234",
  };

  test("renders the component and shows the last four digits", () => {
    render(<CreditCardInfo creditCard={mockCreditCard} />);

    expect(screen.getByText(/Credit Card Ending on 1234/i)).toBeInTheDocument();
  });

  test("displays the correct card company logo based on the creditCard prop", () => {
    render(<CreditCardInfo creditCard={mockCreditCard} />);

    const imgElement = screen.getByAltText(
      "Credit Card Company",
    ) as HTMLImageElement;
    expect(imgElement).toBeInTheDocument();

    const visaEntry = CARD_COMPANY_LIST.find(
      (element) => element.company === mockCreditCard.company,
    );
    expect(imgElement.src).toContain(visaEntry.src);
  });
});
