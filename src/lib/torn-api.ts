const BASE_URL = "https://api.torn.com";
const V2_BASE_URL = "https://api.torn.com/v2";

export interface TornApiError {
  code: number;
  error: string;
}

export interface TornApiResponse<T = Record<string, unknown>> {
  data: T | null;
  error: TornApiError | null;
}

type Section = "user" | "faction" | "company" | "market" | "torn" | "property" | "key";

interface FetchOptions {
  section: Section;
  selections: string[];
  id?: string | number;
  params?: Record<string, string>;
}

class TornApiClient {
  private apiKey: string;
  private lastRequestTime = 0;
  private minInterval = 650; // ~90 req/min to stay safely under 100

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minInterval) {
      await new Promise((r) => setTimeout(r, this.minInterval - elapsed));
    }
    this.lastRequestTime = Date.now();
  }

  async fetch<T = Record<string, unknown>>(
    options: FetchOptions
  ): Promise<TornApiResponse<T>> {
    await this.throttle();

    const { section, selections, id, params } = options;
    const idPart = id ? `/${id}` : "";
    const searchParams = new URLSearchParams({
      selections: selections.join(","),
      key: this.apiKey,
    });
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        searchParams.set(key, value);
      }
    }

    const url = `${BASE_URL}/${section}${idPart}?${searchParams.toString()}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.error) {
        return { data: null, error: json.error as TornApiError };
      }

      return { data: json as T, error: null };
    } catch (err) {
      return {
        data: null,
        error: { code: -1, error: String(err) },
      };
    }
  }

  private async fetchV2<T = Record<string, unknown>>(path: string, params?: Record<string, string>): Promise<TornApiResponse<T>> {
    await this.throttle();
    const searchParams = new URLSearchParams({ key: this.apiKey });
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        searchParams.set(k, v);
      }
    }
    const url = `${V2_BASE_URL}${path}?${searchParams.toString()}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.error) {
        return { data: null, error: json.error as TornApiError };
      }

      return { data: json as T, error: null };
    } catch (err) {
      return {
        data: null,
        error: { code: -1, error: String(err) },
      };
    }
  }

  async fetchTornItemsByIds(ids: number[]) {
    return this.fetchV2<Record<string, unknown>>(`/torn/${ids.join(",")}/items`);
  }

  // User section
  async getUserProfile() {
    return this.fetch({
      section: "user",
      selections: ["profile", "basic", "discord"],
    });
  }

  async getUserBars() {
    return this.fetch({
      section: "user",
      selections: ["bars"],
    });
  }

  async getUserBattleStats() {
    return this.fetch({
      section: "user",
      selections: ["battlestats"],
    });
  }

  async getUserMoney() {
    return this.fetch({
      section: "user",
      selections: ["money", "networth"],
    });
  }

  async getUserCooldowns() {
    return this.fetch({
      section: "user",
      selections: ["cooldowns", "travel"],
    });
  }

  async getUserEquipment() {
    return this.fetchV2(`/user/equipment`);
  }

  async getUserAmmo() {
    return this.fetchV2(`/user/ammo`);
  }

  async getUserCrimes() {
    return this.fetch({
      section: "user",
      selections: ["criminalrecord"],
    });
  }

  async getUserAttacks() {
    return this.fetch({
      section: "user",
      selections: ["attacks"],
    });
  }

  async getUserStocks() {
    return this.fetch({
      section: "user",
      selections: ["stocks"],
    });
  }

  async getUserProperties() {
    return this.fetchV2(`/user/properties`);
  }

  async getUserEducation() {
    return this.fetch({
      section: "user",
      selections: ["education", "skills", "workstats", "weaponexp"],
    });
  }

  async getUserEvents() {
    return this.fetch({
      section: "user",
      selections: ["events", "notifications"],
    });
  }

  async getUserPerks() {
    return this.fetch({
      section: "user",
      selections: ["perks", "merits", "medals", "honors"],
    });
  }

  async getUserMissions() {
    return this.fetch({
      section: "user",
      selections: ["missions"],
    });
  }

  async getUserPersonalStats() {
    return this.fetch({
      section: "user",
      selections: ["personalstats"],
    });
  }

  async getUserPersonalStatsV2() {
    return this.fetchV2(`/user/personalstats`, { cat: "attacking" });
  }

  async getUserMessages() {
    return this.fetch({
      section: "user",
      selections: ["messages"],
    });
  }

  async getUserRefills() {
    return this.fetch({
      section: "user",
      selections: ["refills"],
    });
  }

  async getUserHof() {
    return this.fetch({
      section: "user",
      selections: ["hof"],
    });
  }

  async getUserJobPoints() {
    return this.fetch({
      section: "user",
      selections: ["jobpoints"],
    });
  }

  async getUserBazaar() {
    return this.fetch({
      section: "user",
      selections: ["bazaar"],
    });
  }

  async getUserIcons() {
    return this.fetch({
      section: "user",
      selections: ["icons"],
    });
  }

  // Faction section
  async getFaction() {
    return this.fetch({
      section: "faction",
      selections: ["basic", "territory"],
    });
  }

  async getFactionMembers() {
    return this.fetch({
      section: "faction",
      selections: ["basic"],
    });
  }

  async getFactionChain() {
    return this.fetch({
      section: "faction",
      selections: ["chain", "chains"],
    });
  }

  async getFactionWars() {
    return this.fetch({
      section: "faction",
      selections: ["wars"],
    });
  }

  async getFactionCrimes() {
    return this.fetch({
      section: "faction",
      selections: ["crimes"],
    });
  }

  async getFactionUpgrades() {
    return this.fetch({
      section: "faction",
      selections: ["upgrades"],
    });
  }

  // Market section
  async getPointsMarket() {
    return this.fetch({
      section: "market",
      selections: ["pointsmarket"],
    });
  }

  // Torn section
  async getTornStats() {
    return this.fetch({
      section: "torn",
      selections: ["stats"],
    });
  }

  async getTornItems() {
    return this.fetch({
      section: "torn",
      selections: ["items"],
    });
  }

  async getTornAmmo() {
    return this.fetch({
      section: "torn",
      selections: ["itemammo"],
    });
  }

  async getTornStocks() {
    return this.fetch({
      section: "torn",
      selections: ["stocks"],
    });
  }

  async getTornEducation() {
    return this.fetch({
      section: "torn",
      selections: ["education"],
    });
  }

  async getTornHonors() {
    return this.fetch({
      section: "torn",
      selections: ["honors"],
    });
  }

  async getTornCompanies() {
    return this.fetch({
      section: "torn",
      selections: ["companies"],
    });
  }

  async getTornProperties() {
    return this.fetch({
      section: "torn",
      selections: ["properties"],
    });
  }

  // Company section
  async getCompany() {
    return this.fetch({
      section: "company",
      selections: ["profile", "employees", "stock"],
    });
  }

  // Key section
  async getKeyInfo() {
    return this.fetch({
      section: "key",
      selections: ["info"],
    });
  }

  // Bulk fetch for dashboard
  async getDashboardData() {
    const results = await Promise.allSettled([
      this.getUserProfile(),
      this.getUserBars(),
      this.getUserBattleStats(),
      this.getUserMoney(),
      this.getUserCooldowns(),
      this.getUserCrimes(),
      this.getUserAttacks(),
      this.getUserEvents(),
      this.getUserPersonalStats(),
      this.getUserRefills(),
      this.getUserHof(),
      this.getUserIcons(),
      this.getFaction(),
    ]);

    return {
      profile: results[0].status === "fulfilled" ? results[0].value : null,
      bars: results[1].status === "fulfilled" ? results[1].value : null,
      battlestats: results[2].status === "fulfilled" ? results[2].value : null,
      money: results[3].status === "fulfilled" ? results[3].value : null,
      cooldowns: results[4].status === "fulfilled" ? results[4].value : null,
      crimes: results[5].status === "fulfilled" ? results[5].value : null,
      attacks: results[6].status === "fulfilled" ? results[6].value : null,
      events: results[7].status === "fulfilled" ? results[7].value : null,
      personalstats: results[8].status === "fulfilled" ? results[8].value : null,
      refills: results[9].status === "fulfilled" ? results[9].value : null,
      hof: results[10].status === "fulfilled" ? results[10].value : null,
      icons: results[11].status === "fulfilled" ? results[11].value : null,
      faction: results[12].status === "fulfilled" ? results[12].value : null,
    };
  }
}

export function createTornApi(apiKey: string) {
  return new TornApiClient(apiKey);
}

export type { TornApiClient };
