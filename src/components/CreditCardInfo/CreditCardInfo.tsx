import React from "react";
import { CreditCardModel } from "../../utils/models.ts";
import styles from "./CreditCardInfo.module.scss";
import classNames from "classnames";
import { CLOUD_PORTRAIT_PLACEHOLDER } from "../../utils/constants.ts";

interface CreditCardInfoProps {
  creditCard: CreditCardModel;
}

export const CreditCardInfo = ({creditCard}: CreditCardInfoProps) => {
  if (!creditCard) {
    return <p>No Credit Card in State</p>;
  }
  
  return <div className={classNames(styles.CharacterPortrait)}>
  <div className={classNames(styles.CharacterPortraitImageContainer)}>
    <img
      className={classNames(styles.CharacterPortraitImage)}
      src={CLOUD_PORTRAIT_PLACEHOLDER}
      alt={`Credit Card Company`}
    />
  </div>
    <p className={classNames(styles.CharacterPortraitName)}>
      Credit Card Ending on {creditCard.last_four_digits}
    </p>
</div>;
};
