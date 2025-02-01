import {
  ConfigBooleanValue,
  ConfigItem,
} from "../../models/calculator/Config.ts";

export class IsCompanyVatConfigItem implements ConfigItem<ConfigBooleanValue> {
  id = "vat";
  label = "vat";
  private readonly vatRateDe = 0.19;
  result(input: ConfigBooleanValue) {
    return {
      value: input.value ? input.cost.value : this.vatRateDe * input.cost.value,
      currency: input.cost.currency,
    };
  }
}
