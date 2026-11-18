import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface RateState {
  rate: {
    GBP: {
      rate: number;
      currency: string;
    };
    EUR: {
      rate: number;
      currency: string;
    };
    USD: {
      rate: number;
      currency: string;
    };
  },
  user: {
    rate: "GBP" | "EUR" | "USD",
    country: string,
    /** true while the currency is the default or auto-detected, false once the user picked it */
    isDefault: boolean
  },
  configured: boolean;
}

interface Rate {
  base: string;
  quote: string;
  rate: number;
}

const initialState: RateState = {
  rate: {
    GBP: {
      rate: 1,
      currency: "£"
    },
    EUR: {
      rate: 1,
      currency: "€"
    },
    USD: {
      rate: 1,
      currency: "$"
    }
  },
  user: {
    rate: "GBP",
    country: "United Kingdom",
    isDefault: true
  },
  configured: false
};

const rateSlice = createSlice({
  name: "rate",
  initialState,
  reducers: {
    setRate: (state, action: PayloadAction<{ rates: Rate[] }>) => {
      const { rates } = action.payload;

      state.rate = {
        GBP: {
          rate: rates.find((item) => item.quote === "GBP")?.rate ?? 1,
          currency: "£"
        },
        EUR: {
          rate: rates.find((item) => item.quote === "EUR")?.rate ?? 1,
          currency: "€"
        },
        USD: {
          rate: rates.find((item) => item.quote === "USD")?.rate ?? 1,
          currency: "$"
        }
      };
    },
    setUserRate: (state, action: PayloadAction<{ rate: "GBP" | "EUR" | "USD"; country: string; isDefault?: boolean }>) => {
      state.user.rate = action.payload.rate;
      state.user.country = action.payload.country;
      state.user.isDefault = action.payload.isDefault ?? false;
      state.configured = true;
    },

    setConfigured: (state, action: PayloadAction<boolean>) => {
      state.configured = action.payload;
    }


  },
});

export const selectRates = (state: RootState) => state.rate.rate;
export const selectUser = (state: RootState) => state.rate.user;

export const { setRate, setUserRate } = rateSlice.actions;
export default rateSlice.reducer;