import Link from "next/link";
import type { AlsoListed as AlsoListedItem } from "@/lib/night-catalogue";

export function AlsoListed({ items, total }: { items?: AlsoListedItem[] | null; total?: number }) {
  const links = Array.isArray(items) ? items.filter((item) => item && item.id) : [];
  if (!links.length) return null;
  const shown = links.slice(0, 4);
  const count = typeof total === "number" && total >= shown.length ? total : links.length;
  return (
    <p className="night-note">
      auch gelistet auf{" "}
      {shown.map((item, index) => (
        <span key={item.id}>
          {index > 0 ? ", " : ""}
          <Link href={`/profile/${encodeURIComponent(item.id)}`}>{item.sourcePortal || "Quelle"}</Link>
        </span>
      ))}
      {count > shown.length ? ` und ${count - shown.length} weitere` : ""}
    </p>
  );
}
