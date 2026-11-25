import { useEffect } from "react";
import { useRouter } from "next/router";
import { applyPrefs } from "@/lib/prefs";

/** Applies language and discreet-mode preferences on load and after every page change. */
export function DiscreetEffect() {
  const router = useRouter();

  useEffect(() => {
    // Pages set their own <title>; in discreet mode keep it neutral.
    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains("discreet") && document.title !== "Notizen") {
        document.title = "Notizen";
      }
    });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    applyPrefs();
    const reapply = () => setTimeout(applyPrefs, 0);
    router.events.on("routeChangeComplete", reapply);
    return () => {
      observer.disconnect();
      router.events.off("routeChangeComplete", reapply);
    };
  }, [router.events]);

  return null;
}
