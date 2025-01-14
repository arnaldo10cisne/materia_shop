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
import { useDispatch } from "react-redux";
import {
  addOrUpdateCartItem,
  removeCartItem,
} from "../../store/cartReducer.ts";

interface ProductInfoModalProps {
  product: ProductModel | null;
  onClose: () => any;
  onAddToCart: () => any;
  initialAmount?: number;
}

export const ProductInfoModal = ({
  product,
  onClose,
  onAddToCart,
  initialAmount = 0,
}: ProductInfoModalProps) => {
  const [amountInCart, setAmountInCart] = useState(initialAmount);
  const dispatch = useDispatch();
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

  if (!product) {
    onClose();
    return null;
  }

  const handleAddToCart = () => {
    if (amountInCart === 0) {
      dispatch(
        removeCartItem({
          product: product,
          amount: amountInCart,
        }),
      );
    } else {
      dispatch(
        addOrUpdateCartItem({
          product: product,
          amount: amountInCart,
          total_price: product?.price * amountInCart,
        }),
      );
    }
    onAddToCart();
  };

  return (
    <div className={classNames(styles.ProductInfoModalContainer)}>
      <div className={classNames(styles.ProductInfoModal)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
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
            <p className={classNames(styles.ProductPrice)}>
              Price: {product.price} Gil
            </p>
            <p className={classNames(styles.ProductStock)}>
              Stock: {product.stock_amount}
            </p>
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

            <p className={classNames(styles.TotalPrice)}>
              Total Price: {product.price * amountInCart} Gil
            </p>

            <SelectableOption
              onClickHandler={handleAddToCart}
              sfxOnClick={playPurchaseSfx}
              customStyles={styles.AddToCart}
            >
              {initialAmount === 0
                ? "Add to cart"
                : amountInCart === 0 && initialAmount > 0
                  ? "Remove from cart"
                  : "Update cart"}
            </SelectableOption>
          </div>
        </BlueBox>
      </div>
    </div>
  );
};
