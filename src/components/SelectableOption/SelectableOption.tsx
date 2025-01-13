import React, { useState } from "react";
import { CURSOR_POINTER } from "../../utils/constants.ts";
import classNames from "classnames";
import styles from "./SelectableOption.module.scss";
import { MateriaIconModel } from "../../utils/models.ts";
import {
  playAcceptCursorSfx,
  playBuzzerCursorSfx,
  playMoveCursorSfx,
} from "../../utils/utilityFunctions.ts";

interface SelectableOptionProps {
  icon?: MateriaIconModel | null;
  children: React.ReactNode;
  disabled?: boolean;
  onClickHandler?: () => any;
  sfxOnClick?: () => void;
  customStyles?: any;
}

export const SelectableOption = ({
  children,
  icon = null,
  disabled = false,
  onClickHandler = () => {},
  sfxOnClick = playAcceptCursorSfx,
  customStyles = null,
}: SelectableOptionProps) => {
  const [cursorIsVisble, setCursorIsVisble] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setCursorIsVisble(true);
      playMoveCursorSfx();
    }
  };

  const handleMouseLeave = () => {
    setCursorIsVisble(false);
  };

  const handleClick = () => {
    if (!disabled) {
      sfxOnClick();
      onClickHandler();
    } else {
      playBuzzerCursorSfx();
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={classNames(
        styles.SelectableOption,
        disabled && styles.SelectableOptionDisabled,
        customStyles,
      )}
    >
      {cursorIsVisble && !disabled ? (
        <img
          className={classNames(styles.CursorImage)}
          src={CURSOR_POINTER}
          alt="cursor_pointer"
        />
      ) : null}

      <div
        className={classNames(
          styles.OptionContent,
          disabled && styles.OptionTextDisabled,
        )}
      >
        {icon ? (
          <img
            className={classNames(styles.OptionIcon)}
            src={icon.src}
            alt="optionIcon"
          />
        ) : null}{" "}
        {children}
      </div>
    </div>
  );
};
