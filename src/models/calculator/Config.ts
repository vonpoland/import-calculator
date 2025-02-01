import { Currency } from "../currency/Currency.ts";

export type Cost = {
  value: number;
  currency: Currency;
};

export type ConfigCostValue = {
  cost: Cost;
};

export type ConfigBooleanValue = {
  value: boolean;
} & ConfigCostValue;

type ConfigSingleSelectValue = {
  value: string;
} & ConfigCostValue;

type Rule<T extends ConfigItemValues> = (input: T) => Cost;

type ConfigItemValues =
  | ConfigCostValue
  | ConfigBooleanValue
  | ConfigSingleSelectValue;

export interface ConfigItem<T extends ConfigItemValues> {
  id: string;
  label: string;
  result: Rule<T>;
}
