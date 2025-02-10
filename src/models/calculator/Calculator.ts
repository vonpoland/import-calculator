import { ConfigItemKeys, Cost } from "./Config.ts";

export type CalculatorCostLines = ConfigItemKeys;

export interface ICalculator<T> {
  getFinalCost(
    input: Cost,
    values: T,
  ): {
    finalCost: Cost;
    costLines: Array<{ key: CalculatorCostLines; cost: Cost }>;
  };
}
