import { Creature } from "./Creature";
import { Food } from "./Food";
import { Layer } from "./Layer";

import {
  HIDDEN_LAYER_1_SIZE,
  HIDDEN_LAYER_2_SIZE,
  HIDDEN_LAYER_3_SIZE,
  INPUT_LAYER_SIZE,
  OUTPUT_LAYER_SIZE,
} from "../utils/constants";
import {
  HIGHER_DAMAGE_COEF,
  LOWER_DAMAGE_COEF,
  SAME_FACTION_COEF,
} from "../utils/factions";
import { norm } from "../utils/norm";
import { weightedRandomIndex } from "../utils/weightedRandomIndex";

export class Brain {
  layers: Layer[] = [];
  me: Creature;

  constructor({ parentBrain, me }: constructorProps) {
    this.me = me;
    if (parentBrain) {
      this.layers = parentBrain.layers.map(
        (parentLayer) => new Layer({ parentLayer })
      );
    } else {
      // creates random layers
      this.layers = [
        new Layer({
          inputSize: INPUT_LAYER_SIZE,
          outputSize: HIDDEN_LAYER_1_SIZE,
        }),
        new Layer({
          inputSize: HIDDEN_LAYER_1_SIZE,
          outputSize: HIDDEN_LAYER_2_SIZE,
        }),
        new Layer({
          inputSize: HIDDEN_LAYER_2_SIZE,
          outputSize: HIDDEN_LAYER_3_SIZE,
        }),
        new Layer({
          inputSize: HIDDEN_LAYER_3_SIZE,
          outputSize: OUTPUT_LAYER_SIZE,
        }),
      ];
    }
  }

  generateInputData(creatures: Creature[], foods: Food[]) {
    const inputs = [];
    inputs.push(norm(this.me.currentHP, 0, 1000));
    inputs.push(norm(this.me.energy, 0, 100));
    inputs.push(norm(this.me.age, 0, 100));
    // total inputs: 3

    creatures
      .sort(
        (a, b) => this.me.getVectorTo(a).length - this.me.getVectorTo(b).length
      )
      .slice(0, 5)
      .forEach((creature) => {
        inputs.push(norm(creature.currentHP, 0, 1000));
        inputs.push(norm(creature.energy, 0, 100));
        inputs.push(norm(creature.age, 0, 20));
        inputs.push(
          +(
            creature.faction.coefficients[this.me.faction.name] ===
            HIGHER_DAMAGE_COEF
          )
        );
        inputs.push(
          +(
            creature.faction.coefficients[this.me.faction.name] ===
            SAME_FACTION_COEF
          )
        );
        inputs.push(
          +(
            creature.faction.coefficients[this.me.faction.name] ===
            LOWER_DAMAGE_COEF
          )
        );
        const vectorToCreature = this.me.getVectorTo(creature);
        inputs.push(norm(vectorToCreature.length, 1000, 0));
        inputs.push(...vectorToCreature.directions);
      });
    // inputs per creature: 17
    // total inputs per all creatures: 5 * 17 = 85
    // total input so far: 3 + 85 = 88
    while (inputs.length < 88) {
      inputs.push(0);
    }

    foods
      .sort(
        (a, b) => this.me.getVectorTo(a).length - this.me.getVectorTo(b).length
      )
      .slice(0, 5)
      .forEach((food) => {
        const vectorToFood = this.me.getVectorTo(food);
        inputs.push(norm(vectorToFood.length, 1000, 0));
        inputs.push(...vectorToFood.directions);
      });
    // inputs per food: 11
    // total inputs per all foods: 5 * 11 = 55

    // total inputs: 3 + 85 + 55 = 143 = INPUT_LAYER_SIZE
    while (inputs.length < INPUT_LAYER_SIZE) {
      inputs.push(0);
    }
    return inputs;
  }

  makeDecision(creatures: Creature[], foods: Food[]) {
    const inputs = this.generateInputData(creatures, foods);
    const outputs = this.layers.reduce(
      (prev, layer) => layer.calculate(prev),
      inputs
    );
    return weightedRandomIndex(outputs);
  }
}

type constructorProps = {
  parentBrain?: Brain;
  me: Creature;
};
