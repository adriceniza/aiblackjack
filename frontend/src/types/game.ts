import { PlayerDTO } from "./player";

export enum WSIncomingMessageType {
  JOINED_SESSION = "joined_session",
  GAME_STATE = "game_state",
  ERROR = "error",
}

export enum WSOutcomingMessageType {
  PLAYER_ACTION = "player_action",
  PLACE_BET = "place_bet",
  QUICK_JOIN = "quick_join",
}

export enum GameState {
  ROUND_ENDED = "round_ended",
  PLAYING = "playing",
  WAITING_FOR_PLAYERS = "waiting_for_players",
  BETTING = "betting",
}

export interface GameContextType {
  state: GameState | undefined;
  joinSession: (code: string, name: string) => void;
  quickJoin: (name: string) => void;
  sendMessage: (msg: any) => void;
  isConnected: boolean;
  dealer?: PlayerDTO;
  player?: PlayerDTO;
  players?: PlayerDTO[];
  waitingCountdownEnd?: number;
  winners?: PlayerDTO[];
  pushes?: PlayerDTO[];
}

export interface GameStateDTO {
  players: PlayerDTO[];
  dealer: PlayerDTO;
  current_player_index: number;
  type: WSIncomingMessageType;
  state: string;
  winners?: PlayerDTO[];
  pushes?: PlayerDTO[];
  remaining_cards: number;
  timestamp: number;
  player: PlayerDTO;
  waiting_countdown_end: number;
}
