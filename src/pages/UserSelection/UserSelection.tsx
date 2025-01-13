import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import styles from "./UserSelection.module.scss";
import { UserModel } from "../../utils/models.ts";
import { PLACEHOLDER_CHARACTER_LIST } from "../../utils/constants.ts";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userReducer.ts";
import { playCancelCursorSfx } from "../../utils/utilityFunctions.ts";

export const UserSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const characterList: UserModel[] = PLACEHOLDER_CHARACTER_LIST;

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickSelectCharacter = (character: UserModel) => {
    dispatch(setUser(character));
    navigate("/");
  };

  return (
    <div className={classNames(styles.UserSelection)}>
      <BlueBox>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
        >
          Return
        </SelectableOption>
      </BlueBox>
      <BlueBox>
        {characterList.map((character: UserModel) => {
          return (
            <SelectableOption
              key={character.id}
              onClickHandler={() => {
                handleClickSelectCharacter(character);
              }}
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
