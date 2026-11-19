import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const STORAGE_KEY = "iwsn_age_verified_v2";

export function AgeVerificationGate() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      setVerified(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setVerified(false);
    }
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
    setVerified(true);
  };

  if (!mounted || verified) return null;

  const openLegal = ["/privacy", "/terms", "/imprint", "/report"];
  if (openLegal.includes(router.pathname)) return null;

  return (
    <div className="age-gate">
      <div role="dialog" aria-modal="true" aria-labelledby="age-gate-title" className="age-gate-card">
        <p className="kicker">iwantsexnow.ch · Schweiz</p>
        <h2 id="age-gate-title">Diese Seiten sind für Erwachsene.</h2>
        <p>
          Der Eintritt ist ab 18 Jahren. Wir speichern diese Bestätigung nur lokal in deinem Browser und folgen dem
          revidierten Schweizer Datenschutzgesetz, ohne Werbe-Tracking von Dritten.
        </p>
        <button type="button" className="brass-button age-gate-yes" onClick={confirm}>
          Ich bin 18 oder älter
        </button>
        <a className="age-gate-no" href="https://www.sbb.ch">
          Ich bin unter 18
        </a>
        <p className="age-gate-legal">
          <Link href="/privacy">Datenschutz</Link>
          <Link href="/terms">Nutzungsbedingungen</Link>
          <Link href="/imprint">Impressum</Link>
        </p>
      </div>
    </div>
  );
}

export default AgeVerificationGate;
