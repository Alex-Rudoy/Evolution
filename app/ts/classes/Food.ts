import { Creature } from "./Creature";
import Entity from "./Entity";

import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../utils/constants";
import { randomBetween } from "../utils/randomBetween";

export class Food extends Entity {
  constructor(deadCreature?: Creature) {
    super({
      x: deadCreature
        ? deadCreature.position.x + randomBetween(-15, 15)
        : undefined,
      y: deadCreature
        ? deadCreature.position.y + randomBetween(-15, 15)
        : undefined,
      size: 5,
      color: "#fff891",
    });
  }
}
