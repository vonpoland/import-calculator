import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  Cost,
} from "../../models/calculator/Config.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

export class TransportConfigItem implements ConfigItem {
  constructor(
    private readonly currencyRates: CurrencyRates,
    private readonly provision: Cost,
  ) {}

  key: ConfigItemKeys = "transport";
  label = "transport";

  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<undefined>) {
    const provisionAsInputCurrency = convertCurrency(
      this.provision.value,
      this.provision.currency,
      input.cost.currency,
      this.currencyRates,
    );

    return {
      value: provisionAsInputCurrency,
      currency: input.cost.currency,
    };
  }
}
