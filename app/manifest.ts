import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DataShield-AI",
    short_name: "DataShield-AI",
    description: "AI-powered privacy intelligence and automated compliance platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9FC",
    theme_color: "#1E2A78",
    icons: [
      {
        src: "/datashield-ai-wordmark-dark.svg",
        sizes: "560x160",
        type: "image/svg+xml"
      }
    ]
  };
}
