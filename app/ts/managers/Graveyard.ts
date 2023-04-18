import { Creature } from '../entities/Creature';

import { factionType } from '../utils/factions';
import { weightedRandomIndex } from '../utils/weightedRandomIndex';

export class Graveyard {
  red: Creature[];
  green: Creature[];
  blue: Creature[];

  constructor() {
    this.red = [];
    this.green = [];
    this.blue = [];
  }

  get allGraveyard() {
    return [...this.red, ...this.green, ...this.blue];
  }

  addCreature(creature: Creature) {
    this[creature.faction.name].push(creature);
  }

  reset() {
    this.red = [];
    this.green = [];
    this.blue = [];
  }

  getTop5CreaturesFromFaction(faction: factionType) {
    return this[faction.name].slice(-5);
  }

  getRandomWeightedCreature() {
    const ageMap = this.allGraveyard.map((creature) => creature.age ** 2);
    const weightedRandomCreatureIndex = weightedRandomIndex(ageMap);
    return this.allGraveyard[weightedRandomCreatureIndex];
  }
}
