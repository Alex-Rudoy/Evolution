import { factionType } from "../types";

export const SAME_FACTION_COEF = 1;
export const HIGHER_DAMAGE_COEF = 1.5;
export const LOWER_DAMAGE_COEF = 0.66;

export const redFaction: factionType = {
  id: 0,
  name: "red",
  color: "#df4040",
  coefficients: {
    red: SAME_FACTION_COEF,
    green: HIGHER_DAMAGE_COEF,
    blue: LOWER_DAMAGE_COEF,
  },
};

export const greenFaction: factionType = {
  id: 1,
  name: "green",
  color: "#6acf6f",
  coefficients: {
    red: LOWER_DAMAGE_COEF,
    green: SAME_FACTION_COEF,
    blue: HIGHER_DAMAGE_COEF,
  },
};

export const blueFaction: factionType = {
  id: 2,
  name: "blue",
  color: "#328dc2",
  coefficients: {
    red: HIGHER_DAMAGE_COEF,
    green: LOWER_DAMAGE_COEF,
    blue: SAME_FACTION_COEF,
  },
};

export const factions = [redFaction, greenFaction, blueFaction];
