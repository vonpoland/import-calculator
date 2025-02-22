import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  Cost,
} from "../../models/calculator/Config.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

type ProvisionType = {
  threshold: number;
  percentageProvision: number;
  staticMinProvision?: Cost;
  staticMaxProvision?: Cost;
};

export class ProvisionConfigItem implements ConfigItem {
  constructor(
    private readonly currencyRates: CurrencyRates,
    private readonly provisions: Array<ProvisionType>,
  ) {}

  key: ConfigItemKeys = "provision";
  label = "provision";

  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<undefined>) {
    const provisionConfig = this.provisions.find(
      (config) => input.cost.value <= config.threshold,
    );

    if (!provisionConfig) {
      throw new Error("No provision configuration found for the given cost.");
    }

    const provisionValue =
      input.cost.value * provisionConfig.percentageProvision;

    const minProvisionInInputValue =
      provisionConfig.staticMinProvision !== undefined &&
      convertCurrency(
        provisionConfig.staticMinProvision.value,
        provisionConfig.staticMinProvision.currency,
        input.cost.currency,
        this.currencyRates,
      );
    const maxProvisionInInputValue =
      provisionConfig.staticMaxProvision !== undefined &&
      convertCurrency(
        provisionConfig.staticMaxProvision.value,
        provisionConfig.staticMaxProvision.currency,
        input.cost.currency,
        this.currencyRates,
      );

    if (
      minProvisionInInputValue &&
      input.cost.value < minProvisionInInputValue
    ) {
      return {
        value: minProvisionInInputValue,
        currency: input.cost.currency,
      };
    }

    if (
      maxProvisionInInputValue &&
      input.cost.value > maxProvisionInInputValue
    ) {
      return {
        value: maxProvisionInInputValue,
        currency: input.cost.currency,
      };
    }

    return {
      value: provisionValue,
      currency: input.cost.currency,
    };
  }
}
