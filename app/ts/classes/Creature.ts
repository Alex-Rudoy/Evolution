import { Brain } from "./Brain";
import Entity from "./Entity";
import { Food } from "./Food";
import { Genes } from "./Genes";
import { Traits } from "./Traits";
import { factions } from "../factions";
import {
  colliderType,
  creaturePrioritiesType,
  creatureStatsType,
  factionType,
} from "../types";

import {
  BG_COLOR,
  DEFAULT_CREATURE_HITBOX,
  DEFAULT_DAMAGE,
  DEFAULT_MAX_HP,
  DEFAULT_REGEN,
  DEFAULT_SIGHT_RADIUS,
  DEFAULT_SPEED,
  DEG_360,
  FIELD_HEIGHT,
  FIELD_WIDTH,
} from "../utils/constants";
import { debouncedClg } from "../utils/debouncedClg";
import { randomBetween } from "../utils/randomBetween";

export class Creature extends Entity {
  faction: factionType;
  stats: creatureStatsType;

  moveAngle: number;
  currentHP: number;
  age: number;
  hunger: number;
  fertility: number;
  isAttacked: boolean;
  attackedTimeout: NodeJS.Timeout | null;

  genes: Genes;
  traits: Traits;
  brain: Brain;

  constructor({
    parent1,
    parent2,
    newEpoch,
  }: {
    parent1?: Creature;
    parent2?: Creature;
    newEpoch?: boolean;
  } = {}) {
    const fallbackFaction = factions[randomBetween(0, factions.length, 1)];

    super(
      parent1 && parent2 && !newEpoch
        ? (parent1.collider.x + parent2.collider.x) / 2
        : randomBetween(0, FIELD_WIDTH),
      parent1 && parent2 && !newEpoch
        ? (parent1.collider.y + parent2.collider.y) / 2
        : randomBetween(0, FIELD_HEIGHT),
      DEFAULT_CREATURE_HITBOX,
      parent1 && !newEpoch
        ? parent1.faction.colors[1]
        : fallbackFaction.colors[1]
    );

    this.faction = parent1 && !newEpoch ? parent1.faction : fallbackFaction;

    this.genes = new Genes({ parent1, parent2 });
    this.traits = new Traits({ parent1, parent2 });
    this.brain = new Brain(this);

    this.updateCollider({
      hitbox: DEFAULT_CREATURE_HITBOX * this.traits.traits.vitality,
      color: this.faction.colors[this.traits.traits.agility],
    });

    this.stats = {
      maxHP: DEFAULT_MAX_HP * this.traits.traits.vitality,
      regen: DEFAULT_REGEN * this.traits.traits.vitality,
      damage: DEFAULT_DAMAGE * this.traits.traits.strength,
      speed: DEFAULT_SPEED * this.traits.traits.agility,
      sightRadius: DEFAULT_SIGHT_RADIUS * this.traits.traits.sense,
    };
    this.moveAngle = 0;
    this.currentHP = this.stats.maxHP;
    this.age = 0;
    this.hunger = 0;
    this.fertility = 0;
    this.isAttacked = false;
    this.attackedTimeout = null;

    if (newEpoch) return;
    if (parent1) {
      this.hunger = parent1.hunger;
    }
    if (parent2) {
      this.hunger = (this.hunger + parent2.hunger) / 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);

    // draw pseudo-healthbar by drawing hollow circle
    ctx.beginPath();
    ctx.arc(
      this.collider.x,
      this.collider.y,
      this.collider.hitbox -
        (this.collider.hitbox * this.currentHP) / this.stats.maxHP,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = BG_COLOR;
    ctx.fill();
    ctx.closePath();
  }

  findClosest<T extends Entity>(entities: T[]) {
    if (!entities.length) return null;
    return entities.reduce((prev, curr) =>
      this.getRelativePositionTo(prev).distance <
      this.getRelativePositionTo(curr).distance
        ? prev
        : curr
    );
  }

  dealDamageTo(creature: Creature, secondsPassed: number) {
    creature.takeDamage(
      this.stats.damage *
        secondsPassed *
        this.faction.coefficients[creature.faction.name]
    );
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
    }, 1000);
  }

  heal(hp: number) {
    this.currentHP = Math.min(this.currentHP + hp, this.stats.maxHP);
  }

  eatFood() {
    this.hunger = Math.max(this.hunger - 30, 0);
    this.heal(100);
  }
}
