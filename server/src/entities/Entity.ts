import GameServer from '../GameServer';
import { Vector2 } from '../../../shared/libs/vector';
import { EntityState, EntityType } from '../../../shared/enums';

export default class Entity {
  public position: Vector2 = new Vector2(~~(Math.random() * 1500), ~~(Math.random() * 1500));
  public action: number = EntityState.IDLE;
  public speed: number = 0;
  public angle: number = 0;
  public extra: number = 0;
  public type: number = EntityType.PLAYERS;
  public info: number = 0;
  
  public gameServer: GameServer;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;
  }

  public updateAction(newAction: EntityState): void {
    this.action = newAction;
  }

  public update(delta: number): void {
    
  }
}