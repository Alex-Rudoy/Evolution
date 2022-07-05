import { Creature } from "./classes/Creature";
import { Food } from "./classes/Food";
import { factions } from "./factions";

import { DEFAULT_HUNGER_RATE } from "./utils/constants";

export default class GameStateManager {
  creatures: Creature[];
  graveyard: Creature[];
  foods: Food[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  totalTime: number;
  fullSeconds: number;
  epoch: number;

  constructor() {
    this.creatures = [];
    this.graveyard = [];
    this.foods = [];
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.totalTime = 0;
    this.fullSeconds = 0;
    this.epoch = 0;

    this.start();
  }

  start() {
    this.creatures = [];
    this.foods = [];

    if (!this.epoch) {
      for (let i = 0; i < 100; i++) {
        this.creatures.push(new Creature());
      }
    } else {
      const newEpoch = true;
      this.graveyard === this.graveyard.reverse();

      // factions.forEach((faction) => {
      //   const factionCreatures = this.graveyard // todo uncomment for faction evolution
      //     .filter((creature) => creature.faction.id === faction.id)
      //     .slice(0, 6);
      //   factionCreatures.forEach((parent1) => {
      //     factionCreatures.forEach((parent2) => {
      //       this.creatures.push(new Creature({ parent1, parent2, newEpoch }));
      //     });
      //   });
      // });
      // this.graveyard = [];

      this.graveyard.slice(0, 10).forEach((parent1) => {
        this.graveyard.slice(0, 10).forEach((parent2) => {
          this.creatures.push(new Creature({ parent1, parent2, newEpoch }));
        });
      });
    }
    this.epoch++;
  }

  loop(secondsPassed: number) {
    this.totalTime += secondsPassed;
    this.makeDecisions();
    this.move(secondsPassed);
    this.resolveColliders(secondsPassed);
    this.updateValues(secondsPassed);
    this.checkDead();
    this.everySecond();

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // remove previous frame
    this.creatures.forEach((creature) => {
      creature.draw(this.ctx);
    });
    this.foods.forEach((food) => food.draw(this.ctx));
  }

  makeDecisions() {
    this.creatures.forEach((creature) => {
      creature.brain.makeDecision(this.creatures, this.foods);
    });
  }

  move(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.move(creature.moveAngle, creature.stats.speed * secondsPassed);
    });
    this.foods.forEach((food) => {
      food.move(food.moveAngle, 10 * secondsPassed);
    });
  }

  resolveColliders(secondsPassed: number) {
    // colliding with others
    this.creatures.forEach((creature1) => {
      this.creatures.forEach((creature2) => {
        if (creature1.collidesWith(creature2)) {
          this.moveUnitsAway(creature1, creature2);

          if (creature1.faction.id === creature2.faction.id) {
            if (
              creature1 !== creature2 &&
              creature1.fertility > 100 &&
              creature2.fertility > 100
            ) {
              this.breed(creature1, creature2);
            }
          } else {
            this.damageBoth(creature1, creature2, secondsPassed);
          }
        }
      });
      this.foods.forEach((food) => {
        if (creature1.collidesWith(food)) {
          food.toDestroy = true;
          creature1.eatFood();
        }
      });
    });
  }

  moveUnitsAway(creature1: Creature, creature2: Creature) {
    let { angle, distance } = creature1.getRelativePositionTo(creature2);
    creature1.move(
      angle,
      (distance - creature1.collider.hitbox - creature2.collider.hitbox) / 2
    );
    creature2.move(
      angle + Math.PI,
      (distance - creature1.collider.hitbox - creature2.collider.hitbox) / 2
    );
  }

  breed(parent1: Creature, parent2: Creature) {
    parent1.fertility -= 100;
    parent2.fertility -= 100;
    this.creatures.push(new Creature({ parent1, parent2 }));
  }

  damageBoth(creature1: Creature, creature2: Creature, secondsPassed: number) {
    creature1.dealDamageTo(creature2, secondsPassed);
    creature2.dealDamageTo(creature1, secondsPassed);
  }

  updateValues(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.hunger +=
        secondsPassed *
        DEFAULT_HUNGER_RATE *
        creature.traits.traits.agility ** 2 *
        creature.traits.traits.vitality ** 2 *
        creature.traits.traits.strength ** 2 *
        creature.traits.traits.sense ** 1.5;
      creature.age += secondsPassed;
      creature.fertility += secondsPassed * 15;
      creature.heal(creature.stats.regen * secondsPassed);
      creature.takeDamage(
        (creature.age * 4 * secondsPassed * creature.stats.maxHP) / 1000
      );
      creature.takeDamage(
        ((creature.hunger / 2) * (creature.stats.maxHP / 1000) +
          creature.hunger / 2) *
          secondsPassed
      );
    });
  }

  checkDead() {
    this.creatures = this.creatures.filter((creature) => {
      if (!creature.toDestroy) {
        this.graveyard.push(creature);
        return true;
      }
      if (creature.isAttacked) {
        this.foods.push(new Food(creature));
        this.foods.push(new Food(creature));
        this.foods.push(new Food(creature));
        this.foods.push(new Food(creature));
      }
      return false;
    });

    if (this.creatures.length === 1) {
      this.creatures[0].toDestroy = true;
    }

    if (this.creatures.length === 0) {
      this.start();
    }

    this.foods = this.foods.filter((food) => !food.toDestroy);
  }

  everySecond() {
    if (this.totalTime > this.fullSeconds + 1) {
      this.fullSeconds++;
      if (Math.random() + 0.3 > this.creatures.length / 100) {
        // more population - less food
        this.foods.push(new Food());
      }
    }
  }
}
