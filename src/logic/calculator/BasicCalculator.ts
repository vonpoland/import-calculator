import {
  CalculatorCostLines,
  ICalculator,
} from "../../models/calculator/Calculator.ts";
import {
  ConfigItem,
  Cost,
  ExtraCostsData,
  VehicleData,
  VehicleType,
} from "../../models/calculator/Config.ts";
import { convertCurrency } from "../currency/convert.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";

type BasicCalculatorType = {
  isCompany: boolean;
  isOutsideEu: boolean;
  vehicleType: VehicleType;
  engineOver20CCM: boolean;
  extraCosts: Array<ExtraCostsData>;
};

export class BasicCalculator implements ICalculator<BasicCalculatorType> {
  private constructor(
    private readonly config: Array<ConfigItem<boolean | ConfigItem>>,
    private readonly currencyRates: CurrencyRates,
  ) {}

  static create(config: Array<ConfigItem<boolean> | ConfigItem>) {
    return new this(config);
  }

  protected getSumOfDependencies(
    inputCostCurrency: Cost["currency"],
    dependencies: ConfigItem["dependencies"],
    costLines: Array<{ key: CalculatorCostLines; cost: Cost }>,
  ) {
    return dependencies.reduce(
      (cost, configItemKey) => {
        const dependency = costLines.find((f) => f.key === configItemKey);

        if (!dependency) {
          throw new Error(
            `Dependency not found bad config ${dependency} ${JSON.stringify(costLines)}`,
          );
        }

        const sameValueCost = convertCurrency(
          dependency.cost.value,
          dependency.cost.currency,
          inputCostCurrency,
          this.currencyRates,
        );

        return {
          ...cost,
          value: sameValueCost + cost.value,
        };
      },
      { currency: inputCostCurrency, value: 0 },
    );
  }

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
      const dependenciesSum = this.getSumOfDependencies(
        cost.currency,
        config.dependencies,
        costLines,
      );

      switch (config.key) {
        case "vat": {
          result = (config as ConfigItem<boolean>).result({
            cost: dependenciesSum,
            value: values.isCompany,
          });

          break;
        }
        case "excise-duty": {
          result = (config as ConfigItem<VehicleData>).result({
            cost: dependenciesSum,
            value: {
              engineOver20CCM: values.engineOver20CCM,
              type: values.vehicleType,
            },
          });

          break;
        }
        case "customs-duty":
          result = (config as ConfigItem<boolean>).result({
            cost: dependenciesSum,
            value: values.isOutsideEu,
          });

          break;
        case "extra-costs": {
          const isChecked = values.extraCosts.find(
            (f) => f.label === config.label,
          )?.checked;

          result = (config as ConfigItem<boolean>).result({
            cost,
            value: isChecked,
          });
          break;
        }
        case "transport":
        case "provision":
          result = (config as ConfigItem).result({
            cost,
            value: undefined,
          });
          break;
        default:
          console.warn(`Config not handled ${config.key}`);
      }
      if (result) {
        costLines.push({
          cost: result,
          key: config.key,
        });
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
