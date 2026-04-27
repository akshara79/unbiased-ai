"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { GroupStats } from "@/types";

export default function FairnessChart({ groupStats }: { groupStats: GroupStats[] }) {
  const data = groupStats.map((g) => ({
    name: `${g.attribute}: ${g.group}`,
    "Selection Rate": parseFloat((g.selectionRate * 100).toFixed(1)),
    Count: g.count,
  }));

  return (
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold text-gray-700 mb-4">Selection Rate by Group</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
          <YAxis unit="%" domain={[0, 100]} />
          <Tooltip formatter={(v) => [`${v}%`, "Selection Rate"]} />
          <Legend verticalAlign="top" />
          <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "80% threshold", position: "right", fontSize: 10 }} />
          <Bar dataKey="Selection Rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
