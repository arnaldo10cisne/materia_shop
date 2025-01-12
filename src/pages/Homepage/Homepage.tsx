import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import classNames from "classnames";
import styles from "./Homepage.module.scss";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

export const Homepage = () => {
  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );
  const navigate = useNavigate();

  const handleClickSelectCharacter = () => {
    navigate("/users");
  };

  const handleClickBuyMateria = () => {
    navigate("/products");
  };

  return (
    <div className={classNames(styles.Homepage)}>
      <BlueBox>Welcome to the Materia Shop</BlueBox>
      <BlueBox>
        <SelectableOption onClickHandler={handleClickSelectCharacter}>
          Select Character
        </SelectableOption>
        <SelectableOption
          onClickHandler={handleClickBuyMateria}
          disabled={!selectedUser}
        >
          Buy Materia
        </SelectableOption>
        <CharacterPortrait character={selectedUser} showName={true} />
      </BlueBox>
    </div>
  );
};
