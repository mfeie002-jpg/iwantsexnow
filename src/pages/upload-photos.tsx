import { useState } from "react";
import { useRouter } from "next/router";
import { Camera, Upload, X } from "lucide-react";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { SEO } from "@/components/SEO";

const MAX_PHOTOS = 6;

const TIPS = [
  "Klares Licht, Gesicht gut erkennbar",
  "Keine Gruppenfotos und keine Filter",
  "Nur du selbst auf dem Bild",
  "Das erste Foto wird dein Titelbild",
];

export default function UploadPhotos() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files)
      .slice(0, MAX_PHOTOS)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, reader.result as string]));
        };
        reader.readAsDataURL(file);
      });
    e.target.value = "";
  };

  const removePhoto = (index: number) => setPhotos((prev) => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    try {
      localStorage.setItem("userPhotos", JSON.stringify(photos));
    } catch {
      /* storage can be unavailable (private mode); the redirect still works */
    }
    setSaved(true);
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-papier text-tinte">
      <SEO title="Fotos hochladen | iWantSexNow.ch" description="Lade bis zu sechs Fotos für dein Direktprofil hoch." />
      <LuxuryHeader />
      <PageIntro
        tone="blush"
        note="Zeig dich von deiner besten Seite"
        title="Fotos hochladen"
        lead="Profile mit Fotos bekommen deutlich mehr Anfragen. Bis zu sechs Bilder, du bestimmst die Reihenfolge."
      />

      <main className="relative z-10 mx-auto -mt-6 max-w-4xl px-4 pb-14 sm:px-6">
        <section className="rounded-2xl border-2 border-tinte bg-white p-5 shadow-[0_5px_0_rgba(30,34,71,0.9)] sm:p-8">
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {photos.map((photo, index) => (
              <li key={index} className="polaroid relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`Foto ${index + 1}`} className="h-56 w-full rounded-sm object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label={`Foto ${index + 1} entfernen`}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-tinte shadow-[0_2px_0_rgba(30,34,71,0.9)] ring-2 ring-tinte hover:bg-blush focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kirsche"
                >
                  <X size={18} />
                </button>
                {index === 0 && <span className="hand absolute bottom-1 left-3 text-xl text-kirsche-tief">Titelbild</span>}
              </li>
            ))}

            {photos.length < MAX_PHOTOS && (
              <li>
                <label htmlFor="photo-input" className="flex h-full min-h-[14rem] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-tinte/40 bg-papier p-4 text-center transition hover:border-kirsche hover:bg-blush has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kirsche">
                  <input id="photo-input" type="file" accept="image/*" multiple onChange={handleFileSelect} className="sr-only" />
                  <Upload size={36} className="mb-3 text-kirsche" aria-hidden="true" />
                  <span className="font-bold">Fotos auswählen</span>
                  <span className="mt-1 text-sm text-tinte-soft">PNG oder JPG, bis 10 MB</span>
                </label>
              </li>
            )}
          </ul>

          <div className="mt-8 flex gap-4 rounded-2xl bg-himmel/60 p-5">
            <Camera className="mt-0.5 shrink-0 text-tinte" size={24} aria-hidden="true" />
            <div>
              <h2 className="font-display text-lg font-extrabold">So wirken deine Fotos</h2>
              <ul className="mt-2 space-y-1 text-[15px] text-tinte/85">
                {TIPS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={photos.length === 0 || saved}
              className="brass-button min-h-[54px] flex-1 px-6 text-base disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saved ? "Gespeichert" : "Fotos speichern"}
            </button>
            <button type="button" onClick={() => router.push("/profile")} className="emerald-button min-h-[54px] px-6 text-base">
              Abbrechen
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
