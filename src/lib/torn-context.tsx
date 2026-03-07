"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { createTornApi, type TornApiClient, type TornApiResponse } from "./torn-api";
import { useFlags } from "./feature-flags";

interface DashboardData {
  profile: TornApiResponse | null;
  bars: TornApiResponse | null;
  battlestats: TornApiResponse | null;
  money: TornApiResponse | null;
  cooldowns: TornApiResponse | null;
  crimes: TornApiResponse | null;
  attacks: TornApiResponse | null;
  events: TornApiResponse | null;
  personalstats: TornApiResponse | null;
  refills: TornApiResponse | null;
  hof: TornApiResponse | null;
  icons: TornApiResponse | null;
  faction: TornApiResponse | null;
}

interface TornContextValue {
  apiKey: string;
  setApiKey: (key: string) => void;
  isLoading: boolean;
  data: DashboardData | null;
  error: string | null;
  loadDashboard: () => Promise<void>;
  fetchSection: (
    fetcher: (client: TornApiClient) => Promise<TornApiResponse>
  ) => Promise<TornApiResponse | null>;
  lastUpdated: Date | null;
}

const TornContext = createContext<TornContextValue | null>(null);

export function TornProvider({ children }: { children: ReactNode }) {
  const { maintenanceMode } = useFlags();
  const [apiKey, setApiKeyState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const clientRef = useRef<TornApiClient | null>(null);

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    clientRef.current = createTornApi(key);
    if (typeof window !== "undefined") {
      if (key) {
        window.localStorage.setItem("torn_api_key", key);
      } else {
        window.localStorage.removeItem("torn_api_key");
      }
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!clientRef.current) {
      setError("No API key set");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await clientRef.current.getDashboardData();
      setData(result);
      setLastUpdated(new Date());

      const firstResult = result.profile;
      if (firstResult?.error) {
        setError(`API Error: ${firstResult.error.error}`);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedKey = typeof window !== "undefined"
      ? window.localStorage.getItem("torn_api_key")
      : null;

    if (storedKey && !maintenanceMode) {
      setApiKeyState(storedKey);
      clientRef.current = createTornApi(storedKey);
      loadDashboard();
    }
  }, [loadDashboard, maintenanceMode]);

  const fetchSection = useCallback(
    async (
      fetcher: (client: TornApiClient) => Promise<TornApiResponse>
    ): Promise<TornApiResponse | null> => {
      if (!clientRef.current) return null;
      try {
        return await fetcher(clientRef.current);
      } catch {
        return null;
      }
    },
    []
  );

  return (
    <TornContext.Provider
      value={{
        apiKey,
        setApiKey,
        isLoading,
        data,
        error,
        loadDashboard,
        fetchSection,
        lastUpdated,
      }}
    >
      {children}
    </TornContext.Provider>
  );
}

export function useTorn() {
  const ctx = useContext(TornContext);
  if (!ctx) throw new Error("useTorn must be used within TornProvider");
  return ctx;
}
