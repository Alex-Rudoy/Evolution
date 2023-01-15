import { Brain } from "./Brain";
import Entity from "./Entity";
import { Food } from "./Food";
import { Vector } from "./Vector";

import { clamp } from "../utils/clamp";
import { TENTH_OF_CIRCLE } from "../utils/constants";
import { factions, factionType } from "../utils/factions";

export class Creature extends Entity {
  brain: Brain;
  faction: factionType;
  maxHP: number;
  damage: number;
  maxSpeed: number;
  currentHP: number;
  age: number;
  energy: number;
  attackedTimeout: number;
  isSelected: boolean;

  constructor({ parent, faction, mutate }: constructorProps) {
    if (parent) {
      super({ color: parent.faction.color, size: 10 });
      this.faction = parent.faction;
      this.brain = new Brain({ parentBrain: parent.brain, me: this, mutate });
    } else {
      if (!faction) {
        throw new Error("faction is required");
      }
      super({ color: faction.color, size: 10 });
      this.faction = faction;
      this.brain = new Brain({ me: this });
    }
    this.maxHP = 1000;
    this.damage = 100;
    this.maxSpeed = 100;

    this.currentHP = this.maxHP;
    this.age = 0;
    this.energy = 100;
    this.attackedTimeout = 0;

    this.isSelected = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    // draw "health bar"
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      Math.max(this.size - (this.size * this.currentHP) / this.maxHP, 0),
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.closePath();

    if (this.isSelected) {
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.size + 1,
        0,
        Math.PI * 2,
        true
      );
      ctx.strokeStyle = "#fff";
      ctx.stroke();

      this.brain.drawConnections(ctx);
    }
  }

  updateValuesPerTick(secondsPassed: number) {
    this.energy = Math.max(this.energy - secondsPassed * 20, 0);
    this.age += secondsPassed;
    if (this.isSelected) {
      console.log(this.age);
    }
    const hpPromille = this.maxHP / 1000; // 0.1% of maxHP - will be just 1 HP with default HP
    const energyDeficit = 100 - this.energy;
    this.takeDamage(this.age * 5 * secondsPassed * hpPromille); // 0.5% maxHP per second, per 1 second of age
    this.takeDamage((energyDeficit / 2) * secondsPassed * hpPromille); // 5% maxHP per second at 0 energy
    this.takeDamage((energyDeficit / 2) * secondsPassed); // flat 50 damage per second at 0 energy
    if (this.attackedTimeout) {
      this.attackedTimeout = clamp(this.attackedTimeout - secondsPassed, 0, 1);
    }
  }

  makeDecision(
    cretures: Creature[],
    foods: Food[],
    secondsPassed: number,
    ctx: CanvasRenderingContext2D
  ) {
    const direction = this.brain.makeDecision(cretures, foods, ctx);
    // direction is 1/10 of a circle
    // add acceleration vector to velocity
    const accelerationVector = new Vector(0, 0);
    accelerationVector.setLength(
      Math.min(this.maxSpeed * 4 * secondsPassed, this.maxSpeed / 2)
    ); // can get to max speed in 0.25 second
    accelerationVector.setAngle(direction * TENTH_OF_CIRCLE);
    this.velocity = this.velocity.add(accelerationVector);
    if (this.velocity.length > this.maxSpeed) {
      this.velocity.setLength(this.maxSpeed);
    }
  }

  takeDamageFrom(creature: Creature, secondsPassed: number) {
    this.takeDamage(
      creature.damage *
        secondsPassed *
        creature.faction.coefficients[this.faction.name]
    );
    this.attackedTimeout = 1;
  }

  takeDamage(damage: number) {
    this.currentHP -= damage;

    if (this.currentHP <= 0) {
      this.toDestroy = true;
    }
  }

  heal(hp: number) {
    this.currentHP = Math.min(this.currentHP + hp, this.maxHP);
  }

  eatFood() {
    this.energy = clamp(this.energy + 30, 0, 100);
    this.heal(200);
  }

  get isAttacked() {
    return !!this.attackedTimeout;
  }
}

type constructorProps = {
  parent?: Creature;
  mutate?: boolean;
  faction: factionType;
};
