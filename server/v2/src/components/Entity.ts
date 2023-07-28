/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Game from './Game';
import Vector2 from '../libs/vector';
import { Direction, EntityState, EntityType } from '../enums';
import Circle from './col/Circle';

export default class Entity {
  public id: number = -1;
  public type: EntityType = EntityType.PLAYERS;
  public info: number = 7;
  public speed: number = 200;
  public angle: number = 0;
  public extra: number = 0;

  public state: EntityState = EntityState.NONE;

  public action: boolean = true;

  public position: Vector2 = new Vector2(0, 0);

  private velocity: Vector2 = new Vector2(0, 0);
  private direction: number | null = null;
  private collider: Circle = new Circle(0, 0, 50);

  private maxX: number = 0;
  private maxY: number = 0;

  constructor(public game: Game) {
    this.game = game;

    this.maxX = (this.game.config.get('GAMEPLAY')?.MAP?.WIDTH * 100) - 1;
    this.maxY = (this.game.config.get('GAMEPLAY')?.MAP?.HEIGHT * 100) - 1;
  }

  public updateDirection(direction: number): void {
    if (direction === 0) {
      if (this.direction !== null) {
        this.direction = null;

        this.state &= ~EntityState.WALK;
        this.state |= EntityState.IDLE;
      }
    } else {
      if (this.velocity.x !== 0) this.velocity.x = 0;
      if (this.velocity.y !== 0) this.velocity.y = 0;

      if (direction & Direction.UP) this.velocity.x -= 1;
      if (direction & Direction.LEFT) this.velocity.x += 1;
      if (direction & Direction.DOWN) this.velocity.y -= 1;
      if (direction & Direction.RIGHT) this.velocity.y += 1;

      if (this.velocity.x === 0 && this.velocity.y === 0) return;

      this.direction = Math.atan2(this.velocity.y, this.velocity.x);
    }
  }

  public update(delta: number): void {
    if (this.direction !== null) {
      const dx: number = Math.cos(this.direction) * this.speed * delta;
      const dy: number = Math.sin(this.direction) * this.speed * delta;

      this.position.x += dx;
      this.position.y += dy;

      for (const object of this.game.world.objects) {
        if (this.collider.isCollidingWith(object.collider)) {
          const ox: number = this.position.x - object.collider.x;
          const oy: number = this.position.y - object.collider.y;
          const dist: number = Math.sqrt(ox ** 2 + oy ** 2);
          const overlap: number = this.collider.radius + object.collider.radius - dist;
  
          if (overlap > 0) {
            const angle: number = Math.atan2(oy, ox);

            this.position.x += overlap * Math.cos(angle);
            this.position.y += overlap * Math.sin(angle);
          }
        }
      }

      this.position.x = Math.min(Math.max(this.position.x, 0), this.maxX);
      this.position.y = Math.min(Math.max(this.position.y, 0), this.maxY);
      this.collider.update(this.position.x, this.position.y);

      this.state |= EntityState.WALK;
      this.action = true;
    }
  }
}
