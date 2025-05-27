export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

export enum WSIncomingMessageType {
  JOINED_SESSION = "joined_session",
  NEW_PLAYER_JOINED = "new_player_joined",
  GAME_STATE = "game_state",
  END_GAME = "end_game",
  ERROR = "error",
  BETTING = "betting",
}

export const Coins = [1, 5, 10, 25, 50, 100, 500, 1000];
