import { factionType } from "./types";

import { FACTION_DANGER_RATE } from "./utils/constants";

export const red: factionType = {
  id: 0,
  name: "red",
  colors: {
    "0": "#822020",
    "1": "#8f2525",
    "2": "#9a2929",
    "3": "#a42f2f",
    "4": "#ac3838",
    "5": "#b44444",
    "6": "#bd5151",
    "7": "#c35e5e",
    "8": "#c86868",
    "9": "#cb7373",
  },
  coefficients: {
    red: 1,
    green: FACTION_DANGER_RATE,
    blue: 1,
  },
};

export const green: factionType = {
  id: 1,
  name: "green",
  colors: {
    "0": "#1e7522",
    "1": "#217f26",
    "2": "#258a2a",
    "3": "#2a932f",
    "4": "#2f9b34",
    "5": "#36a33b",
    "6": "#3fac44",
    "7": "#48b24d",
    "8": "#50b455",
    "9": "#59ba5e",
  },
  coefficients: {
    red: 1,
    green: 1,
    blue: FACTION_DANGER_RATE,
  },
};

export const blue: factionType = {
  id: 2,
  name: "blue",
  colors: {
    "0": "#174a67",
    "1": "#195171",
    "2": "#1c597c",
    "3": "#1f6085",
    "4": "#24678e",
    "5": "#2c729a",
    "6": "#357ca5",
    "7": "#3e85ae",
    "8": "#498db5",
    "9": "#5595ba",
  },
  coefficients: {
    red: FACTION_DANGER_RATE,
    green: 1,
    blue: 1,
  },
};

export const factions = [red, green, blue];
