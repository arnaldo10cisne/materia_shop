import classNames from "classnames";
import React, { useState } from "react";
import styles from "./Order.module.scss";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { useNavigate } from "react-router-dom";
import { CreditCardSensitiveDataModel } from "../../utils/models.ts";
import { CcInfoModal } from "../../components/CcInfoModal/CcInfoModal.tsx";
import {
  disableScroll,
  enableScroll,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";

export const Order = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [ccInfo, setCcInfo] = useState<CreditCardSensitiveDataModel | null>(
    null,
  );
  const [openCcInfoModal, setOpenCcInfoModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickReturn = () => {
    navigate("/products");
  };

  const handleClickContinueWithPayment = () => {
    alert("making Payment");
  };

  const handleEnterCreditCard = () => {};

  return (
    <>
      {openCcInfoModal ? (
        <CcInfoModal
          onClose={() => {
            enableScroll();
            setOpenCcInfoModal(false);
            playCancelCursorSfx();
          }}
        />
      ) : null}
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

        <BlueBox customStyles={styles.OrderDataBlueBox}>
          <p>Delivery Address</p>
          <textarea name="" id=""></textarea>

          <SelectableOption
            onClickHandler={() => {
              setOpenCcInfoModal(true);
              disableScroll();
            }}
            // customStyles={}
          >
            Enter Credit Card Information
          </SelectableOption>
        </BlueBox>

        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickContinueWithPayment}
            customStyles={styles.ContinueWithPayment}
          >
            View Summary
          </SelectableOption>
        </BlueBox>
      </div>
    </>
  );
};
