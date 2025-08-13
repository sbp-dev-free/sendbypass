export const CURRENCY = {
  USD: {
    symbol: "$",
    code: "USD",
  },
  EUR: {
    symbol: "€",
    code: "EUR",
  },
};

export const DEFAULT_CURRENCY = CURRENCY.EUR;

export const formatCurrency = (amount: number, currency = DEFAULT_CURRENCY) => {
  return `${currency.symbol}${amount}`;
};
