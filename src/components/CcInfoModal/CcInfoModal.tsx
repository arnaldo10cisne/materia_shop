import React from "react";
import styles from "./CcInfoModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";

interface CcInfoModalProps {
  onClose: () => any;
}

export const CcInfoModal = ({ onClose }: CcInfoModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
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
        </BlueBox>
      </div>
    </div>
  );
};
