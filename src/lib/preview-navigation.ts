/** Only destinations implemented in the public preview belong in navigation. */
export const previewNavigation = [
  {
    label: "Demo entdecken",
    items: [
      { label: "Inserate-Katalog (Demo)", href: "/search" },
      { label: "Beispielprofile", href: "/members" },
      { label: "Städte-Vorschau", href: "/search" },
      { label: "Demo-Übersicht", href: "/demo-accounts" },
    ],
  },
  {
    label: "Städte",
    items: [
      { label: "Zürich (Demo)", href: "/escort-zurich" },
      { label: "Genf (Demo)", href: "/escort-geneva" },
      { label: "Basel (Demo)", href: "/escort-basel" },
      { label: "Bern (Demo)", href: "/escort-bern" },
      { label: "Lausanne (Demo)", href: "/escort-lausanne" },
    ],
  },
  {
    label: "In Vorbereitung",
    items: [
      { label: "Nachrichten – noch nicht aktiv", href: "/messages" },
      { label: "Inserate – noch nicht aktiv", href: "/create-post" },
      { label: "Profilprüfung – noch nicht aktiv", href: "/verify" },
      { label: "Premium – noch nicht aktiv", href: "/premium" },
    ],
  },
  {
    label: "Informationen",
    items: [
      { label: "Über die Vorschau", href: "/about" },
      { label: "Häufige Fragen", href: "/faq" },
      { label: "Sicherheit", href: "/safety" },
      { label: "Kontaktstatus", href: "/contact" },
      { label: "Betreiberangaben – in Vorbereitung", href: "/imprint" },
      { label: "Datenschutzhinweis (Vorschau)", href: "/privacy" },
      { label: "Nutzungsbedingungen (Vorschau)", href: "/terms" },
    ],
  },
];
