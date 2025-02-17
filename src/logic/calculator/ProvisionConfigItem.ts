import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  Cost,
} from "../../models/calculator/Config.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

export class ProvisionConfigItem implements ConfigItem {
  constructor(
    private readonly currencyRates: CurrencyRates,
    private readonly provision: Cost & { provisionPercentage: number },
  ) {}

  key: ConfigItemKeys = "provision";
  label = "provision";

  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<undefined>) {
    const provisionAsInputCurrency = convertCurrency(
      this.provision.value,
      this.provision.currency,
      input.cost.currency,
      this.currencyRates,
    );

    const value = Math.min(
      provisionAsInputCurrency,
      input.cost.value * this.provision.provisionPercentage,
    );

    return {
      value,
      currency: input.cost.currency,
    };
  }
}
