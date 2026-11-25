# Infinity Capital

A React single-page market dashboard for stock and futures/options education. The interface uses Vite, React Router, Recharts, and Lucide icons.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Pages

- `/` — market overview, index chart, and watchlist
- `/markets` — indicative indices, equities, and derivatives
- `/services` — equity, derivatives, portfolio review, and risk-management service overview

## Market data

By default, the app uses clearly labeled sample data. To connect a market-data service, copy `.env.example` to `.env.local` and set `VITE_MARKET_API_URL` to your backend base URL. The frontend requests:

```text
GET {VITE_MARKET_API_URL}/market/snapshot?period=1D
```

Supported `period` values are `1D`, `1W`, `1M`, and `1Y`. The JSON response must include `quotes` and `series` arrays:

```json
{
  "quotes": [
    { "symbol": "NIFTY 50", "price": 24873.65, "change": 0.84 }
  ],
  "series": [
    { "time": "09:15", "value": 24510 }
  ]
}
```

Use an authorized market-data provider and configure the backend to handle its credentials and CORS policy. Do not expose provider secrets in frontend environment variables.

## Important

Market values shown without a configured API are fictional demo figures, not live quotes. The daily client P&L panel also contains fabricated sample entries, not actual client information or verified performance. Replace it only with accurate, authorized records and required disclosures. Derivatives involve substantial risk. This website is not a recommendation to buy or sell; confirm applicable registrations, service scope, and disclosures before offering regulated services.
