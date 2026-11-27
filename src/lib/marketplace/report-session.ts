import { isReportSubmissionKey } from "./report-input";

export const REPORT_SESSION_KEY = "iwsn-private-report-submission-v1";
type ReportStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export class ReportSessionError extends Error {
  constructor() { super("REPORT_SESSION_UNAVAILABLE"); }
}

// Store only a random request identity. Report text, references and contact details stay out of storage.
export function readReportSubmissionKey(storage: ReportStorage): string | null {
  try {
    const stored = storage.getItem(REPORT_SESSION_KEY);
    if (stored === null) return null;
    if (!isReportSubmissionKey(stored)) throw new ReportSessionError();
    return stored.toLowerCase();
  } catch { throw new ReportSessionError(); }
}

export function ensureReportSubmissionKey(
  storage: ReportStorage,
  currentKey: string | null = null,
  createKey: () => string = () => globalThis.crypto.randomUUID()
): string {
  try {
    if (currentKey !== null && !isReportSubmissionKey(currentKey)) throw new ReportSessionError();
    const stored = readReportSubmissionKey(storage);
    if (stored && currentKey && stored !== currentKey.toLowerCase()) throw new ReportSessionError();
    const key = stored || currentKey?.toLowerCase() || createKey().toLowerCase();
    if (!isReportSubmissionKey(key)) throw new ReportSessionError();
    // Re-persist the same identity if storage was cleared while the form remained open.
    if (!stored) storage.setItem(REPORT_SESSION_KEY, key);
    if (readReportSubmissionKey(storage) !== key) throw new ReportSessionError();
    return key;
  } catch { throw new ReportSessionError(); }
}

// Called only by the explicit new-report action after a server-confirmed receipt.
export function clearReportSubmissionKey(storage: ReportStorage, currentKey: string): void {
  try {
    if (!isReportSubmissionKey(currentKey)) throw new ReportSessionError();
    const stored = readReportSubmissionKey(storage);
    if (stored && stored !== currentKey.toLowerCase()) throw new ReportSessionError();
    storage.removeItem(REPORT_SESSION_KEY);
    if (readReportSubmissionKey(storage) !== null) throw new ReportSessionError();
  } catch { throw new ReportSessionError(); }
}
