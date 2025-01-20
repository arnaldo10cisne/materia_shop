import React, { useEffect, useState } from "react";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import styles from "./Products.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { MateriaIconModel, ProductModel } from "../../utils/models.ts";
import { MATERIA_LIST } from "../../utils/constants.ts";
import { ProductInfoModal } from "../../components/ProductInfoModal/ProductInfoModal.tsx";
import {
  disableScroll,
  enableScroll,
  getAllProducts,
  getStylizedNumber,
  playCancelCursorSfx,
  restockProducts,
} from "../../utils/utilityFunctions.ts";
import { CartModal } from "../../components/CartModal/CartModal.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { useQuery } from "react-query";
import { LoadingChocobo } from "../../components/LoadingChocobo/LoadingChocobo.tsx";
import { WaitingModal } from "../../components/WaitingModal/WaitingModal.tsx";

export const Products = () => {
  const [openProductModal, setOpenProductModal] = useState<boolean>(false);
  const [openCartModal, setOpenCartModal] = useState<boolean>(false);
  const [waitingForRestock, setWaitingForRestock] = useState(false);
  const [productInModal, setProductInModal] = useState<ProductModel | null>(
    null,
  );
  const navigate = useNavigate();

  const selectedUser = useSelector(
    (state: RootState) => state.user.selectedUser,
  );

  const cartContent = useSelector((state: RootState) => state.cart.currentCart);

  const {
    data: productsList,
    isLoading,
    refetch: refetchProductList,
  } = useQuery<ProductModel[]>(
    ["Products", "product_list"],
    () => getAllProducts(),
    {
      cacheTime: 0,
    },
  );

  const handleClickReturn = () => {
    navigate("/");
  };

  const handleClickPayWithCreditCard = () => {
    navigate("/order");
  };

  const handleRestockMateria = async () => {
    setWaitingForRestock(true);
    await restockProducts();
    refetchProductList();
    setWaitingForRestock(false);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartContent));
  }, [cartContent]);

  return (
    <>
      {waitingForRestock ? (
        <WaitingModal
          title="We are restocking our Materia."
          description="Our chocobos are gathering the Materia from the Moogle Market!"
          play_song={false}
          show_gif={false}
        />
      ) : null}
      {openProductModal ? (
        <ProductInfoModal
          product={productInModal}
          onClose={() => {
            enableScroll();
            setOpenProductModal(false);
            setProductInModal(null);
          }}
          onAddToCart={() => {
            enableScroll();
            setOpenProductModal(false);
            setProductInModal(null);
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
        <BlueBox customStyles={classNames(styles.ReturnBlueBox)}>
          <SelectableOption
            onClickHandler={handleClickReturn}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.Return}
          >
            Return
          </SelectableOption>
        </BlueBox>
        <div className={classNames(styles.middleSection)}>
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
            {isLoading ? (
              <LoadingChocobo />
            ) : (
              <>
                <div>
                  <SelectableOption
                    onClickHandler={handleRestockMateria}
                    customStyles={styles.RestockMateria}
                  >
                    Restock Materia
                  </SelectableOption>
                </div>
                <div className={classNames(styles.ProductList)}>
                  {productsList?.map((product: ProductModel) => {
                    if (!product?.name || !product?.description) {
                      return null;
                    }
                    return (
                      <div>
                        <SelectableOption
                          key={product.id}
                          onClickHandler={() => {
                            setProductInModal(product);
                            setOpenProductModal(true);
                            disableScroll();
                          }}
                          icon={MATERIA_LIST.find(
                            (materia: MateriaIconModel) => {
                              return materia.type === product.materia_type;
                            },
                          )}
                          disabled={product.stock_amount <= 0}
                          customStyles={styles.ProductItem}
                        >
                          {product.name}
                        </SelectableOption>
                        <p
                          className={classNames(
                            styles.ProductStock,
                            product.stock_amount <= 0 &&
                              styles.ProductStockEmpty,
                          )}
                        >
                          Stock:
                          <span
                            className={classNames(
                              styles.StockNumber,
                              product.stock_amount <= 0
                                ? styles.ProductStockEmpty
                                : null,
                            )}
                          >
                            {getStylizedNumber(
                              String(
                                product.stock_amount >= 0
                                  ? product.stock_amount
                                  : 0,
                              ),
                            )}
                          </span>
                          {cartContent.some(
                            (item) => item.product.id === product.id,
                          ) ? (
                            <>
                              <span className={classNames(styles.inCartAmount)}>
                                {" "}
                                - In Cart:{" "}
                              </span>
                              <span className={classNames(styles.CartNumber)}>
                                {getStylizedNumber(
                                  String(
                                    cartContent.find(
                                      (item) => item.product.id === product.id,
                                    )?.amount,
                                  ),
                                )}
                              </span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </BlueBox>
        </div>

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
