import { beforeEach, describe, expect, it } from "vitest";
import { BasicCalculator } from "../../../src/logic/calculator/BasicCalculator";

describe("Calculator", () => {
  describe("Calculator with provision and vat", () => {
    let calculator: BasicCalculator;

    beforeEach(() => {
      calculator = new BasicCalculator();
    });

    it("should get correct value for non-company in europe", () => {
      // 10000
      // 1000 provision
      // 0 excise
      // 11
      const result = calculator.getFinalCost(
        {
          value: 10000,
          currency: "EUR",
        },
        {
          isCompany: false,
          isOutsideEu: false,
        },
      );

      expect(result.finalCost.value).to.eq(10000 * 1.19 + 1000);
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 * 1.19 + 1000,
      );
    });

    it("should get correct value for company in europe", () => {
      // 10000
      // 1000 provision
      // 0 excise
      // 11
      const result = calculator.getFinalCost(
        {
          value: 10000,
          currency: "EUR",
        },
        {
          isCompany: true,
          isOutsideEu: false,
        },
      );

      expect(result.finalCost.value).to.eq(10000 + 1000);
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 + 1000,
      );
    });
  });
});
