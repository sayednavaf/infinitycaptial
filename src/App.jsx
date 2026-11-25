import { lazy, Suspense, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Compass,
  Menu,
  MoreHorizontal,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { getMarketSnapshot } from "./marketData.js";

const MarketChart = lazy(() => import("./MarketChart.jsx"));

const navigation = [
  { label: "Overview", path: "/", icon: Compass },
  { label: "Markets", path: "/markets", icon: TrendingUp },
  { label: "Services", path: "/services", icon: BriefcaseBusiness },
];

const instruments = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: "1,463.25", change: "+1.42%", positive: true, type: "Equity" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: "982.60", change: "+0.86%", positive: true, type: "Equity" },
  { symbol: "INFY", name: "Infosys Limited", price: "1,584.10", change: "-0.34%", positive: false, type: "Equity" },
  { symbol: "NIFTY 25,000 CE", name: "NIFTY · 26 JUN", price: "184.50", change: "+3.18%", positive: true, type: "Options" },
];

const sampleClientResults = [
  { client: "Client · 04", pnl: 2450 },
  { client: "Client · 12", pnl: -850 },
  { client: "Client · 27", pnl: 1180 },
];

const services = [
  {
    icon: ChartNoAxesCombined,
    title: "Equity advisory",
    category: "CASH MARKETS",
    description: "Market research and portfolio discussion for listed equities, with attention to time horizon, concentration, and risk.",
  },
  {
    icon: TrendingUp,
    title: "Futures & options",
    category: "DERIVATIVES",
    description: "Structured derivatives analysis focused on contract mechanics, scenario planning, and the risk of leverage and expiry.",
  },
  {
    icon: Wallet,
    title: "Portfolio review",
    category: "PORTFOLIO",
    description: "A review of portfolio exposure, diversification, and stated investment objectives to support informed decisions.",
  },
  {
    icon: ShieldCheck,
    title: "Risk management",
    category: "RISK & PROCESS",
    description: "Practical risk conversations around position sizing, drawdowns, and understanding potential losses before a trade.",
  },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

function Sidebar({ mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={closeMobile} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" to="/" onClick={closeMobile}>
          <span className="brand-mark"><span /></span>
          <span className="brand-name">infinity<span>capital</span></span>
        </Link>
        <p className="nav-caption">DASHBOARD</p>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === "/"} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

function Topbar({ title, onMenu }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" aria-label="Open menu" onClick={onMenu}><Menu size={21} /></button>
      <div className="breadcrumbs"><span>Infinity Capital</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div>
      <div className="topbar-actions">
        <div className="market-status"><span className="status-dot" /> Market closed <span className="status-time">· 3:30 PM IST</span></div>
      </div>
    </header>
  );
}

function QuoteStrip({ quotes }) {
  return (
    <div className="quote-strip">
      <div className="quote-strip-label"><span className="status-dot" /> INDICES</div>
      {quotes.map((quote) => (
        <div className="quote-item" key={quote.symbol}>
          <span className="quote-symbol">{quote.symbol}</span>
          <strong>{formatPrice(quote.price)}</strong>
          <span className={quote.change >= 0 ? "positive" : "negative"}>
            {quote.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(quote.change).toFixed(2)}%
          </span>
        </div>
      ))}
      <span className="quote-source">Indicative data</span>
    </div>
  );
}

function InstrumentsTable({ items }) {
  return (
    <div className="table-scroll"><table><thead><tr><th>INSTRUMENT</th><th>TYPE</th><th>LAST PRICE</th><th>CHANGE</th><th /></tr></thead><tbody>
      {items.map((item) => <tr key={item.symbol}><td><div className="instrument-name"><strong>{item.symbol}</strong><span>{item.name}</span></div></td><td><span className="type-pill">{item.type}</span></td><td className="table-price">₹{item.price}</td><td><span className={item.positive ? "change-pill positive-bg" : "change-pill negative-bg"}>{item.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{item.change}</span></td><td><button className="row-more" aria-label={`More about ${item.symbol}`}><MoreHorizontal size={18} /></button></td></tr>)}
    </tbody></table></div>
  );
}

function Overview({ snapshot, period, setPeriod }) {
  const sampleNetPnl = sampleClientResults.reduce((total, result) => total + result.pnl, 0);

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">{new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date()).toUpperCase()} <span>·</span> MARKET OVERVIEW</p><h1>Market overview</h1><p className="welcome-subtitle">A clear view of markets and advisory services.</p></div>
        <Link className="button button-dark" to="/services"><BriefcaseBusiness size={15} /> Explore our services <ArrowRight size={15} /></Link>
      </section>
      <section className="overview-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div><div className="panel-title-row"><h2>NIFTY 50</h2><span className="exchange-tag">NSE</span></div><p className="index-value">{formatPrice(snapshot.quotes[0]?.price ?? 0)} <span className="positive">+0.84%</span></p></div>
            <div className="period-switch" aria-label="Chart period">{["1D", "1W", "1M", "1Y"].map((item) => <button key={item} className={period === item ? "selected" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div>
          </div>
          <div className="chart-meta"><span><span className="legend-dot" /> NIFTY 50</span><span>As of 3:30 PM IST</span></div>
          <Suspense fallback={<div className="chart-loading">Loading chart…</div>}><MarketChart series={snapshot.series} /></Suspense>
          <div className="chart-footnote"><span>Day range</span><span>24,510.20</span><div className="range-track"><i /></div><span>24,873.65</span></div>
        </article>
        <aside className="panel sentiment-panel">
          <div className="panel-heading"><div><p className="eyebrow">MARKET PULSE</p><h2>Today at a glance</h2></div><span className="pulse-icon"><TrendingUp size={17} /></span></div>
          <div className="sentiment-meter"><div className="meter-track"><span /></div><div className="meter-labels"><span>Bearish</span><span>Neutral</span><span>Bullish</span></div></div>
          <div className="sentiment-result"><span className="result-dot" /><strong>Moderately positive</strong><span>+0.7</span></div>
          <p className="sentiment-note">Broad market indices closed higher. Sentiment indicators are informational and not a prediction.</p>
          <div className="sentiment-stats"><div><span>Advances</span><strong className="positive">1,482</strong></div><div><span>Declines</span><strong className="negative">1,106</strong></div><div><span>Unchanged</span><strong>94</strong></div></div>
          <Link className="text-link" to="/markets">View market details <ArrowRight size={14} /></Link>
        </aside>
      </section>
      <section className="panel client-pnl-panel">
        <div className="panel-heading client-pnl-heading">
          <div><p className="eyebrow">DAILY CLIENT PERFORMANCE</p><h2>Client P&amp;L snapshot</h2></div>
          <span className="sample-label">SAMPLE DATA</span>
        </div>
        <div className="client-pnl-summary"><span>Illustrative net P&amp;L</span><strong className={sampleNetPnl >= 0 ? "positive" : "negative"}>{sampleNetPnl >= 0 ? "+" : "−"}₹{formatPrice(Math.abs(sampleNetPnl))}</strong><small>Example only · not actual client results</small></div>
        <div className="table-scroll"><table><thead><tr><th>ANONYMIZED CLIENT</th><th>DAILY P&amp;L</th><th>RECORD TYPE</th></tr></thead><tbody>
          {sampleClientResults.map(({ client, pnl }) => <tr key={client}><td><strong className="client-mask">{client}</strong></td><td className={pnl >= 0 ? "positive" : "negative"}>{pnl >= 0 ? "+" : "−"}₹{formatPrice(Math.abs(pnl))}</td><td><span className="type-pill">Illustrative</span></td></tr>)}
        </tbody></table></div>
        <p className="client-pnl-note"><ShieldCheck size={14} /> These fabricated examples are not real client data, verified performance, or a promise of future returns. Replace them only with accurate, authorized records and required disclosures.</p>
      </section>
      <section className="panel instruments-panel">
        <div className="panel-heading instruments-heading"><div><p className="eyebrow">YOUR WATCHLIST</p><h2>Keeping an eye on</h2></div><Link className="view-all-button" to="/markets">All markets <ArrowRight size={14} /></Link></div>
        <InstrumentsTable items={instruments.slice(0, 3)} />
      </section>
      <section className="disclosure"><ShieldCheck size={15} /><span>{snapshot.isDemo ? "Sample figures for demonstration only. Not live market data." : "Market data is provided for informational purposes only."} This is not investment advice. Securities investments are subject to market risks.</span><Link to="/services">Advisory services <ArrowRight size={12} /></Link></section>
    </>
  );
}

function Markets({ snapshot }) {
  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">EXPLORE THE MARKET</p><h1>Markets</h1><p className="welcome-subtitle">Track indicative prices across indices, equities and derivatives.</p></div><span className="data-badge"><span className="status-dot" /> {snapshot.isDemo ? "Demo data" : "Market data"}</span></div>
    <div className="market-cards">{snapshot.quotes.map((quote) => <article className="panel market-card" key={quote.symbol}><span className="market-card-symbol">{quote.symbol}</span><strong>{formatPrice(quote.price)}</strong><span className={quote.change >= 0 ? "positive" : "negative"}>{quote.change >= 0 ? "+" : ""}{quote.change.toFixed(2)}% today</span><div className="mini-chart"><Suspense fallback={<div className="chart-loading compact">Loading…</div>}><MarketChart series={snapshot.series} compact /></Suspense></div></article>)}</div>
    <article className="panel market-table-panel"><div className="panel-heading"><div><p className="eyebrow">POPULAR INSTRUMENTS</p><h2>Stocks & derivatives</h2></div><span className="filter-button">Indicative prices</span></div><InstrumentsTable items={instruments} /></article>
    <p className="inline-disclaimer"><ShieldCheck size={14} /> Prices shown are illustrative. Configure an authorized market-data provider for live quotes.</p>
  </section>;
}

function Services() {
  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">INFINITY CAPITAL</p><h1>Advisory services</h1><p className="welcome-subtitle">Service areas for investors and market participants.</p></div><span className="data-badge"><ShieldCheck size={14} /> Risk-aware approach</span></div>
    <div className="service-notice"><ShieldCheck size={18} /><div><strong>Clear, responsible advisory.</strong><p>Service availability, advice, and products are subject to applicable registration, eligibility, and regulatory requirements. This page is informational and does not provide a recommendation to buy or sell.</p></div></div>
    <div className="service-grid">{services.map(({ icon: Icon, title, category, description }) => <article className="panel service-card" key={title}><span className="service-icon"><Icon size={19} /></span><p className="eyebrow">{category}</p><h2>{title}</h2><p>{description}</p><span className="service-detail"><ShieldCheck size={13} /> Suitability and risk disclosures apply</span></article>)}</div>
    <p className="service-footnote">Confirm your firm’s registration details, service scope, fees, and required disclosures before publishing this page or offering regulated advisory services.</p>
  </section>;
}

function NotFound() {
  return <section className="page-section not-found"><span className="learning-icon"><Compass size={18} /></span><h1>Page not found</h1><p>That page isn’t part of this dashboard.</p><Link className="button button-dark" to="/">Back to overview <ArrowRight size={15} /></Link></section>;
}

function App() {
  const [snapshot, setSnapshot] = useState({ quotes: [], series: [], isDemo: true });
  const [period, setPeriod] = useState("1D");
  const [marketError, setMarketError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    getMarketSnapshot(period)
      .then((data) => { if (active) { setSnapshot(data); setMarketError(""); } })
      .catch((error) => { if (active) setMarketError(error.message); });
    return () => { active = false; };
  }, [period]);

  const activePage = navigation.find(({ path }) => path === location.pathname);
  const title = activePage?.label ?? "Overview";

  return <div className="app-shell">
    <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
    <main className="main-area">
      <Topbar title={title} onMenu={() => setMobileOpen(true)} />
      {snapshot.quotes.length > 0 && <QuoteStrip quotes={snapshot.quotes} />}
      {marketError && <div className="market-error" role="alert">{marketError}</div>}
      <div className="content-area">
        <Routes>
          <Route path="/" element={snapshot.quotes.length ? <Overview snapshot={snapshot} period={period} setPeriod={setPeriod} /> : <div className="loading-state">Loading market snapshot…</div>} />
          <Route path="/markets" element={<Markets snapshot={snapshot} />} />
          <Route path="/services" element={<Services />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <footer className="footer"><span>© 2026 Infinity Capital</span><span>Risk disclosures apply</span></footer>
    </main>
  </div>;
}

export default App;
