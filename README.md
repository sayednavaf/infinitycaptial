# Infinity Capital

Responsive React/Vite advisory website with TradingView market widgets and an API-backed advisory-services catalog.

## Run locally

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` to the Spring Boot API origin (default `http://localhost:8080`). Set `VITE_ADVISORY_CONTACT_EMAIL` to a verified company contact address to enable the contact link; it is intentionally blank until configured. Only public frontend settings belong in `VITE_*` variables—never place provider tokens or database credentials there.

Build and preview with `npm run build` and `npm run preview`.

## Pages

- `/` — market overview, embedded SENSEX ticker and chart
- `/markets` — TradingView chart with provider symbol search for other supported instruments
- `/services` — advisory services loaded from the backend API

## Market widgets

Market charts are embedded in direct TradingView iframes and do not require a market-data API key. The SENSEX is used as the default because it is available in the embedded data feed; use the chart toolbar's symbol search to explore other supported instruments. The provider controls availability and whether quotes are delayed. Widgets need an internet connection and may be blocked by browser extensions, network policy, or content-security settings.

The overview also includes expandable, on-page general information about equities, futures, options, Indian market hours, and basic risk checks. The cards do not navigate away or provide personalized trading recommendations. Market hours and regulatory details can change, so verify current information with the relevant exchange or regulator.

The frontend uses `GET /api/advisory/services` from the Spring Boot API. The backend's `/api/market/snapshot`, `/api/dashboard`, and stock-analysis routes remain available for a future configured provider but are not used by the current market widgets. See the backend README for the normalized upstream market-provider contract.

Market widgets are for exploration only and are not for trading or investment decisions. Quote timing and availability vary. This website does not execute trades or provide a recommendation to buy or sell. Confirm registrations, service scope, and applicable disclosures before offering regulated services.
