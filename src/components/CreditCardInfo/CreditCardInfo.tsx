import { CreditCardModel } from "../../utils/models";
import styles from "./CreditCardInfo.module.scss";
import classNames from "classnames";
import { CARD_COMPANY_LIST } from "../../utils/constants";

interface CreditCardInfoProps {
  creditCard: CreditCardModel;
}

export const CreditCardInfo = ({ creditCard }: CreditCardInfoProps) => {
  return (
    <div className={classNames(styles.CreditCardInfo)}>
      <div className={classNames(styles.CreditCardLogoContainer)}>
        <img
          className={classNames(styles.CreditCardLogo)}
          src={
            CARD_COMPANY_LIST.find((element) => {
              return element.company === creditCard.company;
            })?.src
          }
          alt={`Credit Card Company`}
        />
      </div>
      <p className={classNames(styles.CreditCardLogoInfo)}>
        Credit Card Ending on {creditCard.last_four_digits}
      </p>
    </div>
  );
};
