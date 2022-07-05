import { Creature } from "./Creature";

import { randomBetween } from "../utils/randomBetween";

export class Traits {
  traits: {
    strength: number;
    agility: number;
    vitality: number;
    sense: number;
  };

  constructor({
    parent1,
    parent2,
  }: {
    parent1?: Creature;
    parent2?: Creature;
  }) {
    this.traits = { strength: 1, agility: 1, vitality: 1, sense: 1 };
    this.recombineTraits(parent1, parent2);
    this.mutateTraits();
  }

  recombineTraits(parent1?: Creature, parent2?: Creature) {
    if (parent1) {
      this.traits = parent1.traits.traits;
    }

    if (parent2) {
      Object.keys(this.traits).forEach((trait) => {
        if (Math.random() > 0.5) {
          this.traits[trait as keyof typeof this.traits] =
            parent2.traits.traits[trait as keyof typeof this.traits];
        }
      });
    }

    if (!parent1 && !parent2) {
      Object.keys(this.traits).forEach((trait) => {
        if (Math.random() > 0.5) {
          this.traits[trait as keyof typeof this.traits] = randomBetween(
            1,
            2,
            0.1
          );
        }
      });
    }
  }

  mutateTraits() {
    Object.keys(this.traits).forEach((trait) => {
      if (Math.random() < 0.001) {
        this.traits[trait as keyof typeof this.traits] = randomBetween(
          1,
          2,
          0.1
        );
      }
    });
  }
}
