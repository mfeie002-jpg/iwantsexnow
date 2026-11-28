import stats from "@/data/index-stats.json";
import { formatStandDate, latestDataStandIso } from "@/lib/honesty";

export function dataStandLabel(): string {
  return formatStandDate(latestDataStandIso(stats as Record<string, unknown>));
}

export function DataStandNote({ className = "night-note" }: { className?: string }) {
  const label = dataStandLabel();
  if (!label) return null;
  return <p className={className}>Datenstand {label}. Der Zeitpunkt stammt aus dem letzten erfassten Harvest der Verzeichnisdaten.</p>;
}
