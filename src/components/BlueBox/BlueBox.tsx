import React from "react";
import classNames from "classnames";
import styles from "./BlueBox.module.scss";

interface BlueBoxProps {
  children: React.ReactNode;
}

export const BlueBox = ({ children }: BlueBoxProps) => {
  return (
    <div className={classNames(styles.ExternalBorder)}>
      <div className={classNames(styles.MiddleBorder)}>
        <div className={classNames(styles.BlueBox, styles.InternalBorder)}>
          {children}
        </div>
      </div>
    </div>
  );
};
