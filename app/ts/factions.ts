import { factionType } from "./types";

export const red: factionType = {
  id: 1,
  name: "red",
  color: "#df4040",
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
  color: "#d1b950",
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
  name: "green",
  color: "#6acf6f",
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
  name: "blue",
  color: "#328dc2",
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
  name: "pink",
  color: "#8d4b8f",
  coefficients: {
    red: 1.2,
    gold: 1.1,
    green: 0.9,
    blue: 0.8,
    pink: 1,
  },
};

export const factions = [red, gold, green, blue, pink];
