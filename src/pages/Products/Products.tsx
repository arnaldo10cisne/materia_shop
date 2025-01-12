import React from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import styles from "./Products.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export const Products = () => {
  const navigate = useNavigate();

  const handleClickReturn = () => {
    navigate("/");
  };

  return (
    <div className={classNames(styles.Products)}>
      <BlueBox>
        <SelectableOption onClickHandler={handleClickReturn}>
          Return
        </SelectableOption>
      </BlueBox>
      <BlueBox>Product List</BlueBox>
    </div>
  );
};
