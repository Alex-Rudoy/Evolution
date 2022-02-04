import Entity from "./Entity";
import { factions } from "../factions";
import { Stats } from "webpack";
import { creaturePrioritiesType, creatureStatsType, factionType } from "../types";
import { Food } from "./Food";

export class Creature extends Entity {
  faction: factionType;
  stats: creatureStatsType;
  priorities: creaturePrioritiesType;

  moveAngle: number;
  currentHP: number;
  age: number;
  hunger: number;
  fertility: number;
  isAttacked: boolean;
  attackedTimeout: NodeJS.Timeout | null;

  constructor({
    parent1,
    parent2,
    allCreatures,
    spawnFactionId,
  }: {
    parent1?: Creature;
    parent2?: Creature;
    allCreatures?: Creature[];
    spawnFactionId?: number;
  } = {}) {
    const fallbackFaction =
      typeof spawnFactionId === "number"
        ? factions[spawnFactionId]
        : factions[Math.floor(Math.random() * factions.length)];
    const x = parent1 && parent2 ? (parent1.collider.x + parent2.collider.x) / 2 : Math.random() * 1600;
    const y = parent1 && parent2 ? (parent1.collider.y + parent2.collider.y) / 2 : Math.random() * 900;
    const hitbox = 10;
    super(x, y, hitbox, parent1 ? parent1.faction.color : fallbackFaction.color);

    this.faction = fallbackFaction;
    this.stats = {
      maxHP: 1000,
      regen: 20,
      damage: 300,
      speed: 50,
    };
    this.priorities = {
      aggression: 100,
      food: 100,
      safety: 100,
      breeding: 100,
    };

    if (allCreatures && allCreatures.length) {
      let arrayToChooseFrom = spawnFactionId
        ? allCreatures.filter((creature) => creature.faction.id === spawnFactionId)
        : allCreatures;
      if (!arrayToChooseFrom.length) {
        arrayToChooseFrom = allCreatures;
      }
      Object.keys(this.stats).forEach((stat) => {
        this.stats[stat as keyof creatureStatsType] =
          arrayToChooseFrom.reduce((sum, creature) => sum + creature.stats[stat as keyof creatureStatsType], 0) /
          arrayToChooseFrom.length;
      });
      Object.keys(this.priorities).forEach((priority) => {
        this.priorities[priority as keyof creaturePrioritiesType] =
          arrayToChooseFrom.reduce(
            (sum, creature) => sum + creature.priorities[priority as keyof creaturePrioritiesType],
            0
          ) / arrayToChooseFrom.length;
      });
      this.updateGameStats();
    }

    if (parent1 && parent2) {
      this.faction = parent1.faction;
      this.collider.color = parent1.faction.color;
      this.hunger = (parent1.hunger + parent2.hunger) / 2;
      Object.keys(this.stats).forEach((stat) => {
        this.stats[stat as keyof creatureStatsType] =
          ((parent1.stats[stat as keyof creatureStatsType] + parent2.stats[stat as keyof creatureStatsType]) / 2) *
          1.01;
      });
      Object.keys(this.priorities).forEach((priority) => {
        this.priorities[priority as keyof creaturePrioritiesType] =
          (parent1.priorities[priority as keyof creaturePrioritiesType] +
            parent2.priorities[priority as keyof creaturePrioritiesType]) /
          2;
      });
    }

    if (spawnFactionId) {
      this.faction;
    }
    this.mutate();

    this.moveAngle = Math.random() * 2 * Math.PI;
    this.currentHP = this.stats.maxHP;
    this.age = 0;
    this.hunger = 0;
    this.fertility = 0;
    this.isAttacked = false;
    this.attackedTimeout = null;
  }

  mutate() {
    Object.keys(this.stats).forEach((stat) => {
      this.stats[stat as keyof creatureStatsType] = Math.round(
        this.stats[stat as keyof creatureStatsType] * (0.9 + Math.random() * 0.2)
      ); // +- 10% for every stat
    });
    Object.keys(this.priorities).forEach((priority) => {
      this.priorities[priority as keyof creaturePrioritiesType] = Math.round(
        this.priorities[priority as keyof creaturePrioritiesType] * (0.9 + Math.random() * 0.2)
      ); // +- 10% for every priority
    });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    ctx.beginPath();
    ctx.arc(
      this.collider.x,
      this.collider.y,
      this.collider.hitbox - (this.collider.hitbox * this.currentHP) / this.stats.maxHP,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }

  decision(creatures: Creature[], foods: Food[]) {
    const enemiesInSight = creatures.filter((creature) => creature.faction.id !== this.faction.id);
    const closestEnemy = this.findClosest(enemiesInSight);

    const alliesInSight = creatures.filter((creature) => creature.faction.id === this.faction.id && creature !== this);
    const fertileAlliesInSight = alliesInSight.filter((creature) => creature.fertility > 90);
    const closestFertileAlly = this.findClosest(fertileAlliesInSight);

    const closestFood = this.findClosest(foods);

    const choices = [
      {
        name: "breed",
        value: closestFertileAlly
          ? (this.fertility * this.priorities.breeding) / this.getRelativePositionTo(closestFertileAlly).distance
          : 0,
        proposedAngle: this.getRelativePositionTo(closestFertileAlly).angle,
      },
      {
        name: "eat",
        value: closestFood
          ? (this.hunger * this.priorities.food) / this.getRelativePositionTo(closestFood).distance
          : 0,
        proposedAngle: this.getRelativePositionTo(closestFood).angle,
      },
      {
        name: "attack",
        value: closestEnemy
          ? (((this.currentHP / closestEnemy.currentHP) * this.priorities.aggression * 50) /
              this.getRelativePositionTo(closestEnemy).distance) *
            this.faction.coefficients[closestEnemy.faction.name]
          : 0,
        proposedAngle: this.getRelativePositionTo(closestEnemy).angle,
      },
      {
        name: "run",
        value: closestEnemy
          ? ((closestEnemy.currentHP / this.currentHP) * this.priorities.safety * 50) /
            this.getRelativePositionTo(closestEnemy).distance /
            this.faction.coefficients[closestEnemy.faction.name]
          : 0,
        proposedAngle: this.getRelativePositionTo(closestEnemy).angle + Math.PI,
      },
    ];

    this.moveAngle = choices.reduce((a, b) => (a.value > b.value ? a : b)).proposedAngle;

    if (this.moveAngle === 0) {
      this.moveAngle = Math.random() * 2 * Math.PI;
    }
  }

  findClosest<T extends Entity>(entities: T[]) {
    if (!entities.length) return null;
    return entities.reduce((prev, curr) =>
      this.getRelativePositionTo(prev).distance < this.getRelativePositionTo(curr).distance ? prev : curr
    );
  }

  dealDamageTo(creature: Creature, secondsPassed: number) {
    creature.takeDamage(this.stats.damage * secondsPassed * this.faction.coefficients[creature.faction.name]);
    creature.registerAttack();
  }

  takeDamage(damage: number) {
    this.currentHP -= damage;

    if (this.currentHP <= 0) {
      this.toDestroy = true;
    }
  }

  registerAttack() {
    this.isAttacked = true;
    this.attackedTimeout = setTimeout(() => {
      this.isAttacked = false;
    }, 300);
  }

  heal(hp: number) {
    this.currentHP = Math.min(this.currentHP + hp, this.stats.maxHP);
  }

  eatFood() {
    this.hunger = Math.max(this.hunger - 30, 0);
    this.heal(100);
  }

  updateGameStats() {
    document.getElementById(`${this.faction.name} Max HP`)!.innerText = Math.round(this.stats.maxHP).toString();
    document.getElementById(`${this.faction.name} Regen`)!.innerText = Math.round(this.stats.regen).toString();
    document.getElementById(`${this.faction.name} Damage`)!.innerText = Math.round(this.stats.damage).toString();
    document.getElementById(`${this.faction.name} Speed`)!.innerText = Math.round(this.stats.speed).toString();
    document.getElementById(`${this.faction.name} Aggression`)!.innerText = Math.round(
      this.priorities.aggression
    ).toString();
    document.getElementById(`${this.faction.name} Safety`)!.innerText = Math.round(this.priorities.safety).toString();
    document.getElementById(`${this.faction.name} Breeding`)!.innerText = Math.round(
      this.priorities.breeding
    ).toString();
    document.getElementById(`${this.faction.name} Food`)!.innerText = Math.round(this.priorities.food).toString();
  }
}
