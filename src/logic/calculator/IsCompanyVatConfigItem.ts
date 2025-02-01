import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
} from "../../models/calculator/Config.ts";

export class IsCompanyVatConfigItem implements ConfigItem<boolean> {
  key: ConfigItemKeys = "vat";
  label = "vat";

  private readonly vatRateDe = 0.19;
  result(input: ConfigItemValues<boolean>) {
    return {
      value: input.value ? 0 : this.vatRateDe * input.cost.value,
      currency: input.cost.currency,
    };
  }
}
