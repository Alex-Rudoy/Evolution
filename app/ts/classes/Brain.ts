import { Creature } from "./Creature";
import Entity from "./Entity";
import { Food } from "./Food";

import { DEFAULT_DAMAGE, DEFAULT_MAX_HP } from "../utils/constants";
import { debouncedClg } from "../utils/debouncedClg";
import { randomBetween } from "../utils/randomBetween";

export class Brain {
  creature: Creature;
  currentSituation: string;

  constructor(thisCreature: Creature) {
    this.creature = thisCreature;
    this.currentSituation = ""; // this should match the genes
  }

  makeDecision(creatures: Creature[], foods: Food[]) {
    const closestEnemies = this.fillToFive(
      this.getClosest(
        creatures.filter(
          (creature) => creature.faction !== this.creature.faction
        )
      )
    );

    const closestAllies = this.fillToFive(
      this.getClosest(
        creatures.filter(
          (creature) => creature.faction === this.creature.faction
        )
      )
    );

    const closestFood = this.fillToFive(this.getClosest(foods));

    this.currentSituation = "";

    for (let i = 100; i <= DEFAULT_MAX_HP * 2; i += 100) {
      this.addParam(this.creature.currentHP >= i);
    }
    for (let i = DEFAULT_DAMAGE; i <= DEFAULT_DAMAGE * 2; i += 30) {
      this.addParam(this.creature.stats.damage >= i);
    }
    for (let i = 0; i <= 30; i += 3) {
      this.addParam(this.creature.age >= i);
    }
    for (let i = 0; i <= 200; i += 20) {
      this.addParam(this.creature.hunger >= i);
    }
    for (let i = 0; i <= 200; i += 30) {
      this.addParam(this.creature.fertility >= i);
    }

    closestEnemies.forEach((enemy, idx) => {
      this.currentSituation += ` enemy${idx}`;
      this.addParam(!!enemy); // is present, just in case
      for (let i = 100; i <= DEFAULT_MAX_HP * 2; i += 100) {
        if (!enemy) this.addParam(false);
        else this.addParam((enemy as Creature).currentHP >= i);
      }
      for (let i = DEFAULT_DAMAGE; i <= DEFAULT_DAMAGE * 2; i += 30) {
        if (!enemy) this.addParam(false);
        else this.addParam((enemy as Creature).stats.damage >= i);
      }
      for (let i = 0; i <= 30; i += 3) {
        if (!enemy) this.addParam(false);
        else this.addParam((enemy as Creature).age >= i);
      }
      for (let i = 0; i <= 200; i += 20) {
        if (!enemy) this.addParam(false);
        else this.addParam((enemy as Creature).hunger >= i);
      }
      for (let i = 0; i <= 200; i += 30) {
        if (!enemy) this.addParam(false);
        else this.addParam((enemy as Creature).fertility >= i);
      }
      if (!enemy) this.addParam(false);
      else
        this.addParam(
          (enemy as Creature).faction.coefficients[
            this.creature.faction.name
          ] === 2 // is dangerous!
        );
      if (!enemy) this.addParam(false);
      else
        this.addParam(
          this.creature.stats.speed > (enemy as Creature).stats.speed
        );

      const position = this.creature.getRelativePositionTo(enemy);
      for (let i = 0; i <= 9; i += 1) {
        if (!enemy) this.addParam(false);
        else this.addParam(position.angle === i);
      }
      for (let i = 0; i <= 300; i += 30) {
        if (!enemy) this.addParam(false);
        else this.addParam(position.distance >= i);
      }
    });

    closestAllies.forEach((ally, idx) => {
      this.currentSituation += ` ally${idx}`;
      this.addParam(!!ally); // is present, just in case
      for (let i = 100; i <= DEFAULT_MAX_HP * 2; i += 100) {
        if (!ally) this.addParam(false);
        else this.addParam((ally as Creature).currentHP >= i);
      }
      for (let i = DEFAULT_DAMAGE; i <= DEFAULT_DAMAGE * 2; i += 30) {
        if (!ally) this.addParam(false);
        else this.addParam((ally as Creature).stats.damage >= i);
      }
      for (let i = 0; i <= 30; i += 3) {
        if (!ally) this.addParam(false);
        else this.addParam((ally as Creature).age >= i);
      }
      for (let i = 0; i <= 200; i += 20) {
        if (!ally) this.addParam(false);
        else this.addParam((ally as Creature).hunger >= i);
      }
      for (let i = 0; i <= 180; i += 30) {
        if (!ally) this.addParam(false);
        else this.addParam((ally as Creature).fertility >= i);
      }

      const position = this.creature.getRelativePositionTo(ally);
      for (let i = 0; i <= 9; i += 1) {
        if (!ally) this.addParam(false);
        else this.addParam(position.angle === i);
      }
      for (let i = 0; i <= 300; i += 30) {
        if (!ally) this.addParam(false);
        else this.addParam(position.distance >= i);
      }
    });

    closestFood.forEach((food, idx) => {
      this.currentSituation += ` food${idx}`;
      const position = this.creature.getRelativePositionTo(food);
      for (let i = 0; i <= 9; i += 1) {
        if (!food) this.addParam(false);
        else this.addParam(position.angle === i);
      }
      for (let i = 0; i <= 300; i += 30) {
        if (!food) this.addParam(false);
        else this.addParam(position.distance >= i);
      }
    });
    if (this.creature.genes.genes[this.currentSituation] === undefined) {
      this.creature.genes.genes[this.currentSituation] = randomBetween(
        0,
        10,
        1
      );
    }
    this.creature.moveAngle = this.creature.genes.genes[this.currentSituation];
  }

  getClosest(entities: Entity[]) {
    return entities
      .sort(
        (entity1, entity2) =>
          entity1.getRelativePositionTo(this.creature).distance -
          entity2.getRelativePositionTo(this.creature).distance
      )
      .slice(0, 5)
      .filter(
        (entity) =>
          this.creature.getRelativePositionTo(entity).distance <
          this.creature.stats.sightRadius
      );
  }

  fillToFive(entities: Entity[]) {
    return [...entities, null, null, null, null, null].slice(0, 5);
  }

  addParam(param: boolean): void {
    this.currentSituation += param ? "1" : "0";
  }
}
