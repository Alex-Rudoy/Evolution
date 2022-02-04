import { Food } from "./classes/Food";
import { Creature } from "./classes/Creature";
import { debouncedClg } from "./utils/debouncedClg";

export default class GameStateManager {
  creatures: Creature[];
  foods: Food[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  totalTime: number;
  fullSeconds: number;

  constructor() {
    this.creatures = [];
    this.foods = [];
    this.canvas = document.querySelector("canvas")!;
    this.ctx = this.canvas.getContext("2d")!;
    this.totalTime = 0;
    this.fullSeconds = 0;

    this.start();
  }

  start() {
    for (let i = 0; i < 100; i++) {
      this.creatures.push(new Creature());
    }
  }

  loop(secondsPassed: number) {
    this.totalTime += secondsPassed;
    this.makeDecisions();
    this.move(secondsPassed);
    this.resolveColliders(secondsPassed);
    this.updateValues(secondsPassed);
    this.checkDead();
    this.everySecond();
    this.sanityCheck();

    this.draw();
    debouncedClg(this.creatures);
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
      creature.decision(this.creatures, this.foods);
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
            if (creature1 !== creature2 && creature1.fertility > 100 && creature2.fertility > 100) {
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
    creature1.move(angle, (distance - creature1.collider.hitbox - creature2.collider.hitbox) / 2);
    creature2.move(angle + Math.PI, (distance - creature1.collider.hitbox - creature2.collider.hitbox) / 2);
  }

  breed(parent1: Creature, parent2: Creature) {
    parent1.fertility -= 100;
    parent2.fertility -= 100;
    this.creatures.push(new Creature({ parent1, parent2 }));
  }

  damageBoth(creature1: Creature, creature2: Creature, secondsPassed: number) {
    creature1.dealDamageTo(creature2, secondsPassed);
    creature2.dealDamageTo(creature1, secondsPassed);
    if (creature1.toDestroy || creature2.toDestroy) {
      this.foods.push(new Food(creature1));
      this.foods.push(new Food(creature1));
      this.foods.push(new Food(creature1));
    }
  }

  updateValues(secondsPassed: number) {
    this.creatures.forEach((creature) => {
      creature.hunger += secondsPassed * 20;
      creature.age += secondsPassed;
      creature.fertility += secondsPassed * 20;
      creature.heal(creature.stats.regen * secondsPassed);
      creature.takeDamage(creature.age * 2 * secondsPassed);
      creature.takeDamage((creature.hunger / 2) * secondsPassed);
    });
  }

  checkDead() {
    this.creatures = this.creatures.filter((creature) => {
      if (!creature.toDestroy) return true;
      return false;
    });

    this.foods = this.foods.filter((food) => !food.toDestroy);
  }

  everySecond() {
    if (this.totalTime > this.fullSeconds + 1) {
      this.fullSeconds++;
      this.foods.push(new Food());
      this.creatures.push(new Creature({ allCreatures: this.creatures }));
    }
  }

  sanityCheck() {
    if (this.creatures.length > 400) {
      this.creatures = [];
      this.start();
    }
  }
}
