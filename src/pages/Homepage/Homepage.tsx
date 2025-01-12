import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import classNames from "classnames";
import styles from "./Homepage.module.scss";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { MAGIC_MATERIA, PLACEHOLDER_CHARACTER } from "../../utils/constants.ts";

export const Homepage = () => {
  return (
    <div className={classNames(styles.Homepage)}>
      <BlueBox>
        <SelectableOption icon={MAGIC_MATERIA} disabled={true}>
          Fire
        </SelectableOption>
        <SelectableOption>Select Character</SelectableOption>
        <SelectableOption>Buy Materia</SelectableOption>
        <CharacterPortrait character={PLACEHOLDER_CHARACTER} showName={true} />
      </BlueBox>
    </div>
  );
};
