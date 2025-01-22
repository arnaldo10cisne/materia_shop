import classNames from "classnames";
import { useEffect } from "react";
import styles from "./Results.module.scss";
import { BlueBox } from "../../components/BlueBox/BlueBox";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { OrderStatus } from "../../utils/models";
import { useNavigate } from "react-router-dom";
import {
  playCancelCursorSfx,
  playChocoboCry,
  playChocoboDance,
} from "../../utils/utilityFunctions";
import {
  DELIVERY_CHOCOBO_IMAGE,
  FAT_CHOCOBO_IMAGE,
} from "../../utils/constants";
import { clearCartContent } from "../../store/cartReducer";

export const Results = () => {
  const order = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderCompleted =
    order.currentOrder?.order_status === OrderStatus.COMPLETED;

  const handleClickReturn = () => {
    if (orderCompleted) {
      navigate("/");
    } else {
      navigate("/order");
    }
  };

  useEffect(() => {
    if (orderCompleted) {
      playChocoboDance();
      dispatch(clearCartContent());
    } else {
      playChocoboCry();
    }
  }, [orderCompleted, dispatch]);

  return (
    <div className={classNames(styles.Results)}>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
          customStyles={styles.Return}
        >
          {orderCompleted
            ? "Return to the Homepage"
            : "Return to Order Summary"}
        </SelectableOption>
      </BlueBox>
      <BlueBox customStyles={styles.ResultsBlueBox}>
        {orderCompleted ? (
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
            orderCompleted ? styles.chocoboDancing : styles.fatChocobo,
          )}
          src={orderCompleted ? DELIVERY_CHOCOBO_IMAGE : FAT_CHOCOBO_IMAGE}
          alt="chocobo"
        />
      </BlueBox>
    </div>
  );
};
