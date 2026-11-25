import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Compass,
  GraduationCap,
  Landmark,
  Menu,
  Scale,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import { getAdvisoryServices } from "./marketData.js";
import TradingViewEmbed from "./TradingViewEmbed.jsx";

const navigation = [
  { label: "Overview", path: "/", icon: Compass },
  { label: "Markets", path: "/markets", icon: TrendingUp },
  { label: "Services", path: "/services", icon: BriefcaseBusiness },
];
const serviceIcons = [ChartNoAxesCombined, TrendingUp, Compass, BriefcaseBusiness, ChartNoAxesCombined, ShieldCheck, GraduationCap];
const marketEssentials = [
  {
    title: "Stock market",
    label: "EQUITY",
    icon: Landmark,
    description: "A share represents a small ownership interest in a company. Shares trade on exchanges such as NSE and BSE, where prices move with supply, demand, company results, and broader market conditions.",
    takeaway: "Shareholders can lose some or all of the amount invested if a company performs poorly.",
    details: [
      "Companies issue shares to raise capital. After listing, investors generally buy and sell those shares from one another through an exchange.",
      "A share price can respond to company earnings, business outlook, economic conditions, interest rates, and investor sentiment. Past performance does not predict future returns.",
      "In India, investors typically hold securities in a demat account and place orders through a broker. Understand brokerage, taxes, and other charges before trading.",
    ],
  },
  {
    title: "Futures",
    label: "DERIVATIVES",
    icon: TrendingUp,
    description: "A futures contract is an exchange-traded agreement to buy or sell an underlying asset at a specified price on a future date. Contracts have set lot sizes and expiry dates, and positions generally require margin.",
    takeaway: "Leverage can magnify both gains and losses; losses can exceed the margin deposited.",
    details: [
      "Exchange-listed futures specify the underlying, contract size, expiry, and settlement terms. A futures position creates an obligation; it is not the same as owning the underlying shares.",
      "Margin is a performance deposit, not a cap on possible losses. Exchanges and brokers may require additional funds when prices move against a position.",
      "Before entering, understand mark-to-market settlement, expiry, applicable margin, liquidity, and how the position can be closed or settled.",
    ],
  },
  {
    title: "Options",
    label: "DERIVATIVES",
    icon: Scale,
    description: "A call option gives its buyer the right to buy, and a put gives the right to sell, under the contract terms. The buyer pays a premium; the option writer takes on an obligation if assigned.",
    takeaway: "An option buyer can lose the premium paid; an uncovered option writer may face very large losses.",
    details: [
      "An option contract has an underlying, strike price, expiry, and premium. A call buyer has a right to buy and a put buyer has a right to sell according to the contract terms.",
      "Option buyers can lose the premium paid if the option expires without value. Option sellers collect premium but take on obligations and may face substantial losses; uncovered call losses can be theoretically unlimited.",
      "Premiums can change with the underlying price, time remaining, volatility, and other factors. Options are complex and can lose value quickly, including when the market moves sideways.",
    ],
  },
  {
    title: "Market hours (India)",
    label: "TIME · IST",
    icon: Compass,
    description: "For the regular NSE/BSE equity market, the pre-open session is generally 9:00–9:15 a.m. IST and normal trading is generally 9:15 a.m.–3:30 p.m. IST on exchange business days.",
    takeaway: "Exchange holidays, special sessions, and other market segments can have different schedules.",
    details: [
      "The pre-open session is a separate order-collection and price-discovery phase; it is not the same as continuous trading. The exchange publishes its specific phases and rules.",
      "Regular cash-equity trading is generally 9:15 a.m. to 3:30 p.m. India Standard Time on trading days. Derivatives and other segments can have their own schedules.",
      "Check the relevant exchange's current market-timings notice and holiday calendar before relying on a schedule. Special sessions can change the normal timetable.",
    ],
  },
  {
    title: "Before you trade",
    label: "RISK CHECK",
    icon: ShieldCheck,
    description: "Know the contract size, expiry, charges, margin rules, and exit plan before placing an order. Derivative prices can change quickly, and a stop-loss does not guarantee a particular exit price.",
    takeaway: "Use official exchange and regulator material; never treat an illustration as a return forecast.",
    details: [
      "Read the product and risk disclosures, understand all charges, and use only a broker/intermediary whose registration can be verified through SEBI or the relevant exchange.",
      "Treat claims of assured or guaranteed returns with caution. Securities-market investments and trades are subject to risk; no card here is a recommendation or a promise of profit.",
      "Never share passwords, PINs, or one-time passwords. Keep records such as contract notes and account statements, and contact the broker or exchange through verified channels if something looks wrong.",
      "Regulatory requirements and exchange rules can change. Consult current SEBI and exchange notices for authoritative information.",
    ],
  },
];

function Sidebar({ mobileOpen, closeMobile }) {
  return <>
    {mobileOpen && <button className="mobile-backdrop" aria-label="Close menu" onClick={closeMobile} />}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <Link className="brand" to="/" onClick={closeMobile} aria-label="Infinity Capital home">
        <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M20 20c-4.1-5.8-7.1-8-10.2-8a7.1 7.1 0 0 0 0 14.2c3.1 0 6.1-2.2 10.2-8s7.1-8 10.2-8a7.1 7.1 0 0 1 0 14.2c-3.1 0-6.1-2.2-10.2-8Z" />
          <path className="brand-trend" d="m13.5 22 4.1-4.3 3.2 2.4 6.3-7" />
          <path className="brand-arrow" d="M23.7 13.1h3.8v3.8" />
        </svg>
        <span className="brand-name">infinity<span>capital</span></span>
      </Link>
      <p className="nav-caption">MARKET INTELLIGENCE</p>
      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} end={path === "/"} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><Icon size={17} /><span>{label}</span></NavLink>)}
      </nav>
      <div className="sidebar-note"><ShieldCheck size={16} /><span>Research with risk awareness</span></div>
    </aside>
  </>;
}

function Topbar({ title, onMenu }) {
  return <header className="topbar">
    <button className="mobile-menu" aria-label="Open menu" onClick={onMenu}><Menu size={21} /></button>
    <div className="breadcrumbs"><span>Infinity Capital</span><span className="breadcrumb-slash">/</span><strong>{title}</strong></div>
    <div className="topbar-actions"><span className="market-status">Market data · provider widget</span></div>
  </header>;
}

function QuoteStrip() {
  return <div className="quote-strip"><TradingViewEmbed type="ticker-tape" /></div>;
}

function MarketChartPanel({ compact = false }) {
  return <article className={`panel chart-panel ${compact ? "chart-panel-compact" : ""}`}>
    <div className="panel-heading">
      <div><p className="eyebrow">MARKET CHART</p><h2>SENSEX</h2></div>
      <span className="chart-provider-label">TradingView embed</span>
    </div>
    <TradingViewEmbed symbol="BSE:SENSEX" />
    <div className="chart-meta"><span>Use the chart’s symbol search to explore other instruments.</span><a className="text-link" href="https://www.tradingview.com/chart/?symbol=BSE%3ASENSEX" target="_blank" rel="noreferrer">Open in TradingView</a></div>
  </article>;
}

function Overview({ services }) {
  const [expandedMarketCard, setExpandedMarketCard] = useState(null);

  return <>
    <section className="hero-panel">
      <div className="hero-copy"><p className="eyebrow">MARKET INTELLIGENCE · ADVISORY</p><h1>Clarity for your<br /><span>market decisions.</span></h1><p>Independent market perspectives, considered analysis, and risk-aware advisory for every market cycle.</p><div className="hero-actions"><Link className="button button-green" to="/services">Explore advisory <ArrowRight size={15} /></Link><Link className="hero-link" to="/markets">View live markets <TrendingUp size={15} /></Link></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-chart-line"><span /><span /><span /><span /><span /><span /><span /></div>      <div className="hero-visual-caption">ILLUSTRATIVE MOTIF · NOT LIVE DATA</div></div>
    </section>
    <section className="section-heading"><div><p className="eyebrow">INDIAN MARKETS</p><h2>Explore market prices</h2></div><Link className="text-link" to="/markets">Open market explorer <ArrowRight size={14} /></Link></section>
    <MarketChartPanel compact />
    <p className="market-widget-disclaimer"><ShieldCheck size={14} /> Market charts and quotes are embedded from TradingView. Data may be delayed or unavailable for some instruments and exchanges. For exploration only—not for trading or investment decisions.</p>
    <section className="market-essentials" aria-labelledby="market-essentials-title">
      <div className="section-heading"><div><p className="eyebrow">KNOW THE BASICS</p><h2 id="market-essentials-title">Market essentials</h2></div><span className="market-education-label">General information · not investment advice</span></div>
      <div className="market-essentials-grid">
        {marketEssentials.map(({ title, label, icon: Icon, description, takeaway, details }) => {
          const isExpanded = expandedMarketCard === title;
          const detailsId = `market-knowledge-details-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

          return <article className={`panel market-knowledge-card ${isExpanded ? "is-expanded" : ""}`} key={title}>
            <button
              className="market-knowledge-trigger"
              type="button"
              aria-expanded={isExpanded}
              aria-controls={detailsId}
              onClick={() => setExpandedMarketCard(isExpanded ? null : title)}
            >
              <span className="market-knowledge-heading"><span className="service-icon"><Icon size={17} /></span><span className="market-knowledge-label">{label}</span></span>
              <span className="market-knowledge-title">{title}</span>
              <span className="market-knowledge-description">{description}</span>
              <span className="market-card-takeaway"><strong>Key point</strong><span>{takeaway}</span></span>
              <span className="market-card-link">{isExpanded ? "Hide details" : "Read more"}<ArrowRight size={13} aria-hidden="true" /></span>
            </button>
            {isExpanded && <div className="market-knowledge-details" id={detailsId}>
              <h4>More about {title.toLowerCase()}</h4>
              <ul>{details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            </div>}
          </article>;
        })}
      </div>
      <p className="market-education-disclaimer">General educational information only—not investment, legal, or tax advice, and not a recommendation to buy or sell. Regulations and exchange schedules may change; verify current details with SEBI and the relevant exchange.</p>
    </section>
    {services?.length > 0 && <section className="service-preview"><div className="section-heading"><div><p className="eyebrow">HOW WE HELP</p><h2>Advisory for every approach</h2></div><Link className="text-link" to="/services">All services <ArrowRight size={14} /></Link></div><div className="preview-grid">{services.slice(0, 3).map((service) => <article className="panel preview-card" key={service.id}><span className="service-icon"><BriefcaseBusiness size={17} /></span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div></section>}
  </>;
}

function Markets() {
  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">NSE · BSE · MARKET DATA</p><h1>Markets</h1><p className="welcome-subtitle">Explore Indian indices and selected equities with an embedded market chart.</p></div><span className="data-badge">TradingView widget</span></div>
    <MarketChartPanel />
    <p className="market-widget-disclaimer"><ShieldCheck size={14} /> Market charts and quotes are embedded from TradingView. Data timing, availability, and exchange coverage are controlled by the provider and may vary. This display is for exploration only; verify data and disclosures before making financial decisions.</p>
  </section>;
}

function Services({ services, loading, error }) {
  return <section className="page-section">
    <div className="page-heading"><div><p className="eyebrow">INFINITY CAPITAL</p><h1>Advisory services</h1><p className="welcome-subtitle">Research, education, and considered support across Indian markets.</p></div><span className="data-badge"><ShieldCheck size={14} /> Risk-aware approach</span></div>
    <div className="service-notice"><ShieldCheck size={18} /><div><strong>Clear, responsible advisory.</strong><p>Service availability and advice are subject to applicable registration, eligibility, and regulatory requirements. This information does not recommend buying or selling any security.</p></div></div>
    {loading ? <div className="empty-panel panel">Loading advisory services…</div> : error ? <div className="empty-panel panel error-message" role="alert">{error}</div> : !services.length ? <div className="empty-panel panel">No advisory services are published yet.</div> : <div className="service-grid">{services.map((service, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <article className="panel service-card" key={service.id}><span className="service-icon"><Icon size={19} /></span><p className="eyebrow">{service.category}</p><h2>{service.title}</h2><p>{service.description}</p><span className="service-detail"><ShieldCheck size={13} /> Suitability and risk disclosures apply</span></article>; })}</div>}
    <section className="contact-panel" id="contact"><div><p className="eyebrow">START A CONVERSATION</p><h2>Thoughtful guidance starts with a clear brief.</h2><p>Contact our team to learn about service scope, suitability, fees, and applicable disclosures.</p></div>{import.meta.env.VITE_ADVISORY_CONTACT_EMAIL ? <a className="button button-green" href={`mailto:${import.meta.env.VITE_ADVISORY_CONTACT_EMAIL}`}>Contact advisory <ArrowRight size={15} /></a> : <span className="contact-unavailable">Contact details not configured</span>}</section>
    <p className="service-footnote">Confirm your firm’s registration details, service scope, fees, and required disclosures before offering regulated advisory services.</p>
  </section>;
}

function NotFound() {
  return <section className="page-section not-found"><span className="learning-icon"><Compass size={18} /></span><h1>Page not found</h1><Link className="button button-green" to="/">Back to overview <ArrowRight size={15} /></Link></section>;
}

function App() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    getAdvisoryServices().then((data) => { if (active) setServices(Array.isArray(data) ? data : data.services ?? []); })
      .catch((error) => { if (active) setServicesError(error.message); })
      .finally(() => { if (active) setServicesLoading(false); });
    return () => { active = false; };
  }, []);

  const title = navigation.find(({ path }) => path === location.pathname)?.label ?? "Overview";
  return <div className="app-shell">
    <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
    <main className="main-area"><Topbar title={title} onMenu={() => setMobileOpen(true)} />
      <QuoteStrip />
      <div className="content-area"><Routes>
        <Route path="/" element={<Overview services={services} />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/services" element={<Services services={services} loading={servicesLoading} error={servicesError} />} />
        <Route path="*" element={<NotFound />} />
      </Routes></div>
      <footer className="footer"><span>© {new Date().getFullYear()} Infinity Capital</span><span>Market data may be delayed · Risk disclosures apply</span></footer>
    </main>
  </div>;
}

export default App;
