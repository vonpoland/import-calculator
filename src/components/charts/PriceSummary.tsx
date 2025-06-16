import "./PriceSummary.css";
import { PriceSummaryProps, TranslationsProps } from "./type.ts";

function formatDate(dateStr: string, locale = "pl-PL") {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
type Props = PriceSummaryProps & {
  locale?: string;
  translations: TranslationsProps;
};

export const PriceSummary = ({
  averagePrice,
  minPrice,
  maxPrice,
  dateFrom,
  dateTo,
  trend,
  locale = "pl-PL",
  translations,
}: Props) => {
  const t = {
    averagePriceLabel: translations.averagePriceLabel,
    minLabel: translations.minLabel,
    maxLabel: translations.maxLabel,
    trend: {
      up: translations.trend.up,
      down: translations.trend.down,
      equal: translations?.trend?.stable,
    },
  };

  const trendIcon =
    trend.type === "up" ? "▲" : trend.type === "down" ? "🔻" : "";
  const trendTextRaw = t.trend[trend.type];
  const trendText = trendTextRaw.replace(
    "{percent}",
    Math.abs(trend.changePercent).toFixed(1),
  );
  const resolvedLocale = locale!;

  return (
    <div className="price-summary car-price-widget">
      <div className="price-header">
        <div className="price-main">
          <span className="price-value">
            {averagePrice.toLocaleString(resolvedLocale)} zł
          </span>
          <span className="price-date">
            {t.averagePriceLabel} ({formatDate(dateFrom, resolvedLocale)}-
            {formatDate(dateTo, resolvedLocale)})
          </span>
        </div>
        <div className="price-range">
          <span>
            {t.minLabel}: {minPrice.toLocaleString(resolvedLocale)} zł
          </span>
          <span>
            {t.maxLabel}: {maxPrice.toLocaleString(resolvedLocale)} zł
          </span>
        </div>
      </div>
      <div className={`price-trend trend-${trend.type}`}>
        {trendIcon} {trendText}
      </div>
    </div>
  );
};
