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

export const Products = () => {
  const [openProductModal, setOpenProductModal] = useState<boolean>(false);
  const [productInModal, setProductInModal] = useState<ProductModel | null>(
    null,
  );
  const navigate = useNavigate();

  const productsList: ProductModel[] = PLACEHOLDER_PRODUCT_LIST;

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickShowCart = () => {};

  const handleClickPayWithCreditCard = () => {
    //Add validations
    navigate("/order");
  };

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

        <BlueBox>Client Info</BlueBox>

        <BlueBox>
          <SelectableOption onClickHandler={handleClickShowCart}>
            Show Cart
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
                </p>
              </>
            );
          })}
        </BlueBox>

        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickPayWithCreditCard}
            customStyles={styles.PayWithCreditCard}
          >
            Pay with Credit card
          </SelectableOption>
        </BlueBox>
      </div>
    </>
  );
};
