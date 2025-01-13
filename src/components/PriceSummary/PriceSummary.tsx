import classNames from "classnames";
import React from "react";
import { CartItem } from "../../utils/models";
import styles from "./PriceSummary.module.scss";
import { calculateOrderPrice } from "../../utils/utilityFunctions.ts";

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
      --------------------------------
      <div className={classNames(styles.infoRow)}>
        <p>Shopping Cart:</p>
        <p>{calculateOrderPrice(cart)} Gil</p>
      </div>
      {addCcFee ? (
        <div className={classNames(styles.infoRow)}>
          <p>Credit Card Fee:</p>
          <p>{parseFloat((calculateOrderPrice(cart) * 0.14).toFixed(2))} Gil</p>
        </div>
      ) : null}
      {includeDeliveryFee ? (
        <div className={classNames(styles.infoRow)}>
          <p>Delivery Fee:</p>
          <p>750 Gil</p>
        </div>
      ) : null}
      --------------------------------
      <div className={classNames(styles.infoRow)}>
        <p>Order Total:</p>
        <p className={classNames(styles.orderTotal)}>
          {calculateOrderPrice(cart, addCcFee, includeDeliveryFee)} Gil
        </p>
      </div>
    </div>
  );
};
