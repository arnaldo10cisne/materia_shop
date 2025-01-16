import classNames from "classnames";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { CreditCardInfo } from "../../components/CreditCardInfo/CreditCardInfo.tsx";
import { createOrder } from "../../store/orderReducer.ts";
import { CreditCardModel, UserModel } from "../../utils/models.ts";

export const Order = () => {
  const order = useSelector((state: RootState) => state.order);

  const [address, setAddress] = useState<string>(
    order.currentOrder?.address || "",
  );
  const [openCcInfoModal, setOpenCcInfoModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

  const creditCard = useSelector(
    (state: RootState) => state.creditCard.creditCard,
  );

  const currentCart = useSelector((state: RootState) => state.cart);

  const handleClickReturn = () => {
    navigate("/products");
  };

  const handleClickViewSummary = () => {
    dispatch(
      createOrder({
        user: selectedUser as UserModel,
        content: currentCart.currentCart,
        address: address,
        credit_card: creditCard as CreditCardModel,
      }),
    );

    navigate("/summary");
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("creditCard", JSON.stringify(creditCard));
  }, [creditCard]);

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
          <p
            className={classNames(
              styles.RemainingCharacters,
              address.length >= 170 && styles.RemainingCharactersWarning,
            )}
          >
            {200 - address.length} characters remaining
          </p>

          <SelectableOption
            onClickHandler={() => {
              setOpenCcInfoModal(true);
              disableScroll();
            }}
            customStyles={styles.EnterCreditCardInfo}
          >
            Enter Credit Card Information
          </SelectableOption>

          {creditCard !== null ? (
            <CreditCardInfo creditCard={creditCard} />
          ) : (
            <p className={classNames(styles.PleaseEnterCC)}>
              Please Enter Credit Card Information
            </p>
          )}
        </BlueBox>

        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickViewSummary}
            customStyles={styles.ContinueWithPayment}
            disabled={!address || creditCard === null}
          >
            View Summary
          </SelectableOption>
        </BlueBox>
      </div>
    </>
  );
};
