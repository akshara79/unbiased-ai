import { AnalysisResult } from "@/types";

export function generateJSONReport(result: AnalysisResult): string {
  const report = {
    title: "Unbiased AI — Fairness Analysis Report",
    generatedAt: new Date().toISOString(),
    summary: {
      fairnessScore: result.fairnessScore,
      fairnessLevel: result.fairnessLevel,
      totalBiasAlerts: result.biasAlerts.length,
      highSeverityAlerts: result.biasAlerts.filter((a) => a.severity === "high").length,
    },
    datasetOverview: result.datasetOverview,
    fairnessMetrics: result.fairnessMetrics,
    biasAlerts: result.biasAlerts,
    featureImportance: result.featureImportance,
    mitigationSuggestions: result.mitigationSuggestions,
  };
  return JSON.stringify(report, null, 2);
}

export function generateHTMLReport(result: AnalysisResult): string {
  const scoreColor =
    result.fairnessLevel === "fair"
      ? "#16a34a"
      : result.fairnessLevel === "risk"
      ? "#d97706"
      : "#dc2626";

  const alertRows = result.biasAlerts
    .map(
      (a) => `
    <tr>
      <td>${a.attribute}</td>
      <td>${a.privilegedGroup}</td>
      <td>${a.unprivilegedGroup}</td>
      <td>${a.disparateImpact.toFixed(3)}</td>
      <td>${a.statisticalParityDiff.toFixed(3)}</td>
      <td style="color:${a.severity === "high" ? "#dc2626" : a.severity === "medium" ? "#d97706" : "#16a34a"}">${a.severity.toUpperCase()}</td>
    </tr>`
    )
    .join("");

  const featureRows = result.featureImportance
    .slice(0, 10)
    .map(
      (f) => `
    <tr>
      <td>${f.feature}</td>
      <td>${(f.correlation * 100).toFixed(1)}%</td>
      <td>${f.isSensitive ? "Yes" : "No"}</td>
      <td>${f.biasRisk}</td>
    </tr>`
    )
    .join("");

  const suggestions = result.mitigationSuggestions
    .map((s) => `<li><strong>${s.title}</strong>: ${s.description}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Fairness Report — Unbiased AI</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; color: #1f2937; }
    h1 { color: #4f46e5; } h2 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f3f4f6; text-align: left; padding: 8px 12px; }
    td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; }
    .score { font-size: 48px; font-weight: bold; color: ${scoreColor}; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; background: ${scoreColor}; color: white; font-weight: bold; }
    ul { line-height: 2; }
  </style>
</head>
<body>
  <h1>Unbiased AI — Fairness Analysis Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>

  <h2>Fairness Score</h2>
  <div class="score">${result.fairnessScore}</div>
  <span class="badge">${result.fairnessLevel.toUpperCase()}</span>

  <h2>Dataset Overview</h2>
  <p>Rows: ${result.datasetOverview.totalRows} | Columns: ${result.datasetOverview.totalColumns} | Prediction: <strong>${result.datasetOverview.predictionColumn}</strong></p>
  <p>Sensitive Attributes: ${result.datasetOverview.sensitiveAttributes.join(", ")}</p>
  <p>Overall Positive Outcome Rate: ${(result.datasetOverview.positiveOutcomeRate * 100).toFixed(1)}%</p>

  <h2>Bias Alerts (${result.biasAlerts.length})</h2>
  ${result.biasAlerts.length === 0 ? "<p>No significant bias detected.</p>" : `
  <table>
    <thead><tr><th>Attribute</th><th>Privileged</th><th>Unprivileged</th><th>Disparate Impact</th><th>Stat. Parity Diff</th><th>Severity</th></tr></thead>
    <tbody>${alertRows}</tbody>
  </table>`}

  <h2>Feature Importance</h2>
  <table>
    <thead><tr><th>Feature</th><th>Correlation</th><th>Sensitive</th><th>Bias Risk</th></tr></thead>
    <tbody>${featureRows}</tbody>
  </table>

  <h2>Mitigation Suggestions</h2>
  <ul>${suggestions}</ul>
</body>
</html>`;
}
