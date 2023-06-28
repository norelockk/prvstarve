import GameServer from '../GameServer';
import { Vector2 } from '../../shared/libs/vector';
import { Direction, EntityState, EntityType } from '../../shared/enums';

export default class Entity {
  // data
  public id: number = -1;
  public position: Vector2 = new Vector2(100, 100);
  public action: number = EntityState.NONE;
  public speed: number = 200;
  public angle: number = 0;
  public extra: number = 0;
  public type: number = EntityType.PLAYERS;
  public info: number = 7;

  // private properties
  private gameServer: GameServer;

  private velocity: Vector2 = new Vector2(0, 0);
  private direction: number | null = null;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
  }

  
  public updateAction(newAction: EntityState): void {
    if (!(this.action & newAction)) {
      this.action -= this.action;
      this.action |= newAction;
    }
  }

  public updateDirection(direction: number): void {
    if (direction === 0) {
      if (this.direction !== null) this.direction = null;

      this.updateAction(EntityState.IDLE);
    } else {
      if (this.velocity.x !== 0) this.velocity.x = 0;
      if (this.velocity.y !== 0) this.velocity.y = 0;

      if (direction & Direction.UP) this.velocity.x -= 1;
      if (direction & Direction.LEFT) this.velocity.x += 1;
      if (direction & Direction.DOWN) this.velocity.y -= 1;
      if (direction & Direction.RIGHT) this.velocity.y += 1;

      if (this.velocity.x === 0 && this.velocity.y === 0) return;

      this.updateAction(EntityState.WALK);
      this.direction = Math.atan2(this.velocity.y, this.velocity.x);
    }
  }

  public update(delta: number): void {
    if (this.direction !== null) {
      const dx: number = Math.cos(this.direction) * this.speed;
      const dy: number = Math.sin(this.direction) * this.speed;

      this.position.x = this.position.x + dx * delta;
      this.position.y = this.position.y + dy * delta;

      // FIX #1 - map border crash
      // FIX info: Thanks to our lord Xmre! <3
      this.position.x = Math.min(Math.max(this.position.x, 0), (154) * 100 - 1);
      this.position.y = Math.min(Math.max(this.position.y, 0), (154) * 100 - 1);
    }
  }
}