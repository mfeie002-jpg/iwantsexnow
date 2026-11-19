import React from "react";
import type { CantonKey, CategoryKey } from "@/components/visuals";

export type IntroTone = "blush" | "butter" | "minze" | "himmel" | "flieder";
export type IntroArt =
  | "hanger"
  | "verified"
  | "search"
  | "compare"
  | "book"
  | "none"
  | `canton:${CantonKey}`
  | `category:${CategoryKey}`;

const ART_IMAGE: Partial<Record<IntroArt, { src: string; alt: string }>> = {
  search: { src: "/editorial/editorial-zurich.jpg", alt: "" },
  compare: { src: "/editorial/editorial-still.jpg", alt: "" },
  book: { src: "/editorial/editorial-salon.jpg", alt: "" },
  hanger: { src: "/editorial/editorial-salon.jpg", alt: "" },
  "canton:zh": { src: "/editorial/editorial-zurich.jpg", alt: "" },
  "canton:zg": { src: "/editorial/editorial-alps.jpg", alt: "" },
  "canton:lu": { src: "/editorial/editorial-alps.jpg", alt: "" },
  "canton:ge": { src: "/editorial/editorial-zurich.jpg", alt: "" },
  "canton:vd": { src: "/editorial/editorial-alps.jpg", alt: "" },
  "canton:ti": { src: "/editorial/editorial-alps.jpg", alt: "" },
  "canton:bs": { src: "/editorial/editorial-zurich.jpg", alt: "" },
  "canton:be": { src: "/editorial/editorial-alps.jpg", alt: "" },
  "category:clubs": { src: "/editorial/editorial-salon.jpg", alt: "" },
  "category:massage": { src: "/editorial/editorial-still.jpg", alt: "" },
  "category:female": { src: "/editorial/editorial-zurich.jpg", alt: "" },
};

/**
 * Editorial page masthead. Tone and art stay in the public props so existing
 * pages keep compiling; the picture is a photograph when we have one.
 */
export function PageIntro({
  note,
  title,
  lead,
  art = "none",
  children,
}: {
  tone?: IntroTone;
  note?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  art?: IntroArt;
  children?: React.ReactNode;
}) {
  const picture = art !== "none" ? ART_IMAGE[art] : undefined;

  return (
    <header className="mast">
      <div className={"mast-grid" + (picture ? " mast-grid-photo" : "")}>
        <div>
          {note ? <p className="kicker">{note}</p> : null}
          <h1>{title}</h1>
          {lead ? <p className="dek">{lead}</p> : null}
          {children ? <div className="mast-actions">{children}</div> : null}
        </div>
        {picture ? (
          <figure className="mast-figure">
            <img src={picture.src} alt={picture.alt} loading="lazy" decoding="async" />
          </figure>
        ) : null}
      </div>
    </header>
  );
}

export default PageIntro;
