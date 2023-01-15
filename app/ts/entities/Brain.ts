import { Creature } from "./Creature";
import Entity from "./Entity";
import { Food } from "./Food";
import { Layer } from "./Layer";

import {
  HIDDEN_LAYER_1_SIZE,
  HIDDEN_LAYER_2_SIZE,
  HIDDEN_LAYER_3_SIZE,
  INPUT_LAYER_SIZE,
  OUTPUT_LAYER_SIZE,
  HIGHER_DAMAGE_COEF,
  LOWER_DAMAGE_COEF,
  SAME_FACTION_COEF,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  HALF_CANVAS_HEIGHT,
  HALF_CANVAS_WIDTH,
  PERSONAL_INPUTS_COUNT,
  CREATURE_INPUTS_COUNT,
} from "../utils/constants";
import { negate } from "../utils/negate";
import { norm } from "../utils/norm";
import { weightedRandomIndex } from "../utils/weightedRandomIndex";

export class Brain {
  layers: Layer[] = [];
  me: Creature;
  closestFood: Food[] = [];
  closestCreatures: Creature[] = [];

  constructor({ parentBrain, me, mutate }: constructorProps) {
    this.me = me;
    if (parentBrain) {
      this.layers = parentBrain.layers.map(
        (parentLayer) => new Layer({ parentLayer, mutate, brain: this })
      );
    } else {
      // creates random layers
      this.layers = [
        new Layer({
          inputSize: INPUT_LAYER_SIZE,
          outputSize: HIDDEN_LAYER_1_SIZE,
          brain: this,
        }),
        new Layer({
          inputSize: HIDDEN_LAYER_1_SIZE,
          outputSize: HIDDEN_LAYER_2_SIZE,
          brain: this,
        }),
        new Layer({
          inputSize: HIDDEN_LAYER_2_SIZE,
          outputSize: OUTPUT_LAYER_SIZE,
          brain: this,
        }),
      ];
    }
  }

  generateInputData() {
    const inputs = [];
    inputs.push(norm(this.me.currentHP, 0, 1000));
    inputs.push(norm(this.me.energy, 0, 100));
    inputs.push(norm(this.me.age, 0, 20));

    this.closestCreatures.forEach((creature) => {
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
      inputs.push(negate(vectorToCreature.x / HALF_CANVAS_WIDTH));
      inputs.push(negate(vectorToCreature.y / HALF_CANVAS_HEIGHT));
    });
    while (inputs.length < PERSONAL_INPUTS_COUNT + CREATURE_INPUTS_COUNT) {
      inputs.push(0);
    }

    this.closestFood.forEach((food) => {
      const vectorToFood = this.me.getVectorTo(food);
      inputs.push(negate(vectorToFood.x / HALF_CANVAS_WIDTH));
      inputs.push(negate(vectorToFood.y / HALF_CANVAS_HEIGHT));
    });

    while (inputs.length < INPUT_LAYER_SIZE) {
      inputs.push(0);
    }
    return inputs;
  }

  makeDecision(
    creatures: Creature[],
    foods: Food[],
    ctx: CanvasRenderingContext2D
  ) {
    this.findClosestCreatures(creatures);
    this.findClosestFood(foods);
    const inputs = this.generateInputData();
    const outputs = this.layers.reduce(
      (prev, layer) => layer.calculate(prev),
      inputs
    );
    if (this.me.isSelected) {
      console.log(outputs);
    }
    return weightedRandomIndex(outputs);
  }

  findClosestCreatures(creatures: Creature[]) {
    this.closestCreatures = creatures
      .sort(
        (a, b) => this.me.getVectorTo(a).length - this.me.getVectorTo(b).length
      )
      .slice(1, 6);
  }

  findClosestFood(foods: Food[]) {
    this.closestFood = foods
      .sort(
        (a, b) => this.me.getVectorTo(a).length - this.me.getVectorTo(b).length
      )
      .slice(0, 5);
  }

  drawConnections(ctx: CanvasRenderingContext2D) {
    this.closestCreatures.forEach((creature) => {
      this.drawConnectionTo(creature, ctx);
    });
    this.closestFood.forEach((food) => {
      this.drawConnectionTo(food, ctx);
    });
  }

  drawConnectionTo(entity: Entity, ctx: CanvasRenderingContext2D) {
    let wrapX = 0;
    let wrapY = 0;

    if (entity.position.x - this.me.position.x > HALF_CANVAS_WIDTH) {
      wrapX = -CANVAS_WIDTH;
    }
    if (entity.position.x - this.me.position.x < -HALF_CANVAS_WIDTH) {
      wrapX = CANVAS_WIDTH;
    }
    if (entity.position.y - this.me.position.y > HALF_CANVAS_HEIGHT) {
      wrapY = -CANVAS_HEIGHT;
    }
    if (entity.position.y - this.me.position.y < -HALF_CANVAS_HEIGHT) {
      wrapY = CANVAS_HEIGHT;
    }

    ctx.beginPath();
    ctx.moveTo(this.me.position.x, this.me.position.y);
    ctx.lineTo(entity.position.x + wrapX, entity.position.y + wrapY);
    ctx.moveTo(this.me.position.x - wrapX, this.me.position.y - wrapY);
    ctx.lineTo(entity.position.x, entity.position.y);
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  }
}

type constructorProps = {
  parentBrain?: Brain;
  me: Creature;
  mutate?: boolean;
};
