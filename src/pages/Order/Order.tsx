import classNames from "classnames";
import React, { useState } from "react";
import styles from "./Order.module.scss";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { useNavigate } from "react-router-dom";
import { CcInfoModal } from "../../components/CcInfoModal/CcInfoModal.tsx";
import {
  disableScroll,
  enableScroll,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

export const Order = () => {
  const [address, setAddress] = useState<string>("");
  const [openCcInfoModal, setOpenCcInfoModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

  const handleClickReturn = () => {
    navigate("/products");
  };

  const handleClickContinueWithPayment = () => {
    alert("making Payment");
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };

  return (
    <>
      {openCcInfoModal ? (
        <CcInfoModal
          onClose={() => {
            enableScroll();
            setOpenCcInfoModal(false);
          }}
          onSubmitCreditCard={() => {
            enableScroll();
            setOpenCcInfoModal(false);
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

        <BlueBox customStyles={styles.UserBlueBox}>
          <p className={classNames(styles.CreatingOrderFor)}>
            Creating Order for
          </p>
          <CharacterPortrait character={selectedUser} showName={true} />
        </BlueBox>

        <BlueBox customStyles={styles.OrderDataBlueBox}>
          <label htmlFor="delivery-address">Delivery Address</label>
          <textarea
            className={classNames(styles.addressTextArea)}
            name="deliveryAddress"
            id="delivery-address"
            value={address}
            onChange={handleAddressChange}
            maxLength={200}
          ></textarea>
          <p>{200 - address.length} characters remaining</p>

          <SelectableOption
            onClickHandler={() => {
              setOpenCcInfoModal(true);
              disableScroll();
            }}
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
