"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

interface ItemListing {
  name: string;
  market_value: number;
  circulation: number;
}

interface ItemListingEntry extends ItemListing {
  id: string;
}

export function ItemMarketSection() {
  const { apiKey, fetchSection } = useTorn();
  const [ itemData, setItemData ] = useState<Record<string, ItemListing> | null>(null);
  const [ loading, setLoading ] = useState(false);
  const [ value, setValue ] = useState<string>('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  useEffect(() => {
    if (!apiKey) return;
    let active = true;

    const loadMarket = async () => {
      setLoading(true);
      try {
        const res = await fetchSection((client) => client.getTornItems());
        if (res?.data && active) {
          const d = res.data as Record<string, unknown>;
          if (d.items) {
            setItemData(d.items as Record<string, ItemListing>);
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

  if (loading && !itemData) {
    return (
      <Card title="Items Market" icon={ShoppingBag} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono animate-pulse">
          LOADING MARKET DATA...
        </div>
      </Card>
    );
  }

  if (!itemData) {
    return (
      <Card title="Items Market" icon={ShoppingBag} className="min-h-[200px]">
        <div className="p-4 text-muted-foreground text-sm font-mono">
          NO DATA LOADED
        </div>
      </Card>
    );
  }

  const listings: ItemListingEntry[] = Object.entries(itemData)
    .map(([id, listing]) => ({ id, ...listing }))
    .filter(item => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
    .sort((a, b) => a.market_value - b.market_value)
    .slice(0, 10);

    console.log(listings);

  return (
    <Card title="Items Market" icon={ShoppingBag} className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-end">
          <div className="text-xs text-muted-foreground uppercase font-mono">
            <input type="text" placeholder="Search Items..." value={value} onChange={handleChange} className="outline-0"></input>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto max-h-[250px] p-0">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-muted/30 sticky top-0 backdrop-blur-sm">
            <tr>
              <th className="p-2 font-normal text-muted-foreground">NAME</th>
              <th className="p-2 font-normal text-muted-foreground text-right">CIRCULATION</th>
              <th className="p-2 font-normal text-muted-foreground text-right">VALUE</th>
            </tr>
          </thead>
          <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
              <td className="p-2 font-bold tabular-nums text-green-500">{listing.name}</td>
              <td className="p-2 text-right tabular-nums">{listing.circulation}</td>
              <td className="p-2 text-right tabular-nums text-muted-foreground">${listing.market_value}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}