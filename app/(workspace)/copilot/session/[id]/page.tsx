import { notFound } from "next/navigation";
import { CopilotLayout } from "@/components/copilot/copilot-layout";
import { copilotRegulations, copilotSessions, copilotTemplates, getCopilotSessionById } from "@/data/copilot";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return copilotSessions.map((session) => ({ id: session.id }));
}

export default async function CopilotSessionPage({ params }: Props) {
  const { id } = await params;
  const session = getCopilotSessionById(id);

  if (!session) {
    notFound();
  }

  return (
    <CopilotLayout
      initialSession={session}
      regulations={copilotRegulations}
      sessions={copilotSessions}
      templates={copilotTemplates}
    />
  );
}
