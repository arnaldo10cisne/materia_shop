import { useState } from "react";
import styles from "./CcInfoModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox";
import { SelectableOption } from "../SelectableOption/SelectableOption";
import {
  playAcceptCursorSfx,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions";
import {
  CreditCardCompany,
  CreditCardModel,
  CreditCardSensitiveDataModel,
} from "../../utils/models";
import { useDispatch } from "react-redux";
import { setCreditCard } from "../../store/creditCardReducer";
import { CARD_COMPANY_LIST, SHINRA } from "../../utils/constants";

interface CcInfoModalProps {
  onClose: () => any;
  onSubmitCreditCard: () => any;
}

export const CcInfoModal = ({
  onClose,
  onSubmitCreditCard,
}: CcInfoModalProps) => {
  const [holderName, setHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const dispatch = useDispatch();
  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (
      !holderName ||
      !cardNumber ||
      !cvv ||
      !expirationDate ||
      cardNumber.replace(/\s+/g, "").length < 16 ||
      cvv.length < 3 ||
      !/^\d{2}\/\d{2}$/.test(expirationDate)
    ) {
      alert("Please fill up the form correctly.");
      return;
    }

    const company = detectCreditCardCompany(cardNumber);

    const lastFourDigits = cardNumber.slice(-4);

    const [month, year] = expirationDate.split("/");

    const sensitiveData: CreditCardSensitiveDataModel = {
      company,
      number: cardNumber.replace(/\s+/g, ""),
      exp_month: month,
      exp_year: year,
      secret_code: cvv,
      holder_name: holderName,
    };

    const creditCard: CreditCardModel = {
      id: crypto.randomUUID(),
      company,
      last_four_digits: lastFourDigits,
      sensitive_data: sensitiveData,
    };

    dispatch(setCreditCard(creditCard));

    setHolderName("");
    setCardNumber("");
    setCvv("");
    setExpirationDate("");

    onSubmitCreditCard();
  };

  const detectCreditCardCompany = (cardNumber: string): CreditCardCompany => {
    const sanitizedNumber = cardNumber.replace(/\s+/g, "");

    if (/^4/.test(sanitizedNumber)) {
      return CreditCardCompany.VISA;
    }
    if (/^5[1-5]/.test(sanitizedNumber)) {
      return CreditCardCompany.MASTER_CARD;
    }

    return CreditCardCompany.OTHER;
  };

  const handleExpirationDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length === 0) {
      setExpirationDate("");
      return;
    }
    if (value.length <= 2) {
      setExpirationDate(value);
    } else {
      const month = value.slice(0, 2);
      const year = value.slice(2, 4);
      setExpirationDate(`${month}/${year}`);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    value = value.slice(0, 16);
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();

    setCardNumber(formattedValue);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");

    value = value.slice(0, 4);

    setCvv(value);
  };

  const handleMakeShinraPay = () => {
    setHolderName("Rufus Shinra");
    setCardNumber("4242 4242 4242 4242");
    setCvv("123");
    setExpirationDate("02/28");
  };

  return (
    <div className={classNames(styles.CcInfoModalContainer)}>
      <div className={classNames(styles.CcInfoModal)}>
        <BlueBox customStyles={styles.ModalBlueBox}>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
          >
            Close
          </SelectableOption>
          <div className={classNames(styles.form)}>
            <div className={styles.FormGroup}>
              <label htmlFor="holderName">Credit Card Holder</label>
              <input
                className={classNames(styles.formInput)}
                type="text"
                id="holderName"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Credit Card Holder"
              />
            </div>
            <div className={styles.FormGroup}>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                className={classNames(styles.formInput)}
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                pattern="[\d ]{16,19}"
              />
            </div>
            <div className={classNames(styles.CreditCardLogoContainer)}>
              <img
                className={classNames(styles.CreditCardLogo)}
                src={
                  CARD_COMPANY_LIST.find((element) => {
                    return (
                      element.company === detectCreditCardCompany(cardNumber)
                    );
                  })?.src
                }
                alt={`${detectCreditCardCompany(cardNumber)}`}
              />
            </div>
            <div
              className={classNames(
                styles.FormGroup,
                styles.FormGroupHorizontal,
              )}
            >
              <label htmlFor="cvv">CVV</label>
              <input
                className={classNames(styles.formInput, styles.cvv)}
                type="password"
                id="cvv"
                value={cvv}
                onChange={(e) => handleCvvChange(e)}
                placeholder="1234"
                maxLength={4}
                pattern="\d{3,4}"
              />
            </div>
            <div
              className={classNames(
                styles.FormGroup,
                styles.FormGroupHorizontal,
              )}
            >
              <label htmlFor="expirationDate">Expiration Date</label>
              <input
                className={classNames(styles.formInput, styles.expirationDate)}
                type="text"
                id="expirationDate"
                value={expirationDate}
                onChange={(e) => handleExpirationDateChange(e)}
                placeholder="MM/YY"
                maxLength={5}
                data-testid="expirationDate"
                pattern="^(0[1-9]|1[0-2])\/\d{2}$"
              />
            </div>
          </div>
          <SelectableOption
            onClickHandler={handleSubmit}
            sfxOnClick={playAcceptCursorSfx}
            customStyles={styles.SubmitButton}
          >
            <p className={classNames(styles.SaveCreditCard)}>
              Save Credit Card
            </p>
          </SelectableOption>
          <SelectableOption
            onClickHandler={handleMakeShinraPay}
            sfxOnClick={playAcceptCursorSfx}
            customStyles={styles.ShinraButton}
          >
            <div className={classNames(styles.MakeShinraPay)}>
              <img
                src={SHINRA}
                alt="shinra"
                className={classNames(styles.shinraLogo)}
              />
              <p className={classNames(styles.MakeShinraPayText)}>
                Make Shinra pay for you <br />
                <span className={classNames(styles.shinraExplanation)}>
                  Input valid fake credit card
                </span>
              </p>

              <img
                src={SHINRA}
                alt="shinra"
                className={classNames(styles.shinraLogo)}
              />
            </div>
          </SelectableOption>
        </BlueBox>
      </div>
    </div>
  );
};
