/** Information and inactive status destinations only; no fictional inventory. */
export const previewNavigation = [
  {
    label: "Funktionsstatus",
    items: [
      { label: "Inserate – noch nicht aktiv", href: "/search" },
      { label: "Nachrichten – noch nicht aktiv", href: "/messages" },
      { label: "Veröffentlichung – noch nicht aktiv", href: "/create-post" },
      { label: "Profilprüfung – noch nicht aktiv", href: "/verify" },
    ],
  },
  {
    label: "Informationen",
    items: [
      { label: "Über die Plattform", href: "/about" },
      { label: "Häufige Fragen", href: "/faq" },
      { label: "Sicherheit", href: "/safety" },
      { label: "Kontaktstatus", href: "/contact" },
      { label: "Betreiberangaben – in Vorbereitung", href: "/imprint" },
      { label: "Datenschutzhinweis", href: "/privacy" },
      { label: "Nutzungsbedingungen", href: "/terms" },
    ],
  },
];
