import { BlueBox } from "../../components/BlueBox/BlueBox";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait";
import styles from "./UserSelection.module.scss";
import { useQuery } from "react-query";
import { UserModel } from "../../utils/models";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userReducer";
import { getAllUsers, playCancelCursorSfx } from "../../utils/utilityFunctions";
import { clearCartContent } from "../../store/cartReducer";
import { clearCreditCard } from "../../store/creditCardReducer";
import { clearOrder } from "../../store/orderReducer";
import { LoadingChocobo } from "../../components/LoadingChocobo/LoadingChocobo";

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
