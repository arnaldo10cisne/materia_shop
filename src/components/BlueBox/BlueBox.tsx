import classNames from "classnames";
import styles from "./BlueBox.module.scss";

interface BlueBoxProps {
  children?: React.ReactNode;
  customStyles?: any;
}

export const BlueBox = ({ children, customStyles = null }: BlueBoxProps) => {
  return (
    <div
      data-testid="bluebox-outer"
      className={classNames(styles.ExternalBorder)}
    >
      <div
        data-testid="bluebox-middle"
        className={classNames(styles.MiddleBorder)}
      >
        <div
          data-testid="bluebox-inner"
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
