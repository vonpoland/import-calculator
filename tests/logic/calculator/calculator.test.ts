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

    it("inside EU should get no extra vat inside EU", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "CHF",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: true,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
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
          isManufacturedOutsideEu: true,
          isImportedFromEu: false,
          extraCosts: [],
          customDutyCountry: "DE",
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
          isManufacturedOutsideEu: true,
          isImportedFromEu: false,
          extraCosts: [],
          customDutyCountry: "DE",
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
            "dutyCostSwiss",
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
          isManufacturedOutsideEu: true,
          isImportedFromEu: false,
          customDutyCountry: "DE",
          extraCosts: [
            {
              checked: true,
              label: "translations",
            },
            {
              checked: false,
              label: "dutyCostSwiss",
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
              CAR: {
                currency: "EUR",
                value: 500,
              },
              ELECTRIC_CAR: {
                currency: "EUR",
                value: 500,
              },
              MOTORCYCLE: {
                currency: "EUR",
                value: 500,
              },
              TRUCK: {
                currency: "EUR",
                value: 1500,
              },
              HYBRID_CAR: {
                currency: "EUR",
                value: 500,
              },
              HYBRID_PLUG_IN: {
                currency: "EUR",
                value: 500,
              },
              QUAD: {
                currency: "EUR",
                value: 500,
              },
              TRUCK_SMALL: {
                currency: "EUR",
                value: 500,
              },
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

    it("should get correct transport cost for truck", () => {
      const response = calculator.getFinalCost(
        {
          value: 1000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "TRUCK",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(2500);
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(1500);
    });

    it("should get transport provision", () => {
      const response = calculator.getFinalCost(
        {
          value: 15000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
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
            [
              {
                threshold: {
                  value: 30000,
                  currency: "EUR",
                },
                percentageProvision: 0.1,
                staticMaxProvision: {
                  currency: "EUR",
                  value: 1000,
                },
                staticMinProvision: {
                  currency: "EUR",
                  value: 500,
                },
              },
              {
                threshold: {
                  value: Infinity,
                  currency: "EUR",
                },
                percentageProvision: 0.05,
              },
            ],
          ),
        ],
        {
          EUR: 1,
          CHF: 0.94,
          PLN: 4.5,
        },
      );
    });

    it("should get correct provision other currency", () => {
      const response = calculator.getFinalCost(
        {
          value: 35000,
          currency: "PLN",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("PLN");
      expect(response.finalCost.value).to.eq(35000 + 3500);
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(1500);
    });

    it("should get correct provision for high value", () => {
      const response = calculator.getFinalCost(
        {
          value: 30000,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(31000);
    });

    it("should get correct provision for high value", () => {
      const response = calculator.getFinalCost(
        {
          value: 30001,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(Math.round(30001 + 30001 * 0.05));
    });

    it("should get correct min provision", () => {
      const response = calculator.getFinalCost(
        {
          value: 100,
          currency: "EUR",
        },
        {
          isCompany: false,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: true,
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
        },
      );

      expect(response.finalCost.currency).to.eq("EUR");
      expect(response.finalCost.value).to.eq(600);
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          extraCosts: [],
          customDutyCountry: "DE",
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
            [
              {
                threshold: {
                  value: Infinity,
                  currency: "EUR",
                },
                percentageProvision: 0.1,
              },
            ],
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: false,
          extraCosts: [],
          customDutyCountry: "DE",
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          vehicleType: "ELECTRIC_CAR",
          engineOver20CCM: false,
          extraCosts: [],
          customDutyCountry: "DE",
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          vehicleType: "CAR",
          engineOver20CCM: false,
          extraCosts: [],
          customDutyCountry: "DE",
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
          isManufacturedOutsideEu: false,
          isImportedFromEu: true,
          vehicleType: "CAR",
          engineOver20CCM: true,
          extraCosts: [],
          customDutyCountry: "DE",
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
