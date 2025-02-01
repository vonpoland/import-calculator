import { ConfigCostValue, ConfigItem } from "../../models/calculator/Config.ts";
import { Currency, CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

export class ProvisionConfigItem implements ConfigItem<ConfigCostValue> {
  constructor(private readonly currencyRates: CurrencyRates) {}

  id = "provision";
  label = "provision";

  private readonly provision = {
    currency: "CHF" as Currency,
    value: 1000,
    provisionPercentage: 0.1,
  };
  result(input: ConfigCostValue) {
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

  readonly type = "number";
  readonly readonly = true;
}
