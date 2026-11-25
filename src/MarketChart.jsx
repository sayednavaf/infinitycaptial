import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
}

export default function MarketChart({ series, compact = false }) {
  const gradientId = `chartFill-${useId().replace(/:/g, "")}`;
  return (
    <div className={`chart-wrap ${compact ? "chart-wrap-compact" : ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#92d7a4" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#92d7a4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#edf0eb" strokeDasharray="3 5" />
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#98a198", fontSize: 11 }} dy={10} />
          <YAxis domain={["dataMin - 100", "dataMax + 100"]} axisLine={false} tickLine={false} tick={{ fill: "#98a198", fontSize: 11 }} tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} />
          <Tooltip
            contentStyle={{ border: "1px solid #e8ece6", borderRadius: 10, fontSize: 12, boxShadow: "0 8px 24px #17201712" }}
            formatter={(value) => [formatPrice(value), "NIFTY 50"]}
            labelStyle={{ color: "#7d877d", marginBottom: 4 }}
          />
          <Area type="monotone" dataKey="value" stroke="#4a9d63" strokeWidth={2.2} fill={`url(#${gradientId})`} activeDot={{ r: 4, fill: "#4a9d63", stroke: "#fff", strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
