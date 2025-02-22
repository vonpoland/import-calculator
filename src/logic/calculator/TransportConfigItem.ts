import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  Cost,
  VehicleData,
  VehicleType,
} from "../../models/calculator/Config.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { convertCurrency } from "../currency/convert.ts";

export class TransportConfigItem implements ConfigItem<VehicleData> {
  constructor(
    private readonly currencyRates: CurrencyRates,
    private readonly provision: Record<VehicleType, Cost>,
  ) {}

  key: ConfigItemKeys = "transport";
  label = "transport";

  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<VehicleData>) {
    const {
      value: { type },
    } = input;
    const provisionCost = this.provision[type];

    const provisionAsInputCurrency = convertCurrency(
      provisionCost.value,
      provisionCost.currency,
      input.cost.currency,
      this.currencyRates,
    );

    return {
      value: provisionAsInputCurrency,
      currency: input.cost.currency,
    };
  }
}
