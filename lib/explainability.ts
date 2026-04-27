import { DataRow, AnalysisConfig, FeatureImportance } from "@/types";

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let num = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : num / denom;
}

function encodeColumn(data: DataRow[], col: string): number[] {
  const vals = data.map((r) => r[col]);
  const unique = [...new Set(vals)];
  return vals.map((v) => unique.indexOf(v));
}

export function computeFeatureImportance(
  data: DataRow[],
  config: AnalysisConfig
): FeatureImportance[] {
  const targetEncoded = encodeColumn(data, config.predictionColumn);
  const features = Object.keys(data[0] || {}).filter(
    (k) => k !== config.predictionColumn
  );

  const importances: FeatureImportance[] = [];

  for (const feature of features) {
    const featureEncoded = encodeColumn(data, feature);
    const corr = Math.abs(pearsonCorrelation(featureEncoded, targetEncoded));
    const isSensitive = config.sensitiveAttributes.includes(feature);

    let biasRisk: "low" | "medium" | "high" = "low";
    if (isSensitive && corr > 0.3) biasRisk = "high";
    else if (isSensitive || corr > 0.5) biasRisk = "medium";

    importances.push({
      feature,
      correlation: parseFloat(corr.toFixed(4)),
      isSensitive,
      biasRisk,
    });
  }

  return importances.sort((a, b) => b.correlation - a.correlation).slice(0, 15);
}
