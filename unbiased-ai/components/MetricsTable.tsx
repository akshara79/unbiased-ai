import { FairnessMetrics } from "@/types";

function badge(val: number, ideal: number, threshold: number) {
  const diff = Math.abs(val - ideal);
  const color = diff < threshold * 0.5 ? "bg-green-100 text-green-700" : diff < threshold ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val.toFixed(3)}</span>;
}

export default function MetricsTable({ metrics }: { metrics: FairnessMetrics[] }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Attribute</th>
            <th className="px-4 py-3 text-center">Disparate Impact<br/><span className="font-normal normal-case text-gray-400">ideal ≥ 0.8</span></th>
            <th className="px-4 py-3 text-center">Stat. Parity Diff<br/><span className="font-normal normal-case text-gray-400">ideal ≈ 0</span></th>
            <th className="px-4 py-3 text-center">Equal Opportunity<br/><span className="font-normal normal-case text-gray-400">ideal ≈ 0</span></th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-indigo-700">{m.attribute}</td>
              <td className="px-4 py-3 text-center">{badge(m.disparateImpact, 1, 0.2)}</td>
              <td className="px-4 py-3 text-center">{badge(m.statisticalParityDifference, 0, 0.1)}</td>
              <td className="px-4 py-3 text-center">{badge(m.equalOpportunityDiff, 0, 0.1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
