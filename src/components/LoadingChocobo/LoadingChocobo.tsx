import React from "react";
import { CHOCOBO_WALKING } from "../../utils/constants.ts";
import classNames from "classnames";
import styles from "./LoadingChocobo.module.scss";

export const LoadingChocobo = () => {
  return (
    <div className={classNames(styles.LoadingChocobo)}>
      <img
        src={CHOCOBO_WALKING}
        alt="loading"
        className={classNames(styles.WalkingChocobo)}
        data-testid="loading-chocobo"
      />
      <p className={classNames(styles.LoadingText)}>...Loading...</p>
    </div>
  );
};
