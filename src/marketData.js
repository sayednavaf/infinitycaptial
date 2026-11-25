const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

async function request(path) {
  if (!apiBaseUrl) {
    throw new Error("Market data unavailable. Configure VITE_API_BASE_URL to connect to the advisory API.");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? `API request failed (${response.status}).`);
  }
  return payload;
}

export function getMarketSnapshot(period = "1D") {
  return request(`/api/market/snapshot?period=${encodeURIComponent(period)}`);
}

export function getAdvisoryServices() {
  return request("/api/advisory/services");
}

export function getStockAnalysis(symbol) {
  return request(`/api/stocks/${encodeURIComponent(symbol)}/analysis`);
}

export function getDashboard() {
  return request("/api/dashboard");
}
