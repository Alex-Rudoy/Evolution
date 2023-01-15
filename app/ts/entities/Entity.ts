import { Vector } from "./Vector";

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  HALF_CANVAS_HEIGHT,
  HALF_CANVAS_WIDTH,
} from "../utils/constants";
import { randomBetween } from "../utils/randomBetween";

export default class Entity {
  position: Vector;
  velocity: Vector;
  color: string;
  size: number;
  toDestroy: boolean = false;

  constructor({ x, y, velocityX, velocityY, size, color }: constructorProps) {
    this.position = new Vector(
      x || randomBetween(0, CANVAS_WIDTH),
      y || randomBetween(0, CANVAS_HEIGHT)
    );
    this.velocity = new Vector(
      velocityX || randomBetween(-5, 5),
      velocityY || randomBetween(-5, 5)
    );
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  forceMove(v: Vector) {
    this.position = this.position.add(v);
  }

  move(secondsPassed: number) {
    this.position = this.position.add(this.velocity.multiplyBy(secondsPassed));
    if (this.position.x > CANVAS_WIDTH) this.position.x -= CANVAS_WIDTH;
    if (this.position.x < 0) this.position.x += CANVAS_WIDTH;
    if (this.position.y > CANVAS_HEIGHT) this.position.y -= CANVAS_HEIGHT;
    if (this.position.y < 0) this.position.y += CANVAS_HEIGHT;
  }

  accelerate(acceleration: Vector) {
    this.velocity = this.velocity.add(acceleration);
  }

  collidesWith(entity: Entity) {
    if (entity === this) return false;
    return this.getVectorTo(entity).length < this.size + entity.size;
  }

  getVectorTo(entity: Entity | null): Vector {
    if (!entity) return new Vector(0, 0);
    const vectorTo = entity.position.subtract(this.position);
    if (vectorTo.x > HALF_CANVAS_WIDTH) vectorTo.x -= CANVAS_WIDTH;
    if (vectorTo.x < -HALF_CANVAS_WIDTH) vectorTo.x += CANVAS_WIDTH;
    if (vectorTo.y > HALF_CANVAS_HEIGHT) vectorTo.y -= CANVAS_HEIGHT;
    if (vectorTo.y < -HALF_CANVAS_HEIGHT) vectorTo.y += CANVAS_HEIGHT;
    return vectorTo;
  }
}

type constructorProps = {
  x?: number;
  y?: number;
  velocityX?: number;
  velocityY?: number;
  size: number;
  color: string;
};
