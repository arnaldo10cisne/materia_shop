import { BlueBox } from "../../components/BlueBox/BlueBox";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption";
import classNames from "classnames";
import styles from "./Homepage.module.scss";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
      <BlueBox customStyles={styles.WelcomeBlueBox}>
        Welcome to the Materia Shop
      </BlueBox>
      <BlueBox customStyles={styles.HomepageBlueBox}>
        <SelectableOption
          onClickHandler={handleClickSelectCharacter}
          customStyles={styles.SelectCharacter}
        >
          Select Character
        </SelectableOption>
        <SelectableOption
          onClickHandler={handleClickBuyMateria}
          disabled={!selectedUser}
          customStyles={styles.BuyMateria}
        >
          Buy Materia
        </SelectableOption>
        <CharacterPortrait character={selectedUser} showName={true} />
      </BlueBox>
    </div>
  );
};
