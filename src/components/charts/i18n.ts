import { TranslationsProps } from "./type.ts";

export const translations: Record<"de" | "pl" | "en", TranslationsProps> = {
  pl: {
    averagePriceLabel: "Średnia cena",
    minLabel: "Min",
    maxLabel: "Max",
    trend: {
      up: "Cena wzrosła o {percent}% w ciągu ostatnich 30 dni",
      down: "Cena spadła o {percent}% w ciągu ostatnich 30 dni",
      equal: "Cena utrzymuje się na stałym poziomie od 30 dni",
    },
  },
  en: {
    averagePriceLabel: "Average price",
    minLabel: "Min",
    maxLabel: "Max",
    trend: {
      up: "The price increased by {percent}% over the last 30 days",
      down: "The price decreased by {percent}% over the last 30 days",
      equal: "The price has remained stable for the last 30 days",
    },
  },
  de: {
    averagePriceLabel: "Durchschnittspreis",
    minLabel: "Min",
    maxLabel: "Max",
    trend: {
      up: "Der Preis ist in den letzten 30 Tagen um {percent}% gestiegen",
      down: "Der Preis ist in den letzten 30 Tagen um {percent}% gesunken",
      equal: "Der Preis ist in den letzten 30 Tagen stabil geblieben",
    },
  },
};
