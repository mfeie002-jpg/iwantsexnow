import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const pilotPath = path.join(dataDir, "pilot-20-cohort.json");
const statePath = path.join(dataDir, "managed-profile-states.json");
const metricsPath = path.join(dataDir, "real-profile-metrics.json");

const pilots = fs.existsSync(pilotPath) ? JSON.parse(fs.readFileSync(pilotPath, "utf8")) : [];
const states = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
const metrics = fs.existsSync(metricsPath) ? JSON.parse(fs.readFileSync(metricsPath, "utf8")) : {};

for (const p of pilots) {
  const pid = p.profileId;
  if (!states[pid]) {
    states[pid] = {
      profileId: pid,
      displayName: p.name,
      city: p.city,
      canton: p.canton,
      rate60Chf: 400,
      accountConfirmed: true,
      claimed: false,
      identityVerified: false,
      availabilityConfirmed: false,
      published: true,
      paused: false,
      pilotSlot: p.pilotSlot,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  if (!metrics[pid]) {
    metrics[pid] = {
      startedAt: new Date().toISOString(),
      views: 0,
      detailOpens: 0,
      sourceClicks: 0,
      contactActions: 0,
      updatedAt: new Date().toISOString(),
    };
  }
}

fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8");
fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), "utf8");
console.log("✓ Alle " + pilots.length + " Pilot-Profile (ZG/ZH) im Server-State vor-initialisiert!");