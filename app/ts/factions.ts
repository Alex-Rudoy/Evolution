import { factionType } from "./types";

export const red: factionType = {
  id: 1,
  name: "red",
  color: "#ce0000",
  coefficients: {
    red: 1,
    gold: 1.2,
    green: 1.1,
    blue: 0.9,
    pink: 0.8,
  },
};

export const gold: factionType = {
  id: 2,
  name: "gold",
  color: "#a78a08",
  coefficients: {
    red: 0.8,
    gold: 1,
    green: 1.2,
    blue: 1.1,
    pink: 0.9,
  },
};

export const green: factionType = {
  id: 3,
  name: "gold",
  color: "#00ce0a",
  coefficients: {
    red: 0.9,
    gold: 0.8,
    green: 1,
    blue: 1.2,
    pink: 1.1,
  },
};

export const blue: factionType = {
  id: 4,
  name: "gold",
  color: "#0004ff",
  coefficients: {
    red: 1.1,
    gold: 0.9,
    green: 0.8,
    blue: 1,
    pink: 1.2,
  },
};

export const pink: factionType = {
  id: 5,
  name: "gold",
  color: "#dd01dd",
  coefficients: {
    red: 1.2,
    gold: 1.1,
    green: 0.9,
    blue: 0.8,
    pink: 1,
  },
};

export const factions = [red, gold, green, blue, pink];
