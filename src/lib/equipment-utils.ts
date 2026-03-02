export type EquipmentStats = {
  damage?: number | null;
  accuracy?: number | null;
  armor?: number | null;
  quality?: number | null;
};

export type EquipmentAmmo = {
  id: number;
  name: string;
  magazine_rounds: number;
  rate_of_fire: {
    minimum: number;
    maximum: number;
  };
};

export type EquipmentItemLike = {
  id?: number;
  name?: string;
  type?: string;
  stats?: EquipmentStats;
};

export type TornItemDetails = {
  base_stats?: {
    damage?: number | null;
    accuracy?: number | null;
    armor?: number | null;
  };
  ammo?: EquipmentAmmo | null;
};

export type TornItemCatalogEntry = {
  id: number;
  name: string;
  type: string;
  sub_type?: string | null;
  details?: TornItemDetails | null;
};

export const isClothing = (itemType?: string) =>
  typeof itemType === "string" && itemType.toLowerCase() === "clothing";

export const getItemId = (item: EquipmentItemLike) =>
  item.id ?? null;

export const buildCatalogById = (catalog: TornItemCatalogEntry[]) => {
  const map = new Map<number, TornItemCatalogEntry>();
  for (const entry of catalog) {
    map.set(entry.id, entry);
  }
  return map;
};

export const buildCatalogByName = (catalog: TornItemCatalogEntry[]) => {
  const map = new Map<string, TornItemCatalogEntry>();
  for (const entry of catalog) {
    const key = entry.name.trim().toLowerCase();
    if (!map.has(key)) map.set(key, entry);
  }
  return map;
};

export const getCatalogEntry = (
  item: EquipmentItemLike,
  byId: Map<number, TornItemCatalogEntry>,
  byName: Map<string, TornItemCatalogEntry>
) => {
  const id = getItemId(item);
  if (id) return byId.get(id) ?? null;
  if (item.name) return byName.get(item.name.trim().toLowerCase()) ?? null;
  return null;
};

export const getCatalogDetails = (
  item: EquipmentItemLike,
  byId: Map<number, TornItemCatalogEntry>,
  byName: Map<string, TornItemCatalogEntry>
) => getCatalogEntry(item, byId, byName)?.details ?? null;

export const hasStats = (stats?: EquipmentStats | null) =>
  Boolean(stats && (stats.damage ?? stats.accuracy ?? stats.armor ?? stats.quality));

export const getStats = (
  item: EquipmentItemLike,
  details: TornItemDetails | null
) => {
  if (hasStats(item.stats)) return item.stats ?? null;
  if (details?.base_stats) {
    return {
      damage: details.base_stats.damage ?? null,
      accuracy: details.base_stats.accuracy ?? null,
      armor: details.base_stats.armor ?? null,
      quality: null,
    };
  }
  return null;
};

export const getAmmoForItem = (
  _item: EquipmentItemLike,
  details: TornItemDetails | null
) => details?.ammo ?? null;
