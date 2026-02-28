import { ScannerDashboard } from "@/components/scanner/scanner-dashboard";
import { scanHistory, scannerDomains } from "@/data/scanner";

export default function ScannerPage() {
  return <ScannerDashboard domains={scannerDomains} history={scanHistory} initialScan={scanHistory[0]} />;
}
