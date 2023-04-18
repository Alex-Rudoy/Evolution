import {
  BLUE_FACTION_COLOR,
  GREEN_FACTION_COLOR,
  HIGHER_DAMAGE_COEF,
  LOWER_DAMAGE_COEF,
  RED_FACTION_COLOR,
  SAME_FACTION_COEF,
} from './constants';

export type factionType = {
  id: number;
  name: 'red' | 'green' | 'blue';
  color: string;
  coefficients: {
    red: number;
    green: number;
    blue: number;
  };
};

export const redFaction: factionType = {
  id: 0,
  name: 'red',
  color: RED_FACTION_COLOR,
  coefficients: {
    red: SAME_FACTION_COEF,
    green: HIGHER_DAMAGE_COEF,
    blue: LOWER_DAMAGE_COEF,
  },
};

export const greenFaction: factionType = {
  id: 1,
  name: 'green',
  color: GREEN_FACTION_COLOR,
  coefficients: {
    red: LOWER_DAMAGE_COEF,
    green: SAME_FACTION_COEF,
    blue: HIGHER_DAMAGE_COEF,
  },
};

export const blueFaction: factionType = {
  id: 2,
  name: 'blue',
  color: BLUE_FACTION_COLOR,
  coefficients: {
    red: HIGHER_DAMAGE_COEF,
    green: LOWER_DAMAGE_COEF,
    blue: SAME_FACTION_COEF,
  },
};

export const factions = [redFaction, greenFaction, blueFaction];
