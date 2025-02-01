import { IsCompanyVatConfigItem } from "../../../src/logic/calculator/IsCompanyVatConfigItem";

import { describe, it, expect } from "vitest";

describe("Currency Conversion", () => {
  it("should get same output for company vat", () => {
    const configItem = new IsCompanyVatConfigItem();
    const inputCostValue = 10;

    expect(
      configItem.result({
        value: true,
        cost: {
          value: inputCostValue,
          currency: "EUR",
        },
      }),
    ).toEqual({
      value: inputCostValue,
      currency: "EUR",
    });
  });

  it("should not get same output for not company vat", () => {
    const configItem = new IsCompanyVatConfigItem();
    const inputCostValue = 10;

    expect(
      configItem.result({
        value: false,
        cost: {
          value: inputCostValue,
          currency: "EUR",
        },
      }),
    ).toEqual({
      currency: "EUR",
      value: inputCostValue * 0.19,
    });
  });
});
