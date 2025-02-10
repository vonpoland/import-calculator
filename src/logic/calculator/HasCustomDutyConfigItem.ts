import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
} from "../../models/calculator/Config.ts";

export class HasCustomDutyConfigItem implements ConfigItem<boolean> {
  key: ConfigItemKeys = "customs-duty"; // cło
  label = "customsDuty";
  dependencies: Array<ConfigItemKeys> = ["input"];

  private readonly exciseRate = 0.1;
  result(input: ConfigItemValues<boolean>) {
    return {
      value: input.value ? this.exciseRate * input.cost.value : 0,
      currency: input.cost.currency,
    };
  }
}
