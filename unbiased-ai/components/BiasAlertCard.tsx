import { BiasAlert } from "@/types";

const severityStyle = {
  high: "bg-red-50 border-red-300 text-red-700",
  medium: "bg-yellow-50 border-yellow-300 text-yellow-700",
  low: "bg-blue-50 border-blue-300 text-blue-700",
};

export default function BiasAlertCard({ alert }: { alert: BiasAlert }) {
  const s = severityStyle[alert.severity];
  return (
    <div className={`rounded-xl border p-4 ${s}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm uppercase tracking-wide">{alert.attribute}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s}`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>
      <p className="text-sm mb-3">{alert.message}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/60 rounded p-2">
          <div className="font-medium">Disparate Impact</div>
          <div className="text-lg font-bold">{alert.disparateImpact.toFixed(3)}</div>
          <div className="text-gray-500">ideal ≥ 0.8</div>
        </div>
        <div className="bg-white/60 rounded p-2">
          <div className="font-medium">Stat. Parity Diff</div>
          <div className="text-lg font-bold">{alert.statisticalParityDiff.toFixed(3)}</div>
          <div className="text-gray-500">ideal ≈ 0</div>
        </div>
      </div>
    </div>
  );
}
