export function getCurrencySymbol(currencyCode: string) {
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
