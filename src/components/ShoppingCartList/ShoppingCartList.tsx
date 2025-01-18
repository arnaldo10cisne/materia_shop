import React from "react";
import styles from "./ShoppingCartList.module.scss";
import classNames from "classnames";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import {
  getStylizedNumber,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { MATERIA_LIST } from "../../utils/constants.ts";
import { MateriaIconModel } from "../../utils/models.ts";
import { removeCartItem } from "../../store/cartReducer.ts";

interface ShoppingCartListProps {
  showRemoveButton?: boolean;
}

export const ShoppingCartList = ({
  showRemoveButton = false,
}: ShoppingCartListProps) => {
  const dispatch = useDispatch();

  const cartContent = useSelector((state: RootState) => state.cart.currentCart);
  return (
    <div className={classNames(styles.ShoppingCartList)}>
      {cartContent.map((cartItem) => {
        return (
          <div className={classNames(styles.ProductList)}>
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
              <p className={classNames(styles.CartItemInfoData)}>Total Price</p>
            </div>
            <div className={classNames(styles.CartItemInfoRow)}>
              <p className={classNames(styles.CartItemInfoData)}>
                <span className={classNames(styles.StylizedNumber)}>
                  {getStylizedNumber(String(cartItem.product.price))}
                </span>
                Gil * {cartItem.amount} units
              </p>
              <p className={classNames(styles.CartItemInfoData)}>
                <span className={classNames(styles.StylizedNumber)}>
                  {getStylizedNumber(String(cartItem.total_price))}
                </span>
                Gil
              </p>
            </div>

            {showRemoveButton ? (
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
                <p className={classNames(styles.RemoveItem)}>Remove Item</p>
              </SelectableOption>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
