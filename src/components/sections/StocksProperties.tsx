"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { Building, ChevronDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StockEntry {
  stock_id: number;
  total_shares: number;
  dividend: Record<string, unknown> | null;
  profit: number;
}

interface PropertyOwner {
  id: number;
  name: string;
}

interface PropertyUpkeep {
  property: number;
  staff: number;
}

interface PropertyEntry {
  id: number;
  owner: PropertyOwner;
  property: {
    id: number;
    name: string;
  };
  happy: number;
  upkeep: PropertyUpkeep;
  market_price: number;
  modifications: Record<string, unknown>[];
  staff: Record<string, unknown>[];
  status: string;
  used_by: PropertyOwner[];
}

function formatMoney(value: number) {
  return "$" + value.toLocaleString();
}

export function StocksProperties() {
  const { apiKey, fetchSection } = useTorn();
  const [stocks, setStocks] = useState<Record<string, StockEntry> | null>(null);
  const [properties, setProperties] = useState<PropertyEntry[] | null>(null);
  const [activeTab, setActiveTab] = useState<"stocks" | "properties">("stocks");

  useEffect(() => {
    if (!apiKey) return;

    fetchSection((client) => client.getUserStocks()).then((res) => {
      if (res?.data) {
        const d = res.data as Record<string, unknown>;
        if (d.stocks) setStocks(d.stocks as Record<string, StockEntry>);
      }
    });

    fetchSection((client) => client.getUserProperties()).then((res) => {
      if (res?.data) {
        const d = res.data as Record<string, unknown>;
        if (Array.isArray(d.properties)) {
          setProperties(d.properties as PropertyEntry[]);
        }
      }
    });
  }, [apiKey, fetchSection]);

  const stockList: StockEntry[] = stocks ? Object.values(stocks) : [];
  const propertyList: PropertyEntry[] = properties ?? [];

  const statusLabel = (status: string) => status.replace(/_/g, " ");
  const statusColor = (status: string) =>
    status === "in_use" ? "text-green-500" : "text-muted-foreground";

  const renderProperty = (prop: PropertyEntry) => (
    <details key={prop.id} className="group border border-border/60 bg-muted/5">
      <summary className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-mono uppercase cursor-pointer select-none">
        <span className="flex items-center gap-2">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180 text-muted-foreground" aria-hidden="true" />
          <span className="font-bold">{prop.property.name}</span>
        </span>
        <span className={cn("text-[10px] font-mono uppercase", statusColor(prop.status))}>
          {statusLabel(prop.status)}
        </span>
      </summary>
      <div className="px-3 pb-3 pt-1 space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono">
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">HAPPY</span>
            <span className="text-green-500">+{prop.happy}</span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">MARKET</span>
            <span>{formatMoney(prop.market_price)}</span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">UPKEEP</span>
            <span className="text-red-400">{formatMoney(prop.upkeep.property + prop.upkeep.staff)}</span>
          </div>
          <div className="flex justify-between border-b border-border/30 pb-1">
            <span className="text-muted-foreground">OWNER</span>
            <span>{prop.owner.name}</span>
          </div>
        </div>
        {prop.modifications.length > 0 && (
          <div className="text-[10px] font-mono text-muted-foreground">
            MODS: {prop.modifications.length}
          </div>
        )}
        {prop.staff.length > 0 && (
          <div className="text-[10px] font-mono text-muted-foreground">
            STAFF: {prop.staff.length}
          </div>
        )}
        {prop.used_by.length > 0 && (
          <div className="text-[10px] font-mono text-muted-foreground">
            USED BY: {prop.used_by.map((u) => u.name).join(", ")}
          </div>
        )}
      </div>
    </details>
  );

  return (
    <Card title="Assets" icon={activeTab === "stocks" ? TrendingUp : Building} className="h-full flex flex-col">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("stocks")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-mono uppercase font-bold transition-colors hover:bg-muted/50",
            activeTab === "stocks" ? "bg-muted text-foreground border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          Stocks
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={cn(
            "flex-1 px-4 py-2 text-xs font-mono uppercase font-bold transition-colors hover:bg-muted/50",
            activeTab === "properties" ? "bg-muted text-foreground border-b-2 border-primary" : "text-muted-foreground"
          )}
        >
          Properties
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-0 min-h-[200px]">
        {activeTab === "stocks" ? (
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-muted/30 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="p-2 font-normal text-muted-foreground">STOCK</th>
                <th className="p-2 font-normal text-muted-foreground text-right">SHARES</th>
                <th className="p-2 font-normal text-muted-foreground text-right">DIVIDEND</th>
              </tr>
            </thead>
            <tbody>
              {stockList.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-3 sm:p-4 text-center text-muted-foreground">NO STOCKS</td>
                </tr>
              ) : (
                stockList.map((stock, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                    <td className="p-2 font-medium">ID {stock.stock_id || "UNK"}</td>
                    <td className="p-2 text-right tabular-nums">{stock.total_shares?.toLocaleString()}</td>
                    <td className="p-2 text-right tabular-nums">
                      {stock.dividend ? (
                        <span className="text-green-500">READY</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <div className="space-y-2 p-2 sm:p-3">
            {propertyList.length === 0 ? (
              <div className="p-3 sm:p-4 text-center text-muted-foreground text-xs font-mono">NO PROPERTIES</div>
            ) : (
              propertyList.map(renderProperty)
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
