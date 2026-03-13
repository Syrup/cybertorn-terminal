"use client";

import Image from "next/image";
import { useState } from "react";
import {
  User,
  Users,
  DollarSign,
  BarChart2,
  ShoppingBag,
  Globe,
  Menu,
  X,
  Target,
  Swords,
  Clock,
  Home,
  Shield,
  GraduationCap,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#profile", label: "Profile", icon: User },
  { href: "#bars", label: "Status Bars", icon: BarChart2 },
  { href: "#battle-stats", label: "Battle Stats", icon: Swords },
  { href: "#money", label: "Finance", icon: DollarSign },
  { href: "#cooldowns", label: "Timers", icon: Clock },
  { href: "#faction", label: "Faction", icon: Users },
  { href: "#crimes", label: "Crimes/Attacks", icon: Target },
  { href: "#market", label: "Market", icon: ShoppingBag },
  { href: "#properties", label: "Assets", icon: Home },
  { href: "#equipment", label: "Equipment", icon: Shield },
  { href: "#education", label: "Skills/Edu", icon: GraduationCap },
  { href: "#events", label: "Events", icon: Bell },
  { href: "#personal-stats", label: "Personal Stats", icon: Globe },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-primary text-primary-foreground rounded-none shadow-lg md:hidden border border-primary-foreground/20"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2 relative h-8 w-8 overflow-hidden shrink-0">
              <Image src="/branding/icon.svg" alt="CyberTorn Icon" fill className="object-contain invert dark:invert-0" priority />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold tracking-tighter uppercase font-mono">
                CYBER<span className="text-primary">TORN</span>
              </h1>
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">
              TERMINAL_CORE_V1.0
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-none group"
                    >
                      <Icon className="h-4 w-4 group-hover:text-foreground transition-colors" />
                      <span className="uppercase tracking-wide text-xs font-mono">{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground font-mono text-center opacity-50">
              SECURE CONNECTION
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
