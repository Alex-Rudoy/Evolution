export type creatureStatsType = {
  maxHP: number;
  regen: number;
  speed: number;
  damage: number;
  sightRadius: number;
};

export type creaturePrioritiesType = {
  aggression: number;
  food: number;
  breeding: number;
};

export type colliderType = {
  x: number;
  y: number;
  hitbox: number;
  color: string;
};

export type factionType = {
  id: number;
  name: "red" | "green" | "blue";
  colors: Record<string, string>;
  coefficients: {
    red: number;
    green: number;
    blue: number;
  };
};
