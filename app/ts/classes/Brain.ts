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
    const closestEnemies = this.fillToThree(
      this.getClosest(
        creatures.filter(
          (creature) => creature.faction !== this.creature.faction
        )
      )
    );

    const closestAllies = this.fillToThree(
      this.getClosest(
        creatures.filter(
          (creature) => creature.faction === this.creature.faction
        )
      )
    );

    const closestFood = this.fillToThree(this.getClosest(foods));

    this.currentSituation = "";

    this.addRatioParam(this.creature.currentHP, 200);
    this.addRatioParam(this.creature.stats.damage, 60);
    this.addRatioParam(this.creature.age, 5);
    this.addRatioParam(this.creature.hunger, 30);
    this.addRatioParam(this.creature.fertility, 50);

    closestEnemies.forEach((enemy, idx) => {
      this.addParam(` enemy${idx}`);
      if (!enemy) {
        this.addParam("hp00dmg00age00hun00ang00dis00spe0");
        return;
      }

      this.addParam("hp");
      this.addRatioParam(
        (enemy as Creature).currentHP /
          this.creature.faction.coefficients[(enemy as Creature).faction.name],
        200
      );

      this.addParam("dmg");
      this.addRatioParam(
        (enemy as Creature).stats.damage *
          (enemy as Creature).faction.coefficients[this.creature.faction.name],
        60
      );

      this.addParam("age");
      this.addRatioParam((enemy as Creature).age, 5);

      this.addParam("hun");
      this.addRatioParam((enemy as Creature).hunger, 30);

      const position = this.creature.getRelativePositionTo(enemy);
      this.addParam("ang");
      this.addRatioParam(position.angle, 1);

      this.addParam("dis");
      this.addRatioParam(position.distance, 60);

      this.addParam("spe");
      this.addParam(
        `${+(this.creature.stats.speed > (enemy as Creature).stats.speed)}`
      );
    });

    closestAllies.forEach((ally, idx) => {
      this.addParam(` ally${idx}`);
      if (!ally) {
        this.addParam("hp00dmg00age00hun00fer00ang00dis00");
        return;
      }

      this.addParam("hp");
      this.addRatioParam((ally as Creature).currentHP, 200);

      this.addParam("dmg");
      this.addRatioParam((ally as Creature).stats.damage, 60);

      this.addParam("age");
      this.addRatioParam((ally as Creature).age, 5);

      this.addParam("hun");
      this.addRatioParam((ally as Creature).hunger, 30);

      this.addParam("fer");
      this.addRatioParam((ally as Creature).fertility, 50);

      const position = this.creature.getRelativePositionTo(ally);
      this.addParam("ang");
      this.addRatioParam(position.angle, 1);

      this.addParam("dis");
      this.addRatioParam(position.distance, 60);
    });

    closestFood.forEach((food, idx) => {
      this.addParam(` food${idx}`);
      if (!food) {
        this.addParam("ang00dis00");
        return;
      }
      const position = this.creature.getRelativePositionTo(food);
      this.addParam("ang");
      this.addRatioParam(position.angle, 1);

      this.addParam("dis");
      this.addRatioParam(position.distance, 60);
    });

    if (this.creature.genes.genes[this.currentSituation] === undefined) {
      this.creature.genes.genes[this.currentSituation] = randomBetween(
        0,
        10,
        1
      );
    }
    debouncedClg(this.currentSituation, this.currentSituation.length);
    this.creature.moveAngle = this.creature.genes.genes[this.currentSituation];
  }

  getClosest(entities: Entity[]) {
    return entities
      .filter(
        (entity) =>
          this.creature.getRelativePositionTo(entity).distance <
          this.creature.stats.sightRadius
      )
      .sort(
        (entity1, entity2) =>
          entity1.getRelativePositionTo(this.creature).distance -
          entity2.getRelativePositionTo(this.creature).distance
      )
      .slice(0, 3);
  }

  fillToThree(entities: Entity[]) {
    return [...entities, null, null, null, null, null].slice(0, 3);
  }

  addRatioParam(param: number, ratio: number) {
    this.addParam(
      Math.round(param / ratio)
        .toString()
        .padStart(2, "0")
    );
  }

  addParam(param: string): void {
    this.currentSituation += param;
  }
}
