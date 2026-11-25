const TICKER_SYMBOLS = [
  { proName: "BSE:SENSEX", title: "SENSEX" },
];

function getWidgetConfig(type, symbol) {
  if (type === "ticker-tape") {
    return {
      symbols: TICKER_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    };
  }

  return {
    autosize: true,
    allow_symbol_change: true,
    calendar: false,
    details: false,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: true,
    interval: "D",
    locale: "en",
    save_image: false,
    style: "1",
    symbol,
    theme: "dark",
    timezone: "Asia/Kolkata",
    withdateranges: true,
    support_host: "https://www.tradingview.com",
  };
}

export default function TradingViewEmbed({ type = "advanced-chart", symbol = "BSE:SENSEX" }) {
  const embedUrl = `https://www.tradingview-widget.com/embed-widget/${type}/?locale=en#${encodeURIComponent(JSON.stringify(getWidgetConfig(type, symbol)))}`;

  return (
    <div className={`tradingview-embed tradingview-embed-${type}`}>
      <iframe
        className="tradingview-widget-frame"
        src={embedUrl}
        title={type === "ticker-tape" ? "TradingView market ticker" : `TradingView chart for ${symbol}`}
        loading={type === "ticker-tape" ? "eager" : "lazy"}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
