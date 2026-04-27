"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { DataRow, AnalysisConfig } from "@/types";

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<DataRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [predictionCol, setPredictionCol] = useState("");
  const [sensitiveAttrs, setSensitiveAttrs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file: File) {
    setFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const rows = results.data as DataRow[];
        setData(rows);
        setColumns(Object.keys(rows[0] || {}));
        setPredictionCol("");
        setSensitiveAttrs([]);
      },
    });
  }

  function toggleSensitive(col: string) {
    setSensitiveAttrs((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  }

  async function handleAnalyze() {
    if (!predictionCol || sensitiveAttrs.length === 0) {
      setError("Please select a prediction column and at least one sensitive attribute.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const config: AnalysisConfig = { predictionColumn: predictionCol, sensitiveAttributes: sensitiveAttrs };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, config }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    fetch("/sample.csv")
      .then((r) => r.blob())
      .then((blob) => handleFile(new File([blob], "sample.csv", { type: "text/csv" })));
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Upload Dataset</h1>
      <p className="text-gray-500 mb-8 text-sm">Upload a CSV with features, a prediction column, and sensitive attributes.</p>

      {/* Drop zone */}
      <div
        className="border-2 border-dashed border-indigo-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-indigo-50 transition-colors mb-4"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-gray-600 font-medium">Drop your CSV here or click to browse</p>
        <p className="text-xs text-gray-400 mt-1">Supports .csv files</p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      <button onClick={loadSample} className="text-sm text-indigo-600 hover:underline mb-6 block">
        Or load sample dataset →
      </button>

      {fileName && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700 mb-6">
          ✅ Loaded: <strong>{fileName}</strong> — {data.length} rows, {columns.length} columns
        </div>
      )}

      {columns.length > 0 && (
        <div className="space-y-6">
          {/* Prediction column */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prediction Column (outcome/label)</label>
            <select
              value={predictionCol}
              onChange={(e) => setPredictionCol(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Select column --</option>
              {columns.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Sensitive attributes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sensitive Attributes (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {columns.filter((c) => c !== predictionCol).map((c) => (
                <button
                  key={c}
                  onClick={() => toggleSensitive(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    sensitiveAttrs.includes(c)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs text-gray-400 mb-2">Preview (first 3 rows)</p>
            <div className="overflow-x-auto rounded-xl border text-xs">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>{columns.map((c) => <th key={c} className="px-3 py-2 text-left text-gray-600">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {data.slice(0, 3).map((row, i) => (
                    <tr key={i} className="border-t">
                      {columns.map((c) => <td key={c} className="px-3 py-2 text-gray-700">{String(row[c] ?? "")}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? "Analyzing..." : "Run Fairness Analysis →"}
          </button>
        </div>
      )}
    </div>
  );
}
