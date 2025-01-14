import React from "react";
import classNames from "classnames";
import styles from "./BlueBox.module.scss";

interface BlueBoxProps {
  children: React.ReactNode;
  customStyles?: any;
}

export const BlueBox = ({ children, customStyles = null }: BlueBoxProps) => {
  return (
    <div className={classNames(styles.ExternalBorder)}>
      <div className={classNames(styles.MiddleBorder)}>
        <div
          className={classNames(
            styles.BlueBox,
            styles.InternalBorder,
            customStyles,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
