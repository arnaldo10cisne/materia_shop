import React, { useState } from "react";
import styles from "./CcInfoModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import {
  playAcceptCursorSfx,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";
import {
  CreditCardCompany,
  CreditCardModel,
  CreditCardSensitiveDataModel,
} from "../../utils/models.ts";
import { useDispatch } from "react-redux";
import { setCreditCard } from "../../store/creditCardReducer.ts";
import { CARD_COMPANY_LIST } from "../../utils/constants.ts";

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
    // e.preventDefault();

    // Validaciones básicas
    if (
      !holderName ||
      !cardNumber ||
      !cvv ||
      !expirationDate ||
      cardNumber.length < 12 || // Por ejemplo, una longitud mínima
      cvv.length < 3 ||
      !/^\d{2}\/\d{2}$/.test(expirationDate) // Formato MM/YY
    ) {
      alert("Please fill up the form correctly.");
      return;
    }

    // Detectar la compañía de la tarjeta
    const company = detectCreditCardCompany(cardNumber);

    // Obtener las últimas 4 cifras del número de la tarjeta
    const lastFourDigits = cardNumber.slice(-4);

    // Parsear la fecha de vencimiento
    const [month, year] = expirationDate.split("/").map(Number);
    const expiration = new Date();
    expiration.setFullYear(2000 + year, month - 1, 1); // Asumiendo que el año está en formato YY

    // Crear el objeto sensitive_data
    const sensitiveData: CreditCardSensitiveDataModel = {
      company,
      number: cardNumber,
      expiration_date: expiration,
      secret_code: Number(cvv),
      holder_name: holderName,
    };

    // Crear el objeto CreditCardModel
    const creditCard: CreditCardModel = {
      id: crypto.randomUUID(),
      company,
      last_four_digits: lastFourDigits,
      sensitive_data: sensitiveData,
    };

    // Dispatch de la acción para establecer la tarjeta de crédito
    dispatch(setCreditCard(creditCard));

    // Limpiar el formulario
    setHolderName("");
    setCardNumber("");
    setCvv("");
    setExpirationDate("");

    // Opcional: Llamar a la función onSubmitCreditCard si necesitas realizar alguna acción adicional
    onSubmitCreditCard();
  };

  const detectCreditCardCompany = (cardNumber: string): CreditCardCompany => {
    const sanitizedNumber = cardNumber.replace(/\s+/g, ""); // Remueve espacios si los hubiera

    if (/^4/.test(sanitizedNumber)) {
      return CreditCardCompany.VISA;
    }
    // En este ejemplo solo se contemplan rangos 51-55 para MasterCard.
    // (MasterCard en la actualidad también comprende rangos 2221–2720,
    //  pero aquí mostramos la forma más básica)
    if (/^5[1-5]/.test(sanitizedNumber)) {
      return CreditCardCompany.MASTER_CARD;
    }

    return CreditCardCompany.OTHER;
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
              onChange={(e) => setCardNumber(e.target.value)}
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
              alt={`Credit Card Company`}
            />
          </div>
          <div className={styles.FormGroup}>
            <label htmlFor="cvv">Security Code (CVV)</label>
            <input
              className={classNames(styles.formInput)}
              type="password"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={4}
              pattern="\d{3,4}"
            />
          </div>
          <div className={styles.FormGroup}>
            <label htmlFor="expirationDate">Expiration Date (MM/YY)</label>
            <input
              className={classNames(styles.formInput)}
              type="text"
              id="expirationDate"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              pattern="^(0[1-9]|1[0-2])\/\d{2}$"
            />
          </div>
          <SelectableOption
            onClickHandler={handleSubmit}
            sfxOnClick={playAcceptCursorSfx}
            customStyles={styles.SubmitButton}
          >
            Save Credit Card
          </SelectableOption>
        </BlueBox>
      </div>
    </div>
  );
};
