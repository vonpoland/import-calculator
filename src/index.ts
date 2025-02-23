import { ProvisionConfigItem } from "./logic/calculator/ProvisionConfigItem.ts";
import { IsCompanyVatConfigItem } from "./logic/calculator/IsCompanyVatConfigItem.ts";
import { BasicCalculator } from "./logic/calculator/BasicCalculator.ts";
import { ExtraCostConfigItem } from "./logic/calculator/ExtraCostsConfigItem.ts";
import { HasCustomDutyConfigItem } from "./logic/calculator/HasCustomDutyConfigItem.ts";
import { HasExciseDutyConfigItem } from "./logic/calculator/HasExciseDutyConfigItem.ts";
import { TransportConfigItem } from "./logic/calculator/TransportConfigItem.ts";
import { convertCurrency } from "./logic/currency/convert.ts";

export const Calculator = {
  ProvisionConfigItem,
  IsCompanyVatConfigItem,
  ExtraCostConfigItem,
  HasCustomDutyConfigItem,
  HasExciseDutyConfigItem,
  TransportConfigItem,
  BasicCalculator,
};

export const Currency = {
  convertCurrency,
};
