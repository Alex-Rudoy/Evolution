export type creatureStatsType = {
  maxHP: number;
  regen: number;
  speed: number;
  damage: number;
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
  name: "red" | "gold" | "green" | "blue" | "pink";
  color: string;
  coefficients: {
    red: number;
    gold: number;
    green: number;
    blue: number;
    pink: number;
  };
};
