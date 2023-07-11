/**
 * @license private
 * @date 4 July 2023
 * Copyright (c) 2023 DREAMY.CODES LIMITED. All Rights Reserved.
 */

import Game from '../Game';
import Vector2 from '../libs/vector';
import { Direction, EntityState, EntityType } from '../enums';

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

  constructor(public game: Game) {
    this.game = game;
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
      const dx = Math.cos(this.direction) * this.speed * delta;
      const dy = Math.sin(this.direction) * this.speed * delta;

      this.position.x += dx;
      this.position.y += dy;

      const maxX = (this.game.config.get('GAMEPLAY')?.MAP?.WIDTH * 100) - 1;
      const maxY = (this.game.config.get('GAMEPLAY')?.MAP?.HEIGHT * 100) - 1;

      this.position.x = Math.min(Math.max(this.position.x, 0), maxX);
      this.position.y = Math.min(Math.max(this.position.y, 0), maxY);

      this.state |= EntityState.WALK;
      this.action = true;
    }
  }
}
