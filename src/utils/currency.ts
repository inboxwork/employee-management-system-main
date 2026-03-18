import { Currency } from "./types";

export function getCurrencySymbol(currencyCode: Currency) {
  const symbols = {
    USD: "$",
    EUR: "€",
    EGP: "£",
    AED: "د.إ",
    SAR: "ر.س",
    GBP: "£",
  };
  return symbols[currencyCode] || currencyCode;
}
