import React from "react";
import styles from "./ProductInfoModal.module.scss";
import classNames from "classnames";
import { MateriaIconModel, ProductModel } from "../../utils/models.ts";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { MATERIA_LIST } from "../../utils/constants.ts";

interface ProductInfoModalProps {
  product: ProductModel | null;
  onClose: () => any;
}

export const ProductInfoModal = ({
  product,
  onClose,
}: ProductInfoModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
  };

  if (!product) {
    onClose();
    return null;
  }

  return (
    <div className={classNames(styles.ProductInfoModalContainer)}>
      <div className={classNames(styles.ProductInfoModal)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            is_return={true}
          >
            Close
          </SelectableOption>
          <div className={classNames(styles.ProductInfoContainer)}>
            <img
              className={classNames(styles.ProductPicture)}
              src={product.picture}
              alt=""
            />

            <p className={classNames(styles.ProductName)}>
              <img
                className={classNames(styles.ProductIcon)}
                src={
                  MATERIA_LIST.find((materia: MateriaIconModel) => {
                    return materia.type === product.materia_type;
                  })?.src
                }
                alt="optionIcon"
              />
              {product.name}
            </p>
            <p className={classNames(styles.ProductDescription)}>
              {product.description}
            </p>
          </div>
        </BlueBox>
      </div>
    </div>
  );
};
