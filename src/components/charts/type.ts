export type Country = "PL" | "DE" | "EN";
export type CountryLocale = "pl-PL" | "de-DE" | "en-GB";

export type PriceSummaryProps = {
  country: Country;
  countryFlag: "🇵🇱" | "🇩🇪";
  countryFlagUrl: Country | string;
  countryLabel: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  dateFrom: string;
  dateTo: string;
  trend: {
    changePercent: number;
    type: "up" | "down" | "equal";
  };
};

export type TranslationsProps = {
  averagePriceLabel: string;
  minLabel: string;
  maxLabel: string;
  trend: {
    up: string;
    down: string;
    equal: string;
  };
};
