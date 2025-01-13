import React, { useState } from "react";
import styles from "./ProductInfoModal.module.scss";
import classNames from "classnames";
import { MateriaIconModel, ProductModel } from "../../utils/models.ts";
import { BlueBox } from "../BlueBox/BlueBox.tsx";
import { SelectableOption } from "../SelectableOption/SelectableOption.tsx";
import { MATERIA_LIST } from "../../utils/constants.ts";
import {
  playCancelCursorSfx,
  playPurchaseSfx,
} from "../../utils/utilityFunctions.ts";

interface ProductInfoModalProps {
  product: ProductModel | null;
  onClose: () => any;
  onAddToCart: () => any;
}

export const ProductInfoModal = ({
  product,
  onClose,
  onAddToCart,
}: ProductInfoModalProps) => {
  const [amountInCart, setAmountInCart] = useState(0);
  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleIncreaseAmount = () => {
    if (product && amountInCart < product.stock_amount) {
      setAmountInCart(amountInCart + 1);
    }
  };

  const handleDecreaseAmount = () => {
    if (amountInCart > 0) {
      setAmountInCart(amountInCart - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart();
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
            sfxOnClick={playCancelCursorSfx}
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

            <p>Stock: {product.stock_amount}</p>
            <div className={classNames(styles.AddToCartController)}>
              <SelectableOption
                onClickHandler={handleDecreaseAmount}
                disabled={amountInCart === 0}
              >
                <span className={classNames(styles.ChangeCartAmount)}>-</span>
              </SelectableOption>
              <p className={classNames(styles.CartAmount)}>
                Cart: {amountInCart}
              </p>
              <SelectableOption
                onClickHandler={handleIncreaseAmount}
                disabled={amountInCart >= product.stock_amount}
              >
                <span className={classNames(styles.ChangeCartAmount)}>+</span>
              </SelectableOption>
            </div>

            <SelectableOption
              onClickHandler={handleAddToCart}
              sfxOnClick={playPurchaseSfx}
              disabled={amountInCart === 0}
            >
              Add to cart
            </SelectableOption>
          </div>
        </BlueBox>
      </div>
    </div>
  );
};
