import { Creature } from "./Creature";
import Entity from "./Entity";

import {
  DEFAULT_FOOD_HITBOX,
  FIELD_HEIGHT,
  FIELD_WIDTH,
} from "../utils/constants";

export class Food extends Entity {
  moveAngle: number;

  constructor(deadCreature?: Creature) {
    super(
      deadCreature
        ? deadCreature.collider.x + Math.random() * 30 - 15
        : Math.random() * FIELD_WIDTH,
      deadCreature
        ? deadCreature.collider.y + Math.random() * 30 - 15
        : Math.random() * FIELD_HEIGHT,
      DEFAULT_FOOD_HITBOX,
      "#fff891"
    );
    this.moveAngle = Math.random() * 2 * Math.PI;
  }
}
