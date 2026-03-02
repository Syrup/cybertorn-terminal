/**
 * Flow test: simulates exact data as returned by Torn API
 * to verify parseCatalog, getStats, getAmmoForItem work end-to-end.
 *
 * Run: npx tsx src/lib/equipment-flow-test.ts
 */
import {
  buildCatalogById,
  buildCatalogByName,
  getCatalogDetails,
  getStats,
  getAmmoForItem,
  hasStats,
  isClothing,
  type EquipmentItemLike,
  type TornItemCatalogEntry,
  type TornItemDetails,
} from "./equipment-utils";

// --- Helpers ---
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseCatalog = (payload: unknown): TornItemCatalogEntry[] => {
  if (!isRecord(payload)) return [];
  const rawItems = payload.items ?? payload;
  if (Array.isArray(rawItems)) {
    return rawItems
      .filter(
        (entry): entry is Record<string, unknown> =>
          isRecord(entry) && typeof entry.id === "number"
      )
      .map((entry) => ({
        id: entry.id as number,
        name: typeof entry.name === "string" ? entry.name : "",
        type: typeof entry.type === "string" ? entry.type : "",
        sub_type: typeof entry.sub_type === "string" ? entry.sub_type : null,
        details: isRecord(entry.details)
          ? (entry.details as TornItemDetails)
          : null,
      }));
  }
  if (isRecord(rawItems)) {
    return Object.values(rawItems)
      .filter(
        (entry): entry is Record<string, unknown> =>
          isRecord(entry) && typeof entry.id === "number"
      )
      .map((entry) => ({
        id: entry.id as number,
        name: typeof entry.name === "string" ? entry.name : "",
        type: typeof entry.type === "string" ? entry.type : "",
        sub_type: typeof entry.sub_type === "string" ? entry.sub_type : null,
        details: isRecord(entry.details)
          ? (entry.details as TornItemDetails)
          : null,
      }));
  }
  return [];
};

// ===== EXACT API RESPONSE: /user?selections=equipment =====
const userEquipmentResponse = {
  equipment: [
    {
      id: 174,
      name: "XM8 Rifle",
      uid: 18047037048,
      type: "Weapon",
      sub_type: "Rifle",
      stats: { damage: 50.06, accuracy: 59.39, armor: null, quality: 34.47 },
      bonuses: [],
      rarity: null,
      slot: 1,
    },
    {
      id: 218,
      name: "Flak Jacket",
      uid: 18043005100,
      type: "Armor",
      sub_type: "Body Armor",
      stats: { damage: null, accuracy: null, armor: 22.5, quality: 18.0 },
      bonuses: [],
      rarity: null,
      slot: 5,
    },
  ],
  clothing: [
    {
      id: 928,
      name: "Bermudas",
      uid: 18043005322,
      type: "Clothing",
    },
  ],
};

// ===== EXACT API RESPONSE: /torn/174,218/items =====
const tornItemsResponse = {
  items: [
    {
      id: 174,
      name: "XM8 Rifle",
      type: "Primary",
      sub_type: null,
      details: {
        category: "Primary",
        stealth_level: 2.6,
        base_stats: { damage: 50, accuracy: 56, armor: 0 },
        ammo: {
          id: 5,
          name: "5.56mm Rifle Round",
          magazine_rounds: 30,
          rate_of_fire: { minimum: 5, maximum: 20 },
        },
        mods: [1, 2, 3],
      },
    },
    {
      id: 218,
      name: "Flak Jacket",
      type: "Armor",
      sub_type: null,
      details: {
        category: "Body Armor",
        stealth_level: 0,
        base_stats: { damage: 0, accuracy: 0, armor: 20 },
        ammo: null,
        mods: [],
      },
    },
  ],
};

// ===== EXACT API RESPONSE: /user?selections=ammo =====
const userAmmoResponse = {
  ammo: [
    {
      id: 5,
      name: "5.56mm Rifle Round",
      types: [
        { name: "Standard", quantity: 120, equipped: true },
        { name: "Hollow Point", quantity: 30, equipped: false },
      ],
    },
  ],
};

// ===== RUN TESTS =====
let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

console.log("\n=== TEST 1: Equipment items have stats directly ===");
{
  const items = userEquipmentResponse.equipment;
  const weapon = items[0];
  console.log("  weapon.stats:", JSON.stringify(weapon.stats));
  assert(weapon.stats !== undefined, "weapon has stats property");
  assert(weapon.stats.damage === 50.06, "damage = 50.06", String(weapon.stats.damage));
  assert(weapon.stats.accuracy === 59.39, "accuracy = 59.39", String(weapon.stats.accuracy));
  assert(weapon.stats.armor === null, "armor = null", String(weapon.stats.armor));
  assert(weapon.stats.quality === 34.47, "quality = 34.47", String(weapon.stats.quality));
}

console.log("\n=== TEST 2: hasStats works on real stats ===");
{
  const weapon = userEquipmentResponse.equipment[0];
  const result = hasStats(weapon.stats);
  console.log("  hasStats(weapon.stats):", result);
  assert(result === true, "hasStats returns true for weapon with stats");

  const armor = userEquipmentResponse.equipment[1];
  const armorResult = hasStats(armor.stats);
  console.log("  hasStats(armor.stats):", armorResult);
  assert(armorResult === true, "hasStats returns true for armor with stats");
}

console.log("\n=== TEST 3: getStats prefers item.stats over catalog ===");
{
  const weapon = userEquipmentResponse.equipment[0] as unknown as EquipmentItemLike;
  const statsResult = getStats(weapon, null);
  console.log("  getStats(weapon, null):", JSON.stringify(statsResult));
  assert(statsResult !== null, "getStats returns non-null");
  assert(statsResult?.damage === 50.06, "damage from item.stats", String(statsResult?.damage));
  assert(statsResult?.quality === 34.47, "quality from item.stats", String(statsResult?.quality));
}

console.log("\n=== TEST 4: parseCatalog with real torn items response ===");
{
  const catalog = parseCatalog(tornItemsResponse);
  console.log("  catalog.length:", catalog.length);
  assert(catalog.length === 2, "parsed 2 items", String(catalog.length));

  const rifle = catalog.find((c) => c.id === 174);
  console.log("  rifle:", JSON.stringify(rifle, null, 2));
  assert(rifle !== undefined, "found rifle in catalog");
  assert(rifle?.details !== null, "rifle has details", JSON.stringify(rifle?.details));
  assert(rifle?.details?.ammo !== null && rifle?.details?.ammo !== undefined, "rifle has ammo in details", JSON.stringify(rifle?.details?.ammo));
  assert(rifle?.details?.ammo?.id === 5, "ammo id = 5", String(rifle?.details?.ammo?.id));
  assert(rifle?.details?.ammo?.name === "5.56mm Rifle Round", "ammo name correct");
  assert(rifle?.details?.base_stats?.damage === 50, "base_stats.damage = 50", String(rifle?.details?.base_stats?.damage));
}

console.log("\n=== TEST 5: Full flow — getStats + getAmmoForItem with catalog ===");
{
  const catalog = parseCatalog(tornItemsResponse);
  const byId = buildCatalogById(catalog);
  const byName = buildCatalogByName(catalog);

  const weapon = userEquipmentResponse.equipment[0] as unknown as EquipmentItemLike;
  const details = getCatalogDetails(weapon, byId, byName);
  console.log("  details for weapon:", JSON.stringify(details, null, 2));
  assert(details !== null, "getCatalogDetails returns details");

  const stats = getStats(weapon, details);
  console.log("  getStats:", JSON.stringify(stats));
  assert(stats?.damage === 50.06, "stats.damage from item.stats (priority)");

  const ammoResult = getAmmoForItem(weapon, details);
  console.log("  getAmmoForItem:", JSON.stringify(ammoResult));
  assert(ammoResult !== null, "ammo found for weapon");
  assert(ammoResult?.id === 5, "ammo id = 5", String(ammoResult?.id));
  assert(ammoResult?.name === "5.56mm Rifle Round", "ammo name correct");
}

console.log("\n=== TEST 6: isClothing classification ===");
{
  const weapon = userEquipmentResponse.equipment[0];
  const armor = userEquipmentResponse.equipment[1];
  const clothing = userEquipmentResponse.clothing[0];

  assert(!isClothing(weapon.type), "Weapon is not clothing");
  assert(!isClothing(armor.type), "Armor is not clothing");
  assert(isClothing(clothing.type), "Clothing is clothing");
}

console.log("\n=== TEST 7: Ammo lookup simulation ===");
{
  const ammoMap = new Map<number, typeof userAmmoResponse.ammo[0]>();
  for (const entry of userAmmoResponse.ammo) {
    ammoMap.set(entry.id, entry);
  }

  const catalog = parseCatalog(tornItemsResponse);
  const byId = buildCatalogById(catalog);
  const byName = buildCatalogByName(catalog);

  const weapon = userEquipmentResponse.equipment[0] as unknown as EquipmentItemLike;
  const details = getCatalogDetails(weapon, byId, byName);
  const ammoResult = getAmmoForItem(weapon, details);

  assert(ammoResult !== null, "weapon has ammo spec");
  if (ammoResult) {
    const userAmmo = ammoMap.get(ammoResult.id);
    console.log("  userAmmo:", JSON.stringify(userAmmo));
    assert(userAmmo !== undefined, "user owns this ammo");
    assert(userAmmo?.types.length === 2, "2 ammo types");
    assert(userAmmo?.types[0].quantity === 120, "Standard qty = 120");
  }
}

console.log("\n=== TEST 8: getAmmoForItem — weapon without catalog (no weapon.ammo) ===");
{
  // The real API equipment items do NOT have weapon.ammo — that comes from catalog details
  const weapon = userEquipmentResponse.equipment[0] as unknown as EquipmentItemLike;
  console.log("  weapon.weapon:", (weapon as Record<string, unknown>).weapon);
  const ammoWithoutCatalog = getAmmoForItem(weapon, null);
  console.log("  getAmmoForItem(weapon, null):", ammoWithoutCatalog);
  assert(ammoWithoutCatalog === null, "no ammo without catalog details", JSON.stringify(ammoWithoutCatalog));
}

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===\n`);
process.exit(failed > 0 ? 1 : 0);
