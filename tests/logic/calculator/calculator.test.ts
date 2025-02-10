import { beforeEach, describe, expect, it } from "vitest";
import { BasicCalculator } from "../../../src/logic/calculator/BasicCalculator";
import { HasCustomDutyConfigItem } from "../../../src/logic/calculator/HasCustomDutyConfigItem";
import { IsCompanyVatConfigItem } from "../../../src/logic/calculator/IsCompanyVatConfigItem";
import { ProvisionConfigItem } from "../../../src/logic/calculator/ProvisionConfigItem";
import {
  EXCISE_RATES,
  HasExciseDutyConfigItem,
} from "../../../src/logic/calculator/HasExciseDutyConfigItem";
import { TransportConfigItem } from "../../../src/logic/calculator/TransportConfigItem";
import { ExtraCostConfigItem } from "../../../src/logic/calculator/ExtraCostsConfigItem";

describe("Calculator", () => {
  let calculator: BasicCalculator;

  describe("VAT tests", () => {
    beforeEach(() => {
      calculator = BasicCalculator.create(
        [new HasCustomDutyConfigItem(), new IsCompanyVatConfigItem()],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
    });

    it("inside EU should get no extra vat for company or no company", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "CHF",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("CHF");
      expect(response.finalCost.value).to.eq(1000);
    });

    it("inside EU should get no extra vat for company or no company", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "CHF",
        },
        {
          isCompany: true,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: true,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("CHF");
      expect(response.finalCost.value).to.eq(1100);
    });

    it("inside EU should get no extra vat for company or no company", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "CHF",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: true,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("CHF");
      expect(response.finalCost.value).to.eq(1000 * 1.1 * 1.19);
    });
  });

  describe("Extra costs tests", () => {
    beforeEach(() => {
      calculator = BasicCalculator.create(
        [
          new ExtraCostConfigItem(
            {
              EUR: 1,
              CHF: 0.94,
              PLN: 4.5,
            },
            {
              currency: "EUR",
              value: 500,
            },
            "translations",
          ),
        ],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
    });

    it("should get correct final cost with extra charge", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "CHF",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [
            {
              checked: true,
              label: "translations",
            },
          ],
        },
      );

      expect(response.finalCost.currency).to.eq("CHF");
      expect(response.finalCost.value).to.eq(1470);
    });
  });

  describe("Transport tests", () => {
    beforeEach(() => {
      calculator = BasicCalculator.create(
        [
          new TransportConfigItem(
            {
              EUR: 1,
              CHF: 0.95,
              PLN: 4.5,
            },
            {
              currency: "EUR",
              value: 500,
            },
          ),
        ],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
    });

    it("should get correct transport cost", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(1500);
    });

    it("should get correct provision", () => {
      const response = calculator.getFinalCost(
        {
          value: 15000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(15500);
    });
  });

  describe("Provision tests", () => {
    beforeEach(() => {
      calculator = BasicCalculator.create(
        [
          new ProvisionConfigItem(
            {
              EUR: 1,
              CHF: 0.95,
              PLN: 4.5,
            },
            {
              currency: "EUR",
              value: 1000,
              provisionPercentage: 0.1,
            },
          ),
        ],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
    });

    it("should get correct provision", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(1100);
    });

    it("should get correct provision", () => {
      const response = calculator.getFinalCost(
        {
          value: 15000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isOutsideEu: false,
          extraCosts: [],
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(16000);
    });
  });

  describe("Calculator with provision and vat", () => {
    beforeEach(() => {
      calculator = BasicCalculator.create(
        [
          new HasCustomDutyConfigItem(),
          new IsCompanyVatConfigItem(),
          new HasExciseDutyConfigItem(),
          new ProvisionConfigItem(
            {
              EUR: 1,
              CHF: 0.95,
              PLN: 4.5,
            },
            {
              currency: "EUR",
              value: 1000,
              provisionPercentage: 0.1,
            },
          ),
        ],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
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
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: false,
          extraCosts: [],
        },
      );

      expect(result.finalCost.value).to.eq(10000 + 1000);
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 + 1000,
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
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: false,
          extraCosts: [],
        },
      );

      expect(result.finalCost.value).to.eq(10000 + 1000);
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 + 1000,
      );
    });

    it("should get correct value for non-company in europe with less then 2.0 engine excise", () => {
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
          vehicleType: "CAR",
          engineOver20CCM: false,
          extraCosts: [],
        },
      );

      expect(result.finalCost.value).to.eq(
        10000 * (1 + EXCISE_RATES.VEHICLE_STANDARD) + 1000,
      );
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 * (1 + EXCISE_RATES.VEHICLE_STANDARD) + 1000,
      );
    });

    it("should get correct value for non-company in europe with more then 2.0 engine excise", () => {
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
          vehicleType: "CAR",
          engineOver20CCM: true,
          extraCosts: [],
        },
      );

      expect(result.finalCost.value).to.eq(
        10000 * (1 + EXCISE_RATES.VEHICLE_OVER_2_ENGINE) + 1000,
      );
      expect(result.costLines.reduce((a, b) => a + b.cost.value, 0)).to.eq(
        10000 * (1 + EXCISE_RATES.VEHICLE_OVER_2_ENGINE) + 1000,
      );
    });
  });
});
