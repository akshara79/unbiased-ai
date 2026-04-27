import { NextRequest, NextResponse } from "next/server";
import { DataRow, AnalysisConfig } from "@/types";
import { computeGroupStats, detectBias, computeFairnessMetrics, computeFairnessScore } from "@/lib/biasDetector";
import { computeFeatureImportance } from "@/lib/explainability";
import { generateMitigationSuggestions } from "@/lib/mitigation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, config }: { data: DataRow[]; config: AnalysisConfig } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if (!config?.predictionColumn || !config?.sensitiveAttributes?.length) {
      return NextResponse.json({ error: "Invalid config" }, { status: 400 });
    }

    const groupStats = computeGroupStats(data, config);
    const biasAlerts = detectBias(groupStats, config.sensitiveAttributes);
    const fairnessMetrics = computeFairnessMetrics(data, config, groupStats);
    const fairnessScore = computeFairnessScore(biasAlerts, fairnessMetrics);
    const featureImportance = computeFeatureImportance(data, config);
    const mitigationSuggestions = generateMitigationSuggestions(biasAlerts, featureImportance, config.sensitiveAttributes);

    const positiveRows = data.filter((r) => {
      const val = r[config.predictionColumn];
      if (config.positiveOutcome !== undefined) return String(val) === String(config.positiveOutcome);
      return val === 1 || val === "1" || val === "yes" || val === "true" || val === "approved" || val === "hired" || val === "admitted";
    });

    const fairnessLevel =
      fairnessScore >= 75 ? "fair" : fairnessScore >= 50 ? "risk" : "biased";

    const result = {
      datasetOverview: {
        totalRows: data.length,
        totalColumns: Object.keys(data[0]).length,
        columns: Object.keys(data[0]),
        predictionColumn: config.predictionColumn,
        sensitiveAttributes: config.sensitiveAttributes,
        positiveOutcomeRate: positiveRows.length / data.length,
      },
      fairnessScore,
      fairnessLevel,
      biasAlerts,
      fairnessMetrics,
      featureImportance,
      mitigationSuggestions,
      groupStats,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
