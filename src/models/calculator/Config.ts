import { Currency } from "../currency/Currency.ts";

export type Cost = {
  value: number;
  currency: Currency;
};

type ConfigCostValue = {
  cost: Cost;
};

export type ConfigItemValues<T> = {
  value: T;
} & ConfigCostValue;

export type ConfigItemKeys =
  | "vat"
  | "provision"
  | "transport"
  | "outside-excise";

export interface ConfigItem<T = undefined> {
  key: ConfigItemKeys;
  label: string;
  result: (input: ConfigItemValues<T>) => Cost;
}
