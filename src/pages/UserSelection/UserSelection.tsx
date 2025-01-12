import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import styles from "./UserSelection.module.scss";
import { UserModel } from "../../utils/models.ts";
import { PLACEHOLDER_CHARACTER } from "../../utils/constants.ts";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export const UserSelection = () => {
  const navigate = useNavigate();

  const characterList: UserModel[] = [
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
    PLACEHOLDER_CHARACTER,
  ];

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickSelectCharacter = () => {};

  return (
    <div className={classNames(styles.UserSelection)}>
      <BlueBox>
        <SelectableOption onClickHandler={handleClickReturn} is_return={true}>
          Return
        </SelectableOption>
      </BlueBox>
      <BlueBox>
        {characterList.map((character: UserModel) => {
          return (
            <SelectableOption
              key={character.id}
              onClickHandler={handleClickSelectCharacter}
            >
              <CharacterPortrait
                key={character.name}
                character={character}
                showName={true}
              />
            </SelectableOption>
          );
        })}
      </BlueBox>
    </div>
  );
};
