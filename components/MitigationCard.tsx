import { MitigationSuggestion } from "@/types";

const icons = { remove: "🗑️", rebalance: "⚖️", threshold: "🎯", reweight: "🔄", proxy: "🔍" };
const priorityStyle = {
  high: "border-red-200 bg-red-50",
  medium: "border-yellow-200 bg-yellow-50",
  low: "border-green-200 bg-green-50",
};

export default function MitigationCard({ suggestion }: { suggestion: MitigationSuggestion }) {
  return (
    <div className={`rounded-xl border p-4 ${priorityStyle[suggestion.priority]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[suggestion.type]}</span>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{suggestion.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              suggestion.priority === "high" ? "bg-red-100 text-red-700" :
              suggestion.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"
            }`}>{suggestion.priority}</span>
          </div>
          <p className="text-sm text-gray-600">{suggestion.description}</p>
        </div>
      </div>
    </div>
  );
}
