import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreditCardModel, CreditCardCompany } from "../utils/models";

interface CreditCardStateModel {
  creditCard: CreditCardModel | null;
}

const initialState: CreditCardStateModel = {
  creditCard: null,
};

const initializeCreditCard = (
  state: CreditCardStateModel,
  company: CreditCardCompany = CreditCardCompany.OTHER,
) => {
  if (!state.creditCard) {
    state.creditCard = {
      id: crypto.randomUUID(),
      company,
      last_four_digits: "",
      sensitive_data: {
        company,
        number: "",
        secret_code: "",
        holder_name: "",
        exp_month: "",
        exp_year: "",
      },
    };
  } else {
    if (!state.creditCard.sensitive_data) {
      state.creditCard.sensitive_data = {
        company: state.creditCard.company,
        number: "",
        secret_code: "",
        holder_name: "",
        exp_month: "",
        exp_year: "",
      };
    }
  }
};

export const creditCardSlice = createSlice({
  name: "creditCard",
  initialState,
  reducers: {
    setCreditCard: (state, action: PayloadAction<CreditCardModel>) => {
      state.creditCard = action.payload;
    },

    updateCreditCardCompany: (
      state,
      action: PayloadAction<CreditCardCompany>,
    ) => {
      initializeCreditCard(state, action.payload);
      if (state.creditCard) {
        state.creditCard.company = action.payload;
        if (state.creditCard.sensitive_data) {
          state.creditCard.sensitive_data.company = action.payload;
        }
      }
    },

    updateCreditCardNumber: (state, action: PayloadAction<string>) => {
      initializeCreditCard(state);
      if (state.creditCard && state.creditCard.sensitive_data) {
        const cardNumber = action.payload;
        state.creditCard.sensitive_data.number = cardNumber;
        state.creditCard.last_four_digits = cardNumber.slice(-4);
      }
    },

    updateCreditCardSecretCode: (state, action: PayloadAction<string>) => {
      initializeCreditCard(state);
      if (state.creditCard && state.creditCard.sensitive_data) {
        state.creditCard.sensitive_data.secret_code = action.payload;
      }
    },

    updateCreditCardExpirationDate: (
      state,
      action: PayloadAction<{ exp_month: string; exp_year: string }>,
    ) => {
      initializeCreditCard(state);
      if (state.creditCard && state.creditCard.sensitive_data) {
        state.creditCard.sensitive_data.exp_month = action.payload.exp_month;
        state.creditCard.sensitive_data.exp_year = action.payload.exp_year;
      }
    },

    updateCreditCardHolderName: (state, action: PayloadAction<string>) => {
      initializeCreditCard(state);
      if (state.creditCard && state.creditCard.sensitive_data) {
        state.creditCard.sensitive_data.holder_name = action.payload;
      }
    },

    clearCreditCard: (state) => {
      state.creditCard = null;
    },
  },
});

export const {
  setCreditCard,
  updateCreditCardCompany,
  updateCreditCardNumber,
  updateCreditCardSecretCode,
  updateCreditCardExpirationDate,
  updateCreditCardHolderName,
  clearCreditCard,
} = creditCardSlice.actions;

export default creditCardSlice.reducer;
