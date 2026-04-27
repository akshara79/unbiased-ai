import { DataRow, AnalysisConfig, GroupStats, BiasAlert, FairnessMetrics } from "@/types";

export function computeGroupStats(
  data: DataRow[],
  config: AnalysisConfig
): GroupStats[] {
  const stats: GroupStats[] = [];

  for (const attr of config.sensitiveAttributes) {
    const groups = [...new Set(data.map((r) => String(r[attr])))].filter(Boolean);

    for (const group of groups) {
      const groupRows = data.filter((r) => String(r[attr]) === group);
      const positiveRows = groupRows.filter((r) => {
        const val = r[config.predictionColumn];
        if (config.positiveOutcome !== undefined) {
          return String(val) === String(config.positiveOutcome);
        }
        return val === 1 || val === "1" || val === "yes" || val === "true" || val === "approved" || val === "hired" || val === "admitted";
      });

      stats.push({
        group,
        attribute: attr,
        count: groupRows.length,
        positiveCount: positiveRows.length,
        selectionRate: groupRows.length > 0 ? positiveRows.length / groupRows.length : 0,
      });
    }
  }

  return stats;
}

export function detectBias(
  groupStats: GroupStats[],
  sensitiveAttributes: string[]
): BiasAlert[] {
  const alerts: BiasAlert[] = [];

  for (const attr of sensitiveAttributes) {
    const attrGroups = groupStats.filter((g) => g.attribute === attr);
    if (attrGroups.length < 2) continue;

    const sorted = [...attrGroups].sort((a, b) => b.selectionRate - a.selectionRate);
    const privileged = sorted[0];
    const unprivileged = sorted[sorted.length - 1];

    const di =
      privileged.selectionRate > 0
        ? unprivileged.selectionRate / privileged.selectionRate
        : 1;
    const spd = unprivileged.selectionRate - privileged.selectionRate;

    let severity: "low" | "medium" | "high" = "low";
    if (di < 0.6 || Math.abs(spd) > 0.2) severity = "high";
    else if (di < 0.8 || Math.abs(spd) > 0.1) severity = "medium";

    if (severity !== "low" || di < 0.9) {
      alerts.push({
        attribute: attr,
        privilegedGroup: privileged.group,
        unprivilegedGroup: unprivileged.group,
        disparateImpact: parseFloat(di.toFixed(4)),
        statisticalParityDiff: parseFloat(spd.toFixed(4)),
        severity,
        message: `Group "${unprivileged.group}" has a ${((1 - di) * 100).toFixed(1)}% lower selection rate than "${privileged.group}" for attribute "${attr}".`,
      });
    }
  }

  return alerts;
}

export function computeFairnessMetrics(
  _data: DataRow[],
  config: AnalysisConfig,
  groupStats: GroupStats[]
): FairnessMetrics[] {
  const metrics: FairnessMetrics[] = [];

  for (const attr of config.sensitiveAttributes) {
    const attrGroups = groupStats.filter((g) => g.attribute === attr);
    if (attrGroups.length < 2) continue;

    const sorted = [...attrGroups].sort((a, b) => b.selectionRate - a.selectionRate);
    const privileged = sorted[0];
    const unprivileged = sorted[sorted.length - 1];

    const di =
      privileged.selectionRate > 0
        ? unprivileged.selectionRate / privileged.selectionRate
        : 1;
    const spd = unprivileged.selectionRate - privileged.selectionRate;

    // Equal opportunity: TPR difference (simplified using selection rate as proxy)
    const eod = spd;

    metrics.push({
      attribute: attr,
      disparateImpact: parseFloat(di.toFixed(4)),
      statisticalParityDifference: parseFloat(spd.toFixed(4)),
      equalOpportunityDiff: parseFloat(eod.toFixed(4)),
      groups: attrGroups,
    });
  }

  return metrics;
}

export function computeFairnessScore(_alerts: BiasAlert[], metrics: FairnessMetrics[]): number {
  if (metrics.length === 0) return 100;

  let totalPenalty = 0;

  for (const m of metrics) {
    // DI penalty: ideal is 1.0, penalty grows as it deviates
    const diPenalty = Math.max(0, (1 - m.disparateImpact) * 50);
    // SPD penalty
    const spdPenalty = Math.abs(m.statisticalParityDifference) * 100;
    totalPenalty += (diPenalty + spdPenalty) / 2;
  }

  const avgPenalty = totalPenalty / metrics.length;
  const score = Math.max(0, Math.min(100, 100 - avgPenalty));
  return parseFloat(score.toFixed(1));
}
