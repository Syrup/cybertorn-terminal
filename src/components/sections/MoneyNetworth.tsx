"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { StatBlock } from "@/components/ui/StatBlock";
import { DollarSign } from "lucide-react";
import { TornMoney } from "@/types/torn-schema";

export function MoneyNetworth() {
  const { data } = useTorn();
  const rawData = data?.money?.data as unknown;

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

  const getNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (isRecord(value)) {
      const candidates = ["networth", "total", "value", "amount"];
      for (const key of candidates) {
        const candidate = value[key];
        if (typeof candidate === "number") return candidate;
      }
      for (const candidate of Object.values(value)) {
        if (typeof candidate === "number") return candidate;
      }
    }
    return 0;
  };

  const money = isRecord(rawData)
    ? ((): TornMoney => {
        const moneyRecord = isRecord(rawData.money) ? rawData.money : rawData;
        const networthSource = rawData.networth ?? moneyRecord.networth;

        return {
          money_onhand: getNumber(moneyRecord.money_onhand),
          money_daily: getNumber(moneyRecord.money_daily),
          points: getNumber(moneyRecord.points),
          cayman_bank: getNumber(moneyRecord.cayman_bank),
          vault_amount: getNumber(moneyRecord.vault_amount),
          networth: getNumber(networthSource),
        };
      })()
    : null;

  if (!money) {
    return (
      <Card title="Finance" icon={DollarSign}>
        <div className="p-4 text-muted-foreground text-sm font-mono">
          WAITING FOR DATA...
        </div>
      </Card>
    );
  }

  const formatMoney = (amount: number) => "$" + amount.toLocaleString();
  const formatNumber = (amount: number) => amount.toLocaleString();

  return (
    <Card title="Finance" icon={DollarSign}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-end mb-2 border-b border-border pb-2">
           <span className="text-sm font-mono text-muted-foreground uppercase">Networth</span>
           <span className="text-xl font-bold tabular-nums text-green-500">{formatMoney(money.networth)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <StatBlock label="Wallet" value={formatMoney(money.money_onhand)} />
          <StatBlock label="Points" value={formatNumber(money.points)} />
          <StatBlock label="Cayman Bank" value={formatMoney(money.cayman_bank)} />
          <StatBlock label="Vault" value={formatMoney(money.vault_amount)} />
        </div>
      </div>
    </Card>
  );
}
