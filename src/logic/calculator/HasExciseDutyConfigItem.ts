import {
  ConfigItem,
  ConfigItemKeys,
  ConfigItemValues,
  VehicleData,
} from "../../models/calculator/Config.ts";

export enum EXCISE_RATES {
  ZERO = 0,
  VEHICLE_STANDARD = 0.031,
  VEHICLE_OVER_2_ENGINE = 0.186,
  HYBRID_LESS_2_ENGINE = 0.093,
  HYBRID_OVER_2_ENGINE = 0.0155,
}

export class HasExciseDutyConfigItem implements ConfigItem<VehicleData> {
  key: ConfigItemKeys = "excise-duty"; // akcyza
  label = "exciseDuty";
  dependencies: Array<ConfigItemKeys> = ["input", "customs-duty", "vat"];
  result(input: ConfigItemValues<VehicleData>) {
    const {
      value: { type, engineOver20CCM },
    } = input;
    let exciseRate: number;

    switch (type) {
      case "CAR":
        exciseRate = engineOver20CCM
          ? EXCISE_RATES.VEHICLE_OVER_2_ENGINE
          : EXCISE_RATES.VEHICLE_STANDARD;
        break;
      case "MOTORCYCLE":
        exciseRate = EXCISE_RATES.ZERO;
        break;
      case "TRUCK":
        exciseRate = EXCISE_RATES.VEHICLE_OVER_2_ENGINE;
        break;
      case "ELECTRIC_CAR":
        exciseRate = EXCISE_RATES.ZERO;
        break;
      case "HYBRID_PLUG_IN":
        exciseRate = EXCISE_RATES.ZERO;
        break;
      case "HYBRID_CAR":
        if (engineOver20CCM) {
          exciseRate = EXCISE_RATES.HYBRID_LESS_2_ENGINE;
        } else {
          exciseRate = EXCISE_RATES.HYBRID_OVER_2_ENGINE;
        }
        break;
      default:
        exciseRate = EXCISE_RATES.ZERO;
        break;
    }

    return {
      value: input.cost.value * exciseRate,
      currency: input.cost.currency,
    };
  }
}
