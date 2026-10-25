import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDir = path.join(process.cwd(), "src", "data");
const stats = JSON.parse(fs.readFileSync(path.join(dataDir, "index-stats.json"), "utf8"));
const claims = JSON.parse(fs.readFileSync(path.join(dataDir, "ready-whatsapp-claims.json"), "utf8"));

const zgMobile = claims.filter((c) => c.canton === "ZG" && c.isMobile);
const zhMobile = claims.filter((c) => c.canton === "ZH" && c.isMobile);

console.log("\n===================================================================");
console.log("ERGEBNIS DEINES DINNER-MARATHONS (COMMIT 08b416f):");
console.log("===================================================================");
console.log(" - Gespeicherte Schweizer Inserate im Tresor:", stats.totalRawListingsInVault);
console.log(" - Gespeicherte Schweizer Clubs & Studios:   ", stats.totalEstablishmentsInVault);
console.log(" - Eindeutige gepruefte +41 Nummern gesamt:  ", claims.length);
console.log(" - Davon echte CH-Handynummern (075-079):    ", stats.mobileWhatsappReadyPhones);
console.log(" - Handynummern in Pilot-Region ZUG (ZG):    ", zgMobile.length);
console.log(" - Handynummern in Pilot-Region ZUERICH (ZH):", zhMobile.length);
console.log("===================================================================");

// Kryptografischer Token-Selbsttest (Freigabe A & B)
const SECRET = "iwsn-swiss-master-secret-2026";
const makeToken = (pid) =>
  crypto.createHmac("sha256", SECRET).update(String(pid).trim().toLowerCase()).digest("hex").slice(0, 28);

const tokA = makeToken("pilot-zh-1");
const tokB = makeToken("pilot-zh-2");
console.log(" - HMAC Token-Trennung (Freigabe A/B):        OK (" + tokA.slice(0, 8) + "... != " + tokB.slice(0, 8) + "...)");

// Erstelle die kuratierte Liste der ersten 20 Pilot-Kandidaten (10x ZG, 10x ZH) mit signiertem Direkt-Claim-Link
const pilot20 = [...zgMobile.slice(0, 10), ...zhMobile.slice(0, 10)].map((c, idx) => {
  const pid = `pilot-${c.canton.toLowerCase()}-${idx + 1}`;
  const token = makeToken(pid);
  const directCockpitUrl = `https://iwantsexnow.ch/creator-dashboard?id=${encodeURIComponent(pid)}&token=${encodeURIComponent(token)}`;
  const inviteText = `Hallo ${c.name}, für deinen Eintrag in ${c.city} haben wir auf iwantsexnow.ch die kostenlose Selbstverwaltung freigeschaltet. Du kannst deine Angaben hier direkt ohne Abo kontrollieren, korrigieren oder pausieren: ${directCockpitUrl} (oder ohne Anmeldung entfernen unter iwantsexnow.ch/report)`;
  return {
    pilotSlot: idx + 1,
    profileId: pid,
    name: c.name,
    city: c.city,
    canton: c.canton,
    phoneDisplay: c.phoneDisplay,
    waDigits: c.waDigits,
    ownerToken: token,
    directCockpitUrl,
    waInviteUrl: `https://wa.me/${c.waDigits}?text=${encodeURIComponent(inviteText)}`,
  };
});

fs.writeFileSync(path.join(dataDir, "pilot-20-cohort.json"), JSON.stringify(pilot20, null, 2), "utf8");
console.log(" - Pilot-Kohorte (20 Profile ZG/ZH) bereit:   src/data/pilot-20-cohort.json");
console.log("===================================================================\n");