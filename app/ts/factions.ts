import { factionType } from "./types";

import { FACTION_DANGER_RATE } from "./utils/constants";

export const red: factionType = {
  id: 0,
  name: "red",
  colors: {
    "1": "#822020",
    "1.1": "#8f2525",
    "1.2": "#9a2929",
    "1.3": "#a42f2f",
    "1.4": "#ac3838",
    "1.5": "#b44444",
    "1.6": "#bd5151",
    "1.7": "#c35e5e",
    "1.8": "#c86868",
    "1.9": "#cb7373",
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
    "1": "#1e7522",
    "1.1": "#217f26",
    "1.2": "#258a2a",
    "1.3": "#2a932f",
    "1.4": "#2f9b34",
    "1.5": "#36a33b",
    "1.6": "#3fac44",
    "1.7": "#48b24d",
    "1.8": "#50b455",
    "1.9": "#59ba5e",
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
    "1": "#174a67",
    "1.1": "#195171",
    "1.2": "#1c597c",
    "1.3": "#1f6085",
    "1.4": "#24678e",
    "1.5": "#2c729a",
    "1.6": "#357ca5",
    "1.7": "#3e85ae",
    "1.8": "#498db5",
    "1.9": "#5595ba",
  },
  coefficients: {
    red: FACTION_DANGER_RATE,
    green: 1,
    blue: 1,
  },
};

export const factions = [red, green, blue];
