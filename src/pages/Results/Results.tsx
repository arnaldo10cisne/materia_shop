import classNames from "classnames";
import React, { useEffect } from "react";
import styles from "./Results.module.scss";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { OrderStatus } from "../../utils/models.ts";
import { useNavigate } from "react-router-dom";
import {
  playCancelCursorSfx,
  playChocoboCry,
  playChocoboDance,
} from "../../utils/utilityFunctions.ts";
import {
  DELIVERY_CHOCOBO_IMAGE,
  FAT_CHOCOBO_IMAGE,
} from "../../utils/constants.ts";
import { clearCartContent } from "../../store/cartReducer.ts";

export const Results = () => {
  const order = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickReturn = () => {
    if (order.currentOrder?.order_status === OrderStatus.COMPLETED) {
      navigate("/");
    } else {
      navigate("/summary");
    }
  };

  useEffect(() => {
    if (order.currentOrder?.order_status === OrderStatus.COMPLETED) {
      playChocoboDance();
      dispatch(clearCartContent());
    } else {
      playChocoboCry();
    }
  }, [order.currentOrder?.order_status, dispatch]);

  return (
    <div className={classNames(styles.Results)}>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
          customStyles={styles.Return}
        >
          {order.currentOrder?.order_status === OrderStatus.COMPLETED
            ? "Return to the Homepage"
            : "Return to Order Summary"}
        </SelectableOption>
      </BlueBox>
      <BlueBox customStyles={styles.ResultsBlueBox}>
        {order.currentOrder?.order_status === OrderStatus.COMPLETED ? (
          <div className={classNames(styles.InformationText)}>
            <p className={classNames(styles.InformationLine)}>
              Congratulations!
            </p>
            <p className={classNames(styles.InformationLine)}>
              Your payment was successful.
            </p>
            <p className={classNames(styles.InformationLine)}>
              Our fastest Chocobo is on its way with your new Materia.
            </p>
            <p className={classNames(styles.InformationLine)}>
              Don't let it burn your house down!
            </p>
          </div>
        ) : (
          <div className={classNames(styles.InformationText)}>
            <p className={classNames(styles.InformationLine)}>
              Uh-oh, something went wrong!
            </p>
            <p className={classNames(styles.InformationLine)}>
              Either your payment failed or our Chocobo got too chonky to
              deliver.
            </p>
            <p className={classNames(styles.InformationLine)}>
              Please try another payment method, or try again later.
            </p>
          </div>
        )}

        <img
          className={classNames(
            order.currentOrder?.order_status === OrderStatus.COMPLETED
              ? styles.chocoboDancing
              : styles.fatChocobo,
          )}
          src={
            order.currentOrder?.order_status === OrderStatus.COMPLETED
              ? DELIVERY_CHOCOBO_IMAGE
              : FAT_CHOCOBO_IMAGE
          }
          alt="chocobo"
        />
      </BlueBox>
    </div>
  );
};
