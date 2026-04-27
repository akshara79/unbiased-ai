import { BiasAlert, FeatureImportance, MitigationSuggestion } from "@/types";

export function generateMitigationSuggestions(
  alerts: BiasAlert[],
  featureImportance: FeatureImportance[],
  sensitiveAttributes: string[]
): MitigationSuggestion[] {
  const suggestions: MitigationSuggestion[] = [];

  const highBiasAttrs = alerts.filter((a) => a.severity === "high").map((a) => a.attribute);
  const sensitiveCorrFeatures = featureImportance.filter(
    (f) => f.isSensitive && f.correlation > 0.2
  );

  if (highBiasAttrs.length > 0) {
    suggestions.push({
      type: "remove",
      title: "Remove Sensitive Attributes",
      description: `Consider removing or anonymizing high-bias attributes: ${highBiasAttrs.join(", ")}. These columns directly correlate with biased outcomes.`,
      priority: "high",
    });
  }

  if (alerts.some((a) => a.severity === "high" || a.severity === "medium")) {
    suggestions.push({
      type: "rebalance",
      title: "Rebalance Training Dataset",
      description:
        "Use oversampling (SMOTE) or undersampling techniques to balance representation across demographic groups in your training data.",
      priority: "high",
    });
  }

  if (alerts.length > 0) {
    suggestions.push({
      type: "threshold",
      title: "Adjust Decision Thresholds Per Group",
      description:
        "Apply group-specific classification thresholds to equalize selection rates. This is a post-processing technique that doesn't require retraining.",
      priority: "medium",
    });
  }

  if (sensitiveCorrFeatures.length > 0) {
    suggestions.push({
      type: "reweight",
      title: "Reweight Training Samples",
      description: `Features ${sensitiveCorrFeatures.map((f) => f.feature).join(", ")} are correlated with sensitive attributes. Apply instance reweighting to reduce their influence during training.`,
      priority: "medium",
    });
  }

  const proxyFeatures = featureImportance.filter(
    (f) => !f.isSensitive && f.biasRisk === "medium" && f.correlation > 0.4
  );
  if (proxyFeatures.length > 0) {
    suggestions.push({
      type: "proxy",
      title: "Audit Proxy Variables",
      description: `Features like ${proxyFeatures
        .slice(0, 3)
        .map((f) => f.feature)
        .join(", ")} may act as proxies for sensitive attributes. Investigate and consider removing them.`,
      priority: "medium",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: "rebalance",
      title: "Continue Monitoring",
      description:
        "No critical bias detected. Continue monitoring fairness metrics as new data arrives and retrain periodically.",
      priority: "low",
    });
  }

  return suggestions;
}
