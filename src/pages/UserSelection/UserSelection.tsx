import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import styles from "./UserSelection.module.scss";
import { useQuery } from "react-query";
import { UserModel } from "../../utils/models.ts";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userReducer.ts";
import {
  getAllUsers,
  playCancelCursorSfx,
} from "../../utils/utilityFunctions.ts";
import { clearCartContent } from "../../store/cartReducer.ts";
import { clearCreditCard } from "../../store/creditCardReducer.ts";
import { clearOrder } from "../../store/orderReducer.ts";
import { LoadingChocobo } from "../../components/LoadingChocobo/LoadingChocobo.tsx";

export const UserSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: characterList, isLoading } = useQuery<UserModel[]>(
    ["UserSelection", "user_list"],
    () => getAllUsers(),
    {
      staleTime: Infinity,
    },
  );

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickSelectCharacter = (character: UserModel) => {
    dispatch(setUser(character));
    dispatch(clearCartContent());
    dispatch(clearCreditCard());
    dispatch(clearOrder());
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(character));
    navigate("/");
  };

  return (
    <div className={classNames(styles.UserSelection)}>
      <BlueBox customStyles={classNames(styles.ReturnBlueBox)}>
        <SelectableOption
          onClickHandler={handleClickReturn}
          sfxOnClick={playCancelCursorSfx}
          customStyles={styles.Return}
        >
          Return
        </SelectableOption>
      </BlueBox>
      <BlueBox customStyles={styles.CharacterListBlueBox}>
        {isLoading ? (
          <LoadingChocobo />
        ) : (
          <div className={classNames(styles.userList)}>
            {characterList?.map((character: UserModel) => {
              return (
                <SelectableOption
                  key={character.id}
                  onClickHandler={() => {
                    handleClickSelectCharacter(character);
                  }}
                  customStyles={styles.CharacterItem}
                >
                  <CharacterPortrait
                    key={character.name}
                    character={character}
                    showName={true}
                  />
                </SelectableOption>
              );
            })}
          </div>
        )}
      </BlueBox>
    </div>
  );
};
