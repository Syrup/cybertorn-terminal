export interface TornStatus {
  description: string;
  details: string;
  state: string;
  color: string;
  until: number;
}

export interface TornJob {
  job: string;
  position: string;
  company_id: number;
  company_name: string;
}

export interface TornFaction {
  position: string;
  faction_id: number;
  days_in_faction: number;
  faction_name: string;
  position_name: string;
}

export interface TornProfile {
  rank: string;
  level: number;
  honor: number;
  gender: string;
  property: string;
  signup: string;
  awards: number;
  friends: number;
  enemies: number;
  forum_posts: number;
  karma: number;
  age: number;
  role: string;
  donator: number;
  player_id: number;
  name: string;
  property_id: number;
  revivable: number;
  life: TornBar;
  status: TornStatus;
  job: TornJob;
  faction: TornFaction;
  married: {
    spouse_id: number;
    spouse_name: string;
    duration: number;
  };
  icons: Record<string, string>;
}

export interface TornBar {
  current: number;
  maximum: number;
  increment: number;
  interval: number;
  ticktime: number;
  fulltime: number;
}

export interface TornBars {
  server_time: number;
  happy: TornBar;
  life: TornBar;
  energy: TornBar;
  nerve: TornBar;
  chain: {
    current: number;
    maximum: number;
    timeout: number;
    modifier: number;
    cooldown: number;
  };
}

export interface TornBattleStats {
  strength: number;
  speed: number;
  dexterity: number;
  defense: number;
  total: number;
  strength_modifier: number;
  speed_modifier: number;
  dexterity_modifier: number;
  defense_modifier: number;
  strength_info: string[];
  speed_info: string[];
  dexterity_info: string[];
  defense_info: string[];
}

export interface TornMoney {
  money_onhand: number;
  money_daily: number;
  points: number;
  cayman_bank: number;
  vault_amount: number;
  networth: number;
  city_bank?: {
    amount: number;
    interest_rate: number;
    until: number;
  };
}

export interface TornCooldowns {
  drug: number;
  booster: number;
  medical: number;
}

export interface TornTravel {
  destination: string;
  timestamp: number;
  departed: number;
  time_left: number;
}

export interface TornCooldownsResponse {
  cooldowns: TornCooldowns;
  travel: TornTravel;
}
