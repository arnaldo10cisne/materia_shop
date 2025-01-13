import React from "react";
import styles from "./CartModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { MATERIA_LIST } from "../../utils/constants.ts";
import { MateriaIconModel } from "../../utils/models.ts";
import { removeCartItem, clearCartContent } from "../../store/cartReducer.ts";
import { PriceSummary } from "../PriceSummary/PriceSummary.tsx";

interface CartModalProps {
  onClose: () => any;
}

export const CartModal = ({ onClose }: CartModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
  };
  const dispatch = useDispatch();

  const cartContent = useSelector((state: RootState) => state.cart.currentCart);

  return (
    <div className={classNames(styles.CartModalContainer)}>
      <div className={classNames(styles.CartModal)}>
        <BlueBox customStyles={styles.CartModalBlueBox}>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
          >
            Close
          </SelectableOption>
          {cartContent.length === 0 ? (
            <p className={classNames(styles.EmptyCartWarning)}>CART IS EMPTY</p>
          ) : (
            <>
              {cartContent.map((cartItem) => {
                return (
                  <>
                    <p className={classNames(styles.ProductName)}>
                      <img
                        className={classNames(styles.ProductIcon)}
                        src={
                          MATERIA_LIST.find((materia: MateriaIconModel) => {
                            return (
                              materia.type === cartItem.product.materia_type
                            );
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
                    <SelectableOption
                      onClickHandler={() => {
                        dispatch(
                          removeCartItem({
                            product: cartItem.product,
                            amount: cartItem.amount,
                          }),
                        );
                      }}
                      sfxOnClick={playCancelCursorSfx}
                      customStyles={styles.RemoveItem}
                    >
                      <p className={classNames(styles.RemoveItem)}>
                        Remove Item
                      </p>
                    </SelectableOption>
                  </>
                );
              })}
              <PriceSummary
                cart={cartContent}
                addCcFee={false}
                includeDeliveryFee={false}
              />
              <SelectableOption
                onClickHandler={() => {
                  dispatch(clearCartContent());
                }}
                sfxOnClick={playCancelCursorSfx}
                customStyles={styles.EmptyCartOption}
              >
                <p className={classNames(styles.EmptyCart)}>Empty Cart</p>
              </SelectableOption>
            </>
          )}
        </BlueBox>
      </div>
    </div>
  );
};
