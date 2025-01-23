import { useState } from "react";
import styles from "./ProductInfoModal.module.scss";
import classNames from "classnames";
import { MateriaIconModel, ProductModel } from "../../utils/models";
import { BlueBox } from "../BlueBox/BlueBox";
import { SelectableOption } from "../SelectableOption/SelectableOption";
import { MATERIA_LIST } from "../../utils/constants";
import {
  getStylizedNumber,
  playAddToCart,
  playCancelCursorSfx,
  playPurchaseSfx,
  playRemoveFromCart,
} from "../../utils/utilityFunctions";
import { useDispatch } from "react-redux";
import { addOrUpdateCartItem, removeCartItem } from "../../store/cartReducer";

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
        <BlueBox customStyles={styles.ModalBlueBox}>
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
              alt={`${product.name}`}
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
              Price:
              <span className={classNames(styles.StylizedNumber)}>
                {getStylizedNumber(String(product.price))}
              </span>
              Gil
            </p>
            <p className={classNames(styles.ProductStock)}>
              Stock:
              <span className={classNames(styles.StylizedNumber)}>
                {getStylizedNumber(String(product.stock_amount))}
              </span>
            </p>
            <div className={classNames(styles.AddToCartController)}>
              <SelectableOption
                onClickHandler={handleDecreaseAmount}
                disabled={amountInCart === 0}
                sfxOnClick={playRemoveFromCart}
              >
                <span className={classNames(styles.ChangeCartAmount)}>-</span>
              </SelectableOption>
              <p className={classNames(styles.CartAmount)}>
                Cart: {amountInCart}
              </p>
              <SelectableOption
                onClickHandler={handleIncreaseAmount}
                disabled={amountInCart >= product.stock_amount}
                sfxOnClick={playAddToCart}
              >
                <span className={classNames(styles.ChangeCartAmount)}>+</span>
              </SelectableOption>
            </div>

            <p className={classNames(styles.TotalPrice)}>
              Total Price:
              <span className={classNames(styles.StylizedNumber)}>
                {getStylizedNumber(String(product.price * amountInCart))}
              </span>
              Gil
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
