import React, { useState } from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import styles from "./Products.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { MateriaIconModel, ProductModel } from "../../utils/models.ts";
import {
  MATERIA_LIST,
  PLACEHOLDER_PRODUCT_LIST,
} from "../../utils/constants.ts";
import { ProductInfoModal } from "../../components/ProductInfoModal/ProductInfoModal.tsx";
import {
  disableScroll,
  enableScroll,
  playCancelCursorSfx,
  playPurchaseSfx,
} from "../../utils/utilityFunctions.ts";
import { CartModal } from "../../components/CartModal/CartModal.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

export const Products = () => {
  const [openProductModal, setOpenProductModal] = useState<boolean>(false);
  const [openCartModal, setOpenCartModal] = useState<boolean>(false);
  const [productInModal, setProductInModal] = useState<ProductModel | null>(
    null,
  );
  const navigate = useNavigate();

  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

  const cartContent = useSelector((state: RootState) => state.cart.currentCart);

  const productsList: ProductModel[] = PLACEHOLDER_PRODUCT_LIST;

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickPayWithCreditCard = () => {
    navigate("/order");
  };

  console.log(cartContent);

  return (
    <>
      {openProductModal ? (
        <ProductInfoModal
          product={productInModal}
          onClose={() => {
            enableScroll();
            setOpenProductModal(false);
            setProductInModal(null);
            playCancelCursorSfx();
          }}
          onAddToCart={() => {
            enableScroll();
            setOpenProductModal(false);
            setProductInModal(null);
            playPurchaseSfx();
          }}
          initialAmount={
            cartContent.find((item) => item.product === productInModal)?.amount
          }
        />
      ) : null}
      {openCartModal ? (
        <CartModal
          onClose={() => {
            enableScroll();
            setOpenCartModal(false);
            playCancelCursorSfx();
          }}
        />
      ) : null}
      <div className={classNames(styles.Products)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickReturn}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.Return}
          >
            Return
          </SelectableOption>
        </BlueBox>

        <BlueBox customStyles={styles.UserBlueBox}>
          <p className={classNames(styles.BuyingMateriaFor)}>
            Buying Materia for
          </p>
          <CharacterPortrait character={selectedUser} showName={true} />
          <SelectableOption
            onClickHandler={() => {
              setOpenCartModal(true);
              disableScroll();
            }}
            customStyles={styles.ShowCart}
          >
            Open Shopping Cart
          </SelectableOption>
        </BlueBox>

        <BlueBox customStyles={styles.ProductListBlueBox}>
          {productsList.map((product: ProductModel) => {
            return (
              <>
                <SelectableOption
                  key={product.id}
                  onClickHandler={() => {
                    setProductInModal(product);
                    setOpenProductModal(true);
                    disableScroll();
                  }}
                  icon={MATERIA_LIST.find((materia: MateriaIconModel) => {
                    return materia.type === product.materia_type;
                  })}
                  disabled={product.stock_amount <= 0}
                  customStyles={styles.ProductItem}
                >
                  {product.name}
                </SelectableOption>
                <p
                  className={classNames(
                    styles.ProductStock,
                    product.stock_amount <= 0 && styles.ProductStockEmpty,
                  )}
                >
                  Stock: {product.stock_amount}
                  {cartContent.some((item) => item.product === product)
                    ? `  |||  In Cart:${cartContent.find((item) => item.product === product)?.amount}`
                    : null}
                </p>
              </>
            );
          })}
        </BlueBox>

        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickPayWithCreditCard}
            customStyles={styles.PayWithCreditCard}
            disabled={cartContent.length === 0}
          >
            Pay with Credit card
          </SelectableOption>
        </BlueBox>
      </div>
    </>
  );
};
