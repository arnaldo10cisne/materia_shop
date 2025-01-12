import React, { useState } from "react";
import { CURSOR_POINTER } from "../../utils/constants.ts";
import classNames from "classnames";
import styles from "./SelectableOption.module.scss";
import { IconModel } from "../../utils/models.ts";

interface SelectableOptionProps {
  icon?: IconModel | null;
  children: React.ReactNode;
  disabled?: boolean;
  onClickHandler?: () => any;
}

export const SelectableOption = ({
  children,
  icon = null,
  disabled = false,
  onClickHandler = () => {},
}: SelectableOptionProps) => {
  const [cursorIsVisble, setCursorIsVisble] = useState(false);

  const handleMouseEnter = () => {
    setCursorIsVisble(true);
  };

  const handleMouseLeave = () => {
    setCursorIsVisble(false);
  };

  const handleClick = () => {
    onClickHandler();
    // RUN SOUND
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={classNames(
        styles.SelectableOption,
        disabled && styles.SelectableOptionDisabled,
      )}
    >
      {cursorIsVisble && !disabled ? (
        <img
          className={classNames(styles.CursorImage)}
          src={CURSOR_POINTER}
          alt="cursor_pointer"
        />
      ) : null}

      <div className={classNames(styles.OptionContent)}>
        {icon ? (
          <img
            className={classNames(styles.OptionIcon)}
            src={icon.src}
            alt="optionIcon"
          />
        ) : null}{" "}
        <p className={classNames(disabled && styles.OptionTextDisabled)}>
          {children}
        </p>{" "}
      </div>
    </div>
  );
};
