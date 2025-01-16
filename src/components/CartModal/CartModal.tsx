import React from "react";
import styles from "./CartModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";
import { RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { clearCartContent } from "../../store/cartReducer.ts";
import { PriceSummary } from "../PriceSummary/PriceSummary.tsx";
import { ShoppingCartList } from "../ShoppingCartList/ShoppingCartList.tsx";

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
              <ShoppingCartList showRemoveButton={true} />
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
