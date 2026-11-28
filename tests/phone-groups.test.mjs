import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { filterOffers, listingPhone, phoneListingRoles } from "../src/lib/night-catalogue.ts";

test("the same phone keeps one listing and links the other entries", () => {
  const offers = [
    { id: "plain", rawPhone: "079 111 22 33", sourcePortal: "xdate.ch", rawName: "A", city: "Zürich" },
    { id: "photo", rawPhone: "+41 79 111 22 33", sourcePortal: "fgirl.ch", rawName: "B", city: "Zürich", bio: "mehr Text", thumbnail: "https://images.fgirl.ch/real.jpg", gallery: ["https://images.fgirl.ch/real-2.jpg"] },
    { id: "solo", rawPhone: "", sourcePortal: "and6.com", rawName: "C" },
  ];
  const roles = phoneListingRoles(offers);
  assert.equal(roles.get("photo").hideFromListing, false);
  assert.deepEqual(roles.get("photo").alsoListed.map((item) => item.id), ["plain"]);
  assert.equal(roles.get("plain").hideFromListing, true);
  assert.equal(roles.get("plain").alsoListed[0].sourcePortal, "fgirl.ch");
  assert.equal(roles.get("solo").hideFromListing, false);
  const tagged = offers.map((offer) => ({ ...offer, ...roles.get(offer.id) }));
  assert.deepEqual(filterOffers(tagged).map((offer) => offer.id), ["photo", "solo"]);
});

test("vault phones collapse to 1007 numbers and the source file stays intact", () => {
  const path = new URL("../src/data/harvested-offers.json", import.meta.url);
  const before = fs.readFileSync(path);
  const offers = JSON.parse(before.toString("utf8"));
  const phones = offers.map(listingPhone).filter(Boolean);
  assert.equal(offers.length, 2589);
  assert.equal(new Set(phones).size, 1007);
  const roles = phoneListingRoles(offers);
  const shown = offers.filter((offer) => !roles.get(offer.id || offer.dedupClusterId)?.hideFromListing);
  assert.ok(shown.length < offers.length);
  assert.ok(shown.some((offer) => (roles.get(offer.id)?.alsoListed || []).length > 0));
  assert.equal(fs.readFileSync(path).equals(before), true);
});
