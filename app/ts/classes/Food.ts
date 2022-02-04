import Entity from "./Entity";
import { Creature } from "./Creature";

export class Food extends Entity {
  moveAngle: number;

  constructor(deadCreature?: Creature) {
    const x = Math.random() * 1600;
    const y = Math.random() * 900;
    const hitbox = 5;
    super(
      deadCreature ? deadCreature.collider.x + Math.random() * 30 - 15 : x,
      deadCreature ? deadCreature.collider.y + Math.random() * 30 - 15 : y,
      hitbox,
      "#fff891"
    );
    this.moveAngle = Math.random() * 2 * Math.PI;
  }
}
