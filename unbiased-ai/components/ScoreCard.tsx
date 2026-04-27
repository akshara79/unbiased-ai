interface ScoreCardProps {
  score: number;
  level: "fair" | "risk" | "biased";
}

const config = {
  fair: { color: "text-green-600", bg: "bg-green-50 border-green-200", label: "FAIR", emoji: "✅" },
  risk: { color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "AT RISK", emoji: "⚠️" },
  biased: { color: "text-red-600", bg: "bg-red-50 border-red-200", label: "BIASED", emoji: "🚨" },
};

export default function ScoreCard({ score, level }: ScoreCardProps) {
  const c = config[level];
  return (
    <div className={`rounded-2xl border-2 p-6 text-center ${c.bg}`}>
      <div className="text-5xl mb-2">{c.emoji}</div>
      <div className={`text-6xl font-black ${c.color}`}>{score}</div>
      <div className="text-gray-500 text-sm mt-1">out of 100</div>
      <div className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${c.color} border ${c.bg}`}>
        {c.label}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        {level === "fair" && "No significant bias detected."}
        {level === "risk" && "Some fairness concerns found. Review alerts."}
        {level === "biased" && "Significant bias detected. Action required."}
      </p>
    </div>
  );
}
