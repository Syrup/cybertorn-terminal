"use client";

import { useTorn } from "@/lib/torn-context";
import { Card } from "@/components/ui/Card";
import { StatBlock } from "@/components/ui/StatBlock";
import { DollarSign } from "lucide-react";
import { TornMoney } from "@/types/torn-schema";
import { useState, useEffect } from "react";
import { calculateBankTimeLeft, formatDuration } from "@/lib/bank-utils";
import dayjs from "dayjs";

export function MoneyNetworth() {
  const { data } = useTorn();
  const rawData = data?.money?.data as unknown;
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

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
        
        const cityBank = isRecord(moneyRecord.city_bank) ? {
          amount: getNumber(moneyRecord.city_bank.amount),
          interest_rate: typeof moneyRecord.city_bank.interest_rate === 'number' ? moneyRecord.city_bank.interest_rate : 0,
          until: getNumber(moneyRecord.city_bank.until) || 
                 getNumber(moneyRecord.city_bank.time_left) || 
                 getNumber(moneyRecord.city_bank.banktimeleft)
        } : undefined;

        return {
          money_onhand: getNumber(moneyRecord.money_onhand),
          money_daily: getNumber(moneyRecord.money_daily),
          points: getNumber(moneyRecord.points),
          cayman_bank: getNumber(moneyRecord.cayman_bank),
          vault_amount: getNumber(moneyRecord.vault_amount),
          networth: getNumber(networthSource),
          city_bank: cityBank,
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

  const bankTimeLeft = money.city_bank ? calculateBankTimeLeft(money.city_bank.until, now) : 0;

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

        {money.city_bank && money.city_bank.amount > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">City Bank Investment</span>
              <span className="text-xs font-mono font-bold text-blue-400">{formatMoney(money.city_bank.amount)}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Time Remaining</span>
              <div className="text-right">
                <div className="text-xs font-mono text-yellow-500">
                  {formatDuration(bankTimeLeft)}
                </div>
                {bankTimeLeft > 0 && (
                  <div className="text-[10px] font-mono text-muted-foreground opacity-70 mt-0.5">
                    EST. {dayjs().add(bankTimeLeft, "second").format("ddd, DD.MM.YYYY HH:mm").toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
