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
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F3A2E" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1F3A2E" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#D6D9CB" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#1B2A20AA" }}
            interval={Math.max(0, Math.floor(formatted.length / 6))}
            axisLine={{ stroke: "#D6D9CB" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#1B2A20AA" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              background: "#1B2A20",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              color: "#F5F7F1",
            }}
            labelStyle={{ color: "#D9A441" }}
          />
          <Area type="monotone" dataKey="clicks" stroke="#1F3A2E" strokeWidth={2} fill="url(#clicksFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
