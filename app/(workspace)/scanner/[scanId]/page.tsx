import { notFound } from "next/navigation";
import { ScanReportView } from "@/components/scanner/scan-report-view";
import { getScanById, scanHistory } from "@/data/scanner";

type Props = {
  params: Promise<{ scanId: string }>;
};

export async function generateStaticParams() {
  return scanHistory.map((scan) => ({ scanId: scan.scanId }));
}

export default async function ScanDetailPage({ params }: Props) {
  const { scanId } = await params;
  const scan = getScanById(scanId);

  if (!scan) {
    notFound();
  }

  return <ScanReportView history={scanHistory} scan={scan} />;
}
