import { CopilotLayout } from "@/components/copilot/copilot-layout";
import { copilotRegulations, copilotSessions, copilotTemplates } from "@/data/copilot";

export default function CopilotPage() {
  return (
    <CopilotLayout
      initialSession={copilotSessions[0]}
      regulations={copilotRegulations}
      sessions={copilotSessions}
      templates={copilotTemplates}
    />
  );
}
