import React, { useEffect } from "react";
import styles from "./WaitingModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { CHOCOBO_WAITING, CHOCOBO_WALTZ } from "../../utils/constants.ts";

export const WaitingModal = () => {
  useEffect(() => {
    if (CHOCOBO_WALTZ) {
      CHOCOBO_WALTZ.volume = 0.2;
      CHOCOBO_WALTZ.play()?.catch((err) =>
        console.error("Error playing chocoboWaltz song:", err),
      );
    }
    return () => {
      if (CHOCOBO_WALTZ) {
        CHOCOBO_WALTZ.pause();
        CHOCOBO_WALTZ.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className={classNames(styles.waitingModalContainer)}>
      <div className={classNames(styles.waitingModal)}>
        <BlueBox>
          <div className={classNames(styles.MainContainer)}>
            <div className={classNames(styles.InformationText)}>
              <p className={classNames(styles.InformationLine)}>
                Your payment is being processed.
              </p>
              <p className={classNames(styles.InformationLine)}>
                Our chocobos can hardly contain their excitement as they prepare
                to deliver your shiny new Materia!
              </p>
            </div>

            <img
              className={classNames(styles.ChocoboWaiting)}
              src={CHOCOBO_WAITING}
              alt="chocobo_waiting"
            />
          </div>
        </BlueBox>
      </div>
    </div>
  );
};
