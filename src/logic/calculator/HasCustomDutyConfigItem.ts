import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  VehicleDataOutsideEu,
} from "../../models/calculator/Config.ts";

export type CustomDutyExcise = {
  STANDARD: number;
  MOTORCYCLE: number;
};

export enum CustomDutyExciseStandard {
  STANDARD = 0.1,
  MOTORCYCLE = 0.1,
}

export class HasCustomDutyConfigItem
  implements ConfigItem<VehicleDataOutsideEu>
{
  constructor(
    private readonly customDutyExcisePerVehicleType: CustomDutyExcise = {
      STANDARD: CustomDutyExciseStandard.STANDARD,
      MOTORCYCLE: CustomDutyExciseStandard.MOTORCYCLE,
    },
  ) {}

  key: ConfigItemKeys = "customs-duty"; // cło
  label = "customsDuty";
  dependencies: Array<ConfigItemKeys> = ["input"];

  result(input: ConfigItemValues<VehicleDataOutsideEu>) {
    if (input.value.isOutsideEu) {
      return {
        value:
          (input.value.type === "MOTORCYCLE"
            ? this.customDutyExcisePerVehicleType.MOTORCYCLE
            : this.customDutyExcisePerVehicleType.STANDARD) * input.cost.value,
        currency: input.cost.currency,
      };
    }
    return {
      value: 0,
      currency: input.cost.currency,
    };
  }
}
