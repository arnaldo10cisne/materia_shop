import React from "react";
import styles from "./CartModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";

interface CartModalProps {
  onClose: () => any;
}

export const CartModal = ({ onClose }: CartModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
  };

  return (
    <div className={classNames(styles.CartModalContainer)}>
      <div className={classNames(styles.CartModal)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
          >
            Close
          </SelectableOption>
          <p>CART CONTENT</p>
        </BlueBox>
      </div>
    </div>
  );
};
