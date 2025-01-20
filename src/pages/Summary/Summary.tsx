import React, { useState } from "react";
import styles from "./Summary.module.scss";
import classNames from "classnames";
import { BlueBox } from "../../components/BlueBox/BlueBox.tsx";
import { SelectableOption } from "../../components/SelectableOption/SelectableOption.tsx";
import { CharacterPortrait } from "../../components/CharacterPortrait/CharacterPortrait.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  CartItem,
  CreditCardModel,
  OrderStatus,
  UserModel,
} from "../../utils/models.ts";
import { useNavigate } from "react-router-dom";
import {
  createOrderInBackend,
  getAcceptanceTokens,
  getCreditCardToken,
  playCancelCursorSfx,
  playCursorEquipSfx,
} from "../../utils/utilityFunctions.ts";
import { CreditCardInfo } from "../../components/CreditCardInfo/CreditCardInfo.tsx";
import { PriceSummary } from "../../components/PriceSummary/PriceSummary.tsx";
import { WaitingModal } from "../../components/WaitingModal/WaitingModal.tsx";
import { updateOrderStatus } from "../../store/orderReducer.ts";
import { ShoppingCartList } from "../../components/ShoppingCartList/ShoppingCartList.tsx";
import { useQuery } from "react-query";
import { LoadingChocobo } from "../../components/LoadingChocobo/LoadingChocobo.tsx";
import { CONVERSION_GIL_COP } from "../../utils/constants.ts";

export const Summary = () => {
  const [waitingForPayment, setWaitingForPayment] = useState(false);
  const [hasAcceptedPolicies, setHasAcceptedPolicies] = useState(false);
  const [hasAuthorizedData, setHasAuthorizedData] = useState(false);
  const order = useSelector((state: RootState) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickReturn = () => {
    navigate("/order");
  };

  const { data: acceptanceTokens, isLoading } = useQuery(
    ["AcceptanceTokens", "acceptance_token"],
    () => getAcceptanceTokens(),
  );

  const handleClickMakePayment = async () => {
    setWaitingForPayment(true);

    const creditCardToken = await getCreditCardToken(
      order.currentOrder?.payment_method?.credit_card as CreditCardModel,
    );

    if (creditCardToken === "ERROR") {
      setWaitingForPayment(false);
      navigate("/results");
      return;
    }

    const formattedOrderContent = order.currentOrder?.content.map(
      (cartItem: CartItem) => ({
        product: cartItem.product.id,
        amount: cartItem.amount,
      }),
    ) as [];

    const response = await createOrderInBackend({
      order_id: order.currentOrder?.id as string,
      content: formattedOrderContent,
      user_id: order.currentOrder?.user.id as string,
      total_order_price:
        (order.currentOrder?.total_order_price as number) * CONVERSION_GIL_COP,
      address: order.currentOrder?.address as string,
      acceptance_auth_token: acceptanceTokens?.acceptance_auth_token,
      acceptance_token: acceptanceTokens?.acceptance_token,
      customer_email: order.currentOrder?.user.email as string,
      tokenized_credit_card: creditCardToken,
    });

    setWaitingForPayment(false);

    dispatch(
      updateOrderStatus(
        response ? (response?.order_status as OrderStatus) : OrderStatus.FAILED,
      ),
    );

    navigate("/results");
  };

  return (
    <>
      {waitingForPayment ? (
        <WaitingModal
          title="Your payment is being processed."
          description="Our chocobos can hardly contain their excitement as they prepare to deliver your shiny new Materia!"
        />
      ) : null}
      <div className={classNames(styles.Summary)}>
        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickReturn}
            sfxOnClick={playCancelCursorSfx}
            customStyles={styles.Return}
          >
            Return to Payment Details
          </SelectableOption>
        </BlueBox>

        <div className={classNames(styles.middleSection)}>
          <BlueBox customStyles={styles.UserBlueBox}>
            <p className={classNames(styles.OrderSummary)}>Order Summary for</p>
            <CharacterPortrait
              character={order.currentOrder?.user as UserModel}
              showName={true}
            />
          </BlueBox>
          <BlueBox customStyles={styles.SummaryBlueBox}>
            {isLoading ? (
              <LoadingChocobo />
            ) : (
              <>
                <div>
                  <p>Order number:</p>
                  <p className={classNames(styles.orderNumber)}>
                    {order.currentOrder?.id}
                  </p>
                </div>

                <div>
                  <p className={classNames(styles.shoppingCartlabel)}>
                    Shopping Cart:
                  </p>
                  <ShoppingCartList />
                </div>

                <PriceSummary
                  cart={order.currentOrder?.content as CartItem[]}
                  addCcFee={true}
                  includeDeliveryFee={true}
                />

                <div>
                  <p className={classNames(styles.PaymentMethodLabel)}>
                    Payment Method:
                  </p>
                  <CreditCardInfo
                    creditCard={
                      order.currentOrder?.payment_method
                        ?.credit_card as CreditCardModel
                    }
                  />
                </div>
                <div>
                  <p className={classNames(styles.AddressdLabel)}>
                    Delivery Address:
                  </p>
                  <p className={classNames(styles.address)}>
                    {order.currentOrder?.address}
                  </p>
                </div>
                <div className={classNames(styles.PersonalDataCheckboxes)}>
                  <div className={classNames(styles.checkboxContainer)}>
                    <input
                      className={classNames(styles.checkbox)}
                      type="checkbox"
                      id="acceptPolicies"
                      checked={hasAcceptedPolicies}
                      onChange={(event) => {
                        setHasAcceptedPolicies(event.target.checked);
                        playCursorEquipSfx();
                      }}
                    />
                    <label
                      htmlFor="acceptPolicies"
                      className={classNames(styles.checkboxText)}
                    >
                      I accept that I have read the{" "}
                      <a
                        className={classNames(styles.permalink)}
                        href={acceptanceTokens?.acceptance_token_permalink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        regulations and the privacy policy
                      </a>{" "}
                      to make this payment.
                    </label>
                  </div>

                  <div className={classNames(styles.checkboxContainer)}>
                    <input
                      className={classNames(styles.checkbox)}
                      type="checkbox"
                      id="authorizeData"
                      checked={hasAuthorizedData}
                      onChange={(event) => {
                        setHasAuthorizedData(event.target.checked);
                        playCursorEquipSfx();
                      }}
                    />
                    <label
                      htmlFor="authorizeData"
                      className={classNames(styles.checkboxText)}
                    >
                      I accept the{" "}
                      <a
                        className={classNames(styles.permalink)}
                        href={acceptanceTokens?.acceptance_auth_token_permalink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        authorization for the administration of personal data
                      </a>
                    </label>
                  </div>
                </div>
              </>
            )}
          </BlueBox>
        </div>

        <BlueBox>
          <SelectableOption
            onClickHandler={handleClickMakePayment}
            customStyles={styles.ContinueWithPayment}
            disabled={
              !order.currentOrder?.address ||
              order.currentOrder.content.length === 0 ||
              !order.currentOrder.payment_method?.credit_card ||
              !hasAcceptedPolicies ||
              !hasAuthorizedData
            }
          >
            Continue with Payment
          </SelectableOption>
        </BlueBox>
      </div>
    </>
  );
};
