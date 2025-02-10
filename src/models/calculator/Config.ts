import { Currency } from "../currency/Currency.ts";

export type Cost = {
  value: number;
  currency: Currency;
};
export type VehicleType =
  | "CAR"
  | "MOTORCYCLE"
  | "TRUCK"
  | "ELECTRIC_CAR"
  | "HYBRID_CAR"
  | "HYBRID_PLUG_IN";

export type VehicleData = {
  type: VehicleType;
  engineOver20CCM: boolean;
};

export type ExtraCostsData = {
  label: string;
  checked: boolean;
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
  | "customs-duty"
  | "excise-duty"
  | "input"
  | "extra-costs";

export interface ConfigItem<T = undefined> {
  key: ConfigItemKeys;
  dependencies: Array<ConfigItemKeys>;
  label: string;
  result: (input: ConfigItemValues<T>) => Cost;
}
