"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";


interface PointListing {
  cost: number;
  quantity: number;
  total_cost: number;
}

interface PointListingEntry extends PointListing {
  id: string;
}

export function MarketSection() {
  const { apiKey, fetchSection } = useTorn();
  const [pointsData, setPointsData] = useState<Record<string, PointListing> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) return;
    let active = true;

    const loadMarket = async () => {
      setLoading(true);
      try {
        const res = await fetchSection((client) => client.getPointsMarket());
        if (res?.data && active) {
          const d = res.data as Record<string, unknown>;
          if (d.pointsmarket) {
            setPointsData(d.pointsmarket as Record<string, PointListing>);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadMarket();
    return () => {
      active = false;
    };
  }, [apiKey, fetchSection]);

  if (loading && !pointsData) {
    return (
      <Card title="Points Market" icon={ShoppingBag} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono animate-pulse">
          LOADING MARKET DATA...
        </div>
      </Card>
    );
  }

  if (!pointsData) {
    return (
      <Card title="Points Market" icon={ShoppingBag} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono">
          NO DATA LOADED
        </div>
      </Card>
    );
  }

  // Sort by cost ascending (cheapest first)
  const listings: PointListingEntry[] = Object.entries(pointsData)
    .map(([id, listing]) => ({ id, ...listing }))
    .sort((a, b) => a.cost - b.cost)
    .slice(0, 10);

  const averagePrice = listings.length > 0 
    ? listings.reduce((acc, curr) => acc + curr.cost, 0) / listings.length 
    : 0;

  return (
    <Card title="Points Market" icon={ShoppingBag} className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-end">
          <div className="text-xs text-muted-foreground uppercase font-mono">Avg Price (Top 10)</div>
          <div className="text-lg font-bold tabular-nums">${Math.round(averagePrice).toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[250px] p-0">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-muted/30 sticky top-0 backdrop-blur-sm">
            <tr>
              <th className="p-2 font-normal text-muted-foreground">COST/POINT</th>
              <th className="p-2 font-normal text-muted-foreground text-right">QTY</th>
              <th className="p-2 font-normal text-muted-foreground text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
              <td className="p-2 font-bold tabular-nums text-green-500">${listing.cost.toLocaleString()}</td>
              <td className="p-2 text-right tabular-nums">{listing.quantity.toLocaleString()}</td>
              <td className="p-2 text-right tabular-nums text-muted-foreground">${listing.total_cost.toLocaleString()}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
