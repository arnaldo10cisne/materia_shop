import React from "react";
import styles from "./Summary.module.scss";
import classNames from "classnames";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  CartItem,
  CreditCardModel,
  MateriaIconModel,
  UserModel,
} from "../../utils/models.ts";
import { useNavigate } from "react-router-dom";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";
import { MATERIA_LIST } from "../../utils/constants.ts";
import { CreditCardInfo } from "../../components/CreditCardInfo/CreditCardInfo.tsx";
import { PriceSummary } from "../../components/PriceSummary/PriceSummary.tsx";

export const Summary = () => {
  const order = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();

  const handleClickReturn = () => {
    navigate("/order");
  };

  const handleClickMakePayment = () => {};

  return (
    <div className={classNames(styles.Summary)}>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
          customStyles={styles.Return}
        >
          Return to Payment Details
        </SelectableOption>
      </BlueBox>
      <BlueBox customStyles={styles.UserBlueBox}>
        <p className={classNames(styles.OrderSummary)}>Order Summary for</p>
        <CharacterPortrait
          character={order.currentOrder?.user as UserModel}
          showName={true}
        />
      </BlueBox>
      <BlueBox customStyles={styles.SummaryBlueBox}>
        <div>
          <p>Order number:</p>
          <p className={classNames(styles.orderNumber)}>
            {order.currentOrder?.id}
          </p>
        </div>

        <div>
          <p className={classNames(styles.shoppingCartlabel)}>Shopping Cart:</p>
          {order.currentOrder?.content.map((cartItem) => {
            return (
              <>
                <p className={classNames(styles.ProductName)}>
                  <img
                    className={classNames(styles.ProductIcon)}
                    src={
                      MATERIA_LIST.find((materia: MateriaIconModel) => {
                        return materia.type === cartItem.product.materia_type;
                      })?.src
                    }
                    alt="materiaIcon"
                  />
                  {cartItem.product.name}
                </p>
                <div
                  className={classNames(
                    styles.CartItemInfoRow,
                    styles.CartItemInfoLabelRow,
                  )}
                >
                  <p className={classNames(styles.CartItemInfoData)}>
                    Unit Price * Units
                  </p>
                  <p className={classNames(styles.CartItemInfoData)}>
                    Total Price
                  </p>
                </div>
                <div className={classNames(styles.CartItemInfoRow)}>
                  <p className={classNames(styles.CartItemInfoData)}>
                    {cartItem.product.price} Gil * {cartItem.amount} units
                  </p>
                  <p className={classNames(styles.CartItemInfoData)}>
                    {cartItem.total_price} Gil
                  </p>
                </div>
              </>
            );
          })}
        </div>

        <PriceSummary
          cart={order.currentOrder?.content as CartItem[]}
          addCcFee={true}
          includeDeliveryFee={true}
        />

        <div>
          <p className={classNames(styles.PaymentMethodLabel)}>
            Payment Method:
          </p>
          <CreditCardInfo
            creditCard={
              order.currentOrder?.payment_method?.credit_card as CreditCardModel
            }
          />
        </div>
        <div>
          <p className={classNames(styles.PaymentMethodLabel)}>
            Delivery Address:
          </p>
          <p className={classNames(styles.address)}>
            {order.currentOrder?.address}
          </p>
        </div>
      </BlueBox>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickMakePayment}
          customStyles={styles.ContinueWithPayment}
        >
          Continue with Payment
        </SelectableOption>
      </BlueBox>
    </div>
  );
};
