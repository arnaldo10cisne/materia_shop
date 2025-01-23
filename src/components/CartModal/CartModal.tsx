import styles from "./CartModal.module.scss";
import classNames from "classnames";
import { BlueBox } from "../BlueBox/BlueBox";
import { SelectableOption } from "../SelectableOption/SelectableOption";
import { playCancelCursorSfx, playErase } from "../../utils/utilityFunctions";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { clearCartContent } from "../../store/cartReducer";
import { PriceSummary } from "../PriceSummary/PriceSummary";
import { ShoppingCartList } from "../ShoppingCartList/ShoppingCartList";

interface CartModalProps {
  onClose: () => any;
}

export const CartModal = ({ onClose }: CartModalProps) => {
  const handleCloseButtonClick = () => {
    onClose();
  };
  const dispatch = useDispatch();

  const cartContent = useSelector((state: RootState) => state.cart.currentCart);

  return (
    <div className={classNames(styles.CartModalContainer)}>
      <div className={classNames(styles.CartModal)}>
        <BlueBox customStyles={styles.ModalBlueBox}>
          <SelectableOption
            onClickHandler={handleCloseButtonClick}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.CloseModal}
          >
            Close
          </SelectableOption>
          {cartContent.length === 0 ? (
            <p className={classNames(styles.EmptyCartWarning)}>CART IS EMPTY</p>
          ) : (
            <>
              <ShoppingCartList showRemoveButton={true} />
              <PriceSummary
                cart={cartContent}
                addCcFee={false}
                includeDeliveryFee={false}
              />
              <SelectableOption
                onClickHandler={() => {
                  dispatch(clearCartContent());
                }}
                sfxOnClick={playErase}
                customStyles={styles.EmptyCartOption}
              >
                <p className={classNames(styles.EmptyCart)}>Empty Cart</p>
              </SelectableOption>
            </>
          )}
        </BlueBox>
      </div>
    </div>
  );
};
