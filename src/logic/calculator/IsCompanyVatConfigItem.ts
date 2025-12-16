import {
  CompanyVatData,
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
} from "../../models/calculator/Config.ts";
import { Country } from "../../models/country/Country.ts";

export const COUNTRY_VAT_RATES: Record<Country, number> = {
  DE: 0.19,
  NL: 0.21,
  PL: 0.23,
  CH: 0.081,
};

export class IsCompanyVatConfigItem implements ConfigItem<CompanyVatData> {
  key: ConfigItemKeys = "vat";
  label = "vat";
  dependencies: Array<ConfigItemKeys> = ["input", "customs-duty"];

  result(input: ConfigItemValues<CompanyVatData>) {
    return {
      value: input.value.isCompany
        ? 0
        : COUNTRY_VAT_RATES[input.value.country] * input.cost.value,
      currency: input.cost.currency,
    };
  }
}
