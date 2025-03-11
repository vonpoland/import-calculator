import { IsCompanyVatConfigItem } from "../../../src/logic/calculator/IsCompanyVatConfigItem";

import { describe, it, expect } from "vitest";

describe("Currency Conversion", () => {
  it("should get same output for company vat", () => {
    const configItem = new IsCompanyVatConfigItem();
    const inputCostValue = 10;

    expect(
      configItem.result({
        value: {
          country: "DE",
          isCompany: true,
        },
        cost: {
          value: inputCostValue,
          currency: "EUR",
        },
      }),
    ).to.eql({
      value: 0,
      currency: "EUR",
    });
  });

  it("should not get same output for not company vat DE", () => {
    const configItem = new IsCompanyVatConfigItem();
    const inputCostValue = 10;

    expect(
      configItem.result({
        value: {
          country: "DE",
          isCompany: false,
        },
        cost: {
          value: inputCostValue,
          currency: "EUR",
        },
      }),
    ).to.eql({
      currency: "EUR",
      value: inputCostValue * 0.19,
    });
  });

  it("should not get same output for not company vat PL", () => {
    const configItem = new IsCompanyVatConfigItem();
    const inputCostValue = 10;

    expect(
      configItem.result({
        value: {
          country: "PL",
          isCompany: false,
        },
        cost: {
          value: inputCostValue,
          currency: "EUR",
        },
      }),
    ).to.eql({
      currency: "EUR",
      value: inputCostValue * 0.23,
    });
  });
});
