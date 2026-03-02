import {
  buildCatalogById,
  buildCatalogByName,
  getCatalogDetails,
  getItemId,
  getStats,
  getAmmoForItem,
  type EquipmentItemLike,
  type TornItemCatalogEntry,
} from "./equipment-utils";

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

const expectTruthy = (value: unknown, label: string) => {
  if (!value) throw new Error(`${label} was falsy`);
};

const expectEqual = (value: unknown, expected: unknown, label: string) => {
  if (value !== expected) throw new Error(`${label} expected ${expected} but got ${value}`);
};

const testGetItemId = () => {
  expectEqual(getItemId({ id: 1 }), 1, "id");
  expectEqual(getItemId({}), null, "no id");
};

const testCatalogLookupById = () => {
  const details = resolve({ id: 1001 });
  expectTruthy(details, "details by id");
  expectEqual(details?.ammo?.id, 2001, "ammo id by id");
};

const testCatalogLookupByName = () => {
  const details = resolve({ name: "XM8 Rifle" });
  expectTruthy(details, "details by name");
  expectEqual(details?.ammo?.id, 2001, "ammo id by name");
};

const testStatsFallback = () => {
  const details = resolve({ name: "XM8 Rifle" });
  const stats = getStats({ name: "XM8 Rifle" }, details);
  expectEqual(stats?.damage, 65, "stats damage fallback");
};

const testAmmoFallback = () => {
  const details = resolve({ name: "Crossbow" });
  const ammoMatch = getAmmoForItem({ name: "Crossbow" }, details);
  expectEqual(ammoMatch?.name, "Crossbow Bolts", "ammo fallback");
};

const run = () => {
  testGetItemId();
  testCatalogLookupById();
  testCatalogLookupByName();
  testStatsFallback();
  testAmmoFallback();
};

run();
