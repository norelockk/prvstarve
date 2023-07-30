export interface LobbyServer {
  n: string; // Server name
  w: string; // Server website
  u: string; // Server ID (UUID)
  m: string; // Server mode/gamemode
  cp: number; // Server current players
  mp: number; // Server max players
  lc: boolean; // Server locked (password)
}

export interface LobbyServerResponse {
  h: string; // Server IP/hostname
  p: string; // Server port (if is not SSL)
  t: string; // Server token to authorize
}