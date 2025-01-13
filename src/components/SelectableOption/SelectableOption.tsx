import React, { useState } from "react";
import {
  CURSOR_POINTER,
  cursorAcceptSfx,
  cursorBuzzerSfx,
  cursorCancelSfx,
  cursorMoveSfx,
} from "../../utils/constants.ts";
import classNames from "classnames";
import styles from "./SelectableOption.module.scss";
import { MateriaIconModel } from "../../utils/models.ts";

interface SelectableOptionProps {
  icon?: MateriaIconModel | null;
  children: React.ReactNode;
  disabled?: boolean;
  is_return?: boolean;
  onClickHandler?: () => any;
}

export const SelectableOption = ({
  children,
  icon = null,
  disabled = false,
  is_return = false,
  onClickHandler = () => {},
}: SelectableOptionProps) => {
  const [cursorIsVisble, setCursorIsVisble] = useState(false);

  const handleMouseEnter = () => {
    if (!disabled) {
      setCursorIsVisble(true);
      cursorMoveSfx
        .play()
        .catch((err) => console.error("Error playing Cursor-Move sfx:", err));
    }
  };

  const handleMouseLeave = () => {
    setCursorIsVisble(false);
  };

  const handleClick = () => {
    if (!disabled) {
      if (is_return) {
        cursorCancelSfx
          .play()
          .catch((err) =>
            console.error("Error playing Cursor-Cancel sfx:", err),
          );
      } else {
        cursorAcceptSfx
          .play()
          .catch((err) =>
            console.error("Error playing Cursor-Accept sfx:", err),
          );
      }
      onClickHandler();
    } else {
      cursorBuzzerSfx
        .play()
        .catch((err) => console.error("Error playing Cursor-Buzzer sfx:", err));
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
