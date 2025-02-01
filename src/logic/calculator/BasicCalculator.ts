import {
  CalculatorCostLines,
  ICalculator,
} from "../../models/calculator/Calculator.ts";
import { ConfigItem, Cost } from "../../models/calculator/Config.ts";
import { HasOutsideExciseConfigItem } from "./HasOutsideExciseConfigItem.ts";
import { IsCompanyVatConfigItem } from "./IsCompanyVatConfigItem.ts";
import { ProvisionConfigItem } from "./ProvisionConfigItem.ts";

type BasicCalculatorType = { isCompany: boolean; isOutsideEu: boolean };

export class BasicCalculator implements ICalculator<BasicCalculatorType> {
  config: Array<ConfigItem<boolean> | ConfigItem> = [
    new HasOutsideExciseConfigItem(),
    new IsCompanyVatConfigItem(),
    new ProvisionConfigItem({
      EUR: 1,
      CHF: 0.95,
      PLN: 4.5,
    }),
  ];
  getFinalCost(
    cost: Cost,
    values: BasicCalculatorType,
  ): {
    finalCost: Cost;
    costLines: Array<{ key: CalculatorCostLines; cost: Cost }>;
  } {
    const costLines: Array<{ key: CalculatorCostLines; cost: Cost }> = [
      {
        key: "input",
        cost,
      },
    ];

    this.config.forEach((config) => {
      let result: Cost;
      switch (config.key) {
        case "vat":
          const exciseCost: Cost = {
            value: 0,
            currency: cost.currency,
          };

          const exciseConfig = this.config.find(
            (c) => c.key === "outside-excise",
          ) as ConfigItem<boolean>;

          if (exciseConfig) {
            exciseCost.value = exciseConfig.result({
              cost,
              value: values.isOutsideEu,
            }).value;
          }

          result = (config as ConfigItem<boolean>).result({
            cost: {
              ...cost,
              value: cost.value + exciseCost.value,
            },
            value: values.isCompany,
          });

          costLines.push({
            cost: result,
            key: "vat",
          });
          break;
        case "outside-excise":
          result = (config as ConfigItem<boolean>).result({
            cost,
            value: values.isOutsideEu,
          });

          costLines.push({
            cost: result,
            key: "outside-excise",
          });
          break;
        case "provision":
          result = (config as ConfigItem).result({
            cost,
            value: undefined,
          });

          costLines.push({
            cost: result,
            key: "provision",
          });
          break;
      }
    });

    return {
      costLines,
      finalCost: {
        currency: cost.currency,
        value: costLines.reduce((a, b) => a + b.cost.value, 0),
      },
    };
  }
}
