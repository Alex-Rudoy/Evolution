import { colliderType } from "../types";

export default class Entity {
  collider: colliderType;
  toDestroy: boolean = false;

  constructor(x: number, y: number, hitbox: number, color: string) {
    this.collider = { x, y, hitbox, color: color };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.collider.x, this.collider.y, this.collider.hitbox, 0, Math.PI * 2, true);
    ctx.fillStyle = this.collider.color;
    ctx.fill();
    ctx.closePath();
  }

  move(angle: number, distance: number) {
    this.collider.x = Math.max(Math.min(this.collider.x + Math.cos(angle) * distance, 1590), 10);
    this.collider.y = Math.max(Math.min(this.collider.y + Math.sin(angle) * distance, 890), 10);
  }

  collidesWith(entity: Entity) {
    if (this.getRelativePositionTo(entity).distance < this.collider.hitbox + entity.collider.hitbox) {
      return true;
    }
    return false;
  }

  getRelativePositionTo(entity: Entity | null) {
    if (!entity) return { angle: 0, distance: 0 };
    return {
      angle: Math.atan2(entity.collider.y - this.collider.y, entity.collider.x - this.collider.x),
      distance: Math.sqrt((this.collider.x - entity.collider.x) ** 2 + (this.collider.y - entity.collider.y) ** 2),
    };
  }
}
