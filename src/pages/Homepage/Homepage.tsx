import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import classNames from "classnames";
import styles from "./Homepage.module.scss";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { PLACEHOLDER_CHARACTER } from "../../utils/constants.ts";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const navigate = useNavigate();

  const handleClickSelectCharacter = () => {
    navigate("/users");
  };

  const handleClickBuyMateria = () => {
    navigate("/products");
  };

  return (
    <div className={classNames(styles.Homepage)}>
      <BlueBox>
        <SelectableOption onClickHandler={handleClickSelectCharacter}>
          Select Character
        </SelectableOption>
        <SelectableOption onClickHandler={handleClickBuyMateria}>
          Buy Materia
        </SelectableOption>
        <CharacterPortrait character={PLACEHOLDER_CHARACTER} showName={true} />
      </BlueBox>
    </div>
  );
};
