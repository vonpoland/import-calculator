import { Currency, CurrencyRates } from "../../models/currency/Currency.ts";

export const convertCurrency = (
  value: number,
  from: Currency,
  to: Currency,
  config: CurrencyRates = {
    EUR: 1,
    CHF: 0.95,
    PLN: 4.5,
  },
) => {
  if (from === to) {
    return value;
  }

  const fromRate = config[from];
  const toRate = config[to];

  const valueInBaseCurrency = value / fromRate;

  return valueInBaseCurrency * toRate;
};
