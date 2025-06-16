import { useState } from "react";
import { CountryLocale, PriceSummaryProps, TranslationsProps } from "./type.ts";
import { PriceSummary } from "./PriceSummary.tsx";
import "./PriceTabs.css";
import { translations } from "./i18n.ts";

type Props = {
  pricesByCountry: Array<PriceSummaryProps>;
  locale?: CountryLocale;
  translations?: TranslationsProps;
};

export const mapFlag = (flag: PriceSummaryProps["countryFlagUrl"]) => {
  if (flag === "PL") {
    return "https://flagcdn.com/pl.svg";
  }

  if (flag === "DE") {
    return "https://flagcdn.com/de.svg";
  }

  if (flag === "EN") {
    return "https://flagcdn.com/en.svg";
  }

  return flag;
};

const getTranslationsFromLocale = (locale: CountryLocale) => {
  switch (locale) {
    case "en-GB":
      return translations.en;
    case "pl-PL":
      return translations.pl;
    case "de-DE":
      return translations.de;
  }
};

export const PriceTabs = ({
  pricesByCountry,
  locale = "pl-PL",
  translations,
}: Props) => {
  const [selectedCountry, setSelectedCountry] = useState(
    pricesByCountry[0].country,
  );

  const selected = pricesByCountry.find((p) => p.country === selectedCountry);
  translations = translations || getTranslationsFromLocale(locale);

  return (
    <div className="price-tabs">
      <div className="tab-header">
        {pricesByCountry.map((entry) => (
          <button
            key={entry.country}
            onClick={() => setSelectedCountry(entry.country)}
            className={`tab-btn ${selectedCountry === entry.country ? "active" : ""}`}
          >
            <img
              src={mapFlag(entry.countryFlagUrl)}
              className="flag"
              alt={entry.country}
              width="20"
            />
            {entry.countryLabel}
          </button>
        ))}
      </div>

      {selected && (
        <div className="tab-content">
          <PriceSummary
            countryFlagUrl={selected.countryFlagUrl}
            country={selected.country}
            countryLabel={selected.countryLabel}
            averagePrice={selected.averagePrice}
            minPrice={selected.minPrice}
            maxPrice={selected.maxPrice}
            dateFrom={selected.dateFrom}
            dateTo={selected.dateTo}
            trend={selected.trend}
            locale={locale}
            translations={translations}
            countryFlag={selected.countryFlag}
          />
        </div>
      )}
    </div>
  );
};
