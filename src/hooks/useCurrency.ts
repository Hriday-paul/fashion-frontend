// useCurrency.ts
import { selectRates, selectUser } from "@/redux/features/rateSlice";
import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

export type CurrencyCode = "GBP" | "EUR" | "USD";

interface FormatOptions {
  /** Override the user's currency */
  currency?: CurrencyCode;
  /** Decimal places (default 2) */
  decimals?: number;
  /** Return only the converted number, no symbol */
  raw?: boolean;
}

/**
 * All amounts from/to the API are in GBP (the base currency).
 * Rates are GBP -> quote (see GetRates: base=GBP).
 */
export const useCurrency = () => {
  const rates = useSelector(selectRates);
  const user = useSelector(selectUser);

  const code: CurrencyCode = user?.rate ?? "GBP";
  const symbol = rates?.[code]?.currency ?? "£";
  // Persisted state from before this field existed has no isDefault
  const isDefault = user?.isDefault ?? false;

  /** Convert a GBP amount to the target currency (number only) */
  const convert = useCallback(
    (gbpAmount?: number | string | null, target: CurrencyCode = code): number => {
      const num = typeof gbpAmount === "string" ? parseFloat(gbpAmount) : (gbpAmount ?? 0);
      const safeAmount = isNaN(num) ? 0 : num;
      if (target === "GBP") return safeAmount;
      const rate = rates?.[target]?.rate ?? 1;
      return safeAmount * rate;
    },
    [rates, code]
  );

  /** Convert and format with symbol: 100 -> "£100.00" (GBP) or "$127.00" (USD) */
  const format = useCallback(
    (gbpAmount?: number | string | null, options: FormatOptions = {}): string => {
      const { currency = code, decimals = 2, raw = false } = options;
      const value = convert(gbpAmount, currency);

      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value);

      const currSymbol = rates?.[currency]?.currency ?? "£";
      return raw ? formatted : `${currSymbol}${formatted}`;
    },
    [convert, rates, code]
  );

  /** Always GBP, never converted. Use for records (orders, earnings, donations...) */
  const formatGbp = useCallback(
    (amount?: number | string | null, options: Omit<FormatOptions, "currency"> = {}): string =>
      format(amount, { ...options, currency: "GBP" }),
    [format]
  );

  /** Same as format but with the currency code: 10 -> "$12.70 USD" */
  const formatWithCode = useCallback(
    (gbpAmount?: number | string | null, currency: CurrencyCode = code, decimals = 2): string =>
      `${format(gbpAmount, { currency, decimals })} ${currency}`,
    [format, code]
  );

  return useMemo(
    () => ({
      convert,
      format,
      formatWithCode,
      formatGbp,
      symbol,
      code,
      isGbp: code === "GBP",
      isDefault,
      country: user?.country ?? "United Kingdom",
    }),
    [convert, format, formatWithCode, formatGbp, symbol, code, isDefault, user?.country]
  );
};
