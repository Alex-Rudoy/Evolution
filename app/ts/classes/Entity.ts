import { colliderType } from "../types";

import { DEG_36, FIELD_HEIGHT, FIELD_WIDTH } from "../utils/constants";
import { debouncedClg } from "../utils/debouncedClg";
import { mod } from "../utils/mod";

export default class Entity {
  collider: colliderType;
  toDestroy: boolean = false;

  constructor(x: number, y: number, hitbox: number, color: string) {
    this.collider = { x, y, hitbox, color: color };
  }

  updateCollider(collider: Partial<colliderType>) {
    this.collider = { ...this.collider, ...collider };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(
      this.collider.x,
      this.collider.y,
      this.collider.hitbox,
      0,
      Math.PI * 2,
      true
    );
    ctx.fillStyle = this.collider.color;
    ctx.fill();
    ctx.closePath();
  }

  move(angle: number, distance: number) {
    this.collider.x = mod(
      this.collider.x + distance * Math.cos(angle),
      FIELD_WIDTH
    );
    this.collider.y = mod(
      this.collider.y + distance * Math.sin(angle),
      FIELD_HEIGHT
    );
  }

  collidesWith(entity: Entity) {
    if (
      this.getRelativePositionTo(entity).distance <
      this.collider.hitbox + entity.collider.hitbox
    )
      debouncedClg(this, entity);
    return (
      this.getRelativePositionTo(entity).distance <
      this.collider.hitbox + entity.collider.hitbox
    );
  }

  getRelativePositionTo(entity: Entity | null) {
    if (!entity) return { angle: 0, distance: 0 };

    let deltaY = entity.collider.y - this.collider.y;
    if (deltaY > FIELD_HEIGHT / 2) deltaY -= -FIELD_HEIGHT; // 700 -> -200
    if (deltaY < -FIELD_HEIGHT / 2) deltaY += FIELD_HEIGHT; // -700 -> 200

    let deltaX = entity.collider.x - this.collider.x;
    if (deltaX > FIELD_WIDTH / 2) deltaX -= -FIELD_WIDTH; // 1400 -> -200
    if (deltaX < -FIELD_WIDTH / 2) deltaX += FIELD_WIDTH; // -1400 -> 200

    return {
      angle: Math.floor(Math.atan2(deltaY, deltaX) / DEG_36),
      distance: Math.sqrt(deltaY ** 2 + deltaX ** 2),
    };
  }
}
