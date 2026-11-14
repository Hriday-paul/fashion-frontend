import { useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserRate } from "@/redux/features/rateSlice";
import { countries } from "@/utils/constant";

const getCurrencyForCountry = (code: string): "GBP" | "EUR" | "USD" => {
  const upper = code.toUpperCase();
  if (upper === "GB") return "GBP";
  const eurozone = [
    "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
    "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR",
  ];
  if (eurozone.includes(upper)) return "EUR";
  return "USD";
};

const getTimeZoneCountryCode = (): string | null => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return null;

    const tzMap: Record<string, string> = {
      "Asia/Dhaka": "BD",
      "Europe/London": "GB",
      "Europe/Belfast": "GB",
      "Asia/Kolkata": "IN",
      "Asia/Calcutta": "IN",
      "Asia/Karachi": "PK",
      "Asia/Kathmandu": "NP",
      "Asia/Colombo": "LK",
      "Europe/Paris": "FR",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Madrid": "ES",
      "Europe/Amsterdam": "NL",
      "Europe/Brussels": "BE",
      "Europe/Dublin": "IE",
      "Europe/Vienna": "AT",
      "Europe/Lisbon": "PT",
      "Europe/Athens": "GR",
      "Europe/Warsaw": "PL",
      "Europe/Stockholm": "SE",
      "Europe/Oslo": "NO",
      "Europe/Copenhagen": "DK",
      "Europe/Helsinki": "FI",
      "Europe/Zurich": "CH",
      "America/Toronto": "CA",
      "America/Vancouver": "CA",
      "America/Montreal": "CA",
      "America/Edmonton": "CA",
      "America/Winnipeg": "CA",
      "America/Halifax": "CA",
      "Australia/Sydney": "AU",
      "Australia/Melbourne": "AU",
      "Australia/Brisbane": "AU",
      "Australia/Perth": "AU",
      "Australia/Adelaide": "AU",
      "Pacific/Auckland": "NZ",
      "Asia/Tokyo": "JP",
      "Asia/Seoul": "KR",
      "Asia/Singapore": "SG",
      "Asia/Kuala_Lumpur": "MY",
      "Asia/Bangkok": "TH",
      "Asia/Jakarta": "ID",
      "Asia/Manila": "PH",
      "Asia/Hong_Kong": "HK",
      "Asia/Taipei": "TW",
      "Asia/Dubai": "AE",
      "Asia/Riyadh": "SA",
      "America/Sao_Paulo": "BR",
      "America/Mexico_City": "MX",
      "America/Bogota": "CO",
      "America/Lima": "PE",
      "America/Santiago": "CL",
      "America/Buenos_Aires": "AR",
      "Africa/Johannesburg": "ZA",
      "Africa/Cairo": "EG",
      "Africa/Lagos": "NG",
      "Africa/Nairobi": "KE",
    };

    if (tzMap[tz]) return tzMap[tz];

    if (tz.startsWith("America/")) return "US";
    if (tz.startsWith("Europe/")) return "GB";
    if (tz.startsWith("Australia/")) return "AU";
  } catch (err) {
    // ignore
  }
  return null;
};

const detectCountryByIP = async (): Promise<string | null> => {
  try {
    const res = await fetch("https://api.country.is", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.country && typeof data.country === "string") {
        return data.country.trim().toUpperCase();
      }
    }
  } catch (err) {
    // fallback
  }

  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data?.country_code && typeof data.country_code === "string") {
        return data.country_code.trim().toUpperCase();
      }
    }
  } catch (err) {
    // ignore
  }

  return null;
};

export const useAutoSelectCountry = (
  setValue: UseFormSetValue<any>,
  currentValue?: string
) => {
  const dispatch = useAppDispatch();
  const rateState = useAppSelector((state) => state.rate);
  const userRate = rateState?.user;
  const isConfigured = Boolean(rateState?.configured);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // If the field is already populated and initialized, do not override user changes
    if (currentValue && hasInitialized.current) return;

    let isMounted = true;

    const selectCountry = async () => {
      // 1. If rateSlice is explicitly configured by user, prioritize it
      if (isConfigured && userRate?.country) {
        const found = countries.find(
          (c) => c.name.toLowerCase() === userRate.country.toLowerCase()
        );
        if (found && isMounted) {
          setValue("country", found.name, { shouldValidate: true });
          hasInitialized.current = true;
          return;
        }
      }

      // 2. Set temporary initial value from rateSlice so field is not blank
      if (userRate?.country && !hasInitialized.current) {
        const initialMatch = countries.find(
          (c) => c.name.toLowerCase() === userRate.country.toLowerCase()
        );
        if (initialMatch && isMounted) {
          setValue("country", initialMatch.name, { shouldValidate: false });
        }
      }

      // 3. Detect via Geolocation (IP detection first, then timezone)
      let detectedCode = await detectCountryByIP();
      if (!detectedCode) {
        detectedCode = getTimeZoneCountryCode();
      }

      if (detectedCode && isMounted) {
        const matched = countries.find(
          (c) => c.code.toUpperCase() === detectedCode!.toUpperCase()
        );

        if (matched) {
          setValue("country", matched.name, { shouldValidate: true });
          hasInitialized.current = true;

          // If rateSlice was not configured, sync rateSlice with the detected country
          if (!isConfigured) {
            dispatch(
              setUserRate({
                country: matched.name,
                rate: getCurrencyForCountry(matched.code),
              })
            );
          }
          return;
        }
      }

      // 4. Fallback to rateSlice country or United States
      if (isMounted && !hasInitialized.current) {
        const fallbackCountry = userRate?.country || "United States";
        const found = countries.find(
          (c) => c.name.toLowerCase() === fallbackCountry.toLowerCase()
        );
        if (found) {
          setValue("country", found.name, { shouldValidate: true });
          hasInitialized.current = true;
        }
      }
    };

    selectCountry();

    return () => {
      isMounted = false;
    };
  }, [isConfigured, userRate?.country, setValue, dispatch]);
};
