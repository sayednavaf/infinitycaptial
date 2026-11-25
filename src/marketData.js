const demoQuotes = [
  { symbol: "NIFTY 50", price: 24873.65, change: 0.84 },
  { symbol: "SENSEX", price: 81698.11, change: 0.62 },
  { symbol: "BANK NIFTY", price: 56234.8, change: -0.31 },
  { symbol: "NIFTY IT", price: 42108.25, change: 1.17 },
];

const demoSeries = [
  { time: "09:15", value: 24510 },
  { time: "10:00", value: 24570 },
  { time: "10:45", value: 24525 },
  { time: "11:30", value: 24640 },
  { time: "12:15", value: 24610 },
  { time: "13:00", value: 24705 },
  { time: "13:45", value: 24680 },
  { time: "14:30", value: 24810 },
  { time: "15:30", value: 24873 },
];

const demoSeriesByPeriod = {
  "1D": demoSeries,
  "1W": [
    { time: "Wed", value: 24350 }, { time: "Thu", value: 24490 },
    { time: "Fri", value: 24390 }, { time: "Mon", value: 24610 },
    { time: "Tue", value: 24873 },
  ],
  "1M": [
    { time: "Week 1", value: 23820 }, { time: "Week 2", value: 24110 },
    { time: "Week 3", value: 23980 }, { time: "Week 4", value: 24610 },
    { time: "Now", value: 24873 },
  ],
  "1Y": [
    { time: "Dec", value: 21800 }, { time: "Feb", value: 22650 },
    { time: "Apr", value: 23120 }, { time: "Jun", value: 22540 },
    { time: "Aug", value: 23900 }, { time: "Oct", value: 24120 },
    { time: "Nov", value: 24873 },
  ],
};

const apiBaseUrl = import.meta.env.VITE_MARKET_API_URL;

export async function getMarketSnapshot(period = "1D") {
  if (!apiBaseUrl) {
    return { quotes: demoQuotes, series: demoSeriesByPeriod[period] ?? demoSeries, isDemo: true };
  }

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/market/snapshot?period=${encodeURIComponent(period)}`);
  if (!response.ok) {
    throw new Error(`Market data request failed (${response.status}).`);
  }

  const data = await response.json();
  if (!Array.isArray(data.quotes) || !Array.isArray(data.series)) {
    throw new Error("Market data response must include quotes and series arrays.");
  }

  return { ...data, isDemo: false };
}
