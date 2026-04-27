export interface DataRow {
  [key: string]: string | number;
}

export interface AnalysisConfig {
  predictionColumn: string;
  sensitiveAttributes: string[];
  positiveOutcome?: string | number;
}

export interface GroupStats {
  group: string;
  attribute: string;
  count: number;
  positiveCount: number;
  selectionRate: number;
}

export interface BiasAlert {
  attribute: string;
  privilegedGroup: string;
  unprivilegedGroup: string;
  disparateImpact: number;
  statisticalParityDiff: number;
  severity: "low" | "medium" | "high";
  message: string;
}

export interface FairnessMetrics {
  attribute: string;
  disparateImpact: number;
  statisticalParityDifference: number;
  equalOpportunityDiff: number;
  groups: GroupStats[];
}

export interface FeatureImportance {
  feature: string;
  correlation: number;
  isSensitive: boolean;
  biasRisk: "low" | "medium" | "high";
}

export interface MitigationSuggestion {
  type: "remove" | "rebalance" | "threshold" | "reweight" | "proxy";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface AnalysisResult {
  datasetOverview: {
    totalRows: number;
    totalColumns: number;
    columns: string[];
    predictionColumn: string;
    sensitiveAttributes: string[];
    positiveOutcomeRate: number;
  };
  fairnessScore: number;
  fairnessLevel: "fair" | "risk" | "biased";
  biasAlerts: BiasAlert[];
  fairnessMetrics: FairnessMetrics[];
  featureImportance: FeatureImportance[];
  mitigationSuggestions: MitigationSuggestion[];
  groupStats: GroupStats[];
}
