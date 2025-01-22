import { useEffect } from "react";
import styles from "./WaitingModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox";
import { CHOCOBO_WAITING, CHOCOBO_WALTZ } from "../../utils/constants";

interface WaitingModalProps {
  title: string;
  description: string;
  play_song?: boolean;
  show_gif?: boolean;
}

export const WaitingModal = ({
  title,
  description,
  play_song = true,
  show_gif = true,
}: WaitingModalProps) => {
  useEffect(() => {
    if (CHOCOBO_WALTZ && play_song) {
      CHOCOBO_WALTZ.volume = 0.2;
      CHOCOBO_WALTZ.play()?.catch((err) =>
        console.error("Error playing chocoboWaltz song:", err),
      );
    }
    return () => {
      if (CHOCOBO_WALTZ && play_song) {
        CHOCOBO_WALTZ.pause();
        CHOCOBO_WALTZ.currentTime = 0;
      }
    };
  }, [play_song]);

  return (
    <div className={classNames(styles.waitingModalContainer)}>
      <div className={classNames(styles.waitingModal)}>
        <BlueBox>
          <div className={classNames(styles.MainContainer)}>
            <div className={classNames(styles.InformationText)}>
              <p className={classNames(styles.InformationLine)}>{title}</p>
              <p className={classNames(styles.InformationLine)}>
                {description}
              </p>
            </div>

            {show_gif ? (
              <img
                className={classNames(styles.ChocoboWaiting)}
                src={CHOCOBO_WAITING}
                alt="chocobo_waiting"
              />
            ) : null}
          </div>
        </BlueBox>
      </div>
    </div>
  );
};
