import classNames from "classnames";
import styles from "./Header.module.scss";
import { SelectableOption } from "../SelectableOption/SelectableOption";
import { METEOR } from "../../utils/constants";

export const Header = () => {
  return (
    <div className={classNames(styles.Header)}>
      <div>
        <SelectableOption>
          <a
            className={classNames(styles.aboutProject)}
            href="https://github.com/arnaldo10cisne/materia_shop/"
            target="_blank"
            rel="noreferrer"
          >
            About this Project
          </a>
        </SelectableOption>
      </div>
      <div>
        <img
          className={classNames(styles.meteor)}
          src={METEOR}
          alt={`meteor`}
        />
      </div>
      <div>
        <SelectableOption>
          <a
            className={classNames(styles.aboutDeveloper)}
            href="https://www.arnaldocisneros.com"
            target="_blank"
            rel="noreferrer"
          >
            About Me
          </a>
        </SelectableOption>
      </div>
    </div>
  );
};
