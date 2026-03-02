"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTorn } from "@/lib/torn-context";
import {
  buildCatalogById,
  buildCatalogByName,
  getAmmoForItem,
  getCatalogDetails,
  getStats,
  hasStats,
  isClothing,
  type EquipmentItemLike,
  type EquipmentStats,
  type EquipmentAmmo,
  type TornItemCatalogEntry,
} from "@/lib/equipment-utils";

// V2 /user/equipment response types
type EquipmentItem = {
  id: number;
  uid: number;
  name: string;
  type: string;
  sub_type: string | null;
  slot: number;
  stats: EquipmentStats;
  bonuses: Array<{ description?: string; value?: number }>;
  rarity: string | null;
};

type ClothingItem = {
  id: number;
  uid: number;
  name: string;
  type: string;
};

type EquipmentResponse = {
  equipment?: EquipmentItem[];
  clothing?: ClothingItem[];
};

// V2 /torn/{ids}/items detail types (for ammo lookup)
type TornItemDetails = {
  base_stats?: {
    damage?: number | null;
    accuracy?: number | null;
    armor?: number | null;
  };
  ammo?: EquipmentAmmo | null;
};

// V2 /user/ammo response types
type UserAmmoType = {
  name: string;
  quantity: number;
  equipped: boolean;
};

type UserAmmo = {
  id: number;
  name: string;
  types: UserAmmoType[];
};

type UserAmmoResponse = {
  ammo?: UserAmmo[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parseCatalog = (payload: unknown): TornItemCatalogEntry[] => {
  if (!isRecord(payload)) return [];
  const rawItems = payload.items ?? payload;
  if (Array.isArray(rawItems)) {
    return rawItems
      .filter((entry): entry is Record<string, unknown> =>
        isRecord(entry) && typeof entry.id === "number"
      )
      .map((entry) => ({
        id: entry.id as number,
        name: typeof entry.name === "string" ? entry.name : "",
        type: typeof entry.type === "string" ? entry.type : "",
        sub_type: typeof entry.sub_type === "string" ? entry.sub_type : null,
        details: isRecord(entry.details) ? (entry.details as TornItemDetails) : null,
      }));
  }
  if (isRecord(rawItems)) {
    return Object.values(rawItems)
      .filter((entry): entry is Record<string, unknown> =>
        isRecord(entry) && typeof entry.id === "number"
      )
      .map((entry) => ({
        id: entry.id as number,
        name: typeof entry.name === "string" ? entry.name : "",
        type: typeof entry.type === "string" ? entry.type : "",
        sub_type: typeof entry.sub_type === "string" ? entry.sub_type : null,
        details: isRecord(entry.details) ? (entry.details as TornItemDetails) : null,
      }));
  }
  return [];
};

export function Equipment() {
  const { apiKey, fetchSection } = useTorn();
  const [data, setData] = useState<EquipmentResponse | null>(null);
  const [ammoData, setAmmoData] = useState<UserAmmoResponse | null>(null);
  const [catalog, setCatalog] = useState<TornItemCatalogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    let active = true;

    const loadEquipment = async () => {
      setLoading(true);
      setData(null);
      setAmmoData(null);
      try {
        const [equipmentRes, ammoRes] = await Promise.all([
          fetchSection((client) => client.getUserEquipment()),
          fetchSection((client) => client.getUserAmmo()),
        ]);
        if (equipmentRes?.data && active) {
          setData(equipmentRes.data as EquipmentResponse);
        }
        if (ammoRes?.data && active) {
          setAmmoData(ammoRes.data as UserAmmoResponse);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEquipment();
    return () => {
      active = false;
    };
  }, [apiKey, fetchSection]);

  const equipmentItems = useMemo<EquipmentItem[]>(() => data?.equipment ?? [], [data]);
  const clothingItems = useMemo<ClothingItem[]>(() => data?.clothing ?? [], [data]);
  const itemIds = useMemo(() => {
    const ids = new Set<number>();
    for (const item of equipmentItems) {
      if (typeof item.id === "number") ids.add(item.id);
    }
    for (const item of clothingItems) {
      if (typeof item.id === "number") ids.add(item.id);
    }
    return Array.from(ids);
  }, [equipmentItems, clothingItems]);

  useEffect(() => {
    if (!apiKey || itemIds.length === 0) return;
    let active = true;
    const loadCatalog = async () => {
      try {
        const res = await fetchSection((client) => client.fetchTornItemsByIds(itemIds));
        if (!active) return;
        if (res?.data) {
          setCatalog(parseCatalog(res.data as unknown));
        }
      } catch {
        // catalog fetch failure is non-fatal — stats still come from equipment items directly
      }
    };
    void loadCatalog();
    return () => {
      active = false;
    };
  }, [apiKey, fetchSection, itemIds]);

  const ammoLookup = useMemo(() => {
    const map = new Map<number, UserAmmo>();
    for (const entry of ammoData?.ammo ?? []) {
      map.set(entry.id, entry);
    }
    return map;
  }, [ammoData]);

  const catalogById = useMemo(() => buildCatalogById(catalog), [catalog]);
  const catalogByName = useMemo(() => buildCatalogByName(catalog), [catalog]);

  const formatStat = (value?: number | null) =>
    value === null || value === undefined ? "-" : value.toFixed(2);

  const formatQuality = (value?: number | null) =>
    value === null || value === undefined ? "-" : `${value.toFixed(2)}%`;

  const renderAmmoMatch = (ammo: EquipmentAmmo | null | undefined) => {
    if (!ammo) return <span className="text-xs text-muted-foreground font-mono">NO AMMO</span>;
    const userAmmo = ammoLookup.get(ammo.id);
    if (!userAmmo) {
      return (
        <div className="text-xs font-mono text-muted-foreground">
          AMMO: {ammo.name} (ID {ammo.id})
          <div className="text-[10px] text-muted-foreground">NOT OWNED</div>
        </div>
      );
    }
    return (
      <div className="text-xs font-mono">
        <div>AMMO: {userAmmo.name}</div>
        <div className="text-[10px] text-muted-foreground">
          {userAmmo.types.map((type) => `${type.name}: ${type.quantity}${type.equipped ? " (EQ)" : ""}`).join(" | ")}
        </div>
      </div>
    );
  };

  const getDetails = (item: EquipmentItem | ClothingItem) =>
    getCatalogDetails(item as EquipmentItemLike, catalogById, catalogByName);

  const clothingFromEquipment = useMemo(
    () => equipmentItems.filter((item) => isClothing(item.type)),
    [equipmentItems]
  );
  const equipmentOnly = useMemo(
    () => equipmentItems.filter((item) => !isClothing(item.type)),
    [equipmentItems]
  );
  const clothingList = clothingItems.length > 0 ? clothingItems : clothingFromEquipment;
  const equipmentList = equipmentOnly;

  if (loading && !data) {
    return (
      <Card title="Equipment" icon={Shield} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono animate-pulse">
          LOADING EQUIPMENT...
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="Equipment" icon={Shield} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono">
          NO DATA LOADED
        </div>
      </Card>
    );
  }

  return (
    <Card title="Equipment" icon={Shield} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto max-h-[420px] p-3 space-y-3">
        <div className="text-[11px] font-mono text-muted-foreground uppercase">Weapons and Armor</div>
        {equipmentList.length === 0 ? (
          <div className="p-3 text-xs font-mono text-muted-foreground border border-border/50">EMPTY</div>
        ) : (
          <div className="space-y-2">
            {equipmentList.map((item, index) => {
              const stats = getStats(item as EquipmentItemLike, getDetails(item) as TornItemDetails | null);
              const open = hasStats(stats);
              return (
                <details key={`${item.uid ?? item.id ?? "equipment"}-${index}`} open={open} className="group border border-border/60 bg-muted/5">
                  <summary className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono uppercase text-muted-foreground cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60">
                    <span className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                      <span>{item.name ?? "Unknown"}</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground">{item.sub_type ?? item.type ?? "-"}</span>
                  </summary>
                  <div className="px-3 pb-3 pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="flex justify-between border border-border/50 px-2 py-1">
                        <span className="text-muted-foreground">DMG</span>
                        <span>{formatStat(stats?.damage)}</span>
                      </div>
                      <div className="flex justify-between border border-border/50 px-2 py-1">
                        <span className="text-muted-foreground">ACC</span>
                        <span>{formatStat(stats?.accuracy)}</span>
                      </div>
                      <div className="flex justify-between border border-border/50 px-2 py-1">
                        <span className="text-muted-foreground">ARM</span>
                        <span>{formatStat(stats?.armor)}</span>
                      </div>
                      <div className="flex justify-between border border-border/50 px-2 py-1">
                        <span className="text-muted-foreground">QLT</span>
                        <span>{formatQuality(stats?.quality)}</span>
                      </div>
                    </div>
                    {renderAmmoMatch(getAmmoForItem(item as EquipmentItemLike, getDetails(item) as TornItemDetails | null))}
                  </div>
                </details>
              );
            })}
          </div>
        )}

        <div className="text-[11px] font-mono text-muted-foreground uppercase pt-2">Clothing</div>
        {clothingList.length === 0 ? (
          <div className="p-3 text-xs font-mono text-muted-foreground border border-border/50">EMPTY</div>
        ) : (
          <div className="space-y-2">
            {clothingList.map((item, index) => (
              <details key={`${item.uid}-${index}`} className="group border border-border/60 bg-muted/5">
                <summary className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono uppercase text-muted-foreground cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60">
                  <span className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                    <span>{item.name ?? "Unknown"}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.type ?? "-"}</span>
                </summary>
                <div className="px-3 pb-3 pt-2">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="flex justify-between border border-border/50 px-2 py-1">
                      <span className="text-muted-foreground">ARM</span>
                      <span>{formatStat(getStats(item as EquipmentItemLike, getDetails(item) as TornItemDetails | null)?.armor)}</span>
                    </div>
                    <div className="flex justify-between border border-border/50 px-2 py-1">
                      <span className="text-muted-foreground">QLT</span>
                      <span>{formatQuality(getStats(item as EquipmentItemLike, getDetails(item) as TornItemDetails | null)?.quality)}</span>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
