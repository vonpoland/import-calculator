import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
} from "../../models/calculator/Config.ts";

export enum VAT_RATES {
  VAT_RATE_DE = 0.19,
  VAT_RATE_COMPANY = 0,
}

export class IsCompanyVatConfigItem implements ConfigItem<boolean> {
  key: ConfigItemKeys = "vat";
  label = "vat";
  dependencies: Array<ConfigItemKeys> = ["input", "customs-duty"];

  result(input: ConfigItemValues<boolean>) {
    return {
      value: input.value
        ? VAT_RATES.VAT_RATE_COMPANY
        : VAT_RATES.VAT_RATE_DE * input.cost.value,
      currency: input.cost.currency,
    };
  }
}
