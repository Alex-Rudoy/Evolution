import { Creature } from "./Creature";

import { GENES_LENGTH } from "../utils/constants";
import { mod } from "../utils/mod";

export class Genes {
  genes: Record<string, number>;

  constructor({
    parent1,
    parent2,
  }: {
    parent1?: Creature;
    parent2?: Creature;
  }) {
    this.genes = {};
    this.recombineGenes(parent1, parent2);
    this.mutateGenes();
  }

  recombineGenes(parent1?: Creature, parent2?: Creature) {
    if (parent2) {
      this.genes = parent2.genes.genes;
    }
    if (parent1) {
      this.genes = { ...this.genes, ...parent1.genes.genes };
    }
    if (parent2) {
      Object.keys(this.genes).forEach((gene) => {
        if (Math.random() > 0.5) {
          this.genes[gene] = parent2.genes.genes[gene];
        }
      });
    }
  }

  mutateGenes() {
    Object.keys(this.genes).forEach((trait) => {
      if (Math.random() > 0.999) {
        this.genes[trait as keyof typeof this.genes] = Math.floor(
          Math.random() * 10
        );
      }
    });
  }
}
