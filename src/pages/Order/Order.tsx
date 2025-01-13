import classNames from "classnames";
import React from "react";
import styles from "./Order.module.scss";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";
import { useNavigate } from "react-router-dom";

export const Order = () => {
  const navigate = useNavigate();

  const handleClickReturn = () => {
    navigate("/products");
  };

  const handleClickContinueWithPayment = () => {
    alert("making Payment");
  };

  return (
    <div className={classNames(styles.Order)}>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
          customStyles={styles.Return}
        >
          Return to Materia List
        </SelectableOption>
      </BlueBox>

      <BlueBox customStyles={styles.OrderDataBlueBox}>ORDER DATA</BlueBox>

      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickContinueWithPayment}
          customStyles={styles.ContinueWithPayment}
        >
          Continue with payment
        </SelectableOption>
      </BlueBox>
    </div>
  );
};
