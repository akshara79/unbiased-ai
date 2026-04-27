import { NextRequest, NextResponse } from "next/server";
import { AnalysisResult } from "@/types";
import { generateJSONReport, generateHTMLReport } from "@/lib/reportGenerator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { result, format }: { result: AnalysisResult; format: "json" | "html" } = body;

    if (!result) {
      return NextResponse.json({ error: "No result provided" }, { status: 400 });
    }

    if (format === "html") {
      const html = generateHTMLReport(result);
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": 'attachment; filename="fairness-report.html"',
        },
      });
    }

    const json = generateJSONReport(result);
    return new NextResponse(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="fairness-report.json"',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
