import {
  CalculatorCostLines,
  ICalculator,
} from "../../models/calculator/Calculator.ts";
import {
  CompanyVatData,
  ConfigItem,
  ConfigItems,
  Cost,
  ExtraCostsData,
  VehicleData,
  VehicleDataOutsideEu,
  VehicleType,
} from "../../models/calculator/Config.ts";
import { convertCurrency } from "../currency/convert.ts";
import { CurrencyRates } from "../../models/currency/Currency.ts";
import { Country } from "../../models/country/Country.ts";

type BasicCalculatorType = {
  isCompany: boolean;
  isManufacturedOutsideEu: boolean;
  isImportedFromEu: boolean;
  vehicleType: VehicleType;
  engineOver20CCM: boolean;
  extraCosts: Array<ExtraCostsData>;
  customDutyCountry: Country;
};

export class BasicCalculator implements ICalculator<BasicCalculatorType> {
  private constructor(
    private readonly config: Array<ConfigItems>,
    private readonly currencyRates: CurrencyRates,
  ) {}

  static create(config: Array<ConfigItems>, currencyRates: CurrencyRates) {
    return new this(config, currencyRates);
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
    const costLines: Array<{
      key: CalculatorCostLines;
      cost: Cost;
      label?: string;
    }> = [
      {
        key: "input",
        cost,
      },
    ];

    this.config.forEach((config) => {
      let result: (Cost & { label?: string }) | null = null;

      const dependenciesSum = this.getSumOfDependencies(
        cost.currency,
        config.dependencies,
        costLines,
      );

      switch (config.key) {
        case "vat": {
          result = (config as ConfigItem<CompanyVatData>).result({
            cost: dependenciesSum,
            value: {
              isCompany: values.isImportedFromEu ? true : values.isCompany, // in ue you don't pay extra vat
              country: values.customDutyCountry,
            },
          });

          break;
        }
        case "transport":
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
          result = (config as ConfigItem<VehicleDataOutsideEu>).result({
            cost: dependenciesSum,
            value: {
              type: values.vehicleType,
              isOutsideEu:
                !values.isImportedFromEu && values.isManufacturedOutsideEu,
            },
          });

          break;
        case "extra-costs": {
          const isChecked = values.extraCosts.find(
            (f) => f.label === config.label,
          )?.checked;

          result = (config as ConfigItem<boolean>).result({
            cost,
            value: Boolean(isChecked),
          });
          break;
        }
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
          cost: {
            value: result.value,
            currency: result.currency,
          },
          key: config.key,
          label: result.label,
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
