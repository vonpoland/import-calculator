import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
} from "../../models/calculator/Config.ts";

export class HasOutsideExciseConfigItem implements ConfigItem<boolean> {
  key: ConfigItemKeys = "outside-excise";
  label = "outsideExcise";

  private readonly exciseRate = 0.1;
  result(input: ConfigItemValues<boolean>) {
    return {
      value: input.value ? this.exciseRate * input.cost.value : 0,
      currency: input.cost.currency,
    };
  }
}
