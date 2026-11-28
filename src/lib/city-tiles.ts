import fs from "node:fs";
import path from "node:path";

export type CityTileSources = { GE: string | null; BE: string | null };

const FILES = { GE: "city-ge_500x400.webp", BE: "city-be_500x400.webp" } as const;

/** Local city photos when those files are actually in public/images/cities. */
export function cityTileSources(directory = path.join(process.cwd(), "public", "images", "cities")): CityTileSources {
  const sources: CityTileSources = { GE: null, BE: null };
  for (const canton of ["GE", "BE"] as const) {
    const filename = FILES[canton];
    sources[canton] = fs.existsSync(path.join(directory, filename)) ? `/images/cities/${filename}` : null;
  }
  return sources;
}
