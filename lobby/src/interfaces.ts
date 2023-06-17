export interface ServerCreateData {
  name: string;
  port: number;
  address: string;
  currentPlayers: number;
  maxPlayers: number;
}

export interface ServerUpdateData {
  playerCount: number;
}