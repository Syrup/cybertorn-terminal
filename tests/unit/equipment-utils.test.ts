import { test, expect } from "bun:test";
import {
  buildCatalogById,
  buildCatalogByName,
  getCatalogDetails,
  getItemId,
  getStats,
  getAmmoForItem,
  type EquipmentItemLike,
  type TornItemCatalogEntry,
} from "../../src/lib/equipment-utils";

const ammo = {
  id: 2001,
  name: "XM8 Rifle Ammo",
  magazine_rounds: 30,
  rate_of_fire: { minimum: 1, maximum: 3 },
};

const catalog: TornItemCatalogEntry[] = [
  {
    id: 1001,
    name: "XM8 Rifle",
    type: "Weapon",
    sub_type: "Rifle",
    details: {
      base_stats: { damage: 65, accuracy: 45, armor: null },
      ammo,
    },
  },
  {
    id: 1002,
    name: "Crossbow",
    type: "Weapon",
    sub_type: "Shotgun",
    details: {
      base_stats: { damage: 80, accuracy: 32, armor: null },
      ammo: { ...ammo, id: 2002, name: "Crossbow Bolts" },
    },
  },
];

const byId = buildCatalogById(catalog);
const byName = buildCatalogByName(catalog);

const resolve = (item: EquipmentItemLike) => getCatalogDetails(item, byId, byName);

test("getItemId", () => {
  expect(getItemId({ id: 1 })).toBe(1);
  expect(getItemId({})).toBeNull();
});

test("CatalogLookupById", () => {
  const details = resolve({ id: 1001 });
  expect(details).toBeTruthy();
  expect(details?.ammo?.id).toBe(2001);
});

test("CatalogLookupByName", () => {
  const details = resolve({ name: "XM8 Rifle" });
  expect(details).toBeTruthy();
  expect(details?.ammo?.id).toBe(2001);
});

test("StatsFallback", () => {
  const details = resolve({ name: "XM8 Rifle" });
  const stats = getStats({ name: "XM8 Rifle" }, details);
  expect(stats?.damage).toBe(65);
});

test("AmmoFallback", () => {
  const details = resolve({ name: "Crossbow" });
  const ammoMatch = getAmmoForItem({ name: "Crossbow" }, details);
  expect(ammoMatch?.name).toBe("Crossbow Bolts");
});
