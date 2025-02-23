import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  Cost,
} from "../../models/calculator/Config.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

export class ExtraCostConfigItem implements ConfigItem<boolean> {
  constructor(
    private readonly currencyRates: CurrencyRates,
    private readonly extraCost: Cost,
    public readonly label: string,
  ) {}

  key: ConfigItemKeys = "extra-costs";
  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<boolean>) {
    if (input.value) {
      const provisionAsInputCurrency = convertCurrency(
        this.extraCost.value,
        this.extraCost.currency,
        input.cost.currency,
        this.currencyRates,
      );

      return {
        label: this.label,
        value: provisionAsInputCurrency,
        currency: input.cost.currency,
      };
    }

    return {
      value: 0,
      currency: input.cost.currency,
      label: this.label,
    };
  }
}
