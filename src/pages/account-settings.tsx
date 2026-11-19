import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { CorporateFooter } from "@/components/CorporateFooter";

interface Booking {
  confirmationCode: string;
  escortName: string;
  date: string;
  time: string;
  duration: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
}

const EMPTY_USER: UserData = { name: "", email: "", phone: "", city: "", bio: "" };

const DEFAULT_NOTIFICATIONS = {
  emailUpdates: true,
  smsNotifications: false,
  newMatches: true,
  promotions: false,
};

type NotificationKey = keyof typeof DEFAULT_NOTIFICATIONS;

const NOTIFICATION_ROWS: { key: NotificationKey; title: string; text: string }[] = [
  { key: "emailUpdates", title: "E-Mail-Updates", text: "Buchungsbestätigungen per E-Mail erhalten." },
  { key: "smsNotifications", title: "SMS-Hinweise", text: "Kurze Hinweise zu deinen Buchungen aufs Handy." },
  { key: "newMatches", title: "Neue Treffer", text: "Hinweis, wenn zu deiner Suche neue Profile dazukommen." },
  { key: "promotions", title: "Aktionen", text: "Gelegentlich Angebote und Neuigkeiten." },
];

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  completed: "Abgeschlossen",
  cancelled: "Storniert",
};

const STATUS_TONE: Record<Booking["status"], string> = {
  pending: "bg-butter",
  confirmed: "bg-minze",
  completed: "bg-himmel",
  cancelled: "bg-blush",
};

const FIELD =
  "w-full rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-sm text-tinte placeholder:text-tinte-soft/70 focus:border-kirsche outline-none disabled:bg-fels disabled:text-tinte-soft";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Speicher nicht verfügbar, Eingaben bleiben nur in dieser Sitzung */
  }
}

export default function AccountSettings() {
  const [user, setUser] = useState<UserData>(EMPTY_USER);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUser({ ...EMPTY_USER, ...readJson<Partial<UserData>>("user", {}) });
    setBookings(readJson<Booking[]>("bookings", []));
    setNotifications({ ...DEFAULT_NOTIFICATIONS, ...readJson<Partial<typeof DEFAULT_NOTIFICATIONS>>("iwsn_notifications", {}) });
    setFavoriteCount(readJson<unknown[]>("ch_favorite_profiles", []).length);
  }, []);

  const handleSaveProfile = () => {
    writeJson("user", user);
    setEditMode(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const cancelBooking = (code: string) => {
    const updated = bookings.map((b) => (b.confirmationCode === code ? { ...b, status: "cancelled" as const } : b));
    setBookings(updated);
    writeJson("bookings", updated);
  };

  const toggleNotification = (key: NotificationKey, value: boolean) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    writeJson("iwsn_notifications", next);
  };

  const trigger =
    "rounded-xl px-4 py-2 text-[13px] font-extrabold text-tinte-soft data-[state=active]:bg-kirsche data-[state=active]:text-white data-[state=active]:shadow-none";

  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO
        title="Mein Konto | iWantSexNow.ch"
        description="Deine Angaben, Merkliste, Buchungen und Benachrichtigungen an einem Ort."
      />
      <LuxuryHeader />

      <PageIntro
        tone="flieder"
        note="Alles an einem Ort"
        art="none"
        title={<>Mein Konto</>}
        lead={<>Deine Angaben, deine Merkliste und deine Buchungen. Gespeichert wird nur auf diesem Gerät.</>}
      />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1.5 justify-start rounded-2xl bg-white border border-linie p-1.5">
            <TabsTrigger value="profile" className={trigger}>Profil</TabsTrigger>
            <TabsTrigger value="favorites" className={trigger}>Merkliste</TabsTrigger>
            <TabsTrigger value="bookings" className={trigger}>Buchungen</TabsTrigger>
            <TabsTrigger value="notifications" className={trigger}>Benachrichtigungen</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-display font-bold">Deine Angaben</h2>
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] px-5 py-2.5 transition"
                  >
                    Bearbeiten
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] px-5 py-2.5 transition"
                    >
                      Speichern
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="rounded-xl border border-tinte/30 text-tinte font-bold text-[13px] px-5 py-2.5 hover:bg-fels transition"
                    >
                      Abbrechen
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div role="status" className="rounded-xl bg-minze px-4 py-3 text-[13px] font-bold">
                  Gespeichert.
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
                <label className="block">
                  <span className="block text-[13px] font-bold mb-1.5">Name</span>
                  <input className={FIELD} value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} disabled={!editMode} placeholder="Vorname oder Anzeigename" autoComplete="name" />
                </label>
                <label className="block">
                  <span className="block text-[13px] font-bold mb-1.5">E-Mail</span>
                  <input className={FIELD} type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} disabled={!editMode} placeholder="name@beispiel.ch" autoComplete="email" />
                </label>
                <label className="block">
                  <span className="block text-[13px] font-bold mb-1.5">Telefon</span>
                  <input className={FIELD} type="tel" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} disabled={!editMode} placeholder="+41 79 …" autoComplete="tel" />
                </label>
                <label className="block">
                  <span className="block text-[13px] font-bold mb-1.5">Ort</span>
                  <input className={FIELD} value={user.city} onChange={(e) => setUser({ ...user, city: e.target.value })} disabled={!editMode} placeholder="z.B. Zürich" autoComplete="address-level2" />
                </label>
              </div>
              <label className="block">
                <span className="block text-[13px] font-bold mb-1.5">Über dich</span>
                <textarea className={FIELD} rows={4} value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} disabled={!editMode} placeholder="Ein, zwei Sätze, wenn du magst." />
              </label>
            </section>
          </TabsContent>

          <TabsContent value="favorites">
            <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-4 text-center">
              <h2 className="text-2xl font-display font-bold">Deine Merkliste</h2>
              <p className="text-tinte-soft text-sm leading-relaxed">
                {favoriteCount > 0
                  ? `Du hast ${favoriteCount} ${favoriteCount === 1 ? "Profil" : "Profile"} gemerkt.`
                  : "Noch nichts gemerkt. Tipp aufs Herz bei einem Profil, dann taucht es hier auf."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/favorites" className="rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] px-6 py-3 transition">
                  Merkliste öffnen
                </Link>
                <Link href="/search" className="rounded-xl border border-tinte/30 font-bold text-[13px] px-6 py-3 hover:bg-fels transition">
                  Profile suchen
                </Link>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="bookings">
            <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-5">
              <h2 className="text-2xl font-display font-bold">Deine Buchungen ({bookings.length})</h2>
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((b) => (
                    <li key={b.confirmationCode} className="rounded-2xl border border-linie p-5 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-display font-bold">{b.escortName}</h3>
                            <span className={`rounded-full px-3 py-0.5 text-[12px] font-extrabold ${STATUS_TONE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
                          </div>
                          <p className="text-[13px] text-tinte-soft">
                            Bestätigungscode: <span className="font-mono font-bold text-tinte">{b.confirmationCode}</span>
                          </p>
                        </div>
                        {b.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => cancelBooking(b.confirmationCode)}
                            className="rounded-xl border border-kirsche-tief text-kirsche-tief font-bold text-[13px] px-4 py-2 hover:bg-blush transition"
                          >
                            Stornieren
                          </button>
                        )}
                      </div>
                      <dl className="grid sm:grid-cols-3 gap-3 text-[13px]">
                        <div><dt className="text-tinte-soft">Datum</dt><dd className="font-bold">{b.date}</dd></div>
                        <div><dt className="text-tinte-soft">Zeit</dt><dd className="font-bold">{b.time}</dd></div>
                        <div><dt className="text-tinte-soft">Dauer</dt><dd className="font-bold">{b.duration}</dd></div>
                      </dl>
                      <p className="text-[12px] text-tinte-soft">Gebucht am {new Date(b.createdAt).toLocaleString("de-CH")}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <p className="text-tinte-soft text-sm">Noch keine Buchungen. Sobald du eine machst, steht sie hier.</p>
                  <Link href="/search" className="inline-block rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] px-6 py-3 transition">
                    Profile suchen
                  </Link>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="notifications">
            <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-5">
              <h2 className="text-2xl font-display font-bold">Benachrichtigungen</h2>
              <ul className="space-y-3">
                {NOTIFICATION_ROWS.map((row) => (
                  <li key={row.key} className="flex items-center justify-between gap-4 rounded-2xl bg-papier border border-linie p-4">
                    <div>
                      <h3 className="font-bold text-sm">{row.title}</h3>
                      <p className="text-[13px] text-tinte-soft">{row.text}</p>
                    </div>
                    <Switch
                      aria-label={row.title}
                      checked={notifications[row.key]}
                      onCheckedChange={(checked) => toggleNotification(row.key, checked)}
                      className="data-[state=checked]:bg-kirsche data-[state=unchecked]:bg-tinte/25"
                    />
                  </li>
                ))}
              </ul>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      <CorporateFooter light />
    </div>
  );
}
