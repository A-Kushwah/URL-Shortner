"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ClicksChart({ data }: { data: { day: string; clicks: number }[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.day + "T00:00:00Z").toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="h-64 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748b" }}
            interval={Math.max(0, Math.floor(formatted.length / 6))}
            axisLine={{ stroke: "#1e293b" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
              color: "#f8fafc",
            }}
            labelStyle={{ color: "#34d399", fontWeight: 600, marginBottom: "4px" }}
            itemStyle={{ color: "#cbd5e1" }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#emeraldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
