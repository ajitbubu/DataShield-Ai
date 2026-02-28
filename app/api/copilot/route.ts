import { NextRequest, NextResponse } from "next/server";
import { CopilotRegulation, copilotRegulations } from "@/data/copilot";
import { generateMockCopilotResponse } from "@/lib/copilot";

type CopilotRequestBody = {
  question?: string;
  regulation?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CopilotRequestBody;

  const question = body.question?.trim() ?? "";
  const regulation = body.regulation?.trim() as CopilotRegulation | undefined;

  if (question.length < 5) {
    return NextResponse.json({ error: "Question must be at least 5 characters." }, { status: 400 });
  }

  if (!regulation || !copilotRegulations.includes(regulation)) {
    return NextResponse.json({ error: "Invalid regulation context." }, { status: 400 });
  }

  // Mock inference adapter. Replace with real LLM + retrieval orchestration later.
  const response = generateMockCopilotResponse(question, regulation);

  return NextResponse.json(response);
}
