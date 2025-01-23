import classNames from "classnames";

import { CartItem } from "../../utils/models";
import styles from "./PriceSummary.module.scss";
import {
  calculateOrderPrice,
  getStylizedNumber,
} from "../../utils/utilityFunctions";

interface PriceSummaryProps {
  cart: CartItem[];
  addCcFee: boolean;
  includeDeliveryFee: boolean;
}

export const PriceSummary = ({
  cart,
  addCcFee = false,
  includeDeliveryFee = false,
}: PriceSummaryProps) => {
  return (
    <div className={classNames(styles.PriceSummary)}>
      <p>Price Summary</p>
      <div className={classNames(styles.infoRow, styles.BorderTopLabel)}>
        <p>Shopping Cart:</p>
        <p>
          {" "}
          <span className={classNames(styles.stylizedNumber)}>
            {getStylizedNumber(String(calculateOrderPrice(cart)))}
          </span>{" "}
          Gil
        </p>
      </div>
      {addCcFee ? (
        <div className={classNames(styles.infoRow)}>
          <p>Credit Card Fee:</p>
          <p>
            {" "}
            <span className={classNames(styles.stylizedNumber)}>
              {getStylizedNumber(
                String(
                  parseFloat((calculateOrderPrice(cart) * 0.14).toFixed(2)),
                ),
              )}
            </span>{" "}
            Gil
          </p>
        </div>
      ) : null}
      {includeDeliveryFee ? (
        <div className={classNames(styles.infoRow)}>
          <p>Delivery Fee:</p>
          <p>
            <span className={classNames(styles.stylizedNumber)}>
              {getStylizedNumber(String(750))}
            </span>{" "}
            Gil
          </p>
        </div>
      ) : null}
      <div className={classNames(styles.infoRow, styles.BorderTopLabel)}>
        <p>Order Total:</p>
        <p className={classNames(styles.orderTotal)}>
          <span className={classNames(styles.stylizedNumber)}>
            {getStylizedNumber(
              String(calculateOrderPrice(cart, addCcFee, includeDeliveryFee)),
            )}
          </span>{" "}
          Gil
        </p>
      </div>
    </div>
  );
};
