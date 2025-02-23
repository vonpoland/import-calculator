import { describe, expect, it } from "vitest";
import { convertCurrency } from "./convert.ts";

describe("convert currency", () => {
  it("should convert currency", () => {
    const response = convertCurrency(120, "CHF", "PLN", {
      EUR: 1,
      CHF: 0.95,
      PLN: 4.16,
    });

    expect(Math.round(response)).to.eq(Math.round(525));
  });
});
