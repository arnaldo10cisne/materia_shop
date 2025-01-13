import React from "react";
import styles from "./CcInfoModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import {
  playAcceptCursorSfx,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";

interface CcInfoModalProps {
  onClose: () => any;
  onSubmitCreditCard: () => any;
}

export const CcInfoModal = ({
  onClose,
  onSubmitCreditCard,
}: CcInfoModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleSubmit = () => {
    // Add Credit card info to state
    onSubmitCreditCard();
  };

  return (
    <div className={classNames(styles.CcInfoModalContainer)}>
      <div className={classNames(styles.CcInfoModal)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
          >
            Close
          </SelectableOption>
          CREDIT CARD FORM
          <SelectableOption
            onClickHandler={handleSubmit}
            sfxOnClick={playAcceptCursorSfx}
          >
            Submit Credit Card Data
          </SelectableOption>
        </BlueBox>
      </div>
    </div>
  );
};
