import React from "react";
import { UserModel } from "../../utils/models";
import classNames from "classnames";
import styles from "./CharacterPortrait.module.scss";

interface CharacterPortraitProps {
  character: UserModel | null;
  showName?: boolean;
}

export const CharacterPortrait = ({
  character,
  showName = false,
}: CharacterPortraitProps) => {
  if (!character) {
    return <p>No Character Selected</p>;
  }

  return (
    <div className={classNames(styles.CharacterPortrait)}>
      <div className={classNames(styles.CharacterPortraitImageContainer)}>
        <img
          className={classNames(styles.CharacterPortraitImage)}
          src={character.portrait}
          alt={`${character.name} portrait`}
        />
      </div>
      {showName ? (
        <p className={classNames(styles.CharacterPortraitName)}>
          {character.name}
        </p>
      ) : null}
    </div>
  );
};
