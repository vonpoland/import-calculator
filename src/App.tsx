import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { PriceTabs } from "./components/charts/PriceTabs.tsx";
import { PriceSummaryProps } from "./components/charts/type.ts";

const stats: Array<PriceSummaryProps> = [
  {
    country: "DE",
    countryFlag: "🇩🇪",
    countryFlagUrl: "DE",
    countryLabel: "DeLabe",
    averagePrice: 555,
    minPrice: 1,
    maxPrice: 10000,
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
    trend: {
      changePercent: 2,
      type: "up",
    },
  },
  {
    country: "PL",
    countryFlag: "🇵🇱",
    countryFlagUrl: "PL",
    countryLabel: "PolskaLabel",
    averagePrice: 555,
    minPrice: 1,
    maxPrice: 10000,
    dateFrom: new Date().toISOString(),
    dateTo: new Date().toISOString(),
    trend: {
      changePercent: 2,
      type: "up",
    },
  },
];
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <PriceTabs pricesByCountry={stats} />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
